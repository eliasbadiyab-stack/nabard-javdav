import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createMaterials,
  buildCyrusTomb,
  buildPersepolisComplex,
  buildFerdowsiComplex,
  buildTraditionalStreet,
  buildPlayerCharacter,
  buildEnemy,
} from './proceduralModels';
import { soundEngine } from '../audio/soundEngine';
import { Gender, MissionConfig } from '../types/game';

// Preallocated math helpers to ensure 0 GC during game loop
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _vec3Cam = new THREE.Vector3();

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  attack: boolean;
  heavyAttack: boolean;
  block: boolean;
  dash: boolean;
  ultimate: boolean;
  touchMoveX: number;
  touchMoveY: number;
}

export interface GameEngineCallbacks {
  onPlayerHealthChange: (hp: number, maxHp: number) => void;
  onMonumentHealthChange: (hp: number, maxHp: number) => void;
  onRageChange: (rage: number, maxRage: number) => void;
  onStatsUpdate: (kills: number, score: number, combo: number) => void;
  onVictory: (stars: number) => void;
  onGameOver: (reason: string) => void;
  onCameraShake?: () => void;
}

interface EnemyInstance {
  id: number;
  type: 'shadow_raider' | 'shadow_brute' | 'ruin_golem';
  mesh: THREE.Group;
  weapon: THREE.Group;
  glowMesh: THREE.Mesh;
  hp: number;
  maxHp: number;
  attackTimer: number;
  attackCooldown: number;
  state: 'chase' | 'attack_windup' | 'attacking' | 'recoil';
  recoilTimer: number;
  targetMonument: boolean;
}

interface HitParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class GameEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private materials: ReturnType<typeof createMaterials>;
  private callbacks: GameEngineCallbacks;

  // Clock & loop
  private clock: THREE.Clock;
  private animationFrameId: number = 0;
  private isDestroyed: boolean = false;
  private isSoftwareGl: boolean = false;

  // Current Mission State
  private mission: MissionConfig;
  private gender: Gender;
  private playerName: string;

  // Player state
  private playerGroup!: THREE.Group;
  private playerWeapon!: THREE.Group;
  private playerShield!: THREE.Group;
  private playerCape!: THREE.Mesh;
  private playerLegs!: THREE.Group;
  private playerBody!: THREE.Group;

  public playerHp: number = 100;
  public maxPlayerHp: number = 100;
  public monumentHp: number = 1000;
  public maxMonumentHp: number = 1000;
  public rage: number = 0;
  public maxRage: number = 100;

  private playerPos = new THREE.Vector3(0, 0, 12);
  private playerVelocity = new THREE.Vector3(0, 0, 0);
  private playerRotation: number = 0;
  private isAttacking: boolean = false;
  private attackPhase: number = 0;
  private attackTimer: number = 0;
  private isBlocking: boolean = false;
  private isDashing: boolean = false;
  private dashTimer: number = 0;
  private comboCount: number = 0;
  private comboResetTimer: number = 0;
  private killsCount: number = 0;
  private score: number = 0;

  // Camera orbit & follow
  private cameraAngleX: number = 0;
  private cameraAngleY: number = 0.35;
  private cameraDistance: number = 9.5;
  private shakeIntensity: number = 0;

  // Enemies & World
  private enemies: EnemyInstance[] = [];
  private enemyIdCounter: number = 0;
  private spawnTimer: number = 0;
  private monumentGroup: THREE.Group | null = null;
  private particles: HitParticle[] = [];
  private particlePool: THREE.Mesh[] = [];

  // Input
  public input: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    attack: false,
    heavyAttack: false,
    block: false,
    dash: false,
    ultimate: false,
    touchMoveX: 0,
    touchMoveY: 0,
  };

  constructor(
    container: HTMLElement,
    mission: MissionConfig,
    gender: Gender,
    playerName: string,
    callbacks: GameEngineCallbacks
  ) {
    this.container = container;
    this.mission = mission;
    this.gender = gender;
    this.playerName = playerName;
    this.callbacks = callbacks;

    this.monumentHp = mission.monumentMaxHealth;
    this.maxMonumentHp = mission.monumentMaxHealth;

    // Detect software GL
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );

    // Studio Environment reflection
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.clock = new THREE.Clock();
    this.materials = createMaterials();

    this.setupWorld();
    this.setupLighting();
    this.setupPlayer();
    this.initParticlePool();
    this.setupInputListeners();

    soundEngine.startBattleRhythm();

    // Start 60fps loop
    this.animate();
  }

  private setupWorld() {
    this.scene.background = new THREE.Color(this.mission.skyColor);
    this.scene.fog = new THREE.FogExp2(this.mission.fogColor, 0.012);

    // Main ground plane (stone arena / courtyard)
    const groundGeo = new THREE.PlaneGeometry(160, 160, 16, 16);
    let groundMat = this.materials.sandstone;
    if (this.mission.groundTextureType === 'cobblestone') {
      groundMat = this.materials.cobblestone;
    } else if (this.mission.groundTextureType === 'palace_marble') {
      groundMat = this.materials.khorasanMarble;
    }

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Build specific historical monument in center
    if (this.mission.monumentType === 'cyrus_tomb') {
      this.monumentGroup = buildCyrusTomb(this.materials);
    } else if (this.mission.monumentType === 'persepolis') {
      this.monumentGroup = buildPersepolisComplex(this.materials);
    } else if (this.mission.monumentType === 'ferdowsi_tomb') {
      this.monumentGroup = buildFerdowsiComplex(this.materials);
    } else {
      this.monumentGroup = buildTraditionalStreet(this.materials);
    }
    this.scene.add(this.monumentGroup);

    // Natural outdoor arena boundaries (cypress trees, historic columns, perimeter rocks)
    const perimeterCount = 28;
    for (let i = 0; i < perimeterCount; i++) {
      const angle = (i / perimeterCount) * Math.PI * 2;
      const radius = 55 + Math.sin(i * 3) * 6;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;

      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(3 + Math.random() * 2),
        this.materials.sandstone
      );
      rock.position.set(px, 1.5, pz);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      this.scene.add(rock);
    }
  }

  private setupLighting() {
    // Warm key directional light (Iranian golden sunshine)
    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    sunLight.position.set(35, 45, 25);
    sunLight.castShadow = !this.isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 120;
    const d = 35;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    this.scene.add(sunLight);

    // Cool Persian sky hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0xd97706, 0.9);
    this.scene.add(hemiLight);

    // Golden ambient glow
    const ambient = new THREE.AmbientLight(0xfef3c7, 0.5);
    this.scene.add(ambient);
  }

  private setupPlayer() {
    const { root, weaponGroup, shieldGroup, cape, legs, body } = buildPlayerCharacter(
      this.gender,
      this.materials
    );
    this.playerGroup = root;
    this.playerWeapon = weaponGroup;
    this.playerShield = shieldGroup;
    this.playerCape = cape;
    this.playerLegs = legs;
    this.playerBody = body;

    this.playerGroup.position.copy(this.playerPos);
    this.scene.add(this.playerGroup);
  }

  private initParticlePool() {
    const geo = new THREE.TetrahedronGeometry(0.18);
    for (let i = 0; i < 60; i++) {
      const p = new THREE.Mesh(geo, this.materials.ancientGold);
      p.visible = false;
      this.scene.add(p);
      this.particlePool.push(p);
    }
  }

  private spawnHitSparks(pos: THREE.Vector3, count: number = 8, isUltimate: boolean = false) {
    let spawned = 0;
    for (const p of this.particlePool) {
      if (!p.visible && spawned < count) {
        p.visible = true;
        p.position.copy(pos).add(_vec3A.set(0, 1.2, 0));
        p.scale.setScalar(isUltimate ? 2.5 : 1.0);
        (p.material as THREE.MeshStandardMaterial).color.setHex(
          isUltimate ? 0xfacc15 : 0xf97316
        );

        const angle = Math.random() * Math.PI * 2;
        const speed = isUltimate ? 12 + Math.random() * 8 : 4 + Math.random() * 5;
        const vel = new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.random() * 6 + 2,
          Math.sin(angle) * speed
        );

        this.particles.push({
          mesh: p,
          vel,
          life: 0,
          maxLife: isUltimate ? 0.6 : 0.35,
        });
        spawned++;
      }
    }
  }

  private setupInputListeners() {
    // Keyboard handlers
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = true;
      if (e.code === 'Space' || e.code === 'KeyJ') this.triggerAttack();
      if (e.code === 'KeyK') this.triggerHeavyAttack();
      if (e.code === 'KeyL' || e.code === 'ShiftLeft') this.triggerDash();
      if (e.code === 'KeyE') this.input.block = true;
      if (e.code === 'KeyQ' || e.code === 'KeyR') this.triggerUltimate();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = false;
      if (e.code === 'KeyE') this.input.block = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Mouse drag for camera orbit
    let isMouseDown = false;
    let prevMouseX = 0;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isMouseDown = true;
        prevMouseX = e.clientX;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        this.cameraAngleX -= deltaX * 0.006;
        prevMouseX = e.clientX;
      }
    };
    const onMouseUp = () => {
      isMouseDown = false;
    };

    this.container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const onResize = () => {
      if (!this.container || this.isDestroyed) return;
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    };
    window.addEventListener('resize', onResize);
  }

  // Combat action triggers
  public triggerAttack() {
    if (this.isAttacking || this.isDashing) return;
    this.isAttacking = true;
    this.attackPhase = (this.attackPhase + 1) % 3;
    this.attackTimer = 0.28;
    soundEngine.playSlash();

    // Check hit in forward cone
    this.executePlayerAttackHit(28, 3.8, Math.PI * 0.6);
  }

  public triggerHeavyAttack() {
    if (this.isAttacking || this.isDashing) return;
    this.isAttacking = true;
    this.attackPhase = 99; // 360 spin
    this.attackTimer = 0.45;
    soundEngine.playSlash();
    this.shakeCamera(0.3);

    // Check hit in full 360 circle
    this.executePlayerAttackHit(65, 4.5, Math.PI * 2);
  }

  public triggerDash() {
    if (this.isDashing) return;
    this.isDashing = true;
    this.dashTimer = 0.28;
    soundEngine.playDash();

    // Burst of forward impulse
    _vec3A.set(0, 0, -1).applyAxisAngle(THREE.Object3D.DEFAULT_UP, this.playerRotation);
    this.playerVelocity.copy(_vec3A).multiplyScalar(22);
  }

  public triggerUltimate() {
    if (this.rage < 100) return;
    this.rage = 0;
    this.callbacks.onRageChange(this.rage, this.maxRage);
    soundEngine.playUltimate();
    this.shakeCamera(0.8);
    this.spawnHitSparks(this.playerPos, 30, true);

    // Blast all enemies in 12 unit radius
    this.enemies.forEach(enemy => {
      const dist = enemy.mesh.position.distanceTo(this.playerPos);
      if (dist < 12) {
        this.damageEnemy(enemy, 150, true);
      }
    });
  }

  private executePlayerAttackHit(damage: number, range: number, coneAngle: number) {
    let hitCount = 0;
    const forward = _vec3A.set(0, 0, -1).applyAxisAngle(THREE.Object3D.DEFAULT_UP, this.playerRotation);

    this.enemies.forEach(enemy => {
      const dist = enemy.mesh.position.distanceTo(this.playerPos);
      if (dist <= range) {
        _vec3B.subVectors(enemy.mesh.position, this.playerPos).normalize();
        const dot = forward.dot(_vec3B);
        const minDot = Math.cos(coneAngle / 2);

        if (coneAngle >= Math.PI * 1.9 || dot >= minDot) {
          this.damageEnemy(enemy, damage, false);
          hitCount++;
        }
      }
    });

    if (hitCount > 0) {
      soundEngine.playHit();
      this.comboCount += hitCount;
      this.comboResetTimer = 2.5;
      this.score += hitCount * 100 * Math.min(this.comboCount, 5);
      this.rage = Math.min(this.maxRage, this.rage + hitCount * 8);
      this.callbacks.onRageChange(this.rage, this.maxRage);
      this.callbacks.onStatsUpdate(this.killsCount, this.score, this.comboCount);
    }
  }

  private damageEnemy(enemy: EnemyInstance, dmg: number, isKnockback: boolean) {
    enemy.hp -= dmg;
    enemy.state = 'recoil';
    enemy.recoilTimer = 0.25;

    // Flash glow red
    (enemy.glowMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5;
    setTimeout(() => {
      if (enemy.glowMesh) {
        (enemy.glowMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
      }
    }, 150);

    this.spawnHitSparks(enemy.mesh.position, 6, isKnockback);

    if (isKnockback) {
      _vec3A.subVectors(enemy.mesh.position, this.playerPos).normalize().multiplyScalar(4);
      enemy.mesh.position.add(_vec3A);
    }

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  private killEnemy(enemy: EnemyInstance) {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
      this.scene.remove(enemy.mesh);
      this.spawnHitSparks(enemy.mesh.position, 14, true);

      this.killsCount++;
      this.score += enemy.type === 'ruin_golem' ? 1500 : 250;
      this.callbacks.onStatsUpdate(this.killsCount, this.score, this.comboCount);

      // Check mission completion
      if (this.killsCount >= this.mission.targetKills) {
        soundEngine.playVictory();
        soundEngine.stopBattleRhythm();
        const stars = this.monumentHp > this.maxMonumentHp * 0.7 ? 3 : this.monumentHp > this.maxMonumentHp * 0.4 ? 2 : 1;
        this.callbacks.onVictory(stars);
      }
    }
  }

  private shakeCamera(intensity: number) {
    this.shakeIntensity = Math.min(1.2, this.shakeIntensity + intensity);
  }

  // Enemy Spawning Logic
  private updateWaveSpawner(dt: number) {
    if (this.killsCount >= this.mission.targetKills) return;

    this.spawnTimer += dt;
    const maxAlive = this.mission.bossWave ? 6 : 5;
    const spawnInterval = 3.2;

    if (this.spawnTimer >= spawnInterval && this.enemies.length < maxAlive) {
      this.spawnTimer = 0;
      this.spawnNextEnemy();
    }
  }

  private spawnNextEnemy() {
    this.enemyIdCounter++;
    // Spawn Ruin Golem boss if boss wave and kills > 60%
    const isBoss =
      this.mission.bossWave &&
      this.killsCount >= Math.floor(this.mission.targetKills * 0.6) &&
      !this.enemies.some(e => e.type === 'ruin_golem');

    const type = isBoss ? 'ruin_golem' : Math.random() > 0.65 ? 'shadow_brute' : 'shadow_raider';
    const { root, body, weapon, glowMesh } = buildEnemy(type, this.materials);

    // Spawn from edge of arena
    const angle = Math.random() * Math.PI * 2;
    const dist = 36 + Math.random() * 8;
    root.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
    this.scene.add(root);

    const maxHp = type === 'ruin_golem' ? 380 : type === 'shadow_brute' ? 140 : 65;

    this.enemies.push({
      id: this.enemyIdCounter,
      type,
      mesh: root,
      weapon,
      glowMesh,
      hp: maxHp,
      maxHp,
      attackTimer: 1.5,
      attackCooldown: type === 'ruin_golem' ? 2.4 : 1.8,
      state: 'chase',
      recoilTimer: 0,
      targetMonument: Math.random() > 0.45,
    });
  }

  // Main 60fps Tick Loop
  private animate = () => {
    if (this.isDestroyed) return;

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05);

    this.updatePlayer(dt);
    this.updateEnemies(dt);
    this.updateParticles(dt);
    this.updateCamera(dt);
    this.updateWaveSpawner(dt);

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private updatePlayer(dt: number) {
    if (this.playerHp <= 0) return;

    // Movement direction from keyboard + touch joystick
    let moveX = 0;
    let moveZ = 0;

    if (this.input.forward) moveZ -= 1;
    if (this.input.backward) moveZ += 1;
    if (this.input.left) moveX -= 1;
    if (this.input.right) moveX += 1;

    // Add touch joystick
    moveX += this.input.touchMoveX;
    moveZ += this.input.touchMoveY;

    // Relative to camera yaw
    const camYaw = this.cameraAngleX;
    const worldMove = _vec3A.set(moveX, 0, moveZ);
    if (worldMove.lengthSq() > 1) worldMove.normalize();

    worldMove.applyAxisAngle(THREE.Object3D.DEFAULT_UP, camYaw);

    const speed = this.isBlocking ? 3.5 : 8.5;

    if (worldMove.lengthSq() > 0.01 && !this.isDashing) {
      this.playerVelocity.x = THREE.MathUtils.damp(this.playerVelocity.x, worldMove.x * speed, 12, dt);
      this.playerVelocity.z = THREE.MathUtils.damp(this.playerVelocity.z, worldMove.z * speed, 12, dt);

      // Face movement direction
      const targetRotation = Math.atan2(worldMove.x, worldMove.z) + Math.PI;
      this.playerRotation = THREE.MathUtils.damp(this.playerRotation, targetRotation, 14, dt);

      // Running leg/cape wobble
      const t = this.clock.getElapsedTime() * 12;
      this.playerLegs.rotation.x = Math.sin(t) * 0.45;
      this.playerCape.rotation.x = 0.25 + Math.sin(t * 1.5) * 0.15;
    } else if (!this.isDashing) {
      this.playerVelocity.x = THREE.MathUtils.damp(this.playerVelocity.x, 0, 10, dt);
      this.playerVelocity.z = THREE.MathUtils.damp(this.playerVelocity.z, 0, 10, dt);
      this.playerLegs.rotation.x = THREE.MathUtils.damp(this.playerLegs.rotation.x, 0, 8, dt);
      this.playerCape.rotation.x = THREE.MathUtils.damp(this.playerCape.rotation.x, 0.1, 4, dt);
    }

    // Apply movement
    this.playerPos.x += this.playerVelocity.x * dt;
    this.playerPos.z += this.playerVelocity.z * dt;

    // Arena boundary clamp
    const maxBound = 52;
    this.playerPos.x = Math.max(-maxBound, Math.min(maxBound, this.playerPos.x));
    this.playerPos.z = Math.max(-maxBound, Math.min(maxBound, this.playerPos.z));

    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.y = this.playerRotation;

    // Dash timer
    if (this.isDashing) {
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    }

    // Attack weapon animation
    if (this.isAttacking) {
      this.attackTimer -= dt;
      const progress = 1 - Math.max(0, this.attackTimer / 0.28);
      if (this.attackPhase === 99) {
        // Spin attack
        this.playerGroup.rotation.y += dt * Math.PI * 8;
        this.playerWeapon.rotation.x = -Math.PI / 3;
      } else {
        // Slash forward
        this.playerWeapon.rotation.x = -Math.PI / 2 + Math.sin(progress * Math.PI) * 1.6;
      }

      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.playerWeapon.rotation.set(0, 0, 0);
      }
    }

    // Shield blocking animation
    if (this.input.block) {
      this.isBlocking = true;
      this.playerShield.position.set(-0.15, 1.45, 0.55);
      this.playerShield.rotation.y = THREE.MathUtils.damp(this.playerShield.rotation.y, 0.35, 12, dt);
    } else {
      this.isBlocking = false;
      this.playerShield.position.set(-0.55, 1.35, 0.2);
      this.playerShield.rotation.y = THREE.MathUtils.damp(this.playerShield.rotation.y, 0, 10, dt);
    }

    // Combo reset timer
    if (this.comboCount > 0) {
      this.comboResetTimer -= dt;
      if (this.comboResetTimer <= 0) {
        this.comboCount = 0;
        this.callbacks.onStatsUpdate(this.killsCount, this.score, this.comboCount);
      }
    }
  }

  private updateEnemies(dt: number) {
    this.enemies.forEach(enemy => {
      // Recoil timer
      if (enemy.state === 'recoil') {
        enemy.recoilTimer -= dt;
        if (enemy.recoilTimer <= 0) {
          enemy.state = 'chase';
        }
        return;
      }

      // Determine target: player or center monument
      const targetPos = enemy.targetMonument ? _vec3B.set(0, 0, 0) : this.playerPos;
      const distToTarget = enemy.mesh.position.distanceTo(targetPos);
      const distToPlayer = enemy.mesh.position.distanceTo(this.playerPos);

      // Face target
      const dx = targetPos.x - enemy.mesh.position.x;
      const dz = targetPos.z - enemy.mesh.position.z;
      enemy.mesh.rotation.y = Math.atan2(dx, dz);

      // Attack range
      const attackRange = enemy.type === 'ruin_golem' ? 4.2 : 2.2;
      const isNearTarget = distToTarget <= attackRange;
      const isNearPlayer = distToPlayer <= attackRange;

      if (isNearTarget || isNearPlayer) {
        // Attack behavior
        enemy.attackTimer -= dt;
        if (enemy.attackTimer <= 0.4 && enemy.state !== 'attacking') {
          // Windup telegraph
          enemy.weapon.rotation.x = -Math.PI / 2.2;
        }

        if (enemy.attackTimer <= 0) {
          // Strike
          enemy.attackTimer = enemy.attackCooldown;
          enemy.weapon.rotation.x = 0.5;

          if (isNearPlayer) {
            this.hitPlayer(enemy);
          } else if (enemy.targetMonument && isNearTarget) {
            this.hitMonument(enemy);
          }
        }
      } else {
        // Move towards target
        const speed = enemy.type === 'ruin_golem' ? 2.8 : 4.4;
        _vec3A.set(dx, 0, dz).normalize().multiplyScalar(speed * dt);
        enemy.mesh.position.add(_vec3A);

        // Walking tilt
        const t = this.clock.getElapsedTime() * 8;
        enemy.mesh.position.y = Math.abs(Math.sin(t)) * 0.12;
      }
    });
  }

  private hitPlayer(enemy: EnemyInstance) {
    if (this.isDashing) return; // Invulnerable in dash

    let dmg = enemy.type === 'ruin_golem' ? 32 : enemy.type === 'shadow_brute' ? 18 : 10;
    if (this.isBlocking) {
      soundEngine.playBlock();
      dmg = Math.floor(dmg * 0.15); // 85% block reduction
      this.spawnHitSparks(this.playerPos, 4, false);
      this.rage = Math.min(this.maxRage, this.rage + 12);
      this.callbacks.onRageChange(this.rage, this.maxRage);
    } else {
      soundEngine.playHit();
      this.shakeCamera(0.4);
      this.spawnHitSparks(this.playerPos, 8, false);
    }

    this.playerHp = Math.max(0, this.playerHp - dmg);
    this.callbacks.onPlayerHealthChange(this.playerHp, this.maxPlayerHp);

    if (this.playerHp <= 0) {
      soundEngine.playGameOver();
      soundEngine.stopBattleRhythm();
      this.callbacks.onGameOver('دلاور ایرانی، در نبردی حماسی بر خاک افتادید...');
    }
  }

  private hitMonument(enemy: EnemyInstance) {
    const dmg = enemy.type === 'ruin_golem' ? 50 : 20;
    this.monumentHp = Math.max(0, this.monumentHp - dmg);
    this.callbacks.onMonumentHealthChange(this.monumentHp, this.maxMonumentHp);
    this.shakeCamera(0.2);

    if (this.monumentHp <= 0) {
      soundEngine.playGameOver();
      soundEngine.stopBattleRhythm();
      this.callbacks.onGameOver('اثر کهن تاریخی ایران به دست مهاجمان آسیب دید!');
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.vel.y -= 14 * dt; // gravity
      p.mesh.position.addScaledVector(p.vel, dt);

      const progress = p.life / p.maxLife;
      p.mesh.scale.setScalar((1 - progress) * 1.2);

      if (p.life >= p.maxLife) {
        p.mesh.visible = false;
        this.particles.splice(i, 1);
      }
    }
  }

  private updateCamera(dt: number) {
    // Smooth camera damping follow behind player
    const camOffset = _vec3Cam.set(
      Math.sin(this.cameraAngleX) * Math.cos(this.cameraAngleY) * this.cameraDistance,
      Math.sin(this.cameraAngleY) * this.cameraDistance,
      Math.cos(this.cameraAngleX) * Math.cos(this.cameraAngleY) * this.cameraDistance
    );

    const targetCamPos = _vec3A.copy(this.playerPos).add(camOffset);

    // Apply camera shake if any
    if (this.shakeIntensity > 0.01) {
      targetCamPos.x += (Math.random() - 0.5) * this.shakeIntensity;
      targetCamPos.y += (Math.random() - 0.5) * this.shakeIntensity;
      targetCamPos.z += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity = THREE.MathUtils.damp(this.shakeIntensity, 0, 8, dt);
    }

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamPos.x, 10, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamPos.y, 10, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamPos.z, 10, dt);

    const lookTarget = _vec3B.copy(this.playerPos).add(_vec3A.set(0, 1.6, 0));
    this.camera.lookAt(lookTarget);
  }

  public rotateCameraBy(deltaX: number) {
    this.cameraAngleX += deltaX;
  }

  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    soundEngine.stopBattleRhythm();
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

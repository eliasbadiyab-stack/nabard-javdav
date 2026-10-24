import * as THREE from 'three';
import { Gender } from '../types/game';

/**
 * Procedural textures generated on HTML5 2D Canvas
 * Eliminates 404 errors and ensures instant, offline PBR materials
 */
export function createProceduralTexture(type: 'sandstone' | 'tile' | 'marble' | 'sun_shield' | 'banner' | 'ground_cobble'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (type === 'sandstone') {
    // Ancient Iranian limestone/sandstone blocks
    ctx.fillStyle = '#d4b382';
    ctx.fillRect(0, 0, 512, 512);

    // Stone blocks grid
    const rows = 8;
    const cols = 4;
    const blockH = 512 / rows;
    const blockW = 512 / cols;

    ctx.strokeStyle = '#8c704a';
    ctx.lineWidth = 3;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (blockW / 2);
      for (let c = -1; c <= cols + 1; c++) {
        const x = c * blockW + offset;
        const y = r * blockH;

        // Subtle color variance per block
        const variance = (Math.random() - 0.5) * 25;
        const rVal = Math.min(255, Math.max(0, 212 + variance));
        const gVal = Math.min(255, Math.max(0, 179 + variance));
        const bVal = Math.min(255, Math.max(0, 130 + variance));
        ctx.fillStyle = `rgb(${rVal},${gVal},${bVal})`;
        ctx.fillRect(x + 2, y + 2, blockW - 4, blockH - 4);
        ctx.strokeRect(x, y, blockW, blockH);
      }
    }

    // Speckle noise
    for (let i = 0; i < 4000; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(80, 60, 40, 0.15)' : 'rgba(255, 245, 220, 0.2)';
      ctx.fillRect(px, py, 2, 2);
    }
  } else if (type === 'tile') {
    // Traditional Iranian Turquoise / Lapis Lazuli Glazed Tile
    ctx.fillStyle = '#0f3e5c';
    ctx.fillRect(0, 0, 512, 512);

    // Persian floral & geometric arabesque
    const tileSize = 64;
    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 4, y + 4, tileSize - 8, tileSize - 8);

        // Center medallion
        ctx.beginPath();
        ctx.arc(x + tileSize / 2, y + tileSize / 2, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Corner petals
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(x + 6, y + 6, 8, 0, Math.PI * 0.5);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + tileSize - 6, y + tileSize - 6, 8, Math.PI, Math.PI * 1.5);
        ctx.fill();
      }
    }
  } else if (type === 'marble') {
    // Polished Khorasan White Marble
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 512, 512);

    // Marble veins
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      let startX = Math.random() * 512;
      let startY = 0;
      ctx.moveTo(startX, startY);
      while (startY < 512) {
        startX += (Math.random() - 0.5) * 60;
        startY += 40 + Math.random() * 30;
        ctx.lineTo(startX, startY);
      }
      ctx.stroke();
    }
  } else if (type === 'sun_shield') {
    // Shield: Golden Persian Sun & Lion Motif
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 512, 512);

    // Circular rim
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();

    // Inner bronze ring
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();

    // Radiating Golden Sun Rays
    ctx.save();
    ctx.translate(256, 256);
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < 16; i++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, -90);
      ctx.lineTo(16, -175);
      ctx.lineTo(0, -195);
      ctx.lineTo(-16, -175);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Central Golden Lion Head silhouette
    ctx.beginPath();
    ctx.arc(256, 256, 75, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Lion features (noble crown & mane)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(230, 240, 10, 0, Math.PI * 2); // eye left
    ctx.arc(282, 240, 10, 0, Math.PI * 2); // eye right
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(256, 255);
    ctx.lineTo(245, 275);
    ctx.lineTo(267, 275);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'banner') {
    // Derafsh Banner: Imperial Iranian Green, White, Red with Lion and Sun
    ctx.fillStyle = '#16a34a'; // Green
    ctx.fillRect(0, 0, 512, 170);
    ctx.fillStyle = '#ffffff'; // White
    ctx.fillRect(0, 170, 512, 172);
    ctx.fillStyle = '#dc2626'; // Red
    ctx.fillRect(0, 342, 512, 170);

    // Center Lion and Sun
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(256, 256, 65, 0, Math.PI * 2);
    ctx.fill();
    // Sun rays
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const rx = 256 + Math.cos(a) * 85;
      const ry = 256 + Math.sin(a) * 85;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(rx, ry);
      ctx.stroke();
    }
    // Crown / Lion contour
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦁', 256, 270);
  } else if (type === 'ground_cobble') {
    // Persian stone plaza cobblestone
    ctx.fillStyle = '#57534e';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 4;
    const size = 32;
    for (let y = 0; y < 512; y += size) {
      const offset = (y / size % 2) * (size / 2);
      for (let x = -size; x < 512 + size; x += size) {
        ctx.fillStyle = (x + y) % (size * 2) === 0 ? '#63605d' : '#524f4b';
        ctx.fillRect(x + offset + 2, y + 2, size - 4, size - 4);
        ctx.strokeRect(x + offset, y, size, size);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Reusable procedural materials
export function createMaterials() {
  const sandstoneTex = createProceduralTexture('sandstone');
  const tileTex = createProceduralTexture('tile');
  const marbleTex = createProceduralTexture('marble');
  const shieldTex = createProceduralTexture('sun_shield');
  const bannerTex = createProceduralTexture('banner');
  const cobbleTex = createProceduralTexture('ground_cobble');

  return {
    sandstone: new THREE.MeshStandardMaterial({
      map: sandstoneTex,
      roughness: 0.85,
      metalness: 0.1,
    }),
    ancientGold: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.9,
    }),
    persianBlueTile: new THREE.MeshStandardMaterial({
      map: tileTex,
      roughness: 0.35,
      metalness: 0.2,
    }),
    khorasanMarble: new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.3,
      metalness: 0.15,
    }),
    shieldMat: new THREE.MeshStandardMaterial({
      map: shieldTex,
      roughness: 0.3,
      metalness: 0.85,
    }),
    bannerMat: new THREE.MeshStandardMaterial({
      map: bannerTex,
      roughness: 0.6,
      side: THREE.DoubleSide,
    }),
    cobblestone: new THREE.MeshStandardMaterial({
      map: cobbleTex,
      roughness: 0.9,
      metalness: 0.05,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.2,
      metalness: 0.95,
    }),
    crimsonCloth: new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide,
    }),
    persianBronze: new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.4,
      metalness: 0.75,
    }),
    shadowFlesh: new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.4,
    }),
    shadowArmor: new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.8,
    }),
    glowingRed: new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    }),
    glowingCyan: new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    }),
  };
}

/**
 * 1. Tomb of Cyrus the Great (Pasargadae / آرامگاه کوروش بزرگ)
 * Exact historic architecture: 6 stepped tiers of sandstone, gabled chamber at the top
 */
export function buildCyrusTomb(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const group = new THREE.Group();

  // Tier 1 to 6 stepped plinths
  const plinthSizes = [
    { w: 14, h: 0.9, d: 12 },
    { w: 12.5, h: 0.8, d: 10.5 },
    { w: 11, h: 0.7, d: 9 },
    { w: 9.6, h: 0.6, d: 7.8 },
    { w: 8.4, h: 0.55, d: 6.8 },
    { w: 7.4, h: 0.5, d: 6.0 },
  ];

  let currentY = 0;
  plinthSizes.forEach(tier => {
    const geo = new THREE.BoxGeometry(tier.w, tier.h, tier.d);
    const mesh = new THREE.Mesh(geo, mats.sandstone);
    mesh.position.y = currentY + tier.h / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    currentY += tier.h;
  });

  // Main Tomb Chamber
  const chamberW = 5.6;
  const chamberH = 3.2;
  const chamberD = 4.4;
  const chamberGeo = new THREE.BoxGeometry(chamberW, chamberH, chamberD);
  const chamberMesh = new THREE.Mesh(chamberGeo, mats.sandstone);
  chamberMesh.position.y = currentY + chamberH / 2;
  chamberMesh.castShadow = true;
  chamberMesh.receiveShadow = true;
  group.add(chamberMesh);

  // Chamber low doorway (traditional Cyrus tomb entrance)
  const doorGeo = new THREE.BoxGeometry(1.2, 1.6, 0.4);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
  const doorMesh = new THREE.Mesh(doorGeo, doorMat);
  doorMesh.position.set(0, currentY + 0.8, chamberD / 2 + 0.05);
  group.add(doorMesh);

  // Triangular Gabled Stone Roof
  const roofH = 1.4;
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-chamberW / 2 - 0.2, 0);
  roofShape.lineTo(0, roofH);
  roofShape.lineTo(chamberW / 2 + 0.2, 0);
  roofShape.closePath();

  const extrudeSettings = {
    depth: chamberD + 0.4,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
  const roofMesh = new THREE.Mesh(roofGeo, mats.sandstone);
  roofMesh.position.set(0, currentY + chamberH, -(chamberD + 0.4) / 2);
  roofMesh.castShadow = true;
  group.add(roofMesh);

  // 4 Corner Bronze Fire Braziers (آتشدان‌های زرین)
  const brazierPositions = [
    [-8, 0, -7],
    [8, 0, -7],
    [-8, 0, 7],
    [8, 0, 7],
  ];

  brazierPositions.forEach(([x, y, z]) => {
    const brazier = createFireBrazier(mats);
    brazier.position.set(x, y, z);
    group.add(brazier);
  });

  // Ancient boundary stone pillars
  for (let i = -6; i <= 6; i += 3) {
    if (Math.abs(i) < 2) continue;
    const col1 = createCyrusBoundaryColumn(mats);
    col1.position.set(i * 1.8, 0, -9.5);
    group.add(col1);

    const col2 = createCyrusBoundaryColumn(mats);
    col2.position.set(i * 1.8, 0, 9.5);
    group.add(col2);
  }

  return group;
}

function createCyrusBoundaryColumn(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const col = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.8), mats.sandstone);
  base.position.y = 0.2;
  col.add(base);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.8, 12), mats.sandstone);
  shaft.position.y = 1.6;
  shaft.castShadow = true;
  col.add(shaft);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.7), mats.sandstone);
  cap.position.y = 3.1;
  col.add(cap);
  return col;
}

/**
 * 2. Persepolis (تخت جمشید / پارسه)
 * Colossal Fluted Columns, Apadana Staircase, Winged Bull Portal
 */
export function buildPersepolisComplex(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const group = new THREE.Group();

  // Grand elevated palace terrace
  const terrace = new THREE.Mesh(
    new THREE.BoxGeometry(32, 1.2, 26),
    mats.sandstone
  );
  terrace.position.y = 0.6;
  terrace.receiveShadow = true;
  group.add(terrace);

  // Grand monumental double stairs on front
  const stepsCount = 6;
  for (let i = 0; i < stepsCount; i++) {
    const stepW = 10;
    const stepH = 0.2;
    const stepD = 0.6 * (stepsCount - i);
    const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, stepD), mats.sandstone);
    stepMesh.position.set(0, (i + 0.5) * stepH, 13 + (stepsCount - i) * 0.3);
    group.add(stepMesh);
  }

  // Persepolis Monumental Columns (8 tall columns)
  const colPositions = [
    [-10, 1.2, -8], [-4, 1.2, -8], [4, 1.2, -8], [10, 1.2, -8],
    [-10, 1.2, 4],  [-4, 1.2, 4],  [4, 1.2, 4],  [10, 1.2, 4],
  ];

  colPositions.forEach(([x, y, z]) => {
    const column = createPersepolisColumn(mats);
    column.position.set(x, y, z);
    group.add(column);
  });

  // Gate of All Nations (دروازه ملل) flanked by winged guardian statues
  const gateLeft = createWingedBullPillar(mats, false);
  gateLeft.position.set(-3.2, 1.2, -2);
  group.add(gateLeft);

  const gateRight = createWingedBullPillar(mats, true);
  gateRight.position.set(3.2, 1.2, -2);
  group.add(gateRight);

  // Lintels across gate
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.9, 2), mats.sandstone);
  lintel.position.set(0, 1.2 + 5.5, -2);
  lintel.castShadow = true;
  group.add(lintel);

  // Royal Golden Sun Banners
  const bannerLeft = createDerafshBanner(mats);
  bannerLeft.position.set(-6, 1.2, 10);
  group.add(bannerLeft);

  const bannerRight = createDerafshBanner(mats);
  bannerRight.position.set(6, 1.2, 10);
  group.add(bannerRight);

  return group;
}

function createPersepolisColumn(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const col = new THREE.Group();

  // Bell-shaped lotus base
  const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 0.6, 16), mats.sandstone);
  base1.position.y = 0.3;
  col.add(base1);

  // Fluted Column Shaft
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 7.5, 24), mats.sandstone);
  shaft.position.y = 0.6 + 3.75;
  shaft.castShadow = true;
  col.add(shaft);

  // Persepolis Capital (Double Bull / Homa Capital)
  const capitalBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.2), mats.sandstone);
  capitalBase.position.y = 8.4;
  col.add(capitalBase);

  // Double protome tops (winged bulls facing opposite directions)
  const bull1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.8), mats.ancientGold);
  bull1.position.set(-0.4, 8.9, 0);
  col.add(bull1);

  const bull2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.8), mats.ancientGold);
  bull2.position.set(0.4, 8.9, 0);
  col.add(bull2);

  return col;
}

function createWingedBullPillar(mats: ReturnType<typeof createMaterials>, mirror: boolean): THREE.Group {
  const g = new THREE.Group();
  // Pillar body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.2, 2.2), mats.sandstone);
  body.position.y = 2.6;
  body.castShadow = true;
  g.add(body);

  // Wing relief
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 1.6), mats.ancientGold);
  wing.position.set(mirror ? -0.85 : 0.85, 3.2, 0);
  g.add(wing);

  // Head of bull/guardian
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 1.0), mats.persianBronze);
  head.position.set(0, 4.4, 0.8);
  g.add(head);

  return g;
}

/**
 * 3. Ferdowsi Mausoleum (آرامگاه فردوسی در طوس)
 * Monumental cubic white marble structure, reflecting pool & cypress trees
 */
export function buildFerdowsiComplex(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const group = new THREE.Group();

  // Stepped marble podium
  const podium1 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 20), mats.khorasanMarble);
  podium1.position.y = 0.4;
  group.add(podium1);

  const podium2 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 16), mats.khorasanMarble);
  podium2.position.y = 1.1;
  group.add(podium2);

  // Main Monument Cube (کعب مقبره فردوسی)
  const cubeW = 10;
  const cubeH = 8.5;
  const cube = new THREE.Mesh(new THREE.BoxGeometry(cubeW, cubeH, cubeW), mats.khorasanMarble);
  cube.position.y = 1.4 + cubeH / 2;
  cube.castShadow = true;
  group.add(cube);

  // Classical Persian Columns attached to faces
  const sideOffsets = [-3.5, 3.5];
  sideOffsets.forEach(ox => {
    [-1, 1].forEach(oz => {
      const colZ = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, cubeH, 16), mats.khorasanMarble);
      colZ.position.set(ox, 1.4 + cubeH / 2, (oz * cubeW) / 2 + 0.1);
      group.add(colZ);

      const colX = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, cubeH, 16), mats.khorasanMarble);
      colX.position.set((oz * cubeW) / 2 + 0.1, 1.4 + cubeH / 2, ox);
      group.add(colX);
    });
  });

  // Top stepped cornice
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(11, 1.0, 11), mats.khorasanMarble);
  cornice.position.y = 1.4 + cubeH + 0.5;
  group.add(cornice);

  // Center gold Shahnameh emblem on monument
  const emblem = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32), mats.ancientGold);
  emblem.rotation.x = Math.PI / 2;
  emblem.position.set(0, 5.8, cubeW / 2 + 0.15);
  group.add(emblem);

  // Front Reflecting Pool (استخر فیروزه‌ای جلوی مقبره)
  const poolW = 14;
  const poolD = 8;
  const poolRim = new THREE.Mesh(new THREE.BoxGeometry(poolW, 0.4, poolD), mats.khorasanMarble);
  poolRim.position.set(0, 0.2, 16);
  group.add(poolRim);

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(poolW - 1, poolD - 1), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.35, 16);
  group.add(water);

  // Flanking Persian Cypress trees (سرو ناز)
  const treePositions = [
    [-11, 0, 8], [11, 0, 8],
    [-11, 0, 16], [11, 0, 16],
    [-11, 0, 22], [11, 0, 22],
  ];
  treePositions.forEach(([x, y, z]) => {
    const tree = createPersianCypress();
    tree.position.set(x, y, z);
    group.add(tree);
  });

  return group;
}

/**
 * 4. Traditional Iranian Historic Street / Avenue (خیابان و طاق‌های کهن ایرانی)
 * Arches, turquoise tilework, lanterns, Persian brick facades
 */
export function buildTraditionalStreet(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const group = new THREE.Group();

  // Street buildings on left and right
  const buildingHeights = [6, 7.5, 6.5, 8];
  for (let i = 0; i < 4; i++) {
    const zPos = (i - 1.5) * 11;
    const h = buildingHeights[i];

    // Left facade
    const bLeft = createPersianBuildingFacade(mats, h);
    bLeft.position.set(-10, 0, zPos);
    group.add(bLeft);

    // Right facade
    const bRight = createPersianBuildingFacade(mats, h);
    bRight.rotation.y = Math.PI;
    bRight.position.set(10, 0, zPos);
    group.add(bRight);
  }

  // Grand Persian Arched Gateway over street (طاق نصرت سنتی)
  const archWay = createPersianGatewayArch(mats);
  archWay.position.set(0, 0, -14);
  group.add(archWay);

  // Street decorative Persian lanterns
  const lanternZ = [-10, 0, 10];
  lanternZ.forEach(z => {
    const l1 = createPersianStreetLantern(mats);
    l1.position.set(-6, 0, z);
    group.add(l1);

    const l2 = createPersianStreetLantern(mats);
    l2.position.set(6, 0, z);
    group.add(l2);
  });

  // Central fountain/monument circle
  const centerFountain = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.6, 24), mats.sandstone);
  centerFountain.position.set(0, 0.3, 0);
  group.add(centerFountain);

  const fountainWater = new THREE.Mesh(
    new THREE.CircleGeometry(3.1, 24),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.7 })
  );
  fountainWater.rotation.x = -Math.PI / 2;
  fountainWater.position.set(0, 0.55, 0);
  group.add(fountainWater);

  const centerPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 3.5, 16), mats.persianBronze);
  centerPillar.position.set(0, 1.8, 0);
  group.add(centerPillar);

  // Sun emblem atop center fountain
  const sunEmblem = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 24), mats.ancientGold);
  sunEmblem.position.set(0, 3.8, 0);
  group.add(sunEmblem);

  return group;
}

function createPersianBuildingFacade(mats: ReturnType<typeof createMaterials>, height: number): THREE.Group {
  const g = new THREE.Group();
  const width = 10;
  const depth = 4;

  // Main brick/sandstone structure
  const wall = new THREE.Mesh(new THREE.BoxGeometry(depth, height, width), mats.sandstone);
  wall.position.set(depth / 2, height / 2, 0);
  wall.castShadow = true;
  g.add(wall);

  // Turquoise tile decorative strip along the roof
  const roofBorder = new THREE.Mesh(new THREE.BoxGeometry(depth + 0.3, 0.6, width + 0.2), mats.persianBlueTile);
  roofBorder.position.set(depth / 2, height + 0.3, 0);
  g.add(roofBorder);

  // Traditional Orosi arched window panels
  const windowCount = 2;
  for (let w = 0; w < windowCount; w++) {
    const winGeo = new THREE.BoxGeometry(0.3, 2.2, 1.6);
    const winMesh = new THREE.Mesh(winGeo, mats.persianBlueTile);
    winMesh.position.set(-0.05, height * 0.5, (w - 0.5) * 4);
    g.add(winMesh);
  }

  return g;
}

function createPersianGatewayArch(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const g = new THREE.Group();

  // Left & right support pillars with turquoise tiles
  const pillarGeo = new THREE.BoxGeometry(2.4, 7, 2.4);
  const pLeft = new THREE.Mesh(pillarGeo, mats.sandstone);
  pLeft.position.set(-7, 3.5, 0);
  g.add(pLeft);

  const pRight = new THREE.Mesh(pillarGeo, mats.sandstone);
  pRight.position.set(7, 3.5, 0);
  g.add(pRight);

  // Tile inserts on pillars
  const tileInL = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5, 2.2), mats.persianBlueTile);
  tileInL.position.set(-7, 3.5, 0);
  g.add(tileInL);

  const tileInR = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5, 2.2), mats.persianBlueTile);
  tileInR.position.set(7, 3.5, 0);
  g.add(tileInR);

  // Pointed Persian arch span
  const archSpan = new THREE.Mesh(new THREE.BoxGeometry(16.4, 2.0, 2.8), mats.sandstone);
  archSpan.position.set(0, 7.8, 0);
  g.add(archSpan);

  const archTileFrieze = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 2.9), mats.persianBlueTile);
  archTileFrieze.position.set(0, 8.0, 0);
  g.add(archTileFrieze);

  // Crown pinnacle
  const crown = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.5, 8), mats.ancientGold);
  crown.position.set(0, 9.6, 0);
  g.add(crown);

  return g;
}

function createPersianStreetLantern(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.2, 12), mats.persianBronze);
  pole.position.y = 2.1;
  g.add(pole);

  const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.45), mats.ancientGold);
  lantern.position.y = 4.2;
  g.add(lantern);

  // Warm glow light source
  const light = new THREE.PointLight(0xf59e0b, 1.2, 10);
  light.position.y = 4.2;
  g.add(light);

  return g;
}

export function createPersianCypress(): THREE.Group {
  const g = new THREE.Group();
  // Trunk
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 1.6, 8), trunkMat);
  trunk.position.y = 0.8;
  g.add(trunk);

  // Foliage: Slender flame-like Persian Cypress (سرو ناز)
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.75 });
  const f1 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.2, 10), foliageMat);
  f1.position.y = 3.2;
  f1.castShadow = true;
  g.add(f1);

  const f2 = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.5, 10), foliageMat);
  f2.position.y = 5.2;
  f2.castShadow = true;
  g.add(f2);

  return g;
}

export function createFireBrazier(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.6, 12), mats.sandstone);
  base.position.y = 0.3;
  g.add(base);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.2, 12), mats.persianBronze);
  shaft.position.y = 1.2;
  g.add(shaft);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.3, 0.6, 16), mats.persianBronze);
  bowl.position.y = 1.9;
  g.add(bowl);

  // Glowing hot fire core
  const fireCore = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.4),
    new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xef4444,
      emissiveIntensity: 1.5,
    })
  );
  fireCore.position.y = 2.1;
  g.add(fireCore);

  const flameLight = new THREE.PointLight(0xf97316, 2, 12);
  flameLight.position.y = 2.4;
  g.add(flameLight);

  return g;
}

export function createDerafshBanner(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 7.5, 12), mats.ancientGold);
  pole.position.y = 3.75;
  g.add(pole);

  // Crossbar
  const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 8), mats.ancientGold);
  cross.rotation.z = Math.PI / 2;
  cross.position.y = 7.0;
  g.add(cross);

  // Golden spearhead top
  const spearhead = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 8), mats.ancientGold);
  spearhead.position.y = 7.8;
  g.add(spearhead);

  // Fabric Banner
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.8), mats.bannerMat);
  banner.position.set(0, 5.0, 0.05);
  g.add(banner);

  return g;
}

/**
 * 5. Player Hero Character (Composite 8-part 3D character)
 * Persian Champion (Male / Female) with armor, cape, shamshir, and golden sun shield
 */
export function buildPlayerCharacter(gender: Gender, mats: ReturnType<typeof createMaterials>): {
  root: THREE.Group;
  weaponGroup: THREE.Group;
  shieldGroup: THREE.Group;
  cape: THREE.Mesh;
  legs: THREE.Group;
  body: THREE.Group;
} {
  const root = new THREE.Group();

  // Root pivot at floor (y = 0)
  const body = new THREE.Group();
  root.add(body);

  // Pelvis / Hips
  const hipsGeo = new THREE.BoxGeometry(0.65, 0.35, 0.45);
  const hips = new THREE.Mesh(hipsGeo, mats.persianBronze);
  hips.position.y = 0.95;
  hips.castShadow = true;
  body.add(hips);

  // Torso / Chestplate (with Golden Lion emblem engraving)
  const chestW = gender === 'female' ? 0.68 : 0.78;
  const chestGeo = new THREE.BoxGeometry(chestW, 0.75, 0.48);
  const chest = new THREE.Mesh(chestGeo, mats.ancientGold);
  chest.position.y = 1.45;
  chest.castShadow = true;
  body.add(chest);

  // Royal Golden Shoulder Pauldrons
  const pauldronGeo = new THREE.BoxGeometry(0.3, 0.25, 0.4);
  const pLeft = new THREE.Mesh(pauldronGeo, mats.ancientGold);
  pLeft.position.set(-(chestW / 2 + 0.14), 1.7, 0);
  pLeft.castShadow = true;
  body.add(pLeft);

  const pRight = new THREE.Mesh(pauldronGeo, mats.ancientGold);
  pRight.position.set(chestW / 2 + 0.14, 1.7, 0);
  pRight.castShadow = true;
  body.add(pRight);

  // Head & Persian Helmet
  const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xf6d7b0, // Persian skin tone
    roughness: 0.5,
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.95;
  body.add(head);

  // Persian conical iron helmet with gold rim & crest
  const helmetGeo = new THREE.ConeGeometry(0.27, 0.42, 16);
  const helmet = new THREE.Mesh(helmetGeo, mats.steel);
  helmet.position.y = 2.12;
  body.add(helmet);

  const helmRim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 8, 20), mats.ancientGold);
  helmRim.rotation.x = Math.PI / 2;
  helmRim.position.y = 1.98;
  body.add(helmRim);

  if (gender === 'female') {
    // Heroine warrior dark braid hair
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
    const braid = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.75, 8), hairMat);
    braid.position.set(0, 1.75, -0.22);
    braid.rotation.x = 0.2;
    body.add(braid);
  } else {
    // Hero feather plume on helmet
    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 6), mats.crimsonCloth);
    plume.position.set(0, 2.4, -0.05);
    plume.rotation.x = -0.3;
    body.add(plume);
  }

  // Legs group
  const legs = new THREE.Group();
  body.add(legs);

  const legGeo = new THREE.BoxGeometry(0.24, 0.85, 0.26);
  const legLeft = new THREE.Mesh(legGeo, mats.persianBronze);
  legLeft.position.set(-0.2, 0.45, 0);
  legLeft.castShadow = true;
  legs.add(legLeft);

  const legRight = new THREE.Mesh(legGeo, mats.persianBronze);
  legRight.position.set(0.2, 0.45, 0);
  legRight.castShadow = true;
  legs.add(legRight);

  // Boots
  const bootGeo = new THREE.BoxGeometry(0.26, 0.22, 0.36);
  const bootLeft = new THREE.Mesh(bootGeo, mats.steel);
  bootLeft.position.set(-0.2, 0.1, 0.05);
  legs.add(bootLeft);

  const bootRight = new THREE.Mesh(bootGeo, mats.steel);
  bootRight.position.set(0.2, 0.1, 0.05);
  legs.add(bootRight);

  // Persian Royal Cape (Drapes from shoulders down to calves)
  const capeGeo = new THREE.PlaneGeometry(0.7, 1.2, 4, 6);
  const cape = new THREE.Mesh(capeGeo, mats.crimsonCloth);
  cape.position.set(0, 1.15, -0.26);
  cape.rotation.x = 0.1;
  cape.castShadow = true;
  body.add(cape);

  // Right Arm & Weapon (Persian curved shamshir)
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(chestW / 2 + 0.2, 1.35, 0.2);
  body.add(weaponGroup);

  // Arm
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.18), mats.persianBronze);
  armR.position.y = -0.15;
  weaponGroup.add(armR);

  // Persian Scimitar / Shamshir (شمشیر اصیل ایرانی)
  const swordHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), mats.ancientGold);
  swordHandle.rotation.x = Math.PI / 2;
  swordHandle.position.set(0, -0.4, 0.1);
  weaponGroup.add(swordHandle);

  const swordGuard = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.08), mats.ancientGold);
  swordGuard.position.set(0, -0.4, 0.25);
  weaponGroup.add(swordGuard);

  // Curved shamshir blade
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.1, 0.3);
  bladeShape.lineTo(0.14, 0.75);
  bladeShape.lineTo(0.08, 1.15);
  bladeShape.lineTo(0, 1.25); // sharp tip
  bladeShape.lineTo(-0.04, 0.8);
  bladeShape.lineTo(0, 0);

  const bladeExtrude = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.03, bevelEnabled: false });
  const blade = new THREE.Mesh(bladeExtrude, mats.steel);
  blade.rotation.x = -Math.PI / 2;
  blade.position.set(0, -0.4, 0.25);
  blade.castShadow = true;
  weaponGroup.add(blade);

  // Left Arm & Shield (Golden Persian Sun & Lion Shield)
  const shieldGroup = new THREE.Group();
  shieldGroup.position.set(-(chestW / 2 + 0.2), 1.35, 0.2);
  body.add(shieldGroup);

  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.18), mats.persianBronze);
  armL.position.y = -0.15;
  shieldGroup.add(armL);

  // Circular Persian Sun Shield (سپر شیر و خورشید)
  const shieldMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.08, 24), mats.shieldMat);
  shieldMesh.rotation.x = Math.PI / 2;
  shieldMesh.rotation.z = Math.PI;
  shieldMesh.position.set(-0.1, -0.15, 0.25);
  shieldMesh.castShadow = true;
  shieldGroup.add(shieldMesh);

  return { root, weaponGroup, shieldGroup, cape, legs, body };
}

/**
 * 6. Invader Enemies (Shadow Raiders, Brutes & Ruin Colossus)
 */
export function buildEnemy(
  type: 'shadow_raider' | 'shadow_brute' | 'ruin_golem',
  mats: ReturnType<typeof createMaterials>
): {
  root: THREE.Group;
  body: THREE.Group;
  weapon: THREE.Group;
  glowMesh: THREE.Mesh;
} {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  if (type === 'ruin_golem') {
    // Boss: Giant Stone Ruin Colossus
    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.8, 1.8), mats.shadowArmor);
    torso.position.y = 2.8;
    torso.castShadow = true;
    body.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 1.0), mats.shadowFlesh);
    head.position.y = 4.6;
    body.add(head);

    // Glowing red eye core
    const eyeCore = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), mats.glowingRed);
    eyeCore.position.set(0, 4.6, 0.52);
    body.add(eyeCore);

    // Massive arms
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.7), mats.shadowArmor);
    armL.position.set(-1.6, 2.6, 0);
    body.add(armL);

    const weapon = new THREE.Group();
    weapon.position.set(1.6, 2.6, 0);
    body.add(weapon);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.7), mats.shadowArmor);
    weapon.add(armR);

    // Stone Maul/Club
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 2.8, 8), mats.sandstone);
    club.position.set(0, -1.2, 0.5);
    weapon.add(club);

    // Heavy legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.9), mats.shadowArmor);
    legL.position.set(-0.7, 0.8, 0);
    body.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.9), mats.shadowArmor);
    legR.position.set(0.7, 0.8, 0);
    body.add(legR);

    return { root, body, weapon, glowMesh: eyeCore };
  } else {
    // Regular Shadow Raider / Brute
    const scale = type === 'shadow_brute' ? 1.3 : 1.0;
    root.scale.set(scale, scale, scale);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.42), mats.shadowArmor);
    torso.position.y = 1.3;
    torso.castShadow = true;
    body.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), mats.shadowFlesh);
    head.position.y = 1.85;
    body.add(head);

    // Red visor eyes
    const glowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.1), mats.glowingRed);
    glowMesh.position.set(0, 1.85, 0.22);
    body.add(glowMesh);

    // Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.8, 0.24), mats.shadowArmor);
    legL.position.set(-0.18, 0.4, 0);
    body.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.8, 0.24), mats.shadowArmor);
    legR.position.set(0.18, 0.4, 0);
    body.add(legR);

    // Weapon arm
    const weapon = new THREE.Group();
    weapon.position.set(0.45, 1.3, 0);
    body.add(weapon);

    const darkBlade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.18), mats.shadowArmor);
    darkBlade.position.set(0, -0.2, 0.4);
    darkBlade.rotation.x = Math.PI / 4;
    weapon.add(darkBlade);

    return { root, body, weapon, glowMesh };
  }
}

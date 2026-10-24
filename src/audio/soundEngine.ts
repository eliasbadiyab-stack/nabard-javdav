/**
 * Procedural Web Audio API Sound Engine
 * Zero external audio files, 100% offline and instant feedback
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;

  constructor() {
    // Initialized lazily on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.musicInterval) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Quick metallic sword slash
  public playSlash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    // Add white noise puff for whoosh
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.start();
    noise.start();
    osc.stop(this.ctx.currentTime + 0.12);
    noise.stop(this.ctx.currentTime + 0.12);
  }

  // Metallic heavy impact
  public playHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Shield block clang
  public playBlock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Dash swoosh
  public playDash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Ultimate strike blast
  public playUltimate() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Harmonic chord buildup + explosion
    const freqs = [130, 195, 260, 390, 520];
    freqs.forEach(f => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 2, this.ctx!.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx!.currentTime + 0.7);

      gain.gain.setValueAtTime(0.12, this.ctx!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start();
      osc.stop(this.ctx!.currentTime + 0.7);
    });
  }

  // Victory Fanfare
  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [293.66, 329.63, 369.99, 440.0, 587.33]; // D major heroic fanfare
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.14);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + idx * 0.14 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.14 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.14);
      osc.stop(this.ctx!.currentTime + idx * 0.14 + 0.6);
    });
  }

  // Game over solemn drum & tone
  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  // Ambient Epic War Drum Pulse (procedural Persian tombak/daf rhythm)
  public startBattleRhythm() {
    if (this.isMuted) return;
    this.initCtx();
    if (this.musicInterval) return;

    let step = 0;
    this.musicInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      step = (step + 1) % 8;

      // Bass drum on 0, 3, 5 (Persian 6/8 or epic 4/4 syncopation)
      if (step === 0 || step === 3 || step === 5) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const baseFreq = step === 0 ? 80 : 105;
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(step === 0 ? 0.22 : 0.14, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      }
    }, 280);
  }

  public stopBattleRhythm() {
    if (this.musicInterval) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();

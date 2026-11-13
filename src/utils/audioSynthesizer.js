// Web Audio API ambient audio synthesizer for Vadodara 3D Experience
// Self-contained: does not depend on any external audio files!

class VadodaraAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isGarbaPlaying = false;
    this.volume = 0.35;
    this.droneGain = null;
    this.chimeTimer = null;
    this.garbaTimer = null;
    this.oscillators = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  startAmbience(preset = "palace") {
    this.init();
    if (!this.ctx) return;
    this.stopAmbience();

    this.isPlaying = true;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm Indian Tanpura Drone (Sa & Pa harmonic overtones)
    const baseFreq = preset === "lake" ? 110 : preset === "temple" ? 130.81 : 146.83; // D, C, D
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 2.25];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle LFO vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600 + idx * 200, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.oscillators.push(osc, lfo);
    });

    // Schedule gentle temple bells / royal chimes
    this.scheduleChimes();
  }

  scheduleChimes() {
    if (!this.isPlaying || !this.ctx) return;

    const nextChime = Math.random() * 10000 + 8000;
    this.chimeTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.playTempleBell();
        this.scheduleChimes();
      }
    }, nextChime);
  }

  playTempleBell() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const bellFreqs = [523.25, 659.25, 783.99, 1046.5];
      const fundamental = bellFreqs[Math.floor(Math.random() * bellFreqs.length)];

      const harmonics = [1, 2.02, 3.01, 4.2];
      harmonics.forEach((mult, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(fundamental * mult, now);

        gain.gain.setValueAtTime(0.06 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5 + i * 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 4);
      });
    } catch {
      // Audio fallback
    }
  }

  // ============================================
  // NAVRATRI GARBA DHOL BEAT SYNTHESIZER
  // ============================================
  startGarbaBeats() {
    this.init();
    if (!this.ctx) return;
    this.isGarbaPlaying = true;

    let step = 0;
    // 3-Tali (3-clap) authentic Garba rhythmic pattern
    const tempo = 420; // ms per beat

    const playStep = () => {
      if (!this.isGarbaPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Base Dhol Bass Drum ("Dha")
      if (step % 4 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.31);
      }

      // Sharp Treble Dhol Snare ("Ti-Ke")
      if (step % 2 === 1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }

      // Clapping / Manjira high-frequency bell
      if (step === 0 || step === 2 || step === 3) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1760, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      }

      step = (step + 1) % 6;
      this.garbaTimer = setTimeout(playStep, tempo);
    };

    playStep();
  }

  stopGarbaBeats() {
    this.isGarbaPlaying = false;
    if (this.garbaTimer) {
      clearTimeout(this.garbaTimer);
      this.garbaTimer = null;
    }
  }

  playHotspotClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // safe fallback
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  stopAmbience() {
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.stopGarbaBeats();
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored
      }
    });
    this.oscillators = [];
    this.isPlaying = false;
  }
}

export const audioEngine = new VadodaraAudioEngine();

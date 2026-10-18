/* ===================================================================
   StudyVerse — Web Audio API Engine
   Sound Effects, Success Chimes, Synthesized Ambient Focus Noise
   (100% Client-Side, Zero External MP3 Dependencies)
   =================================================================== */

const AudioEngine = {
  ctx: null,
  ambientNode: null,
  ambientGain: null,
  currentAmbientType: null,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  isSoundEnabled() {
    const user = StorageManager.getUser();
    return user.soundEnabled !== false;
  },

  // Soft Task Checkmark / Button Click Chime
  playChime() {
    if (!this.isSoundEnabled()) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio playChime note error', e);
    }
  },

  // Quiz Correct Answer Chime
  playCorrect() {
    if (!this.isSoundEnabled()) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.1, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch (e) {
      console.warn('Audio playCorrect error', e);
    }
  },

  // Quiz Incorrect Answer Tone
  playIncorrect() {
    if (!this.isSoundEnabled()) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio playIncorrect error', e);
    }
  },

  // Level Up & Badge Celebration Fanfare
  playCelebration() {
    if (!this.isSoundEnabled()) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        { time: 0.0, freqs: [440, 554.37, 659.25] },     // A major
        { time: 0.15, freqs: [493.88, 622.25, 739.99] }, // B
        { time: 0.3, freqs: [554.37, 659.25, 830.61] },  // C#m
        { time: 0.5, freqs: [587.33, 739.99, 880, 1174.66] } // D major fanfare
      ];

      chords.forEach(chord => {
        chord.freqs.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + chord.time);

          gain.gain.setValueAtTime(0.06, now + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + chord.time);
          osc.stop(now + chord.time + 0.45);
        });
      });
    } catch (e) {
      console.warn('Audio playCelebration error', e);
    }
  },

  // Synthesized Ambient Sound Generator for Pomodoro
  startAmbientSound(type) {
    this.stopAmbientSound();
    try {
      this.init();
      if (!this.ctx) return;

      this.currentAmbientType = type;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      if (type === 'alpha') {
        // Binaural Lo-Fi Alpha Wave (10Hz difference for deep focus)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(226, this.ctx.currentTime); // 10Hz Alpha beat

        osc1.connect(this.ambientGain);
        osc2.connect(this.ambientGain);
        osc1.start();
        osc2.start();
        this.ambientNode = { stop: () => { osc1.stop(); osc2.stop(); } };
      } else if (type === 'whitenoise' || type === 'rain') {
        // Synthesized White/Pink Noise with bandpass filter for rain or soft hum
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Soft pink/brown rain filter
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.05;
          } else {
            output[i] = white * 0.04;
          }
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.ambientGain);
        whiteNoise.start();
        this.ambientNode = whiteNoise;
      }
    } catch (e) {
      console.warn('Ambient sound synthesis error', e);
    }
  },

  stopAmbientSound() {
    if (this.ambientNode) {
      try {
        this.ambientNode.stop();
      } catch (e) {}
      this.ambientNode = null;
    }
    this.currentAmbientType = null;
  }
};

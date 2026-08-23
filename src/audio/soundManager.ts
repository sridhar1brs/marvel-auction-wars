// Procedural Web Audio API SFX & Official MP3 Soundtrack Engine for MARVEL: AUCTION WARS
// Featuring "The Avengers" by Alan Silvestri (MP3 Audio + Procedural Fallback)

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private audioElement: HTMLAudioElement | null = null;
  private bgmTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private activeBgmNodes: (AudioNode | OscillatorNode)[] = [];
  private bgmMasterGain: GainNode | null = null;

  constructor() {
    // Setup audio element for Alan Silvestri's The Avengers MP3
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio('/audio/avengers_theme.mp3');
      this.audioElement.loop = true;
      this.audioElement.volume = 0.35;
      this.audioElement.preload = 'auto';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    
    // Toggle MP3 volume
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }

    // Toggle Synth Gain
    if (this.bgmMasterGain && this.ctx) {
      this.bgmMasterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isBgmActive(): boolean {
    return this.isBgmPlaying;
  }

  // ==========================================
  // 🎺 THE AVENGERS · ALAN SILVESTRI MP3 BGM
  // ==========================================

  public startAvengersTheme() {
    this.initContext();
    this.isBgmPlaying = true;

    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.muted = this.isMuted;
      this.audioElement.volume = 0.35;
      
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('[BGM] MP3 autoplay notice:', err);
          // Fallback to procedural synth if browser restricts MP3 playback
          this.playAvengersSynthLoop();
        });
      }
    } else {
      this.playAvengersSynthLoop();
    }
  }

  public stopAvengersTheme() {
    this.isBgmPlaying = false;
    
    // Stop MP3
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    // Stop synth fallback
    if (this.bgmTimeoutId) {
      clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
    this.activeBgmNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignored
      }
    });
    this.activeBgmNodes = [];
  }

  // Frequency mapping for fallback procedural synthesizer
  private readonly NOTE_FREQS: Record<string, number> = {
    'A2': 110.00, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'Bb3': 233.08, 'C4': 261.63,
    'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'C5': 523.25,
    'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'Bb5': 932.33, 'C6': 1046.50
  };

  private playAvengersSynthLoop() {
    if (!this.isBgmPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const tempo = 104;
    const beat = 60 / tempo;

    if (!this.bgmMasterGain) {
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.connect(this.ctx.destination);
    }
    this.bgmMasterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, now);

    const melody: { note: string; start: number; duration: number }[] = [
      { note: 'D4', start: 0, duration: beat * 1.5 },
      { note: 'D4', start: beat * 1.5, duration: beat * 0.5 },
      { note: 'F4', start: beat * 2.0, duration: beat * 1.0 },
      { note: 'G4', start: beat * 3.0, duration: beat * 1.0 },
      { note: 'A4', start: beat * 4.0, duration: beat * 2.0 },
      { note: 'G4', start: beat * 6.0, duration: beat * 0.5 },
      { note: 'F4', start: beat * 6.5, duration: beat * 0.5 },
      { note: 'E4', start: beat * 7.0, duration: beat * 1.0 },
      { note: 'D4', start: beat * 8.0, duration: beat * 2.0 },
      { note: 'D4', start: beat * 10.0, duration: beat * 1.0 },
      { note: 'F4', start: beat * 11.0, duration: beat * 1.0 },
      { note: 'G4', start: beat * 12.0, duration: beat * 1.5 },
      { note: 'A4', start: beat * 13.5, duration: beat * 0.5 },
      { note: 'Bb4', start: beat * 14.0, duration: beat * 1.0 },
      { note: 'A4', start: beat * 15.0, duration: beat * 1.0 },
      { note: 'G4', start: beat * 16.0, duration: beat * 2.0 },
      { note: 'D5', start: beat * 18.0, duration: beat * 1.5 },
      { note: 'D5', start: beat * 19.5, duration: beat * 0.5 },
      { note: 'F5', start: beat * 20.0, duration: beat * 1.0 },
      { note: 'G5', start: beat * 21.0, duration: beat * 1.0 },
      { note: 'A5', start: beat * 22.0, duration: beat * 2.0 },
      { note: 'F5', start: beat * 24.0, duration: beat * 1.0 },
      { note: 'G5', start: beat * 25.0, duration: beat * 1.0 },
      { note: 'E5', start: beat * 26.0, duration: beat * 2.0 },
      { note: 'D5', start: beat * 28.0, duration: beat * 3.5 },
    ];

    melody.forEach(({ note, start, duration }) => {
      const freq = this.NOTE_FREQS[note];
      if (!freq) return;

      const oscLead = this.ctx!.createOscillator();
      const oscHarmonic = this.ctx!.createOscillator();
      const noteGain = this.ctx!.createGain();
      const startTime = now + start;

      oscLead.type = 'sawtooth';
      oscLead.frequency.setValueAtTime(freq, startTime);
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 0.5, startTime);

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.08);
      noteGain.gain.setValueAtTime(0.28, startTime + duration - 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscLead.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(this.bgmMasterGain!);

      oscLead.start(startTime);
      oscLead.stop(startTime + duration);
      oscHarmonic.start(startTime);
      oscHarmonic.stop(startTime + duration);

      this.activeBgmNodes.push(oscLead, oscHarmonic, noteGain);
    });

    const totalBeats = 32;
    const loopDurationMs = totalBeats * beat * 1000;
    this.bgmTimeoutId = setTimeout(() => {
      this.playAvengersSynthLoop();
    }, loopDurationMs - 150);
  }

  // ==========================================
  // 🔊 PROCEDURAL SFX COLLECTION
  // ==========================================

  // 1. UI Button Click
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 2. Bid Placed (High-tech digital chime)
  public playBidPlaced() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + i * 0.04;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.15);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  // 3. Outbid Warning Alert
  public playOutbid() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(330, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // 4. Auction Gavel Strike (Auction Won)
  public playGavelWon() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const chordOsc = this.ctx!.createOscillator();
      const chordGain = this.ctx!.createGain();
      const chordStart = now + 0.1 + idx * 0.03;

      chordOsc.type = 'triangle';
      chordOsc.frequency.setValueAtTime(freq, chordStart);

      chordGain.gain.setValueAtTime(0.2, chordStart);
      chordGain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.4);

      chordOsc.connect(chordGain);
      chordGain.connect(this.ctx!.destination);

      chordOsc.start(chordStart);
      chordOsc.stop(chordStart + 0.4);
    });
  }

  // 5. Card Skipped
  public playSkip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 6. Countdown Beep
  public playTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isUrgent ? 1100 : 750, now);

    gain.gain.setValueAtTime(isUrgent ? 0.3 : 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 7. Mythic Cosmic Reveal
  public playMythicReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(60, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);
    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.2);

    [440, 659.25, 880, 1174.66, 1318.51, 1760].forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const st = now + 0.15 + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, st);
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, st + 0.8);

      gain.gain.setValueAtTime(0.12, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(st);
      osc.stop(st + 0.8);
    });
  }

  // 8. Battle Attack Impact
  public playAttackHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 9. Special Ability Surge
  public playAbilityTrigger() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.35);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 10. Victory Fanfare (Web Letter Days - Spider-Man: Brand New Day)
  public playVictory() {
    this.playWebLetterDays();
  }

  // 11. "Web Letter Days" - Spider-Man: Brand New Day Soundtrack (Michael Giacchino)
  public playMarvelIntroFanfare() {
    this.playWebLetterDays();
  }

  public playWebLetterDays() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Check if an external audio file exists in public/audio/web_letter_days.mp3
    try {
      const audio = new Audio('/audio/web_letter_days.mp3');
      audio.volume = 0.65;
      audio.play().catch(() => {
        // If file not found or blocked, fall back seamlessly to procedural synthesizer
        this.synthesizeWebLetterDays();
      });
      return;
    } catch {
      this.synthesizeWebLetterDays();
    }
  }

  private synthesizeWebLetterDays() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Cinematic Web-Thwip & Sub-Bass Drop
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 2.8);
    subGain.gain.setValueAtTime(0.45, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.8);

    // 2. High Frequency Web-Shooter Flutter Swoosh
    const bufferSize = this.ctx.sampleRate * 1.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, now);
    noiseFilter.frequency.linearRampToValueAtTime(450, now + 1.4);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // 3. Michael Giacchino "Spider-Man: Brand New Day" Main Theme Motif (Web Letter Days)
    // Notes: [A3] -> [C4] -> [D4] -> [E4] -> [G4] -> [E4] -> [D4] -> [C4] -> [E4] -> [A4]
    const spiderManMotif = [
      // Opening ostinato rhythm
      { f: 220.00, t: 0.10, d: 0.22, type: 'sawtooth' as OscillatorType, vol: 0.16 }, // A3
      { f: 261.63, t: 0.32, d: 0.22, type: 'sawtooth' as OscillatorType, vol: 0.18 }, // C4
      { f: 293.66, t: 0.54, d: 0.25, type: 'sawtooth' as OscillatorType, vol: 0.20 }, // D4
      { f: 329.63, t: 0.80, d: 0.45, type: 'sawtooth' as OscillatorType, vol: 0.26 }, // E4 (Accent)

      // Brand New Day Emotional Lift
      { f: 392.00, t: 1.15, d: 0.35, type: 'sawtooth' as OscillatorType, vol: 0.28 }, // G4
      { f: 329.63, t: 1.45, d: 0.35, type: 'sawtooth' as OscillatorType, vol: 0.26 }, // E4
      { f: 293.66, t: 1.75, d: 0.35, type: 'sawtooth' as OscillatorType, vol: 0.24 }, // D4
      { f: 261.63, t: 2.05, d: 0.35, type: 'sawtooth' as OscillatorType, vol: 0.24 }, // C4

      // Triumphant Giacchino French Horn Climax at t = 2.35s
      { f: 110.00, t: 2.35, d: 2.5, type: 'sawtooth' as OscillatorType, vol: 0.28 }, // A2 (Bass Foundation)
      { f: 220.00, t: 2.35, d: 2.5, type: 'sawtooth' as OscillatorType, vol: 0.30 }, // A3
      { f: 329.63, t: 2.35, d: 2.5, type: 'sawtooth' as OscillatorType, vol: 0.32 }, // E4
      { f: 440.00, t: 2.35, d: 2.7, type: 'sawtooth' as OscillatorType, vol: 0.36 }, // A4 (High Heroic Trumpet)
      { f: 523.25, t: 2.35, d: 2.7, type: 'sawtooth' as OscillatorType, vol: 0.34 }, // C5
      { f: 659.25, t: 2.35, d: 2.7, type: 'sawtooth' as OscillatorType, vol: 0.32 }, // E5
    ];

    spiderManMotif.forEach(({ f, t, d, type, vol }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, now + t);

      osc.type = type;
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(vol, now + t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + t);
      osc.stop(now + t + d);
    });
  }
}

export const soundManager = new SoundManager();

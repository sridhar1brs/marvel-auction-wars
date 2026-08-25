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
    // Setup audio element for Alan Silvestri's Avengers Theme
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio('/audio/marvel-music/avengers_theme.webm');
      this.audioElement.loop = true;
      this.audioElement.volume = 0.50;
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
    
    // Toggle Audio volume
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }

    // Toggle Synth Gain
    if (this.bgmMasterGain && this.ctx) {
      this.bgmMasterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.20, this.ctx.currentTime);
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
  // ⚡ THE AVENGERS MAIN THEME · ALAN SILVESTRI
  // ==========================================

  public startAvengersTheme() {
    this.initContext();
    this.isBgmPlaying = true;

    if (!this.audioElement && typeof window !== 'undefined') {
      this.audioElement = new Audio('/audio/marvel-music/avengers_theme.webm');
      this.audioElement.loop = true;
      this.audioElement.volume = 0.50;
    }

    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.muted = this.isMuted;
      this.audioElement.volume = 0.50;
      
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('[SoundManager] Audio playback notice:', err);
        });
      }
    }
  }

  public stopAvengersTheme() {
    this.isBgmPlaying = false;
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

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
        // already disconnected
      }
    });
    this.activeBgmNodes = [];
  }

  // Frequency mapping for procedural synthesizer
  private readonly NOTE_FREQS: Record<string, number> = {
    'A2': 110.00, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'Bb3': 233.08, 'C4': 261.63,
    'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'C5': 523.25,
    'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'Bb5': 932.33, 'C6': 1046.50
  };

  private playAvengersSynthLoop() {
    if (!this.isBgmPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const tempo = 110;
    const beat = 60 / tempo;

    if (!this.bgmMasterGain) {
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.connect(this.ctx.destination);
    }
    this.bgmMasterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.20, now);

    // Alan Silvestri Avengers Theme Main Motif
    const melody: { note: string; start: number; duration: number }[] = [
      { note: 'A3', start: 0, duration: beat * 0.75 },
      { note: 'C4', start: beat * 0.75, duration: beat * 0.75 },
      { note: 'D4', start: beat * 1.5, duration: beat * 1.0 },
      { note: 'E4', start: beat * 2.5, duration: beat * 2.0 },
      { note: 'G4', start: beat * 4.5, duration: beat * 1.0 },
      { note: 'E4', start: beat * 5.5, duration: beat * 1.0 },
      { note: 'D4', start: beat * 6.5, duration: beat * 1.0 },
      { note: 'C4', start: beat * 7.5, duration: beat * 1.5 },
      { note: 'A4', start: beat * 9.0, duration: beat * 3.0 }
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

    const totalBeats = 16;
    const loopDurationMs = totalBeats * beat * 1000;
    this.bgmTimeoutId = setTimeout(() => {
      this.playAvengersSynthLoop();
    }, loopDurationMs - 120);
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

  // 10. Victory Fanfare (Subtle triumph chime - No background song triggered)
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  // 11. Marvel Intro Fanfare
  public playMarvelIntroFanfare() {
    // Kept subtle - No song auto-played
  }

  public playAvengersFanfare() {
    // Disabled auto-song to let MCU Sound Engine handle all music
  }

  private synthesizeAvengersFanfare() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Alan Silvestri Avengers Motif (A4, C5, D5, E5)
    const avengersNotes = [
      { f: 220.00, t: 0.10, d: 0.35, vol: 0.25 },
      { f: 261.63, t: 0.45, d: 0.35, vol: 0.28 },
      { f: 293.66, t: 0.80, d: 0.40, vol: 0.30 },
      { f: 329.63, t: 1.20, d: 1.50, vol: 0.38 },
      { f: 440.00, t: 1.20, d: 1.50, vol: 0.35 },
      { f: 523.25, t: 1.20, d: 1.50, vol: 0.32 }
    ];

    avengersNotes.forEach(({ f, t, d, vol }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(vol, now + t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + t);
      osc.stop(now + t + d);
    });
  }
}

export const soundManager = new SoundManager();

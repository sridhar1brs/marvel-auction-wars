import { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [bgmActive, setBgmActive] = useState(soundManager.isBgmActive());

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playClick();
  };

  const handleToggleAvengersBgm = () => {
    if (bgmActive) {
      soundManager.stopAvengersTheme();
      setBgmActive(false);
    } else {
      soundManager.startAvengersTheme();
      setBgmActive(true);
    }
    soundManager.playClick();
  };

  return (
    <div className="flex items-center gap-2 bg-marvel-dark/90 backdrop-blur border border-marvel-border px-2.5 py-1 rounded-full text-xs shadow-lg">
      {/* SFX Mute/Unmute */}
      <button
        onClick={handleToggleMute}
        title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
        className={`p-1.5 rounded-full transition-all ${
          isMuted 
            ? 'text-red-400 bg-red-950/40 hover:bg-red-900/40' 
            : 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40'
        }`}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* The Avengers Theme - Alan Silvestri */}
      <button
        onClick={handleToggleAvengersBgm}
        title="Play / Pause 'The Avengers' Theme by Alan Silvestri"
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-black tracking-wider uppercase transition-all ${
          bgmActive
            ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border border-amber-400/80 shadow-glow-gold animate-pulse'
            : 'bg-slate-800/90 text-slate-300 hover:text-white border border-white/10 hover:border-amber-500/50'
        }`}
      >
        <Music className={`w-3.5 h-3.5 ${bgmActive ? 'animate-bounce text-amber-300' : 'text-slate-400'}`} />
        <span>{bgmActive ? '🎵 AVENGERS THEME' : 'PLAY AVENGERS BGM'}</span>
      </button>
    </div>
  );
}

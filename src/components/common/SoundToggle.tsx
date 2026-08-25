import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playClick();
  };

  return (
    <div className="flex items-center gap-2 bg-marvel-dark/90 backdrop-blur border border-marvel-border px-2.5 py-1 rounded-full text-xs shadow-lg">
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
    </div>
  );
}

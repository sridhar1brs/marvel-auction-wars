import { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Swords, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface Props {
  onComplete: () => void;
  title?: string;
  subtitle?: string;
}

export function MarvelCinematicIntro({
  onComplete,
  title = 'MARVEL',
  subtitle = 'AUCTION WARS • MULTIVERSE TOURNAMENT',
}: Props) {
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Space key handler to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Try playing video with audio
    if (videoRef.current) {
      videoRef.current.volume = 0.9;
      videoRef.current.play().catch(() => {
        // If autoplay blocked by browser policy, retry muted so visuals start immediately
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => setVideoError(true));
        }
      });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSkip = () => {
    soundManager.playClick();
    onComplete();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer select-none overflow-hidden animate-fadeIn"
    >
      {/* 1080p Marvel Cinematic Video Player */}
      {!videoError ? (
        <video
          ref={videoRef}
          src="/videos/marvel_intro.mp4"
          autoPlay
          playsInline
          onEnded={onComplete}
          onError={() => setVideoError(true)}
          className="w-full h-full object-contain sm:object-cover pointer-events-none"
        />
      ) : (
        /* Fallback Cosmic Intro Graphic if video is unavailable */
        <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fadeIn space-y-4">
          <div className="px-10 py-5 bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-4 border-white shadow-glow-red">
            <h1 className="font-heading font-black text-6xl sm:text-9xl text-white tracking-tighter uppercase drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
              {title}
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 shadow-glow-red">
            <Swords className="w-4 h-4 text-marvel-red animate-pulse" />
            <span className="font-heading font-extrabold text-sm text-red-200 tracking-widest uppercase">
              {subtitle}
            </span>
            <Sparkles className="w-4 h-4 text-marvel-gold animate-spin" />
          </div>
        </div>
      )}

      {/* Top Sound Toggle if browser started muted */}
      {isMuted && !videoError && (
        <button
          onClick={toggleSound}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-red-600/90 hover:bg-red-500 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider shadow-glow-red transition-all animate-bounce"
        >
          <VolumeX className="w-4 h-4" />
          <span>TAP TO UNMUTE SOUND</span>
        </button>
      )}

      {/* Bottom Skip Indicator */}
      <div className="absolute bottom-6 z-20 text-center">
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest bg-black/75 px-5 py-2 rounded-full border border-white/20 hover:text-white hover:border-red-500 transition-all shadow-lg">
          Click anywhere or Press SPACE to Skip ⚡
        </span>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Swords, Volume2 } from 'lucide-react';

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
  const [stage, setStage] = useState<'flipping' | 'reveal' | 'subtitle' | 'exit'>('flipping');
  const [comicFrame, setComicFrame] = useState(0);

  const comicCovers = [
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/156-captain-america.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/332-hulk.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/687-venom.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/226-doctor-strange.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/213-deadpool.jpg',
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/655-thanos.jpg',
  ];

  useEffect(() => {
    // Play the Marvel intro fanfare immediately
    soundManager.playMarvelIntroFanfare();

    // Fast comic page flip animation
    const flipInterval = setInterval(() => {
      setComicFrame(prev => (prev + 1) % comicCovers.length);
    }, 90);

    // Stage 1: Comic Flip -> Stage 2: MARVEL Zoom
    const timer1 = setTimeout(() => {
      setStage('reveal');
    }, 1200);

    // Stage 3: Subtitle slide in
    const timer2 = setTimeout(() => {
      setStage('subtitle');
    }, 2000);

    // Stage 4: Fade out exit
    const timer3 = setTimeout(() => {
      setStage('exit');
    }, 3600);

    // Final complete callback
    const timer4 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearInterval(flipInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const handleSkip = () => {
    soundManager.playClick();
    onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer select-none transition-opacity duration-700 ${
        stage === 'exit' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Comic Flipping Panels & Vignette */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <img
          src={comicCovers[comicFrame]}
          alt="Marvel Comic Reel"
          className="w-full h-full object-cover filter grayscale contrast-200 transition-all duration-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>

      {/* Central Marvel Red Block & Typography */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fadeIn">
        {/* Red Box with 3D White Marvel Lettering */}
        <div
          className={`relative px-8 py-3.5 sm:px-14 sm:py-5 bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-2 sm:border-4 border-white shadow-glow-red transition-all duration-1000 transform ${
            stage === 'flipping'
              ? 'scale-125 brightness-150'
              : stage === 'reveal'
              ? 'scale-105 brightness-125'
              : 'scale-100 brightness-100'
          }`}
        >
          {/* Inside letter masked flipbook effect */}
          <div className="absolute inset-0 opacity-20 overflow-hidden mix-blend-screen pointer-events-none">
            <img
              src={comicCovers[(comicFrame + 2) % comicCovers.length]}
              alt="Comic Mask"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="font-heading font-black text-5xl sm:text-8xl md:text-9xl text-white tracking-tighter uppercase relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            {title}
          </h1>
        </div>

        {/* Cinematic Subtitle Under Banner */}
        <div
          className={`mt-4 sm:mt-6 flex flex-col items-center gap-2 transition-all duration-700 transform ${
            stage === 'subtitle' || stage === 'reveal'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 shadow-glow-red">
            <Swords className="w-3.5 h-3.5 text-marvel-red animate-pulse" />
            <span className="font-heading font-extrabold text-xs sm:text-sm text-red-200 tracking-widest uppercase">
              {subtitle}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-marvel-gold animate-spin" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/70 border border-cyan-500/40 text-[10px] font-bold text-cyan-300">
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>OST: Web Letter Days • Spider-Man: Brand New Day</span>
          </div>
        </div>
      </div>

      {/* Skip Button Indicator */}
      <div className="absolute bottom-8 z-20 text-center">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full border border-white/10 hover:text-white transition-colors">
          Click anywhere or Press SPACE to Skip
        </span>
      </div>
    </div>
  );
}

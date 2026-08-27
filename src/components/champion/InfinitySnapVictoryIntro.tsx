import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Flame, Shield, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../audio/soundManager';

interface Props {
  championName: string;
  championAvatar: string;
  onComplete: () => void;
}

interface StoneData {
  id: string;
  name: string;
  sub: string;
  color: string;
  glow: string;
  border: string;
  symbol: string;
  cx: number;
  cy: number;
  r: number;
}

const INFINITY_STONES: StoneData[] = [
  { id: 'power', name: 'POWER STONE', sub: 'Cosmic Dominance', color: '#A855F7', glow: 'rgba(168,85,247,0.9)', border: '#C084FC', symbol: '🟣', cx: 110, cy: 195, r: 10 },
  { id: 'space', name: 'SPACE STONE', sub: 'Tesseract Warp', color: '#38BDF8', glow: 'rgba(56,189,248,0.9)', border: '#7DD3FC', symbol: '🔵', cx: 145, cy: 150, r: 10 },
  { id: 'reality', name: 'REALITY STONE', sub: 'Aether Shifter', color: '#EF4444', glow: 'rgba(239,68,68,0.9)', border: '#F87171', symbol: '🔴', cx: 195, cy: 130, r: 11 },
  { id: 'soul', name: 'SOUL STONE', sub: 'Vormir Essence', color: '#F97316', glow: 'rgba(249,115,22,0.9)', border: '#FB923C', symbol: '🟠', cx: 245, cy: 150, r: 10 },
  { id: 'time', name: 'TIME STONE', sub: 'Eye of Agamotto', color: '#10B981', glow: 'rgba(16,185,129,0.9)', border: '#34D399', symbol: '🟢', cx: 285, cy: 220, r: 10 },
  { id: 'mind', name: 'MIND STONE', sub: 'Vision Nexus Core', color: '#FBBF24', glow: 'rgba(251,191,36,1.0)', border: '#FDE047', symbol: '🟡', cx: 195, cy: 235, r: 16 },
];

export function InfinitySnapVictoryIntro({ championName, championAvatar, onComplete }: Props) {
  const [activeStoneIndex, setActiveStoneIndex] = useState<number>(-1);
  // Stages: 'CHARGING_STONES' -> 'WINDUP_TENSION' -> 'SNAP_RELEASE' -> 'SUPERNOVA'
  const [stage, setStage] = useState<'CHARGING_STONES' | 'WINDUP_TENSION' | 'SNAP_RELEASE' | 'SUPERNOVA'>('CHARGING_STONES');
  const [isWhiteout, setIsWhiteout] = useState<boolean>(false);
  const [showShockwave, setShowShockwave] = useState<boolean>(false);

  useEffect(() => {
    // 1. Sequentially ignite all 6 Infinity Stones
    const stoneInterval = setInterval(() => {
      setActiveStoneIndex(prev => {
        const next = prev + 1;
        if (next < INFINITY_STONES.length) {
          soundManager.playInfinityStone(next);
          return next;
        } else {
          clearInterval(stoneInterval);
          return prev;
        }
      });
    }, 420);

    // 2. Transition into Windup Tension (Thumb & Middle Finger press together with plasma arcs)
    const windupTimer = setTimeout(() => {
      setStage('WINDUP_TENSION');
    }, 420 * 6 + 300);

    // 3. Trigger The Snap! (Fingers snap across, middle finger slams down, thumb flicks out)
    const snapTimer = setTimeout(() => {
      setStage('SNAP_RELEASE');
      soundManager.playCosmicSnap();

      // Trigger Whiteout Flash
      setIsWhiteout(true);
      setShowShockwave(true);

      // Launch 360° Cosmic Confetti Starburst Explosion
      try {
        confetti({
          particleCount: 250,
          spread: 360,
          startVelocity: 55,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#FFD700', '#FF1744', '#00E5FF', '#A855F7', '#10B981', '#F97316', '#FFFFFF']
        });

        setTimeout(() => {
          confetti({
            particleCount: 160,
            angle: 60,
            spread: 90,
            origin: { x: 0, y: 0.65 },
            colors: ['#FFD700', '#FF1744', '#A855F7']
          });
          confetti({
            particleCount: 160,
            angle: 120,
            spread: 90,
            origin: { x: 1, y: 0.65 },
            colors: ['#00E5FF', '#10B981', '#FBBF24']
          });
        }, 250);
      } catch (e) {
        console.error(e);
      }

      setTimeout(() => {
        setIsWhiteout(false);
        setStage('SUPERNOVA');
      }, 300);

      // 4. Complete and reveal champion stage
      setTimeout(() => {
        onComplete();
      }, 1600);
    }, 420 * 6 + 1300);

    return () => {
      clearInterval(stoneInterval);
      clearTimeout(windupTimer);
      clearTimeout(snapTimer);
    };
  }, [onComplete]);

  const currentStone = activeStoneIndex >= 0 && activeStoneIndex < INFINITY_STONES.length 
    ? INFINITY_STONES[activeStoneIndex] 
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#04060E] flex flex-col items-center justify-center overflow-hidden select-none animate-fadeIn">
      
      {/* 1. Deep Space Cosmic Nebula Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/50 via-[#060814] to-black pointer-events-none" />

      {/* Floating Stardust Particles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* 2. Full-Screen Blinding Whiteout Flash upon SNAP */}
      {isWhiteout && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-flash" />
      )}

      {/* 3. 360° Cosmic Shockwave Wave Rings */}
      {showShockwave && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="w-40 h-40 rounded-full border-8 border-amber-300 shadow-[0_0_120px_#FBBF24] animate-ping" />
          <div className="absolute w-60 h-60 rounded-full border-4 border-cyan-400 shadow-[0_0_90px_#22D3EE] animate-ping [animation-delay:150ms]" />
          <div className="absolute w-80 h-80 rounded-full border-2 border-purple-400 shadow-[0_0_70px_#C084FC] animate-ping [animation-delay:300ms]" />
        </div>
      )}

      {/* Skip Button */}
      <button
        onClick={() => {
          soundManager.playClick();
          onComplete();
        }}
        className="absolute top-6 right-6 z-40 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/90 text-amber-300 hover:text-white border border-amber-500/50 font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md hover:scale-105 active:scale-95"
      >
        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>SKIP INTRO ⚡</span>
      </button>

      {/* Main Center Stage */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-xl mx-auto px-4 space-y-6">
        
        {/* Top Header Prompt */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/80 text-amber-300 text-xs font-heading font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>COSMIC DESTINY FULFILLED</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-200 uppercase tracking-wide">
            {stage === 'WINDUP_TENSION' ? (
              <span className="text-amber-300 animate-pulse">FOCUSSING COSMIC WILL...</span>
            ) : stage === 'SNAP_RELEASE' || stage === 'SUPERNOVA' ? (
              <span className="text-yellow-300 font-black tracking-widest text-3xl animate-bounce">⚡ THE COSMIC SNAP! ⚡</span>
            ) : (
              'THE UNIVERSE RECOGNIZES ITS CHAMPION'
            )}
          </h2>
        </div>

        {/* 3D Infinity Gauntlet Animated Vessel */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
          
          {/* Ambient Cosmic Core Flare */}
          <div 
            className="absolute inset-4 rounded-full blur-3xl transition-all duration-500 pointer-events-none"
            style={{
              background: stage === 'SNAP_RELEASE' || stage === 'SUPERNOVA'
                ? 'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(245,158,11,0.6) 40%, transparent 80%)'
                : currentStone 
                ? `radial-gradient(circle, ${currentStone.glow} 0%, rgba(245,158,11,0.3) 60%, transparent 80%)`
                : 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)'
            }}
          />

          {/* SVG Animated Metallic Infinity Gauntlet with Articulated Finger Snap */}
          <svg 
            viewBox="0 0 400 400" 
            className={`w-full h-full drop-shadow-[0_0_45px_rgba(255,215,0,0.8)] transition-all duration-300 ${
              stage === 'WINDUP_TENSION' 
                ? 'scale-105 rotate-1 animate-pulse' 
                : stage === 'SNAP_RELEASE' 
                ? 'scale-125 -rotate-6 animate-shake' 
                : 'animate-float-idle'
            }`}
          >
            <defs>
              <linearGradient id="gauntletGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF7A1" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="65%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="gauntletPlate" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#92400E" />
                <stop offset="40%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <filter id="stoneGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Gauntlet Forearm Armor Base */}
            <path
              d="M 120 380 L 140 280 L 260 280 L 280 380 Z"
              fill="url(#gauntletGold)"
              stroke="#FDE047"
              strokeWidth="4"
            />
            {/* Wrist Guard Armor Bands */}
            <rect x="135" y="270" width="130" height="24" rx="8" fill="url(#gauntletPlate)" stroke="#FDE047" strokeWidth="3" />
            <rect x="145" y="298" width="110" height="18" rx="6" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />

            {/* Palm and Hand Structure */}
            <path
              d="M 105 270 Q 90 190 115 180 Q 135 100 150 140 Q 170 75 195 125 Q 215 90 240 145 Q 265 145 280 220 Q 290 260 270 270 Z"
              fill="url(#gauntletGold)"
              stroke="#FFF275"
              strokeWidth="4"
            />

            {/* ======================================================= */}
            {/* DYNAMIC ARTICULATED FINGERS BASED ON ANIMATION STAGE   */}
            {/* ======================================================= */}

            {stage === 'CHARGING_STONES' && (
              /* State 1: Open Hand with Fingers Extended Outward */
              <g className="transition-all duration-300">
                {/* Little Finger */}
                <path d="M 110 185 Q 112 135 115 115" stroke="#78350F" strokeWidth="9" strokeLinecap="round" />
                {/* Ring Finger */}
                <path d="M 148 145 Q 152 95 158 75" stroke="#78350F" strokeWidth="10" strokeLinecap="round" />
                {/* Middle Finger */}
                <path d="M 195 128 Q 195 78 198 58" stroke="#78350F" strokeWidth="11" strokeLinecap="round" />
                {/* Index Finger */}
                <path d="M 238 145 Q 242 100 248 80" stroke="#78350F" strokeWidth="10" strokeLinecap="round" />
                {/* Thumb */}
                <path d="M 275 215 Q 310 180 315 155" stroke="#78350F" strokeWidth="11" strokeLinecap="round" />
              </g>
            )}

            {stage === 'WINDUP_TENSION' && (
              /* State 2: PRE-SNAP TENSION (Thumb presses tightly against the Middle Finger) */
              <g className="transition-all duration-300">
                {/* Little Finger (Curled) */}
                <path d="M 110 185 Q 115 155 125 140" stroke="#78350F" strokeWidth="9" strokeLinecap="round" />
                {/* Ring Finger (Curled) */}
                <path d="M 148 145 Q 155 120 165 110" stroke="#78350F" strokeWidth="10" strokeLinecap="round" />
                
                {/* Middle Finger (Arching to meet the Thumb at (235, 150)) */}
                <path d="M 195 128 Q 215 130 235 150" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
                
                {/* Index Finger (Curled Up) */}
                <path d="M 245 145 Q 260 110 268 95" stroke="#78350F" strokeWidth="10" strokeLinecap="round" />
                
                {/* Thumb (Stretching across to press against Middle Finger at (235, 150)) */}
                <path d="M 275 215 Q 260 175 235 150" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />

                {/* Crackling Plasma Energy Spark at Contact Point (235, 150) */}
                <circle cx="235" cy="150" r="14" fill="#FDE047" filter="url(#stoneGlow)" className="animate-ping" />
                <path d="M 220 145 L 250 155 M 235 135 L 235 165" stroke="#FFFFFF" strokeWidth="4" className="animate-spin" />
              </g>
            )}

            {(stage === 'SNAP_RELEASE' || stage === 'SUPERNOVA') && (
              /* State 3: SNAP COMPLETED (Middle Finger slammed down, Thumb flicked outward, Shockwave blast) */
              <g className="transition-all duration-300">
                {/* Little Finger */}
                <path d="M 110 185 Q 115 165 120 150" stroke="#78350F" strokeWidth="9" strokeLinecap="round" />
                {/* Ring Finger */}
                <path d="M 148 145 Q 155 130 160 120" stroke="#78350F" strokeWidth="10" strokeLinecap="round" />
                
                {/* Middle Finger (SLAMMED DOWN firmly into palm base at (195, 200)) */}
                <path d="M 195 128 Q 195 170 195 205" stroke="#FFF275" strokeWidth="13" strokeLinecap="round" />
                
                {/* Index Finger (Extended Upward in Victory Pose) */}
                <path d="M 245 145 Q 255 95 262 70" stroke="#78350F" strokeWidth="10" strokeLinecap="round" />
                
                {/* Thumb (FLICKED OUTWARD wide to the right) */}
                <path d="M 275 215 Q 330 190 345 160" stroke="#FFF275" strokeWidth="13" strokeLinecap="round" />

                {/* EXPLOSIVE SNAP STARBURST AT CONTACT POINT */}
                <circle cx="220" cy="170" r="28" fill="#FDE047" filter="url(#stoneGlow)" className="animate-ping" />
                <polygon
                  points="220,135 230,160 255,165 235,180 240,205 220,190 200,205 205,180 185,165 210,160"
                  fill="#FFFFFF"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  className="animate-spin"
                />
              </g>
            )}

            {/* Core Cosmic Energy Filaments */}
            <path d="M 110 195 Q 195 235 285 220" fill="none" stroke="#FDE047" strokeWidth="2" opacity="0.6" />
            <path d="M 145 150 Q 195 235 245 150" fill="none" stroke="#FDE047" strokeWidth="2" opacity="0.6" />
            <path d="M 195 130 L 195 235" fill="none" stroke="#FDE047" strokeWidth="2" opacity="0.6" />

            {/* 6 INFINITY STONES (Igniting Sequentially) */}
            {INFINITY_STONES.map((stone, idx) => {
              const isLit = activeStoneIndex >= idx;
              const isCurrent = activeStoneIndex === idx;

              return (
                <g key={stone.id} className="transition-all duration-300">
                  {/* Socket Bezel */}
                  <circle
                    cx={stone.cx}
                    cy={stone.cy}
                    r={stone.r + 3}
                    fill="#3B1C05"
                    stroke="#FDE047"
                    strokeWidth="2"
                  />

                  {/* Radiating Energy Ring when lit */}
                  {isLit && (
                    <circle
                      cx={stone.cx}
                      cy={stone.cy}
                      r={stone.r + (isCurrent ? 9 : 4)}
                      fill="none"
                      stroke={stone.color}
                      strokeWidth={isCurrent ? '3' : '1.5'}
                      opacity={isCurrent ? '0.9' : '0.4'}
                      className={isCurrent ? 'animate-ping' : ''}
                      style={{ transformOrigin: `${stone.cx}px ${stone.cy}px` }}
                    />
                  )}

                  {/* Glowing Gem Stone */}
                  <circle
                    cx={stone.cx}
                    cy={stone.cy}
                    r={stone.r}
                    fill={isLit ? stone.color : '#261C14'}
                    stroke={isLit ? stone.border : '#52341D'}
                    strokeWidth={isLit ? 3 : 1.5}
                    filter={isLit ? 'url(#stoneGlow)' : undefined}
                    className={isCurrent ? 'animate-pulse' : ''}
                  />

                  {/* Gem Highlight Sparkle */}
                  {isLit && (
                    <circle
                      cx={stone.cx - stone.r * 0.3}
                      cy={stone.cy - stone.r * 0.3}
                      r={stone.r * 0.3}
                      fill="#FFFFFF"
                      opacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Status / Stone Callout */}
        <div className="h-16 flex flex-col items-center justify-center">
          {stage === 'CHARGING_STONES' && currentStone ? (
            <div className="animate-bounce space-y-1">
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-heading font-black tracking-wider uppercase border shadow-lg"
                style={{
                  backgroundColor: `${currentStone.color}30`,
                  borderColor: currentStone.border,
                  color: '#FFFFFF'
                }}
              >
                <span>{currentStone.symbol}</span>
                <span>{currentStone.name} IGNITED</span>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                {currentStone.sub}
              </p>
            </div>
          ) : stage === 'WINDUP_TENSION' ? (
            <div className="animate-pulse space-y-1">
              <span className="text-xl sm:text-2xl font-heading font-black text-amber-300 tracking-wider uppercase">
                ⚡ ALL 6 STONES PRIMED ⚡
              </span>
              <p className="text-xs font-mono text-slate-300">PREPARING TO SNAP REALITY...</p>
            </div>
          ) : stage === 'SNAP_RELEASE' || stage === 'SUPERNOVA' ? (
            <div className="animate-bounce">
              <span className="text-3xl sm:text-4xl font-heading font-black text-yellow-300 tracking-widest uppercase drop-shadow-[0_0_30px_#F59E0B]">
                💥 SNAP! REALITY RESHAPED! 💥
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Gathering Infinity Stones...
            </span>
          )}
        </div>

        {/* Champion Name Callout Banner */}
        <div className="flex items-center gap-2.5 bg-black/80 px-6 py-2.5 rounded-2xl border border-amber-400/40 shadow-inner">
          <span className="text-3xl">{championAvatar}</span>
          <span className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
            {championName}
          </span>
        </div>

      </div>
    </div>
  );
}

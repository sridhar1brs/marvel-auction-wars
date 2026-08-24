import React, { useEffect } from 'react';
import { Sparkles, Zap, Flame, Shield, Skull } from 'lucide-react';

export interface UltimateAnimationProps {
  isOpen: boolean;
  type: 'special' | 'dual_strike' | 'boss_ultimate' | 'relic';
  heroName: string;
  partnerHeroName?: string;
  abilityTitle: string;
  description: string;
  bannerColor?: string;
  damageBonus?: number;
  onComplete: () => void;
}

export const UltimateAnimationOverlay: React.FC<UltimateAnimationProps> = ({
  isOpen,
  type,
  heroName,
  partnerHeroName,
  abilityTitle,
  description,
  bannerColor = '#E62429',
  damageBonus,
  onComplete
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const isDual = type === 'dual_strike';
  const isBoss = type === 'boss_ultimate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* Speed Lines Background */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${bannerColor} 10%, transparent 70%)`,
          animation: 'pulse 1s infinite alternate'
        }}
      />

      {/* Comic Diagonal Energy Streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -rotate-45 animate-pulse" />
      </div>

      {/* Main Impact Card */}
      <div className="relative z-10 max-w-2xl w-full mx-4 text-center transform scale-100 transition-all duration-300 animate-scaleUp">
        
        {/* Top Badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {isDual ? (
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-red-500 to-purple-600 text-white font-black text-sm tracking-widest uppercase shadow-lg shadow-red-500/50 flex items-center gap-1.5 animate-bounce">
              <Flame className="w-4 h-4 text-yellow-300" />
              🔥 TEAM SYNERGY DUAL STRIKE
            </span>
          ) : isBoss ? (
            <span className="px-4 py-1.5 rounded-full bg-red-950 text-red-400 border border-red-500/50 font-black text-sm tracking-widest uppercase shadow-lg flex items-center gap-1.5 animate-pulse">
              <Skull className="w-4 h-4 text-red-500" />
              ⚠️ TITAN BOSS ULTIMATE
            </span>
          ) : (
            <span className="px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-black text-sm tracking-widest uppercase shadow-lg flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-300" />
              ⚡ SIGNATURE SUPERPOWER
            </span>
          )}
        </div>

        {/* Hero Title */}
        <div className="mb-2">
          <h2 className="text-3xl sm:text-5xl font-black italic tracking-wider text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {heroName}
            {partnerHeroName && (
              <span className="text-yellow-400"> & {partnerHeroName}</span>
            )}
          </h2>
        </div>

        {/* Ability Banner */}
        <div 
          className="my-4 py-3 px-6 rounded-2xl border-2 shadow-2xl relative overflow-hidden backdrop-blur-md"
          style={{
            borderColor: bannerColor,
            background: `linear-gradient(135deg, ${bannerColor}33 0%, rgba(15, 23, 42, 0.9) 100%)`
          }}
        >
          <div className="text-xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-200">
            {abilityTitle}
          </div>
          <p className="text-sm sm:text-base text-gray-200 mt-1 max-w-xl mx-auto font-medium leading-relaxed">
            {description}
          </p>

          {damageBonus && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              +{damageBonus} BONUS COMBO DAMAGE
            </div>
          )}
        </div>

        {/* Action Skip Hint */}
        <button
          onClick={onComplete}
          className="mt-4 text-xs text-gray-400 hover:text-white uppercase tracking-widest underline decoration-dotted transition-colors"
        >
          Click anywhere or tap to continue ➔
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Character } from '../../../types/game';
import { CharacterPortrait } from '../../common/CharacterPortrait';
import { Shield, Zap, Sparkles, Flame, Swords } from 'lucide-react';

interface Props {
  character: Character;
  side: 'p1' | 'p2';
  isAttacking?: boolean;
  isTakingHit?: boolean;
  isDefending?: boolean;
  isSuperActive?: boolean;
  isDefeated?: boolean;
  activeSkillName?: string | null;
  damageTaken?: number | null;
}

export function Fighter2DSprite({
  character,
  side,
  isAttacking = false,
  isTakingHit = false,
  isDefending = false,
  isSuperActive = false,
  isDefeated = false,
  activeSkillName = null,
  damageTaken = null
}: Props) {
  const isP1 = side === 'p1';

  const getAnimationClass = () => {
    if (isDefeated) return 'opacity-30 grayscale blur-xs scale-90 transition-all duration-700';
    if (isTakingHit) return 'animate-recoil';
    if (isAttacking) return isP1 ? 'animate-combat-p1' : 'animate-combat-p2';
    return 'animate-float-idle';
  };

  const getGradeTheme = () => {
    switch (character.grade) {
      case 'MYTHIC':
        return {
          auraColor: '#A855F7',
          glowRing: 'ring-purple-400 shadow-[0_0_50px_rgba(168,85,247,0.9)]',
          badgeBg: 'bg-purple-950/90 border-purple-400 text-purple-200',
          flame: 'from-purple-600 via-fuchsia-500 to-indigo-600'
        };
      case 'A':
        return {
          auraColor: '#EF4444',
          glowRing: 'ring-red-400 shadow-[0_0_40px_rgba(239,68,68,0.9)]',
          badgeBg: 'bg-red-950/90 border-red-400 text-red-200',
          flame: 'from-red-600 via-amber-500 to-orange-600'
        };
      case 'B':
        return {
          auraColor: '#38BDF8',
          glowRing: 'ring-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.8)]',
          badgeBg: 'bg-cyan-950/90 border-cyan-400 text-cyan-200',
          flame: 'from-cyan-500 via-blue-500 to-indigo-500'
        };
      default:
        return {
          auraColor: '#10B981',
          glowRing: 'ring-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.7)]',
          badgeBg: 'bg-emerald-950/90 border-emerald-400 text-emerald-200',
          flame: 'from-emerald-500 via-teal-500 to-green-600'
        };
    }
  };

  const theme = getGradeTheme();

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* 1. Behind-Fighter Dynamic Elemental Energy Flames */}
      <div 
        className={`absolute -inset-8 rounded-full pointer-events-none transition-all duration-500 animate-aura-fire ${
          isSuperActive ? 'scale-150 opacity-95' : isAttacking ? 'scale-135 opacity-90' : 'opacity-60'
        }`}
        style={{
          background: `radial-gradient(circle, ${theme.auraColor} 0%, transparent 70%)`
        }}
      />

      {/* 2. Defensive Kinetic Bubble Shield */}
      {isDefending && (
        <div className="absolute -inset-8 rounded-full border-4 border-cyan-300 bg-cyan-400/20 shadow-[0_0_50px_#22D3EE] z-20 pointer-events-none animate-ping" />
      )}

      {/* 3. Floating Combat Arcade Damage Pop */}
      {isTakingHit && (
        <div className="absolute -top-12 z-50 pointer-events-none animate-damage-pop">
          <div className="flex items-center gap-1 px-4 py-1.5 rounded-2xl bg-black/90 border-2 border-red-500 shadow-[0_0_30px_#EF4444] text-red-400 font-heading font-black text-lg sm:text-2xl tracking-wider">
            <Flame className="w-5 h-5 text-red-500 animate-bounce fill-current" />
            <span>{damageTaken ? `-${damageTaken} HP` : 'HIT!'}</span>
          </div>
        </div>
      )}

      {/* 4. 2D Animated Fighter Avatar Body */}
      <div className={`relative z-10 transition-transform duration-300 ${getAnimationClass()}`}>
        
        {/* Hardware-Accelerated Kinetic Speed Trail when Attacking */}
        {isAttacking && (
          <div 
            className={`absolute inset-0 opacity-40 pointer-events-none transform ${
              isP1 ? '-translate-x-8' : 'translate-x-8'
            }`}
          >
            <CharacterPortrait
              character={character}
              size="xl"
              showBadge={false}
              className="opacity-40"
            />
          </div>
        )}

        {/* Core Character Portrait */}
        <div className="relative">
          <CharacterPortrait
            character={character}
            size="xl"
            showBadge={true}
            className={`shadow-2xl transition-all duration-300 ${
              isSuperActive 
                ? 'ring-4 ring-amber-400 shadow-[0_0_50px_rgba(245,158,11,1)]' 
                : isAttacking
                ? `${theme.glowRing} scale-105`
                : isTakingHit 
                ? 'brightness-200 contrast-125' 
                : ''
            }`}
          />

          {/* Floating Super Skill Indicator Pill */}
          {activeSkillName && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
              <div className="bg-purple-950/95 text-purple-200 border-2 border-purple-400 px-3.5 py-1 rounded-full text-xs font-heading font-black uppercase tracking-wider shadow-glow-cosmic flex items-center gap-1.5 animate-bounce">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span>{activeSkillName}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Dynamic Fighter Arena Ground Platform */}
      <div 
        className={`w-36 sm:w-48 h-6 rounded-full blur-md -mt-2 transition-all duration-300 ${
          isAttacking 
            ? 'scale-150 bg-amber-400/70 shadow-[0_0_35px_#F59E0B]' 
            : isTakingHit
            ? 'scale-90 bg-red-600/70 shadow-[0_0_25px_#EF4444]'
            : 'bg-black/70 border border-white/20'
        }`}
      />
    </div>
  );
}

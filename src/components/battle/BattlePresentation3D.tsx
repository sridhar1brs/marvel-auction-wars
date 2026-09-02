import React from 'react';
import { Swords } from 'lucide-react';
import { Character } from '../../types/game';
import { Fighter2DSprite } from './fx/Fighter2DSprite';
import { CombatFXOverlay, CombatEffectType, ComicBurst } from './fx/CombatFXOverlay';

export interface BattlePresentation3DProps {
  player: Character;
  opponent: Character;
  playerAttacking?: boolean;
  opponentAttacking?: boolean;
  playerTakingHit?: boolean;
  opponentTakingHit?: boolean;
  playerDefending?: boolean;
  opponentDefending?: boolean;
  playerSuper?: boolean;
  opponentSuper?: boolean;
  playerDamage?: number | null;
  opponentDamage?: number | null;
  effectType?: CombatEffectType;
  comicBurst?: ComicBurst | null;
  signatureMoveName?: string;
  title?: string;
  className?: string;
}

/** Shared, dependency-free battle stage used by local, online and PvP battles. */
export function BattlePresentation3D({
  player,
  opponent,
  playerAttacking = false,
  opponentAttacking = false,
  playerTakingHit = false,
  opponentTakingHit = false,
  playerDefending = false,
  opponentDefending = false,
  playerSuper = false,
  opponentSuper = false,
  playerDamage = null,
  opponentDamage = null,
  effectType = 'melee',
  comicBurst = null,
  signatureMoveName = '',
  title = 'BATTLE SPOTLIGHT',
  className = '',
}: BattlePresentation3DProps) {
  const hp = (hero: Character) => Math.max(0, Math.min(100, hero.currentHp ?? 100));
  const image = (hero: Character) => hero.imageUrl || `/images/characters/${hero.id}.jpg`;

  return (
    <section className={`battle-presentation-3d relative overflow-hidden rounded-3xl border border-purple-500/50 bg-gradient-to-b from-purple-950/50 via-black/90 to-indigo-950/60 p-2 sm:p-3 shadow-glow-cosmic ${className}`}>
      <div className="absolute inset-0 pointer-events-none opacity-40 [background:radial-gradient(ellipse_at_center,rgba(59,130,246,.3),transparent_65%)]" />
      <div className="absolute inset-x-3 bottom-3 h-1/2 rounded-[50%] border border-cyan-400/20 bg-[linear-gradient(rgba(34,211,238,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.16)_1px,transparent_1px)] bg-[size:32px_32px] [transform:perspective(500px)_rotateX(62deg)] [transform-origin:bottom] opacity-50" />
      <div className="absolute left-1/4 top-1/3 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />
      <CombatFXOverlay
        effectType={effectType}
        attackerSide={playerAttacking ? 'left' : 'right'}
        comicBurst={comicBurst}
        isSuperMove={playerSuper || opponentSuper}
        superHeroName={playerAttacking ? player.name : opponent.name}
        superHeroImageUrl={image(playerAttacking ? player : opponent)}
        superAbilityName={(playerAttacking ? player : opponent).specialAbilities?.[0]?.name || 'COSMIC STRIKE'}
        signatureMoveName={signatureMoveName}
      />
      {title && (
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <span className="text-[10px] font-heading font-black uppercase tracking-widest text-amber-300">{title}</span>
          <Swords className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        </div>
      )}
      <div className="relative z-10 grid grid-cols-11 gap-2 sm:gap-5 items-center [perspective:900px]">
        <FighterCard hero={player} side="p1" hp={hp(player)} attacking={playerAttacking} takingHit={playerTakingHit} defending={playerDefending} superActive={playerSuper} damage={playerDamage} />
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="rounded-full border border-amber-400/70 bg-black/80 p-2 shadow-glow-amber"><Swords className="h-4 w-4 text-amber-300" /></div>
          <span className="mt-1 text-[10px] font-black text-white">VS</span>
        </div>
        <FighterCard hero={opponent} side="p2" hp={hp(opponent)} attacking={opponentAttacking} takingHit={opponentTakingHit} defending={opponentDefending} superActive={opponentSuper} damage={opponentDamage} />
      </div>
    </section>
  );
}

function FighterCard({ hero, side, hp, attacking, takingHit, defending, superActive, damage }: {
  hero: Character; side: 'p1' | 'p2'; hp: number; attacking: boolean; takingHit: boolean;
  defending: boolean; superActive: boolean; damage: number | null;
}) {
  return (
    <div className={`col-span-5 flex min-w-0 flex-col items-center gap-1 rounded-2xl border ${side === 'p1' ? 'border-red-500/40 bg-red-950/20' : 'border-blue-500/40 bg-blue-950/20'} p-1 sm:p-2 [transform:scale(.78)_rotateY(${side === 'p1' ? '4deg' : '-4deg'})]`}>
      <Fighter2DSprite character={hero} side={side} isAttacking={attacking} isTakingHit={takingHit} isDefending={defending} isSuperActive={superActive} isDefeated={hp <= 0} damageTaken={damage} />
      <div className="w-full max-w-[220px] text-center">
        <div className="truncate text-xs font-heading font-black text-white">{hero.name}</div>
        <div className="mt-1 h-2 overflow-hidden rounded-full border border-white/10 bg-black/70">
          <div className={`h-full rounded-full transition-all duration-500 ${side === 'p1' ? 'bg-gradient-to-r from-red-600 to-amber-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} style={{ width: `${hp}%` }} />
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-slate-300">{hp} / 100 HP</div>
      </div>
    </div>
  );
}

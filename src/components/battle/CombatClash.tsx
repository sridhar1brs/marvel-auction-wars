import { BattleRound, Player } from '../../types/game';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { Swords, Zap, Shield, Sparkles, Heart, Flame, Skull, Crosshair } from 'lucide-react';

interface Props {
  round: BattleRound;
  player1: Player;
  player2: Player;
}

export function CombatClash({ round, player1, player2 }: Props) {
  const p1 = round.player1Character;
  const p2 = round.player2Character;
  const isP1Winner = round.winnerPlayerId === player1.id;

  const p1Hp = round.player1HpRemaining !== undefined ? round.player1HpRemaining : 100;
  const p2Hp = round.player2HpRemaining !== undefined ? round.player2HpRemaining : 100;
  const p1MaxHp = p1.maxHp || 100;
  const p2MaxHp = p2.maxHp || 100;

  const p1HpPercent = Math.max(0, Math.min(100, Math.round((p1Hp / p1MaxHp) * 100)));
  const p2HpPercent = Math.max(0, Math.min(100, Math.round((p2Hp / p2MaxHp) * 100)));

  const getHpGradient = (percent: number) => {
    if (percent > 55) return 'from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.7)]';
    if (percent > 25) return 'from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.7)]';
    return 'from-red-600 via-rose-600 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-pulse';
  };

  const getActionBadge = (action?: string, heroName?: string, abilityName?: string) => {
    switch (action) {
      case 'DEFEND':
        return (
          <span className="bg-blue-950 text-blue-300 border border-blue-400 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>🛡️ KINETIC GUARD</span>
          </span>
        );
      case 'SPECIAL':
        return (
          <span className="bg-purple-950 text-purple-200 border border-purple-400 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-glow-cosmic animate-pulse">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>⚡ {abilityName?.toUpperCase() || 'SUPERPOWER'}</span>
          </span>
        );
      case 'ARTIFACT':
        return (
          <span className="bg-amber-950 text-amber-300 border border-amber-400 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-glow-gold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>🔮 RELIC SURGE</span>
          </span>
        );
      default:
        return (
          <span className="bg-red-950 text-red-300 border border-red-400 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-glow-red">
            <Swords className="w-3.5 h-3.5 text-red-400" />
            <span>⚔️ STRIKE ATTACK</span>
          </span>
        );
    }
  };

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 border-2 border-white/15 bg-gradient-to-b from-black via-slate-950 to-black shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden space-y-6 animate-fadeIn">
      
      {/* Top Clash Bar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-950/90 px-4 py-1 rounded-full border border-amber-500/50 shadow-sm">
            ROUND {round.roundNumber} RESOLUTION • {round.tier} CLASH
          </span>
        </div>
        
        <span className="text-sm font-heading font-black text-emerald-400 bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/40 shadow-glow-gold animate-bounce">
          👑 {isP1Winner ? `${p1.name} (Player 1) CONQUERED ROUND` : `${p2.name} (Player 2) CONQUERED ROUND`}
        </span>
      </div>

      {/* Main Big Stage Duel */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
        
        {/* PLAYER 1 FIGHTER (5 Cols) */}
        <div className={`lg:col-span-5 rounded-3xl p-6 border-2 transition-all space-y-4 relative overflow-hidden ${
          isP1Winner 
            ? 'bg-gradient-to-b from-emerald-950/40 via-black to-slate-950 border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/40' 
            : 'bg-black/80 border-white/10 opacity-90'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-300 truncate max-w-[140px]">
              {player1.name} ({player1.avatar})
            </span>
            {getActionBadge(round.player1Action, p1.name, p1.specialAbilities?.[0]?.name || p1.powers)}
          </div>

          {/* Large Hero Portrait & Title */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <CharacterPortrait character={p1} size="lg" />
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1 min-w-0">
              <h3 className="font-heading font-black text-2xl text-white truncate drop-shadow">
                {p1.name}
              </h3>
              
              {/* Damage Taken Indicator */}
              {round.player2DamageDealt > 0 && (
                <span className="inline-block text-xs font-black text-red-400 bg-red-950/90 px-2.5 py-0.5 rounded-full border border-red-500/50 animate-shake">
                  💥 Took -{round.player2DamageDealt} Damage!
                </span>
              )}
            </div>
          </div>

          {/* LARGE PROMINENT HEALTH BAR */}
          <div className="p-3.5 bg-black/90 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>HEALTH BAR</span>
              </span>
              <span className={`text-sm font-mono ${p1Hp <= 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                {p1Hp <= 0 ? '💀 0 HP (KNOCKED OUT)' : `${p1Hp} / ${p1MaxHp} HP (${p1HpPercent}%)`}
              </span>
            </div>
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div 
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${getHpGradient(p1HpPercent)}`}
                style={{ width: `${p1HpPercent}%` }}
              />
            </div>
          </div>

          {/* Power Roll & Calculation Details */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Base Power:</span>
              <span className="font-mono text-white">{p1.overallPower}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Tactical Roll:</span>
              <span className="font-mono text-amber-400">+{round.player1Roll}</span>
            </div>
            {round.player1AbilityTriggered && (
              <div className="flex items-center justify-between text-purple-300">
                <span className="font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>{round.player1AbilityTriggered.name}:</span>
                </span>
                <span className="font-mono">+{round.player1AbilityTriggered.bonusPower} Power</span>
              </div>
            )}
            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
              <span className="font-black text-slate-300">FINAL COMBAT POWER:</span>
              <span className="font-heading font-black text-lg text-amber-400">
                {round.player1TotalPower}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER VS EMBLEM (1 Col) */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-red-600 via-purple-600 to-blue-600 p-0.5 shadow-glow-cosmic flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center">
              <Swords className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-white">VS</span>
        </div>

        {/* PLAYER 2 FIGHTER (5 Cols) */}
        <div className={`lg:col-span-5 rounded-3xl p-6 border-2 transition-all space-y-4 relative overflow-hidden ${
          !isP1Winner 
            ? 'bg-gradient-to-b from-emerald-950/40 via-black to-slate-950 border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/40' 
            : 'bg-black/80 border-white/10 opacity-90'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-300 truncate max-w-[140px]">
              {player2.name} ({player2.avatar})
            </span>
            {getActionBadge(round.player2Action, p2.name, p2.specialAbilities?.[0]?.name || p2.powers)}
          </div>

          {/* Large Hero Portrait & Title */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <CharacterPortrait character={p2} size="lg" />
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1 min-w-0">
              <h3 className="font-heading font-black text-2xl text-white truncate drop-shadow">
                {p2.name}
              </h3>

              {/* Damage Taken Indicator */}
              {round.player1DamageDealt > 0 && (
                <span className="inline-block text-xs font-black text-red-400 bg-red-950/90 px-2.5 py-0.5 rounded-full border border-red-500/50 animate-shake">
                  💥 Took -{round.player1DamageDealt} Damage!
                </span>
              )}
            </div>
          </div>

          {/* LARGE PROMINENT HEALTH BAR */}
          <div className="p-3.5 bg-black/90 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-blue-500 fill-current" />
                <span>HEALTH BAR</span>
              </span>
              <span className={`text-sm font-mono ${p2Hp <= 0 ? 'text-red-500' : 'text-cyan-400'}`}>
                {p2Hp <= 0 ? '💀 0 HP (KNOCKED OUT)' : `${p2Hp} / ${p2MaxHp} HP (${p2HpPercent}%)`}
              </span>
            </div>
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div 
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${getHpGradient(p2HpPercent)}`}
                style={{ width: `${p2HpPercent}%` }}
              />
            </div>
          </div>

          {/* Power Roll & Calculation Details */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Base Power:</span>
              <span className="font-mono text-white">{p2.overallPower}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Tactical Roll:</span>
              <span className="font-mono text-amber-400">+{round.player2Roll}</span>
            </div>
            {round.player2AbilityTriggered && (
              <div className="flex items-center justify-between text-purple-300">
                <span className="font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>{round.player2AbilityTriggered.name}:</span>
                </span>
                <span className="font-mono">+{round.player2AbilityTriggered.bonusPower} Power</span>
              </div>
            )}
            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
              <span className="font-black text-slate-300">FINAL COMBAT POWER:</span>
              <span className="font-heading font-black text-lg text-amber-400">
                {round.player2TotalPower}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. COMBAT RESOLUTION LOG & PLAY-BY-PLAY FEED */}
      <div className="p-4 bg-black/70 rounded-2xl border border-white/10 space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Crosshair className="w-4 h-4 text-amber-400" />
          <span>PLAY-BY-PLAY CLASH COMMENTARY:</span>
        </span>
        <div className="space-y-1">
          {round.log.map((entry, idx) => (
            <p key={idx} className="text-slate-300 font-mono text-xs leading-relaxed">
              • {entry}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}



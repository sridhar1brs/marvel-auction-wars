import { BattleRound, Player } from '../../types/game';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { Swords, Zap, Shield, Sparkles, Award, Heart, Flame } from 'lucide-react';

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

  const getHpColor = (hp: number, max: number) => {
    const ratio = hp / max;
    if (ratio > 0.6) return 'bg-emerald-500 shadow-glow-emerald';
    if (ratio > 0.25) return 'bg-amber-500 shadow-glow-gold';
    return 'bg-red-600 shadow-glow-red animate-pulse';
  };

  const getActionBadge = (action?: string) => {
    switch (action) {
      case 'DEFEND':
        return <span className="bg-blue-950 text-blue-300 border border-blue-500/50 px-2 py-0.5 rounded text-[10px] font-black">🛡️ DEFEND</span>;
      case 'SPECIAL':
        return <span className="bg-purple-950 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded text-[10px] font-black">⚡ SPECIAL</span>;
      case 'ARTIFACT':
        return <span className="bg-amber-950 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded text-[10px] font-black">🔮 RELIC</span>;
      default:
        return <span className="bg-red-950 text-red-300 border border-red-500/50 px-2 py-0.5 rounded text-[10px] font-black">⚔️ ATTACK</span>;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden space-y-6">
      {/* Round Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/40">
          ROUND {round.roundNumber} • {round.tier} TIER CLASH
        </span>
        <span className="text-xs font-extrabold text-slate-400">
          {isP1Winner ? `👑 ${p1.name} won round` : `👑 ${p2.name} won round`}
        </span>
      </div>

      {/* Main Duel Stage */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Player 1 Fighter (5 cols) */}
        <div className={`md:col-span-5 flex flex-col items-center p-4 rounded-2xl border transition-all ${
          isP1Winner ? 'bg-emerald-950/30 border-emerald-500/70 shadow-glow-gold' : 'bg-black/40 border-white/10'
        }`}>
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-300 truncate max-w-[120px]">
              {player1.name} ({player1.avatar})
            </span>
            {getActionBadge(round.player1Action)}
          </div>

          <CharacterPortrait character={p1} size="lg" showBadge={true} />
          
          <h3 className="text-xl font-heading font-black text-white mt-3 truncate text-center">
            {p1.name}
          </h3>

          {/* Health Bar */}
          <div className="w-full mt-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-extrabold">
              <span className="text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400 fill-current" />
                <span>HEALTH BAR</span>
              </span>
              <span className={p1Hp <= 0 ? 'text-red-500' : 'text-emerald-400'}>
                {p1Hp}/{p1MaxHp} HP
              </span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getHpColor(p1Hp, p1MaxHp)}`}
                style={{ width: `${Math.max(0, Math.min(100, (p1Hp / p1MaxHp) * 100))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-slate-400">BASE: {p1.overallPower}</span>
            <span className="text-xs text-slate-500">+</span>
            <span className="text-xs font-bold text-amber-400">ROLL: +{round.player1Roll}</span>
          </div>

          {/* Triggered Ability */}
          {round.player1AbilityTriggered && (
            <div className="mt-2.5 p-2 bg-amber-950/80 border border-amber-500/50 rounded-lg text-center animate-bounce w-full">
              <span className="text-[10px] font-black text-amber-300 uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{round.player1AbilityTriggered.name} (+{round.player1AbilityTriggered.bonusPower})</span>
              </span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between w-full bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="font-bold text-slate-400">COMBAT POWER:</span>
            <span className="font-heading font-black text-base text-amber-400">
              {round.player1TotalPower}
            </span>
          </div>
        </div>

        {/* Center VS Indicator (1 col) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
          <div className="p-3 bg-marvel-red/20 rounded-full border border-marvel-red/60 shadow-glow-red">
            <Swords className="w-6 h-6 text-marvel-red animate-pulse" />
          </div>
          <span className="font-heading font-black text-xl text-white mt-1">VS</span>
        </div>

        {/* Player 2 Fighter (5 cols) */}
        <div className={`md:col-span-5 flex flex-col items-center p-4 rounded-2xl border transition-all ${
          !isP1Winner ? 'bg-emerald-950/30 border-emerald-500/70 shadow-glow-gold' : 'bg-black/40 border-white/10'
        }`}>
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-300 truncate max-w-[120px]">
              {player2.name} ({player2.avatar})
            </span>
            {getActionBadge(round.player2Action)}
          </div>

          <CharacterPortrait character={p2} size="lg" showBadge={true} />
          
          <h3 className="text-xl font-heading font-black text-white mt-3 truncate text-center">
            {p2.name}
          </h3>

          {/* Health Bar */}
          <div className="w-full mt-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-extrabold">
              <span className="text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400 fill-current" />
                <span>HEALTH BAR</span>
              </span>
              <span className={p2Hp <= 0 ? 'text-red-500' : 'text-emerald-400'}>
                {p2Hp}/{p2MaxHp} HP
              </span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getHpColor(p2Hp, p2MaxHp)}`}
                style={{ width: `${Math.max(0, Math.min(100, (p2Hp / p2MaxHp) * 100))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-slate-400">BASE: {p2.overallPower}</span>
            <span className="text-xs text-slate-500">+</span>
            <span className="text-xs font-bold text-amber-400">ROLL: +{round.player2Roll}</span>
          </div>

          {/* Triggered Ability */}
          {round.player2AbilityTriggered && (
            <div className="mt-2.5 p-2 bg-amber-950/80 border border-amber-500/50 rounded-lg text-center animate-bounce w-full">
              <span className="text-[10px] font-black text-amber-300 uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{round.player2AbilityTriggered.name} (+{round.player2AbilityTriggered.bonusPower})</span>
              </span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between w-full bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="font-bold text-slate-400">COMBAT POWER:</span>
            <span className="font-heading font-black text-base text-amber-400">
              {round.player2TotalPower}
            </span>
          </div>
        </div>
      </div>

      {/* Combat Log Box */}
      <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1 text-xs">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
          COMBAT RESOLUTION LOG
        </span>
        {round.log.map((entry, idx) => (
          <p key={idx} className="text-slate-300 font-mono text-[11px]">
            {entry}
          </p>
        ))}
      </div>
    </div>
  );
}


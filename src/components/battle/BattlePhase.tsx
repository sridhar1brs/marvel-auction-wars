import { TournamentMatch, GameState } from '../../types/game';
import { CombatClash } from './CombatClash';
import { Swords, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  state: GameState;
  onReturnToTree: () => void;
}

export function BattlePhase({ state, onReturnToTree }: Props) {
  const match = state.tournamentMatches.find(m => m.id === state.currentMatchId);

  if (!match || !match.player1 || !match.player2) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center glass-panel rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">No Active Match in Progress</h2>
        <button
          onClick={onReturnToTree}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs"
        >
          Return to Tournament Tree
        </button>
      </div>
    );
  }

  const latestRound = match.rounds.length > 0 ? match.rounds[match.rounds.length - 1] : null;
  const isMatchComplete = match.status === 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Match Header & Scoreboard */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block">
            {match.roundName.toUpperCase()} BATTLE ARENA
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            {match.player1.name} vs {match.player2.name}
          </h1>
        </div>

        {/* Live Duel Score Counter */}
        <div className="flex items-center gap-4 bg-black/60 px-5 py-2 rounded-2xl border border-white/10">
          <div className="text-center">
            <span className="text-[10px] font-extrabold text-slate-400 block truncate max-w-[80px]">
              {match.player1.name}
            </span>
            <span className="font-heading font-black text-2xl text-emerald-400">
              {match.player1Score}
            </span>
          </div>

          <span className="text-slate-600 font-black text-xl">:</span>

          <div className="text-center">
            <span className="text-[10px] font-extrabold text-slate-400 block truncate max-w-[80px]">
              {match.player2.name}
            </span>
            <span className="font-heading font-black text-2xl text-blue-400">
              {match.player2Score}
            </span>
          </div>
        </div>
      </div>

      {/* Current Animated Combat Duel */}
      {latestRound ? (
        <CombatClash
          round={latestRound}
          player1={match.player1}
          player2={match.player2}
        />
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center text-slate-300 space-y-3">
          <Swords className="w-8 h-8 text-marvel-red mx-auto animate-bounce" />
          <h3 className="text-lg font-heading font-black text-white">
            HEROES ARE ENTERING THE ARENA...
          </h3>
          <p className="text-xs text-slate-400">
            Pairing highest and matching tier heroes for round duels.
          </p>
        </div>
      )}

      {/* Match Completed Banner / Return Button */}
      {isMatchComplete && (
        <div className="glass-panel-glow p-6 rounded-2xl border border-emerald-500/50 text-center space-y-4 shadow-glow-gold animate-shake">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-400 text-xs font-black uppercase">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>MATCH COMPLETE • {match.winner?.name.toUpperCase()} ADVANCES!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            VICTORY FOR {match.winner?.name}!
          </h2>

          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Final score: {match.player1Score} - {match.player2Score}. Check tournament standings to proceed to the next match.
          </p>

          <button
            onClick={() => {
              soundManager.playClick();
              onReturnToTree();
            }}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-sm uppercase tracking-wider rounded-xl shadow-glow-red transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <span>ADVANCE TO TOURNAMENT TREE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

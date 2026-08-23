import { TournamentMatch, GameState } from '../../types/game';
import { Trophy, Swords, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  state: GameState;
  onPlayMatch: (matchId: string) => void;
}

export function TournamentBracket({ state, onPlayMatch }: Props) {
  const matches = state.tournamentMatches;

  const qfMatches = matches.filter(m => m.roundName === 'Quarterfinals');
  const semiMatches = matches.filter(m => m.roundName === 'Semifinals');
  const finalMatch = matches.find(m => m.roundName === 'Final');

  const handleStartDuel = (matchId: string) => {
    soundManager.playClick();
    onPlayMatch(matchId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-marvel-red bg-red-950/80 px-3 py-1 rounded-full border border-red-500/40">
          ESPORTS SINGLE ELIMINATION
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider mt-2">
          TOURNAMENT BRACKET
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1">
          {matches.length} matches decided by roster power and strategic duels. Win each matchup to claim the Championship!
        </p>
      </div>

      {/* Bracket Tree Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Col 1: Quarterfinals (if present) */}
        {qfMatches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-slate-300">
                QUARTERFINALS
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Best-of-N</span>
            </div>

            <div className="space-y-3">
              {qfMatches.map(m => (
                <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
              ))}
            </div>
          </div>
        )}

        {/* Col 2: Semifinals (if present) */}
        {semiMatches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-slate-300">
                SEMIFINALS
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Best-of-N</span>
            </div>

            <div className="space-y-4">
              {semiMatches.map(m => (
                <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
              ))}
            </div>
          </div>
        )}

        {/* Col 3: Grand Final */}
        {finalMatch && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-marvel-gold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-marvel-gold" />
                <span>CHAMPIONSHIP FINAL</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold">Final Climax</span>
            </div>

            <div className="p-1 rounded-2xl bg-gradient-to-b from-amber-500/30 to-purple-600/30">
              <MatchCard match={finalMatch} onPlay={handleStartDuel} isGrandFinal={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  onPlay,
  isGrandFinal = false,
}: {
  match: TournamentMatch;
  onPlay: (matchId: string) => void;
  isGrandFinal?: boolean;
}) {
  const p1 = match.player1;
  const p2 = match.player2;
  const isReady = match.status === 'READY';
  const isComplete = match.status === 'COMPLETED';

  return (
    <div
      className={`glass-panel p-4 rounded-xl border transition-all ${
        isGrandFinal
          ? 'border-amber-500/70 shadow-glow-gold bg-black/80'
          : isReady
          ? 'border-red-500/60 shadow-glow-red'
          : 'border-white/10'
      }`}
    >
      {/* Player 1 Row */}
      <div className={`flex items-center justify-between p-2 rounded-lg mb-1.5 ${
        match.winner?.id === p1?.id ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' : 'bg-black/40 text-slate-300'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">{p1?.avatar || '❓'}</span>
          <span className="font-extrabold text-xs truncate">
            {p1 ? p1.name : 'TBD (Awaiting Winner)'}
          </span>
        </div>
        <span className="font-heading font-black text-sm text-white">
          {match.player1Score}
        </span>
      </div>

      {/* Player 2 Row */}
      <div className={`flex items-center justify-between p-2 rounded-lg mb-3 ${
        match.winner?.id === p2?.id ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' : 'bg-black/40 text-slate-300'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">{p2?.avatar || '❓'}</span>
          <span className="font-extrabold text-xs truncate">
            {p2 ? p2.name : match.isBye ? 'BYE (Automatic Advance)' : 'TBD (Awaiting Winner)'}
          </span>
        </div>
        <span className="font-heading font-black text-sm text-white">
          {match.player2Score}
        </span>
      </div>

      {/* Action Footer */}
      {isReady && (
        <button
          onClick={() => onPlay(match.id)}
          className="w-full py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-xs uppercase tracking-wider rounded-lg shadow-glow-red transition-all flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>FIGHT MATCH</span>
        </button>
      )}

      {isComplete && (
        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>WINNER: {match.winner?.name}</span>
          </div>
        </div>
      )}

      {match.status === 'PENDING' && (
        <span className="block text-center text-[10px] font-bold uppercase text-slate-500 py-1">
          Awaiting Previous Round Winners
        </span>
      )}
    </div>
  );
}

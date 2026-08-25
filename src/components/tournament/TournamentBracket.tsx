import React, { useState } from 'react';
import { TournamentMatch, GameState } from '../../types/game';
import { Trophy, Swords, Play, CheckCircle2, ChevronRight, Sparkles, Shield, Flame, LayoutGrid } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  state: GameState;
  onPlayMatch: (matchId: string) => void;
}

export function TournamentBracket({ state, onPlayMatch }: Props) {
  const matches = state.tournamentMatches;

  const r16Matches = matches.filter(m => m.roundName === 'Round of 16');
  const qfMatches = matches.filter(m => m.roundName === 'Quarterfinals');
  const semiMatches = matches.filter(m => m.roundName === 'Semifinals');
  const finalMatch = matches.find(m => m.roundName === 'Final');

  const [mobileRoundTab, setMobileRoundTab] = useState<'ALL' | 'R16' | 'QF' | 'SF' | 'FINAL'>('ALL');

  const handleStartDuel = (matchId: string) => {
    soundManager.playClick();
    onPlayMatch(matchId);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-heading font-black tracking-widest uppercase shadow-glow-red">
          <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>MARVEL CHAMPIONSHIP SINGLE ELIMINATION BRACKET</span>
        </div>
        <h1 className="text-2xl sm:text-5xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 uppercase tracking-wider">
          TOURNAMENT PLAYOFF BRACKET
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          {matches.length} playoff matchups decided in head-to-head tactical clashes. Win each round to advance and lift the Marvel Auction Wars Championship Trophy!
        </p>

        {/* Mobile Round Filter Tabs (Visible on screens < lg) */}
        <div className="lg:hidden flex items-center justify-center gap-1.5 flex-wrap pt-2">
          {r16Matches.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setMobileRoundTab(prev => prev === 'R16' ? 'ALL' : 'R16');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                mobileRoundTab === 'R16' ? 'bg-cyan-950 text-cyan-200 border-cyan-400' : 'bg-slate-900/80 text-slate-400 border-white/10'
              }`}
            >
              Round of 16
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setMobileRoundTab(prev => prev === 'QF' ? 'ALL' : 'QF');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              mobileRoundTab === 'QF' ? 'bg-red-950 text-red-200 border-red-400' : 'bg-slate-900/80 text-slate-400 border-white/10'
            }`}
          >
            Quarterfinals
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setMobileRoundTab(prev => prev === 'SF' ? 'ALL' : 'SF');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              mobileRoundTab === 'SF' ? 'bg-purple-950 text-purple-200 border-purple-400' : 'bg-slate-900/80 text-slate-400 border-white/10'
            }`}
          >
            Semifinals
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setMobileRoundTab(prev => prev === 'FINAL' ? 'ALL' : 'FINAL');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              mobileRoundTab === 'FINAL' ? 'bg-amber-950 text-amber-200 border-amber-400' : 'bg-slate-900/80 text-slate-400 border-white/10'
            }`}
          >
            Final 🏆
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setMobileRoundTab('ALL');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              mobileRoundTab === 'ALL' ? 'bg-slate-800 text-white border-white/30' : 'bg-slate-900/80 text-slate-400 border-white/10'
            }`}
          >
            Full Bracket ⇄
          </button>
        </div>
      </div>

      {/* Mobile Tab-Filtered Single-Round View (If a single round is selected on mobile) */}
      {mobileRoundTab !== 'ALL' ? (
        <div className="lg:hidden space-y-4 max-w-md mx-auto">
          {mobileRoundTab === 'R16' && (
            <div className="space-y-3">
              <h3 className="font-heading font-black text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Round of 16 Matches ({r16Matches.length})
              </h3>
              {r16Matches.map(m => (
                <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
              ))}
            </div>
          )}

          {mobileRoundTab === 'QF' && (
            <div className="space-y-3">
              <h3 className="font-heading font-black text-sm text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Quarterfinals Matches ({qfMatches.length})
              </h3>
              {qfMatches.map(m => (
                <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
              ))}
            </div>
          )}

          {mobileRoundTab === 'SF' && (
            <div className="space-y-3">
              <h3 className="font-heading font-black text-sm text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Semifinals Final Four ({semiMatches.length})
              </h3>
              {semiMatches.map(m => (
                <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
              ))}
            </div>
          )}

          {mobileRoundTab === 'FINAL' && finalMatch && (
            <div className="space-y-3">
              <h3 className="font-heading font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Grand Championship Final
              </h3>
              <MatchCard match={finalMatch} onPlay={handleStartDuel} />
            </div>
          )}
        </div>
      ) : (
        /* Full Bracket Columns Grid with responsive scroll */
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className={`${r16Matches.length > 0 ? 'min-w-[1050px] grid grid-cols-4' : 'min-w-[750px] grid grid-cols-3'} gap-6 items-center`}>
          
          {/* Column 0: Round of 16 (if active) */}
          {r16Matches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-heading font-black text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ROUND OF 16</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold">STAGE 1</span>
              </div>

              <div className="space-y-3">
                {r16Matches.map(m => (
                  <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
                ))}
              </div>
            </div>
          )}

          {/* Column 1: Quarterfinals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>QUARTERFINALS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{r16Matches.length > 0 ? 'STAGE 2' : 'ROUND 1'}</span>
            </div>

            <div className="space-y-4">
              {qfMatches.length > 0 ? (
                qfMatches.map(m => (
                  <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-slate-500 font-bold">
                  Top Seeds Advanced directly to Semifinals
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Semifinals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>SEMIFINALS</span>
              </span>
              <span className="text-[10px] text-purple-300 font-bold">FINAL FOUR</span>
            </div>

            <div className="space-y-4">
              {semiMatches.map(m => (
                <MatchCard key={m.id} match={m} onPlay={handleStartDuel} />
              ))}
            </div>
          </div>

          {/* Column 3: Championship Final */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>CHAMPIONSHIP FINAL</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">GRAND CLIMAX</span>
            </div>

            {finalMatch && (
              <div className="p-1 rounded-3xl bg-gradient-to-b from-amber-500/40 via-purple-600/30 to-red-600/40 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <MatchCard match={finalMatch} onPlay={handleStartDuel} isGrandFinal={true} />
              </div>
            )}
          </div>

        </div>
      </div>
      )}
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
      className={`glass-panel p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
        isGrandFinal
          ? 'border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.4)] bg-[#140E06]/95'
          : isReady
          ? 'border-red-500/70 shadow-[0_0_25px_rgba(230,36,41,0.35)] bg-[#12080A]/95 animate-pulse'
          : isComplete
          ? 'border-emerald-500/40 bg-[#09100C]/90'
          : 'border-white/10 bg-black/60 opacity-80'
      }`}
    >
      {/* Player 1 Row */}
      <div className={`flex items-center justify-between p-2.5 rounded-xl mb-2 transition-all ${
        match.winner?.id === p1?.id 
          ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 shadow-sm' 
          : 'bg-black/50 text-slate-200 border border-white/5'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base">{p1?.avatar || '❓'}</span>
          <div className="min-w-0">
            <span className="font-heading font-black text-xs sm:text-sm truncate block text-white">
              {p1 ? p1.name : 'TBD (Awaiting Winner)'}
            </span>
            {p1 && (
              <span className="text-[10px] text-slate-400 font-bold">
                {p1.collection.length} Heroes in Roster
              </span>
            )}
          </div>
        </div>
        <span className="font-heading font-black text-base text-amber-400 pl-2">
          {match.player1Score}
        </span>
      </div>

      {/* Player 2 Row */}
      <div className={`flex items-center justify-between p-2.5 rounded-xl mb-3 transition-all ${
        match.winner?.id === p2?.id 
          ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 shadow-sm' 
          : 'bg-black/50 text-slate-200 border border-white/5'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base">{p2?.avatar || '❓'}</span>
          <div className="min-w-0">
            <span className="font-heading font-black text-xs sm:text-sm truncate block text-white">
              {p2 ? p2.name : match.isBye ? 'BYE (Automatic Advance)' : 'TBD (Awaiting Winner)'}
            </span>
            {p2 && (
              <span className="text-[10px] text-slate-400 font-bold">
                {p2.collection.length} Heroes in Roster {p2.isBot && '🤖'}
              </span>
            )}
          </div>
        </div>
        <span className="font-heading font-black text-base text-cyan-400 pl-2">
          {match.player2Score}
        </span>
      </div>

      {/* Action Footer Button */}
      {isReady && (
        <button
          onClick={() => onPlay(match.id)}
          className="w-full py-3 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(230,36,41,0.5)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
        >
          <Play className="w-4 h-4 fill-current text-white animate-bounce" />
          <span>COMMENCE MATCH DUEL</span>
        </button>
      )}

      {isComplete && (
        <div className="flex items-center justify-between text-xs font-heading font-black text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>WINNER: {match.winner?.name.toUpperCase()} ADVANCED</span>
          </div>
        </div>
      )}

      {match.status === 'PENDING' && (
        <span className="block text-center text-[10px] font-bold uppercase text-slate-500 py-1.5">
          🔒 Awaiting Previous Match Results
        </span>
      )}
    </div>
  );
}

import { useState } from 'react';
import { TournamentMatch, GameState, BattleActionType } from '../../types/game';
import { CombatClash } from './CombatClash';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { Swords, Trophy, ArrowRight, CheckCircle2, Zap, Shield, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  state: GameState;
  onReturnToTree: () => void;
  onExecuteAction?: (matchId: string, action1: BattleActionType, action2: BattleActionType, p1HeroIdx: number, p2HeroIdx: number) => void;
}

export function BattlePhase({ state, onReturnToTree, onExecuteAction }: Props) {
  const match = state.tournamentMatches.find(m => m.id === state.currentMatchId);
  const [p1HeroIdx, setP1HeroIdx] = useState(0);
  const [p2HeroIdx, setP2HeroIdx] = useState(0);
  const [p1Action, setP1Action] = useState<BattleActionType>('ATTACK');
  const [p2Action, setP2Action] = useState<BattleActionType>('ATTACK');

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

  const p1 = match.player1;
  const p2 = match.player2;
  const latestRound = match.rounds.length > 0 ? match.rounds[match.rounds.length - 1] : null;
  const isMatchComplete = match.status === 'COMPLETED';

  const handleExecuteRound = () => {
    soundManager.playClick();
    if (!onExecuteAction) return;

    let botHeroIdx = p2HeroIdx;
    let botAction = p2Action;

    if (p2.isBot) {
      // Pick a random available hero with HP > 0 for bot
      const liveHeroes = p2.collection
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => (c.currentHp === undefined || c.currentHp > 0));
      
      if (liveHeroes.length > 0) {
        botHeroIdx = liveHeroes[Math.floor(Math.random() * liveHeroes.length)].i;
      }
      const actions: BattleActionType[] = ['ATTACK', 'SPECIAL', 'DEFEND', 'ARTIFACT'];
      botAction = actions[Math.floor(Math.random() * actions.length)];
    }

    onExecuteAction(match.id, p1Action, botAction, p1HeroIdx, botHeroIdx);
  };

  const actionButtons: { id: BattleActionType; label: string; icon: any; color: string }[] = [
    { id: 'ATTACK', label: 'ATTACK', icon: Swords, color: 'bg-red-950/80 hover:bg-red-900 border-red-500/60 text-red-200' },
    { id: 'SPECIAL', label: 'SPECIAL MOVE', icon: Zap, color: 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/60 text-purple-200' },
    { id: 'DEFEND', label: 'DEFENSIVE GUARD', icon: Shield, color: 'bg-blue-950/80 hover:bg-blue-900 border-blue-500/60 text-blue-200' },
    { id: 'ARTIFACT', label: 'RELIC POWER', icon: Sparkles, color: 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/60 text-amber-200' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Match Header & Scoreboard */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block">
            {match.roundName.toUpperCase()} BATTLE ARENA (FIRST TO {match.targetWins || 3} WINS)
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

      {/* Interactive Combat Command Selection (if match not complete) */}
      {!isMatchComplete && onExecuteAction && (
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-5 bg-black/40 shadow-glow-cosmic animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-400" />
              <h2 className="font-heading font-black text-base sm:text-lg text-white uppercase tracking-wider">
                Round {match.rounds.length + 1}: Select Fighter & Command
              </h2>
            </div>
            <span className="text-xs font-bold text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/40 animate-pulse">
              🎮 Ready for Your Orders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Player 1 Choice Box */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/40 space-y-3">
              <span className="text-xs font-black uppercase text-red-300 block">
                {match.player1.name}'s Fighter Deployment:
              </span>

              {/* Roster Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {p1.collection.map((c, i) => {
                  const hp = c.currentHp !== undefined ? c.currentHp : 100;
                  const isDead = hp <= 0;

                  return (
                    <button
                      key={c.id}
                      disabled={isDead}
                      onClick={() => {
                        soundManager.playClick();
                        setP1HeroIdx(i);
                      }}
                      className={`shrink-0 p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isDead
                          ? 'border-red-950 bg-red-950/40 opacity-40 grayscale cursor-not-allowed'
                          : p1HeroIdx === i
                          ? 'border-red-400 bg-red-900/60 ring-2 ring-red-400/50 scale-105'
                          : 'border-white/10 bg-black/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <CharacterPortrait character={c} size="sm" showBadge={false} />
                      <span className="text-[10px] font-bold text-white max-w-[60px] truncate">{c.name}</span>
                      <span className={`text-[9px] font-extrabold flex items-center gap-0.5 ${isDead ? 'text-red-500' : 'text-emerald-400'}`}>
                        {isDead ? (
                          <span>💀 KO</span>
                        ) : (
                          <>
                            <Heart className="w-2.5 h-2.5 fill-current text-red-400" />
                            <span>{hp} HP</span>
                          </>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tactical Actions */}
              <div className="grid grid-cols-2 gap-1.5">
                {actionButtons.map(btn => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => {
                        soundManager.playClick();
                        setP1Action(btn.id);
                      }}
                      className={`p-2 rounded-lg border text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
                        p1Action === btn.id
                          ? `${btn.color} ring-2 ring-white/30 scale-[1.02]`
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Player 2 Choice Box */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-300 block">
                  {p2.name}'s Deployment:
                </span>
                {p2.isBot && (
                  <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                    🤖 AI Auto-Tactics
                  </span>
                )}
              </div>

              {/* Roster Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {p2.collection.map((c, i) => {
                  const hp = c.currentHp !== undefined ? c.currentHp : 100;
                  const isDead = hp <= 0;

                  return (
                    <button
                      key={c.id}
                      disabled={isDead || p2.isBot}
                      onClick={() => {
                        if (!p2.isBot && !isDead) {
                          soundManager.playClick();
                          setP2HeroIdx(i);
                        }
                      }}
                      className={`shrink-0 p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isDead
                          ? 'border-red-950 bg-red-950/40 opacity-40 grayscale cursor-not-allowed'
                          : p2HeroIdx === i
                          ? 'border-blue-400 bg-blue-900/60 ring-2 ring-blue-400/50 scale-105'
                          : 'border-white/10 bg-black/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <CharacterPortrait character={c} size="sm" showBadge={false} />
                      <span className="text-[10px] font-bold text-white max-w-[60px] truncate">{c.name}</span>
                      <span className={`text-[9px] font-extrabold flex items-center gap-0.5 ${isDead ? 'text-red-500' : 'text-emerald-400'}`}>
                        {isDead ? (
                          <span>💀 KO</span>
                        ) : (
                          <>
                            <Heart className="w-2.5 h-2.5 fill-current text-red-400" />
                            <span>{hp} HP</span>
                          </>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tactical Actions */}
              <div className="grid grid-cols-2 gap-1.5">
                {actionButtons.map(btn => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => {
                        if (!p2.isBot) {
                          soundManager.playClick();
                          setP2Action(btn.id);
                        }
                      }}
                      className={`p-2 rounded-lg border text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
                        p2Action === btn.id
                          ? `${btn.color} ring-2 ring-white/30 scale-[1.02]`
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trigger Clash Button */}
          <button
            onClick={handleExecuteRound}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-red-600 hover:from-red-500 hover:to-purple-500 text-white font-heading font-black text-base uppercase tracking-widest shadow-glow-red transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
          >
            <Swords className="w-5 h-5 animate-pulse" />
            <span>⚡ UNLEASH ROUND {match.rounds.length + 1} CLASH!</span>
            <Swords className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      )}

      {/* Current Animated Combat Duel */}
      {latestRound && (
        <CombatClash
          round={latestRound}
          player1={match.player1}
          player2={match.player2}
        />
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


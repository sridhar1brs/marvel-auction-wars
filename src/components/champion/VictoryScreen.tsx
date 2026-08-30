import React, { useState, useEffect, useRef } from 'react';
import { Player, GameState } from '../../types/game';
import { 
  Trophy, Award, DollarSign, Swords, RotateCcw, Sparkles, 
  Crown, Star, Flame, Zap, PartyPopper, Shield, Target, TrendingUp, Gem, CheckCircle2
} from 'lucide-react';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { soundManager } from '../../audio/soundManager';
import confetti from 'canvas-confetti';
import { InfinitySnapVictoryIntro } from './InfinitySnapVictoryIntro';
import { PlayerProfileModal } from '../common/PlayerProfileModal';
import { useAuth } from '../../context/AuthContext';

interface Props {
  champion: Player;
  state: GameState;
  onPlayAgain: () => void;
  onVoteRematch?: () => void;
}

export function VictoryScreen({ champion, state, onPlayAgain, onVoteRematch }: Props) {
  const { user, recordMatchResult, isAuthenticated } = useAuth();
  const [showSnapIntro, setShowSnapIntro] = useState<boolean>(true);
  const [selectedProfilePlayer, setSelectedProfilePlayer] = useState<Player | null>(null);
  const [matchXpBreakdown, setMatchXpBreakdown] = useState<{ total: number; reasons: { label: string; xp: number }[] } | null>(null);
  const hasRecordedMatch = useRef<boolean>(false);

  // Authoritative Match Outcome Recording on VictoryScreen Mount
  useEffect(() => {
    if (!isAuthenticated || !user || hasRecordedMatch.current) return;
    hasRecordedMatch.current = true;

    // Find if authenticated user is in match
    const userInMatch = state.players.find(p => 
      p.id === user.id || 
      p.name.toLowerCase() === user.username.toLowerCase() ||
      p.name.toLowerCase() === (user.displayName || '').toLowerCase()
    );

    const isChampion = champion.name.toLowerCase() === user.username.toLowerCase() || 
                       champion.name.toLowerCase() === (user.displayName || '').toLowerCase();

    const battlesWon = userInMatch?.stats?.battlesWon || (isChampion ? 6 : 2);
    const charsBought = userInMatch?.collection?.length || (isChampion ? champion.collection.length : 3);

    const token = `match-${state.roomId || Date.now()}-${user.id}`;

    recordMatchResult({
      isWin: isChampion,
      isTournamentChampion: isChampion,
      isMvp: isChampion,
      battlesWon,
      charactersPurchased: charsBought,
      matchType: 'tournament'
    }, token).then((res) => {
      if (res && res.xpAwarded) {
        setMatchXpBreakdown(res.xpAwarded);
      }
    });
  }, [isAuthenticated, user?.id, champion.name, state.roomId]);

  useEffect(() => {
    if (!showSnapIntro) {
      soundManager.playVictory();
      
      // Celebratory entrance confetti cascade
      try {
        confetti({
          particleCount: 180,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FF1744', '#00E5FF', '#A855F7', '#10B981', '#FBBF24']
        });
      } catch {
        // Fallback
      }
    }
  }, [showSnapIntro]);

  const triggerConfettiBlast = () => {
    soundManager.playAttackHit();
    try {
      confetti({
        particleCount: 160,
        spread: 140,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF1744', '#00E5FF', '#A855F7', '#10B981', '#FBBF24', '#FFFFFF']
      });
    } catch {
      // Confetti fallback
    }
  };

  // Find MVP character in champion roster
  const sortedSquad = [...champion.collection].sort((a, b) => b.overallPower - a.overallPower);
  const mvpChar = sortedSquad[0] || null;
  const otherHeroes = sortedSquad.slice(1);
  const totalPower = champion.collection.reduce((sum, c) => sum + c.overallPower, 0);

  if (showSnapIntro) {
    return (
      <InfinitySnapVictoryIntro
        championName={champion.name}
        championAvatar={champion.avatar}
        onComplete={() => setShowSnapIntro(false)}
      />
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8 overflow-hidden animate-fadeIn select-none">
      
      {/* 1. HIGH-TECH COSMIC NEBULA & GOD-RAYS BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-purple-950/20 to-black pointer-events-none" />

      {/* Floating Stardust Shimmer */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* 2. GRAND 3D CHAMPIONSHIP TROPHY APEX & TITLE HEADER */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        
        {/* Supreme 3D Golden Trophy with Orbiting Infinity Stones */}
        <div className="relative inline-flex items-center justify-center group cursor-pointer" onClick={triggerConfettiBlast}>
          
          {/* Radial Golden Flare */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* 3D Golden Trophy Box Vessel */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-[0_0_60px_rgba(255,215,0,0.8)] border-2 border-amber-200 animate-float-idle flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-black/90 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
              
              {/* Internal God Rays */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.25)_0%,transparent_70%)]" />

              <Trophy className="w-14 h-14 sm:w-18 sm:h-18 text-amber-300 fill-amber-400 drop-shadow-[0_0_20px_rgba(255,215,0,1)] transform group-hover:scale-110 transition-transform duration-300" />
              
              {/* 6 Inlaid Infinity Gems Row */}
              <div className="flex items-center gap-1.5 mt-2 z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#A855F7] animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38BDF8] animate-pulse [animation-delay:150ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#EF4444] animate-pulse [animation-delay:300ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_#F97316] animate-pulse [animation-delay:450ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981] animate-pulse [animation-delay:600ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_10px_#FBBF24] animate-pulse [animation-delay:750ms]" />
              </div>
            </div>
          </div>

          {/* Floating Crown Pinnacle */}
          <Crown className="w-12 h-12 text-amber-300 fill-amber-400 absolute -top-5 -right-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,1)] z-20" />
        </div>

        {/* Grand Title & Persona Callout */}
        <div className="space-y-2 max-w-2xl">
          
          <div className="inline-flex items-center gap-2 px-6 py-1.5 rounded-full bg-gradient-to-r from-red-950/90 via-amber-950/90 to-purple-950/90 border border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.5)] text-amber-300 font-heading font-black text-xs uppercase tracking-widest">
            <Flame className="w-4 h-4 text-red-400 animate-bounce" />
            <span>MARVEL AUCTION SUPREMACY</span>
            <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black bg-gradient-to-b from-white via-amber-200 to-amber-500 bg-clip-text text-transparent tracking-wider uppercase drop-shadow-[0_0_40px_rgba(255,215,0,0.6)]">
            TOURNAMENT CHAMPION
          </h1>

          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="text-4xl sm:text-5xl">{champion.avatar}</span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wide drop-shadow-md">
              {champion.name}
            </h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs font-mono font-black uppercase">
              👑 UNDEFEATED
            </span>
          </div>
        </div>
      </div>

      {/* 3. HERO PODIUM & SQUAD HALL OF FAME */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Squad Hall of Fame & MVP Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* MVP HERO CENTERPIECE SPOTLIGHT */}
          {mvpChar && (
            <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-950/70 via-purple-950/60 to-black border-2 border-amber-400/90 shadow-[0_0_50px_rgba(255,215,0,0.35)] overflow-hidden backdrop-blur-xl">
              
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                
                {/* MVP Portrait with Crown and Glowing Ring */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 blur-md opacity-80 animate-pulse" />
                  <CharacterPortrait character={mvpChar} size="xl" showBadge={true} className="relative ring-4 ring-amber-300 shadow-2xl" />
                  
                  <span className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black text-xs font-heading font-black uppercase px-3 py-1 rounded-full shadow-xl border-2 border-white animate-bounce flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>MVP</span>
                  </span>
                </div>

                {/* MVP Info & Stats */}
                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>TOURNAMENT DOMINATOR</span>
                  </div>

                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-white truncate drop-shadow">
                    {mvpChar.name}
                  </h3>

                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    "{mvpChar.description}"
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                    <span className="text-xs bg-amber-500/20 text-amber-300 font-mono font-black px-3 py-1 rounded-xl border border-amber-500/50 shadow-sm flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{mvpChar.overallPower} PWR</span>
                    </span>
                    <span className="text-xs bg-red-500/20 text-red-300 font-mono font-black px-3 py-1 rounded-xl border border-red-500/50 shadow-sm flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-red-400" />
                      <span>GRADE {mvpChar.grade} APEX</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SQUAD ROSTER CARDS */}
          <div className="rounded-3xl p-5 bg-black/60 border border-white/10 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200">
                  VICTORIOUS SQUAD ({champion.collection.length} HEROES)
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">
                TOTAL POWER: <strong className="text-amber-400 text-sm font-black">{totalPower} PWR</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {champion.collection.map((char, index) => {
                const isMvp = char.id === mvpChar?.id;
                return (
                  <div 
                    key={char.id} 
                    className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all duration-300 ${
                      isMvp 
                        ? 'bg-amber-950/40 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/60' 
                        : 'bg-black/50 border-white/10 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="relative">
                      <CharacterPortrait character={char} size="sm" showBadge={true} />
                      {isMvp && (
                        <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full shadow">
                          ★
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-xs text-white mt-2 truncate w-full">
                      {char.name}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">
                      ⚡ {char.overallPower} PWR
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ALL PLAYERS TOURNAMENT LEADERBOARD & DOSSIERS */}
          <div className="rounded-3xl p-5 bg-black/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>TOURNAMENT FINAL STANDINGS</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Click player for Dossier</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {state.players
                .slice()
                .sort((a, b) => (b.stats?.battlesWon || 0) - (a.stats?.battlesWon || 0))
                .map((p, rank) => {
                  const isChamp = p.id === champion.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedProfilePlayer(p);
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer hover:border-cyan-400/60 hover:bg-slate-900/80 ${
                        isChamp ? 'bg-amber-950/40 border-amber-400/60' : 'bg-black/40 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-black text-[10px] shrink-0 ${
                          rank === 0 ? 'bg-amber-400 text-black' : rank === 1 ? 'bg-slate-300 text-black' : rank === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {rank + 1}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center text-xs shrink-0 bg-black">
                          {p.customAvatarUrl || p.profile?.customAvatarUrl ? (
                            <img src={p.customAvatarUrl || p.profile?.customAvatarUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{p.avatar}</span>
                          )}
                        </div>
                        <span className="font-extrabold text-xs text-white truncate max-w-[120px] sm:max-w-none">
                          {p.name} {isChamp && '👑'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-right font-mono text-[11px] shrink-0">
                        <span className="text-red-400 font-bold">
                          {p.stats?.battlesWon || 0} Wins
                        </span>
                        <span className="text-emerald-400">
                          ${p.stats?.moneySpent || 0}
                        </span>
                        <span className="text-[10px] text-cyan-400 underline">
                          Profile
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

        {/* Right: Stark-Tech Combat Telemetry & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FINAL MATCH TELEMETRY HOLOCUBES */}
          <div className="rounded-3xl p-6 bg-black/70 border border-amber-500/30 shadow-[0_0_35px_rgba(0,0,0,0.8)] space-y-4 backdrop-blur-xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-heading font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span>CHAMPIONSHIP TELEMETRY</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">FINAL STATS</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              {/* Money Invested */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Invested</span>
                </div>
                <span className="text-xl font-heading font-black text-emerald-400 block">
                  ${champion.stats.moneySpent}
                </span>
              </div>

              {/* Cash Remaining */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <Gem className="w-3.5 h-3.5 text-amber-400" />
                  <span>Treasury Bank</span>
                </div>
                <span className="text-xl font-heading font-black text-amber-400 block">
                  ${champion.money}
                </span>
              </div>

              {/* Duels Won */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  <span>Duels Conquered</span>
                </div>
                <span className="text-xl font-heading font-black text-red-400 block">
                  {champion.stats.battlesWon} WINS
                </span>
              </div>

              {/* Peak Bid */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>Peak Auction Bid</span>
                </div>
                <span className="text-xl font-heading font-black text-purple-400 block">
                  ${champion.stats.highestBid}
                </span>
              </div>

            </div>

            {/* WHY THEY WON: Tactical Breakdown */}
            <div className="p-4 bg-slate-950/90 rounded-2xl border border-white/5 space-y-2 text-xs">
              <span className="text-[11px] font-heading font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>CHAMPIONSHIP DECIDING FACTORS</span>
              </span>
              
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">⚡</span>
                  <span><strong>Vanguard Power:</strong> {mvpChar?.name} anchored the team with a decisive <strong>{mvpChar?.overallPower} Power</strong> output.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">💎</span>
                  <span><strong>Economic Precision:</strong> Retained <strong>${champion.money}</strong> in liquid reserves while locking down key lots.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">⚔️</span>
                  <span><strong>Duel Dominance:</strong> Cleared all tournament brackets to claim the Multiverse title!</span>
                </div>
              </div>
            </div>

            {/* COMMANDER CAREER XP REWARD CARD */}
            {isAuthenticated && user && (
              <div className="p-4 bg-gradient-to-r from-purple-950/80 via-[#10162B] to-cyan-950/80 rounded-2xl border border-cyan-500/40 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-heading font-black text-xs text-white uppercase tracking-wider">
                      COMMANDER PROGRESSION
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded-full font-mono">
                    LVL {user.level}
                  </span>
                </div>

                {matchXpBreakdown && matchXpBreakdown.total > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {matchXpBreakdown.reasons.map((r, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-black/60 border border-white/10 rounded-lg text-cyan-300 font-mono">
                        {r.label} <strong className="text-amber-300">+{r.xp} XP</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                    <span>{user.currentLevelXp?.toLocaleString() || 0} / {user.xpForNextLevel?.toLocaleString() || 100} XP</span>
                    <span className="text-cyan-300">{user.progressPercent || 0}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-black/80 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 rounded-full transition-all duration-700 shadow-glow-cyan"
                      style={{ width: `${Math.max(4, Math.min(100, user.progressPercent || 0))}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CELEBRATION ACTION BUTTONS */}
            <div className="pt-2 space-y-2.5">
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={triggerConfettiBlast}
                  className="py-3 px-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 font-heading font-black text-xs uppercase tracking-wider rounded-2xl border border-amber-400/60 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.02]"
                >
                  <PartyPopper className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>CONFETTI BLAST 🎊</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowSnapIntro(true);
                  }}
                  className="py-3 px-3 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-300 font-heading font-black text-xs uppercase tracking-wider rounded-2xl border border-purple-400/60 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>REPLAY SNAP ✨</span>
                </button>
              </div>

              {/* MULTIPLAYER REMATCH VOTES TRACKER */}
              {state.isOnline && (
                <div className="p-3 bg-black/60 rounded-2xl border border-purple-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-heading font-black text-purple-300 uppercase">
                      ⚔️ REMATCH VOTES ({state.rematchVotes?.length || 0}/{state.players.filter(p => !p.isBot).length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {state.players.filter(p => !p.isBot).map(p => {
                      const hasVoted = state.rematchVotes?.includes(p.id);
                      return (
                        <span 
                          key={p.id} 
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border ${
                            hasVoted ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          <span>{p.name}</span>
                          <span>{hasVoted ? '✓' : '⏳'}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Master Play Again / Rematch Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  if (state.isOnline && onVoteRematch) {
                    onVoteRematch();
                  } else {
                    onPlayAgain();
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-amber-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-heading font-black text-base sm:text-lg uppercase tracking-wider rounded-2xl shadow-[0_0_35px_rgba(255,215,0,0.6)] border-2 border-amber-400 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5"
              >
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>{state.isOnline ? 'VOTE TO REMATCH 🔄' : 'COMMENCE NEW TOURNAMENT'}</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Player Profile Modal */}
      {selectedProfilePlayer && (
        <PlayerProfileModal
          player={selectedProfilePlayer}
          onClose={() => setSelectedProfilePlayer(null)}
        />
      )}
    </div>
  );
}

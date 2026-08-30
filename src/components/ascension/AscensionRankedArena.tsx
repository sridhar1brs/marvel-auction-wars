import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character } from '../../types/game';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { 
  Trophy, Lock, Swords, Shield, Zap, Sparkles, Award, 
  Flame, CheckCircle2, ChevronRight, Crown, AlertTriangle, Play,
  Gift, Check, ArrowUpRight, Star, Layers, RefreshCw
} from 'lucide-react';
import { ALL_RANK_DEFINITIONS, getRankLabel, RankDefinition, RankedTierReward } from '../../data/ascensionProgression';

const getRankArtwork = (tier: string, division: number): React.CSSProperties => {
  if (tier === 'ASCENDER') {
    return {
      backgroundImage: "url('/images/ranks/ascender.png')",
      backgroundSize: '500% auto',
      backgroundPosition: '50% 50%',
    };
  }
  return {
    backgroundImage: `url('/images/ranks/${tier.toLowerCase()}.png')`,
    backgroundSize: '500% auto',
    backgroundPosition: `${((division - 1) / 4) * 100}% 50%`,
  };
};

export function AscensionRankedArena() {
  const { user, token, refreshProfile } = useAuth();
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState<'ARENA' | 'LADDER'>('ARENA');
  const [matchFormat, setMatchFormat] = useState<'1v1' | '2v2' | '3v3'>('1v1');
  const [battleState, setBattleState] = useState<'IDLE' | 'MATCHMAKING' | 'DUEL' | 'RESULT'>('IDLE');
  const [playerTeam, setPlayerTeam] = useState<Character[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Character[]>([]);
  const [opponentName, setOpponentName] = useState<string>('');
  const [opponentRating, setOpponentRating] = useState<number>(1000);
  const [lastMatchResult, setLastMatchResult] = useState<{ isWin: boolean; ratingDelta: number; astraAwarded: number; newRating: number; newTier: string } | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [claimingRankId, setClaimingRankId] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const commanderLevel = user?.level || 1;
  const isLocked = commanderLevel < 10;

  const ownedCharIds = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);
  const availableRoster = useMemo(() => ALL_CHARACTERS.filter(c => ownedCharIds.has(c.id)), [ownedCharIds]);
  const teamSize = matchFormat === '1v1' ? 1 : matchFormat === '2v2' ? 2 : 3;

  // Rank Info Helper
  const rankInfo = useMemo(() => {
    const tier = user?.rankedTier || 'UNRANKED';
    const division = user?.rankedDivision || 0;
    const rating = user?.rankedRating || 0;
    const isPlacements = !user?.isPlacementsCompleted || tier === 'UNRANKED';
    const placementsPlayed = user?.placementMatchesPlayed || 0;

    let badgeColor = 'from-slate-700 to-slate-900 border-slate-600 text-slate-300';
    let icon = '🛡️';

    if (tier === 'ASCENDER') {
      badgeColor = 'from-amber-400 via-purple-600 to-cyan-400 border-amber-300 text-amber-200 shadow-glow-cosmic';
      icon = '⚡';
    } else if (tier === 'COSMIC') {
      badgeColor = 'from-indigo-900 to-blue-900 border-indigo-400 text-indigo-200';
      icon = '🪐';
    } else if (tier === 'VIBRANIUM') {
      badgeColor = 'from-teal-900 to-emerald-950 border-teal-400 text-teal-200';
      icon = '💠';
    } else if (tier === 'PLATINUM') {
      badgeColor = 'from-slate-600 to-cyan-900 border-slate-300 text-white';
      icon = '⚔️';
    } else if (tier === 'GOLD') {
      badgeColor = 'from-amber-900 to-yellow-950 border-amber-400 text-amber-200';
      icon = '🏆';
    } else if (tier === 'SILVER') {
      badgeColor = 'from-slate-700 to-slate-800 border-slate-400 text-slate-200';
      icon = '🥈';
    } else if (tier === 'BRONZE') {
      badgeColor = 'from-orange-950 to-amber-950 border-orange-700 text-orange-300';
      icon = '🥉';
    }

    // Next Rank Calculation
    const nextRank = ALL_RANK_DEFINITIONS.find(r => r.requiredRating > rating);
    const mmrToNext = nextRank ? Math.max(0, nextRank.requiredRating - rating) : 0;

    return { tier, division, rating, isPlacements, placementsPlayed, badgeColor, icon, nextRank, mmrToNext };
  }, [user]);

  useEffect(() => {
    const state = socket.ascensionState;
    if (!state || state.mode !== 'ranked') return;
    if (state.phase === 'MATCHMAKING') setBattleState('MATCHMAKING');
    if (state.phase === 'BATTLE') setBattleState('DUEL');
    if (state.phase === 'RESULT') {
      const isWin = state.winnerId === socket.socket?.id;
      const reward = state.rewards?.[socket.socket?.id || ''];
      setLastMatchResult({
        isWin,
        ratingDelta: reward?.ratingDelta || 0,
        astraAwarded: reward?.astraAwarded || 0,
        newRating: reward?.newRating || rankInfo.rating,
        newTier: reward?.newTier || rankInfo.tier,
      });
      setBattleState('RESULT');
      refreshProfile();
    }
  }, [socket.ascensionState]);

  const handleStartQueue = () => {
    if (playerTeam.length !== teamSize) return;
    soundManager.playClick();
    setBattleState('MATCHMAKING');
    socket.queueAscension('ranked', matchFormat, playerTeam.map(c => c.id));
  };

  const handleExecuteTurn = () => {
    setIsResolving(true);
    soundManager.playAttackHit();
    setTimeout(() => {
      setIsResolving(false);
      socket.submitAscensionAction('ATTACK', 0);
    }, 800);
  };

  const handleClaimRankReward = async (rankId: string, rankLabel: string) => {
    if (!token) return;
    setClaimingRankId(rankId);
    setClaimMessage(null);
    try {
      const res = await fetch('/api/ranked/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rankId }),
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playVictory();
        setClaimMessage({ type: 'success', text: `Claimed rewards for ${rankLabel}!` });
        await refreshProfile();
      } else {
        soundManager.playAttackHit();
        setClaimMessage({ type: 'error', text: data.error || 'Failed to claim reward.' });
      }
    } catch (err) {
      setClaimMessage({ type: 'error', text: 'Network connection failed.' });
    } finally {
      setClaimingRankId(null);
      setTimeout(() => setClaimMessage(null), 4000);
    }
  };

  const claimedRewards = useMemo(() => new Set(user?.claimedRankRewards || []), [user?.claimedRankRewards]);

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Top Banner Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/90 via-slate-950 to-cyan-950/90 border border-purple-500/40 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rankInfo.badgeColor} border-2 flex items-center justify-center text-3xl shadow-lg shrink-0`}>
            {rankInfo.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-xl text-white tracking-wider">
                {getRankLabel(rankInfo.tier, rankInfo.division)}
              </h2>
              <span className="text-xs bg-amber-500 text-black font-black px-2 py-0.5 rounded-full font-mono">
                {rankInfo.rating.toLocaleString()} MMR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {rankInfo.nextRank 
                ? `${rankInfo.mmrToNext.toLocaleString()} MMR needed to reach ${rankInfo.nextRank.label}`
                : 'Maximum Competitive Summit Reached (⚡ Ascender)'}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('ARENA'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ARENA'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-cosmic'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Competitive Arena</span>
          </button>

          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('LADDER'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'LADDER'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-glow-gold'
                : 'text-amber-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Rank Ladder & Rewards</span>
          </button>
        </div>
      </div>

      {/* Claim Notification Message */}
      {claimMessage && (
        <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
          claimMessage.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
            : 'bg-red-950/80 border-red-500 text-red-300'
        }`}>
          {claimMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{claimMessage.text}</span>
        </div>
      )}

      {/* VIEW 1: COMPETITIVE ARENA */}
      {activeTab === 'ARENA' && battleState === 'IDLE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Match Setup & Queue Card (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#090D1A] border-2 border-purple-500/40 shadow-xl space-y-5">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider block">MATCH PROTOCOL</span>
              <h3 className="font-heading font-black text-lg text-white">Ranked Matchmaking</h3>
            </div>

            {/* Match Format Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Select Battle Format:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1v1', '2v2', '3v3'] as const).map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setMatchFormat(fmt);
                      setPlayerTeam([]);
                    }}
                    className={`py-2.5 rounded-2xl text-xs font-heading font-black transition-all border cursor-pointer ${
                      matchFormat === fmt
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-glow-cosmic'
                        : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {fmt} Clash
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Squad Preview */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Deploy Squad ({playerTeam.length}/{teamSize}):</span>
                <span className="text-amber-400 font-mono">
                  PWR: {playerTeam.reduce((acc, c) => acc + c.overallPower + (user?.characterStatsBoosts[c.id]?.power || 0), 0)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 min-h-[90px]">
                {Array.from({ length: teamSize }).map((_, i) => {
                  const char = playerTeam[i];
                  return char ? (
                    <div
                      key={char.id}
                      onClick={() => setPlayerTeam(playerTeam.filter((_, idx) => idx !== i))}
                      className="p-2 rounded-xl bg-purple-950/60 border border-purple-400/80 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-105"
                      title="Click to remove"
                    >
                      <CharacterPortrait character={char} size="sm" showBadge={false} />
                      <span className="text-[10px] font-bold text-white truncate max-w-full mt-1">{char.name}</span>
                    </div>
                  ) : (
                    <div
                      key={`empty-${i}`}
                      className="rounded-xl border border-dashed border-white/15 bg-black/20 flex flex-col items-center justify-center text-slate-600 text-[10px] font-mono"
                    >
                      <span>Slot {i + 1}</span>
                      <span className="text-[9px] text-slate-700">Empty</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Queue Button */}
            <button
              type="button"
              onClick={handleStartQueue}
              disabled={playerTeam.length !== teamSize || isLocked}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-heading font-black text-sm uppercase tracking-wider transition-all shadow-glow-cosmic disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isLocked ? 'Locked (Requires Commander Level 10)' : 'Enter Ranked Queue'}</span>
            </button>
          </div>

          {/* Right Column: Hero Selector (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#090D1A] border-2 border-cyan-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">AVAILABLE HEROES</span>
                <h3 className="font-heading font-black text-lg text-white">Select {teamSize} Heroes</h3>
              </div>
              <span className="text-xs text-amber-400 font-mono font-bold">{availableRoster.length} Owned</span>
            </div>

            {availableRoster.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm text-slate-400">You don't own any heroes in your roster yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {availableRoster.map(char => {
                  const isSelected = playerTeam.some(c => c.id === char.id);
                  const boost = user?.characterStatsBoosts[char.id]?.power || 0;
                  return (
                    <div
                      key={char.id}
                      onClick={() => {
                        soundManager.playClick();
                        if (isSelected) {
                          setPlayerTeam(playerTeam.filter(c => c.id !== char.id));
                        } else if (playerTeam.length < teamSize) {
                          setPlayerTeam([...playerTeam, char]);
                        }
                      }}
                      className={`p-2 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-purple-950/80 border-purple-400 shadow-glow-cosmic scale-105'
                          : 'bg-black/40 border-white/10 hover:border-cyan-500/40'
                      }`}
                    >
                      <CharacterPortrait character={char} size="sm" showBadge={false} />
                      <span className="text-xs font-bold text-white truncate w-full mt-1.5">{char.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">⚡ PWR {char.overallPower + boost}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: COMPLETE LARGE SCROLLABLE RANK LADDER & REWARDS */}
      {activeTab === 'LADDER' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#090D1A] border-2 border-amber-500/40 shadow-2xl space-y-6">
            
            {/* Ladder Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">COMPETITIVE PROGRESSION</span>
                <h3 className="font-heading font-black text-2xl text-white flex items-center gap-2.5">
                  <span>MARVEL ASCENSION RANKED SUMMIT</span>
                  <span className="text-xs bg-amber-500 text-black font-black px-2.5 py-0.5 rounded-full font-mono">
                    29 Divisions
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Compete on the global competitive ladder. Each tier unlocks significantly higher value Astra, Epic & Mythic Draft Tokens, and exclusive competitive titles!
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30 text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current MMR Rating</span>
                <span className="text-xl font-heading font-black text-amber-400 font-mono">
                  {rankInfo.rating.toLocaleString()} MMR
                </span>
              </div>
            </div>

            {/* Scrollable Rank Ladder Cards */}
            <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-2">
              {ALL_RANK_DEFINITIONS.map(rank => {
                const isCurrent = rankInfo.tier === rank.tier && rankInfo.division === rank.division;
                const isUnlocked = (user?.rankedRating || 0) >= rank.requiredRating;
                const isClaimed = claimedRewards.has(rank.id);
                const reward = rank.reward;

                return (
                  <div
                    key={rank.id}
                    className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-amber-950/80 via-black to-purple-950/80 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.3)] scale-[1.01]'
                        : isUnlocked
                        ? 'bg-black/60 border-cyan-500/40 hover:border-cyan-400'
                        : 'bg-black/30 border-white/10 opacity-75'
                    }`}
                  >
                    {/* Left: Rank Badge & Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/15 bg-no-repeat shrink-0 shadow-md"
                        style={getRankArtwork(rank.tier, rank.division)}
                        aria-label={`${rank.label} logo`}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-heading font-black text-base sm:text-lg text-white">
                            {rank.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-black uppercase bg-amber-500 text-black px-2 py-0.5 rounded-full font-mono animate-pulse shadow-sm">
                              You Are Here
                            </span>
                          )}
                          {isUnlocked && !isCurrent && (
                            <span className="text-[10px] font-bold text-cyan-400 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                          <span className="text-amber-400 font-bold">{rank.requiredRating.toLocaleString()} MMR</span>
                          <span>•</span>
                          <span>{rank.tier} Division</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Progressive Reward Details */}
                    <div className="flex-1 p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-center">
                      <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider mb-1 flex items-center gap-1">
                        <Gift className="w-3 h-3 text-amber-400" />
                        <span>Tier Milestone Reward:</span>
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white font-mono bg-purple-950/60 border border-purple-500/30 px-2 py-1 rounded-xl">
                          🪙 {reward.astra.toLocaleString()} Astra
                        </span>
                        {reward.cardShards > 0 && (
                          <span className="text-xs font-bold text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-500/30 px-2 py-1 rounded-xl">
                            🔷 {reward.cardShards} Shards
                          </span>
                        )}
                        {reward.cratesCount && reward.crateType && (
                          <span className="text-xs font-bold text-amber-300 font-mono bg-amber-950/60 border border-amber-500/30 px-2 py-1 rounded-xl">
                            📦 {reward.cratesCount}x {reward.crateType === 'CHARACTER_CRATE' ? 'Card Crate' : 'Shard Crate'}
                          </span>
                        )}
                        {reward.tokensCount && reward.tokenCategory && (
                          <span className="text-xs font-bold text-rose-300 font-mono bg-rose-950/60 border border-rose-500/30 px-2 py-1 rounded-xl">
                            🎫 {reward.tokensCount}x {reward.tokenCategory} Token
                          </span>
                        )}
                        {reward.exclusiveTitle && (
                          <span className="text-xs font-black text-yellow-300 font-heading bg-yellow-950/60 border border-yellow-500/30 px-2 py-1 rounded-xl">
                            👑 {reward.exclusiveTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Claim / Status Action Button */}
                    <div className="shrink-0 flex items-center justify-end">
                      {isClaimed ? (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono">
                          <Check className="w-4 h-4" />
                          <span>Claimed</span>
                        </div>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          disabled={claimingRankId === rank.id}
                          onClick={() => handleClaimRankReward(rank.id, rank.label)}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-heading font-black text-xs uppercase tracking-wider transition-all shadow-glow-gold cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <Gift className="w-4 h-4" />
                          <span>{claimingRankId === rank.id ? 'Claiming...' : 'Claim Reward'}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 border border-white/10 text-slate-500 text-xs font-mono">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Reach {rank.requiredRating.toLocaleString()} MMR</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* Matchmaking View */}
      {battleState === 'MATCHMAKING' && (
        <div className="py-16 text-center bg-[#090D1A] border-2 border-purple-500/40 rounded-3xl shadow-2xl space-y-4 animate-pulse">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-3xl shadow-glow-cyan">
            ⚔️
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-wider font-heading">
            Searching for Opponent...
          </h3>
          <p className="text-sm text-purple-300 font-mono">
            Scanning Global {rankInfo.tier} Ladder • Matching MMR ({rankInfo.rating} Rating)
          </p>
          <button onClick={() => { socket.cancelAscensionQueue(); setBattleState('IDLE'); }} className="rounded-xl border border-white/20 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer">
            CANCEL SEARCH
          </button>
        </div>
      )}

      {/* Duel Turn Resolution */}
      {battleState === 'DUEL' && (
        <div className="p-8 bg-[#090D1A] border-2 border-purple-500/40 rounded-3xl shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Player Side */}
            <div className="p-6 bg-black/60 border border-cyan-500/40 rounded-2xl text-center space-y-3">
              <div className="text-xs font-bold text-cyan-400 uppercase">You (Commander)</div>
              <div className="text-xl font-black text-white">{playerTeam[0]?.name}</div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                ⚡ PWR {playerTeam[0]?.overallPower + (user?.characterStatsBoosts[playerTeam[0]?.id]?.power || 0)}
              </div>
            </div>

            {/* Opponent Side */}
            <div className="p-6 bg-black/60 border border-rose-500/40 rounded-2xl text-center space-y-3">
              <div className="text-xs font-bold text-rose-400 uppercase">Rival: {opponentName || 'Opponent'}</div>
              <div className="text-xl font-black text-white">{opponentTeam[0]?.name || 'Opponent Hero'}</div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                ⚡ PWR {opponentTeam[0]?.overallPower || 100}
              </div>
            </div>
          </div>

          <button
            onClick={handleExecuteTurn}
            disabled={isResolving}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-400 text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            ⚡ Strike & Resolve Match
          </button>
        </div>
      )}

      {/* Match Result */}
      {battleState === 'RESULT' && lastMatchResult && (
        <div className="p-8 bg-[#090D1A] border-2 border-amber-500/40 rounded-3xl text-center shadow-2xl space-y-5">
          <div className="text-6xl">
            {lastMatchResult.isWin ? '🏆' : '💀'}
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-wide font-heading">
            {lastMatchResult.isWin ? 'RANKED VICTORY!' : 'RANKED DEFEAT'}
          </h3>
          <div className="flex justify-center items-center gap-6 text-sm font-bold font-mono">
            <span className={lastMatchResult.isWin ? 'text-emerald-400' : 'text-rose-400'}>
              {lastMatchResult.isWin ? '+25 Rating' : '-15 Rating'}
            </span>
            <span className="text-amber-300">
              ✨ +{lastMatchResult.astraAwarded.toLocaleString()} ASTRA
            </span>
          </div>

          <button
            onClick={() => setBattleState('IDLE')}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
          >
            Return to Ranked Lobby
          </button>
        </div>
      )}

    </div>
  );
}

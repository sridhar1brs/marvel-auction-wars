import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { 
  Trophy, Award, Crown, Zap, Flame, Shield, 
  Users, Clock, Sparkles, Filter, Check, Star 
} from 'lucide-react';

export type LeaderboardCategory = 'RANK' | 'WINS' | 'LEVEL_XP' | 'MVP' | 'DUNGEON_PEAK' | 'PLAY_TIME';

export function AscensionLeaderboards() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory>('RANK');
  const [leaderboardData, setLeaderboardData] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLeaderboard(selectedCategory);
  }, [selectedCategory]);

  const fetchLeaderboard = async (category: LeaderboardCategory) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/ascension/leaderboards?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.leaderboard)) {
          setLeaderboardData(data.leaderboard);
        }
      }
    } catch (err) {
      console.error('Failed to fetch Ascension leaderboards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankDisplay = (p: UserProfile) => {
    if (!p.isPlacementsCompleted || p.rankedTier === 'UNRANKED') {
      return 'UNRANKED';
    }
    if (p.rankedTier === 'ASCENDER') {
      return '⚡ ASCENDER';
    }
    return `${p.rankedTier} ${p.rankedDivision || ''}`;
  };

  const getMetricDisplay = (player: UserProfile) => {
    if (selectedCategory === 'RANK') return `${(player.rankedRating ?? 0).toLocaleString()} Rating • ${getRankDisplay(player)}`;
    if (selectedCategory === 'WINS') return `${player.wins ?? 0} Wins (${player.winRate || 0}% WR)`;
    if (selectedCategory === 'LEVEL_XP') return `Level ${player.level ?? 1} (${(player.xp ?? 0).toLocaleString()} XP)`;
    if (selectedCategory === 'MVP') return `${player.mvpAwards ?? 0} MVP Awards`;
    if (selectedCategory === 'DUNGEON_PEAK') return `Wave ${player.dungeonPeak || player.dungeonMaxWave || 0}`;
    if (selectedCategory === 'PLAY_TIME') return player.playtimeFormatted || '0m';
    return `${player.wins ?? 0} Wins`;
  };

  const top3 = leaderboardData.slice(0, 3);
  const restList = leaderboardData.slice(3);

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#1C1204] via-[#101A2E] to-[#120822] border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>GLOBAL MULTIVERSE HALL OF FAME</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            ASCENSION TOP 50 LEADERBOARDS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Live rankings of the top 50 commanders in the Marvel Ascension multiverse across competitive Ranked MMR, career victories, level XP, and MVP dominance.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-black/60 border border-white/10 shrink-0">
          {(['RANK', 'WINS', 'LEVEL_XP', 'MVP', 'DUNGEON_PEAK', 'PLAY_TIME'] as LeaderboardCategory[]).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow-glow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'RANK' ? '🏆 RANK' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* 🥈 #2 Silver */}
          {top3[1] && (
            <div className="order-2 md:order-1 p-5 rounded-3xl bg-gradient-to-b from-[#1C1F2E] to-[#0A0D18] border-2 border-slate-400/60 text-center space-y-3 shadow-lg transform hover:scale-102 transition-transform">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-300 text-black font-heading font-black text-lg flex items-center justify-center shadow-md">
                🥈 #2
              </div>
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-slate-300 bg-black flex items-center justify-center text-3xl shadow-md">
                {top3[1].customAvatarUrl ? (
                  <img src={top3[1].customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{top3[1].avatar || '🦸‍♂️'}</span>
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading font-black text-base text-white uppercase truncate">
                  {top3[1].displayName || top3[1].username}
                </h3>
                <span className="text-xs text-amber-300 font-mono font-bold block">
                  {getRankDisplay(top3[1])}
                </span>
                <span className="text-[11px] text-slate-300 font-mono block">
                  {getMetricDisplay(top3[1])}
                </span>
              </div>
            </div>
          )}

          {/* 🥇 #1 Champion */}
          {top3[0] && (
            <div className="order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-[#332208] to-[#120B02] border-2 border-amber-400 text-center space-y-3 shadow-[0_0_50px_rgba(245,158,11,0.4)] transform md:-translate-y-3 scale-105 transition-transform relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-heading font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                <Crown className="w-3 h-3" /> #1 GLOBAL TITAN
              </div>
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 text-black font-heading font-black text-xl flex items-center justify-center shadow-glow-gold">
                🥇
              </div>
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-amber-300 bg-black flex items-center justify-center text-4xl shadow-glow-gold">
                {top3[0].customAvatarUrl ? (
                  <img src={top3[0].customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{top3[0].avatar || '🦸‍♂️'}</span>
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading font-black text-lg text-white uppercase truncate">
                  {top3[0].displayName || top3[0].username}
                </h3>
                <span className="text-sm text-amber-300 font-mono font-black block">
                  {getRankDisplay(top3[0])}
                </span>
                <span className="text-xs text-amber-200 font-mono block">
                  {getMetricDisplay(top3[0])}
                </span>
              </div>
            </div>
          )}

          {/* 🥉 #3 Bronze */}
          {top3[2] && (
            <div className="order-3 p-5 rounded-3xl bg-gradient-to-b from-[#241711] to-[#0D0805] border-2 border-amber-700/60 text-center space-y-3 shadow-lg transform hover:scale-102 transition-transform">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-700 text-white font-heading font-black text-lg flex items-center justify-center shadow-md">
                🥉 #3
              </div>
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-amber-700 bg-black flex items-center justify-center text-3xl shadow-md">
                {top3[2].customAvatarUrl ? (
                  <img src={top3[2].customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{top3[2].avatar || '🦸‍♂️'}</span>
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading font-black text-base text-white uppercase truncate">
                  {top3[2].displayName || top3[2].username}
                </h3>
                <span className="text-xs text-amber-300 font-mono font-bold block">
                  {getRankDisplay(top3[2])}
                </span>
                <span className="text-[11px] text-slate-300 font-mono block">
                  {getMetricDisplay(top3[2])}
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TOP 4 - 50 TABLE LIST */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#090D1E]/95 border border-white/10 shadow-xl space-y-2">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono font-bold text-slate-400 uppercase">
          <span className="w-12 text-center">Rank</span>
          <span className="flex-1 text-left px-4">Commander</span>
          <span className="w-32 text-center hidden sm:block">Rank Tier</span>
          <span className="w-36 text-right">Performance</span>
        </div>

        {restList.map((player, idx) => {
          const rankPos = idx + 4;
          const isCurrentPlayer = user && user.id === player.id;

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${
                isCurrentPlayer
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-glow-cyan'
                  : 'bg-black/40 border-white/5 hover:border-white/20'
              }`}
            >
              {/* Rank Position */}
              <div className="w-12 text-center font-heading font-black text-sm text-slate-400 font-mono">
                #{rankPos}
              </div>

              {/* Commander Name & Avatar */}
              <div className="flex-1 flex items-center gap-3 px-4">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center text-base">
                  {player.customAvatarUrl ? (
                    <img src={player.customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{player.avatar || '🦸‍♂️'}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs sm:text-sm text-white uppercase">
                    {player.displayName || player.username}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    LVL {player.level || 1} • {player.wins || 0} Wins
                  </span>
                </div>
              </div>

              {/* Rank Tier Badge */}
              <div className="w-32 text-center hidden sm:block">
                <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/50 text-purple-200 text-[10px] font-mono font-bold">
                  {getRankDisplay(player)}
                </span>
              </div>

              {/* Performance Metric Value */}
              <div className="w-36 text-right font-mono font-bold text-xs text-amber-300">
                {getMetricDisplay(player)}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

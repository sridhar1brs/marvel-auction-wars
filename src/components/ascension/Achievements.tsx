import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { Trophy, CheckCircle, Lock, Star, Sparkles } from 'lucide-react';

const ACHIEVEMENT_DEFINITIONS: Record<string, { title: string; description: string; target: number; rewardType: 'astra' | 'cardShards'; rewardAmount: number; icon: string; category: string }> = {
  first_blood:      { title: 'First Blood',       description: 'Win your first battle',                    target: 1,   rewardType: 'astra',       rewardAmount: 500,   icon: '⚔️',  category: 'Combat' },
  battle_10:        { title: 'Gladiator',          description: 'Win 10 battles',                           target: 10,  rewardType: 'astra',       rewardAmount: 1500,  icon: '🗡️',  category: 'Combat' },
  battle_50:        { title: 'Battle-Hardened',    description: 'Win 50 battles',                           target: 50,  rewardType: 'astra',       rewardAmount: 5000,  icon: '🛡️',  category: 'Combat' },
  battle_100:       { title: 'War Hero',           description: 'Win 100 battles',                          target: 100, rewardType: 'astra',       rewardAmount: 15000, icon: '🏆',  category: 'Combat' },
  collector_10:     { title: 'Collector',          description: 'Own 10 characters',                        target: 10,  rewardType: 'cardShards',  rewardAmount: 100,   icon: '🃏',  category: 'Collection' },
  collector_50:     { title: 'Major Collector',    description: 'Own 50 characters',                        target: 50,  rewardType: 'cardShards',  rewardAmount: 500,   icon: '📦',  category: 'Collection' },
  collector_100:    { title: 'Master Collector',   description: 'Own 100 characters',                       target: 100, rewardType: 'cardShards',  rewardAmount: 1500,  icon: '🌟',  category: 'Collection' },
  dungeon_1:        { title: 'Dungeon Delver',     description: 'Complete a dungeon run',                   target: 1,   rewardType: 'astra',       rewardAmount: 1000,  icon: '🏰',  category: 'Exploration' },
  dungeon_10:       { title: 'Dungeon Master',     description: 'Complete 10 dungeon runs',                 target: 10,  rewardType: 'astra',       rewardAmount: 5000,  icon: '🔮',  category: 'Exploration' },
  crate_opener_5:   { title: 'Crate Hunter',       description: 'Open 5 crates',                           target: 5,   rewardType: 'cardShards',  rewardAmount: 100,   icon: '📦',  category: 'Exploration' },
  crate_opener_25:  { title: 'Crate Fanatic',      description: 'Open 25 crates',                          target: 25,  rewardType: 'cardShards',  rewardAmount: 500,   icon: '🎁',  category: 'Exploration' },
  ranked_bronze:    { title: 'Bronze Contender',   description: 'Reach Bronze rank',                       target: 1,   rewardType: 'astra',       rewardAmount: 1000,  icon: '🥉',  category: 'Ranked' },
  ranked_gold:      { title: 'Gold Warrior',       description: 'Reach Gold rank',                         target: 1,   rewardType: 'astra',       rewardAmount: 3000,  icon: '🥇',  category: 'Ranked' },
  ranked_diamond:   { title: 'Diamond Elite',      description: 'Reach Diamond rank',                      target: 1,   rewardType: 'astra',       rewardAmount: 8000,  icon: '💎',  category: 'Ranked' },
  ranked_ascender:  { title: 'Ascender',           description: 'Reach the legendary Ascender rank',       target: 1,   rewardType: 'astra',       rewardAmount: 50000, icon: '⚡',  category: 'Ranked' },
  multiversal:      { title: 'Multiversal',        description: 'Play all 3 game modes',                   target: 3,   rewardType: 'astra',       rewardAmount: 2000,  icon: '🌌',  category: 'Exploration' },
  mvp_5:            { title: 'MVP',                description: 'Earn 5 MVP awards',                       target: 5,   rewardType: 'astra',       rewardAmount: 3000,  icon: '⭐',  category: 'Combat' },
  forge_10:         { title: 'Forge Master',       description: 'Craft 10 cards in the Card Forge',        target: 10,  rewardType: 'astra',       rewardAmount: 2000,  icon: '🔨',  category: 'Collection' },
  wheel_spin_10:    { title: 'Wheel Addict',       description: 'Spin the Mystery Wheel 10 times',         target: 10,  rewardType: 'astra',       rewardAmount: 1500,  icon: '🎰',  category: 'Exploration' },
  daily_streak_7:   { title: 'Weekly Devotee',     description: 'Claim 7-day login streak',                target: 7,   rewardType: 'astra',       rewardAmount: 5000,  icon: '📅',  category: 'Exploration' },
  mastery_level_5:  { title: 'Character Expert',   description: 'Reach Mastery Level 5 with any character', target: 5,  rewardType: 'cardShards',  rewardAmount: 200,   icon: '🎖️', category: 'Mastery' },
  mastery_level_10: { title: 'Character Master',   description: 'Reach Mastery Level 10 with any character', target: 10, rewardType: 'cardShards', rewardAmount: 500,   icon: '👑',  category: 'Mastery' },
  team_builder:     { title: 'Team Builder',       description: 'Save 3 team presets',                     target: 3,   rewardType: 'astra',       rewardAmount: 1000,  icon: '👥',  category: 'Social' },
};

const CATEGORIES = ['All', 'Combat', 'Collection', 'Ranked', 'Exploration', 'Mastery', 'Social'];

export function Achievements() {
  const { user, claimAchievement, getAchievements } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [definitions, setDefinitions] = useState<Record<string, any>>(ACHIEVEMENT_DEFINITIONS);

  const achievements = user?.achievements || {};

  useEffect(() => {
    getAchievements().then(data => {
      if (data.definitions) setDefinitions(data.definitions);
    });
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleClaim = async (achievementId: string) => {
    setClaimingId(achievementId);
    const data = await claimAchievement(achievementId);
    setClaimingId(null);
    if (data.success) {
      soundManager.playVictoryFanfare();
      showToast('success', `Achievement claimed! +${data.rewardAmount?.toLocaleString()} ${data.rewardType === 'astra' ? '✨ ASTRA' : '🔷 Shards'}`);
    } else {
      soundManager.playAttackHit();
      showToast('error', data.error || 'Failed to claim.');
    }
  };

  const filteredEntries = Object.entries(ACHIEVEMENT_DEFINITIONS)
    .filter(([_, def]) => activeCategory === 'All' || def.category === activeCategory);

  // Stats
  const total = Object.keys(ACHIEVEMENT_DEFINITIONS).length;
  const unlocked = Object.entries(achievements).filter(([_, a]) => a.progress >= (ACHIEVEMENT_DEFINITIONS[_]?.target || 0)).length;
  const claimed = Object.entries(achievements).filter(([_, a]) => a.isClaimed).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-2 ${
          toastMsg.type === 'success' ? 'bg-emerald-900 border border-emerald-500 text-emerald-200' : 'bg-red-900 border border-red-500 text-red-200'
        }`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-[#1A1000] to-[#1A0D2E] border border-amber-500/20 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400" /> Achievements
            </h1>
            <p className="text-slate-400 text-sm mt-1">Complete challenges to earn Astra and Card Shards</p>
          </div>
          <div className="flex gap-6">
            {[
              { label: 'Unlocked', value: unlocked, color: 'text-amber-400' },
              { label: 'Claimed', value: claimed, color: 'text-emerald-400' },
              { label: 'Total', value: total, color: 'text-slate-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="relative z-10 mt-4">
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.round((claimed / total) * 100)}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">{Math.round((claimed / total) * 100)}% complete</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredEntries.map(([id, def]) => {
          const userAch = achievements[id] || { progress: 0, isClaimed: false };
          const isCompleted = userAch.progress >= def.target;
          const isClaimed = userAch.isClaimed;
          const progress = Math.min(def.target, userAch.progress);
          const pct = Math.min(100, Math.round((progress / def.target) * 100));

          return (
            <div
              key={id}
              className={`rounded-2xl border p-4 transition-all ${
                isClaimed
                  ? 'border-white/5 bg-white/2 opacity-60'
                  : isCompleted
                  ? 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                  : 'border-white/10 bg-[#0B0D1E]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl flex-shrink-0 ${!isCompleted && !isClaimed ? 'grayscale opacity-40' : ''}`}>
                  {def.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading font-black text-white text-sm truncate">{def.title}</span>
                    <div className={`text-xs font-bold flex-shrink-0 ${def.rewardType === 'astra' ? 'text-cyan-400' : 'text-indigo-400'}`}>
                      {def.rewardType === 'astra' ? '✨' : '🔷'} {def.rewardAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">{def.description}</div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 text-[10px]">{def.category}</span>
                      <span className={isCompleted ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {progress} / {def.target}
                      </span>
                    </div>
                    <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isClaimed ? 'bg-slate-500' : isCompleted ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-slate-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Button */}
              {isCompleted && !isClaimed && (
                <button
                  onClick={() => handleClaim(id)}
                  disabled={claimingId === id}
                  className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {claimingId === id ? 'Claiming...' : '🎁 Claim Reward'}
                </button>
              )}
              {isClaimed && (
                <div className="mt-2 text-center text-xs text-emerald-400 font-bold">✓ Reward Claimed</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

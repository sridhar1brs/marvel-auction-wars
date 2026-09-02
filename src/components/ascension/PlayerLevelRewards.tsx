import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { PLAYER_LEVEL_REWARDS, PlayerLevelReward } from '../../data/playerLevelRewards';
import { 
  Trophy, Award, Sparkles, Check, Lock, ArrowRight, 
  Coins, Package, Gem, Shield, Crown, Zap, Flame, Star
} from 'lucide-react';

export function PlayerLevelRewards() {
  const { user, claimPlayerLevelReward } = useAuth();
  const [claimingLevel, setClaimingLevel] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'UNCLAIMED' | 'MILESTONES'>('ALL');
  const [feedback, setFeedback] = useState<{ msg: string; success: boolean } | null>(null);

  const playerLevel = user?.level || 1;
  const claimedList = user?.claimedLevelRewards || [];
  const claimedSet = new Set(claimedList);

  const unclaimedUnlockedList = PLAYER_LEVEL_REWARDS.filter(
    r => r.level <= playerLevel && !claimedSet.has(r.level)
  );

  const filteredRewards = PLAYER_LEVEL_REWARDS.filter(reward => {
    if (filterMode === 'UNCLAIMED') {
      return reward.level <= playerLevel && !claimedSet.has(reward.level);
    }
    if (filterMode === 'MILESTONES') {
      return reward.isMilestone || reward.isMajorMilestone;
    }
    return true;
  });

  const handleClaim = async (reward: PlayerLevelReward) => {
    if (claimingLevel !== null) return;
    setClaimingLevel(reward.level);
    setFeedback(null);
    soundManager.playClick();

    try {
      const res = await claimPlayerLevelReward(reward.level);
      if (res.success) {
        soundManager.playVictoryFanfare();
        setFeedback({ msg: `🎉 Successfully claimed Level ${reward.level} Reward! (+✨ ${reward.astra.toLocaleString()} Astra)`, success: true });
      } else {
        soundManager.playAttackHit();
        setFeedback({ msg: res.error || 'Failed to claim level reward.', success: false });
      }
    } catch (err: any) {
      setFeedback({ msg: err?.message || 'Error claiming reward.', success: false });
    } finally {
      setClaimingLevel(null);
      setTimeout(() => setFeedback(null), 4500);
    }
  };

  const handleClaimAll = async () => {
    if (unclaimedUnlockedList.length === 0 || claimingLevel !== null) return;
    soundManager.playClick();

    let claimedCount = 0;
    for (const reward of unclaimedUnlockedList) {
      setClaimingLevel(reward.level);
      const result = await claimPlayerLevelReward(reward.level);
      if (!result.success) {
        setClaimingLevel(null);
        setFeedback({
          msg: result.error || `Failed to claim Level ${reward.level} reward.`,
          success: false,
        });
        setTimeout(() => setFeedback(null), 4500);
        return;
      }
      claimedCount += 1;
    }

    setClaimingLevel(null);
    soundManager.playVictoryFanfare();
    setFeedback({ msg: `🌟 All ${claimedCount} unlocked Level Rewards claimed!`, success: true });
    setTimeout(() => setFeedback(null), 4500);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#180A28] via-[#0E1535] to-[#14081E] border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-widest shadow-glow-gold">
              <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>COMMANDER PROGRESSION REWARDS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider">
              PLAYER LEVEL REWARDS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Level up your Commander account through battles, auctions, and dungeons to unlock high-yield Astra reserves, card shards, crate bundles, and milestone titles!
            </p>
          </div>

          {/* Commander Level Badge & Quick Claim */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-black/80 border-2 border-amber-500/60 shadow-glow-gold flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-heading font-black text-2xl shadow-lg">
                {playerLevel}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  COMMANDER LEVEL
                </span>
                <span className="text-2xl font-heading font-black text-white">
                  LEVEL {playerLevel}
                </span>
                <span className="text-[11px] font-mono text-slate-400 block">
                  {claimedList.length} / {PLAYER_LEVEL_REWARDS.length} Claimed
                </span>
              </div>
            </div>

            {unclaimedUnlockedList.length > 0 && (
              <button
                type="button"
                onClick={handleClaimAll}
                className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>CLAIM ALL ({unclaimedUnlockedList.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Feedback Notification */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-center text-xs sm:text-sm font-bold animate-fadeIn shadow-xl ${
          feedback.success 
            ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200' 
            : 'bg-red-950/90 border-red-400 text-red-200'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* 3. Filter Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setFilterMode('ALL'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filterMode === 'ALL'
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            All Levels ({PLAYER_LEVEL_REWARDS.length})
          </button>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setFilterMode('UNCLAIMED'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'UNCLAIMED'
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>Ready to Claim</span>
            {unclaimedUnlockedList.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-black rounded-full text-[10px] font-black">
                {unclaimedUnlockedList.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setFilterMode('MILESTONES'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filterMode === 'MILESTONES'
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            ⭐ Milestones Only
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Your Progress: <strong className="text-amber-400">Level {playerLevel}</strong>
        </div>
      </div>

      {/* 4. Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map(reward => {
          const isUnlocked = playerLevel >= reward.level;
          const isClaimed = claimedSet.has(reward.level);
          const isCurrentTarget = playerLevel + 1 === reward.level;
          const isProcessing = claimingLevel === reward.level;

          return (
            <div
              key={reward.level}
              className={`relative rounded-3xl p-5 border transition-all flex flex-col justify-between gap-4 overflow-hidden ${
                isClaimed
                  ? 'bg-[#080B14]/80 border-white/10 opacity-75'
                  : isUnlocked
                  ? reward.isMajorMilestone
                    ? 'bg-gradient-to-br from-[#241203] via-[#140A02] to-black border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                    : reward.isMilestone
                    ? 'bg-gradient-to-br from-[#1C0E2D] to-black border-2 border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                    : 'bg-gradient-to-br from-[#0B132B] to-black border border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-black/40 border-white/5 opacity-50'
              }`}
            >
              {/* Badge Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading font-black text-sm ${
                    isClaimed
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
                      : isUnlocked
                      ? 'bg-amber-500 text-black shadow-glow-gold'
                      : 'bg-white/10 text-slate-400'
                  }`}>
                    {reward.level}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                      PLAYER LEVEL {reward.level}
                    </span>
                    <h3 className="text-base font-heading font-black text-white leading-tight">
                      {reward.title}
                    </h3>
                  </div>
                </div>

                {/* Milestone / Badge Pin */}
                {reward.isMajorMilestone ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> MAJOR
                  </span>
                ) : reward.isMilestone ? (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-purple-400" /> MILESTONE
                  </span>
                ) : null}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed min-h-[32px]">
                {reward.description}
              </p>

              {/* Reward Items Pills */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                {reward.astra > 0 && (
                  <div className="p-2 rounded-xl bg-black/60 border border-amber-500/30 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Astra</span>
                      <span className="text-xs font-heading font-bold text-amber-300">
                        +✨ {reward.astra.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {reward.draftShards > 0 && (
                  <div className="p-2 rounded-xl bg-black/60 border border-cyan-500/30 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">{reward.shardCategory} shards</span>
                      <span className="text-xs font-heading font-bold text-cyan-300">
                        +🧩 {reward.draftShards}
                      </span>
                    </div>
                  </div>
                )}

                {reward.crates > 0 && (
                  <div className="p-2 rounded-xl bg-black/60 border border-purple-500/30 flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Crate</span>
                      <span className="text-xs font-heading font-bold text-purple-300">
                        {reward.crates}x {reward.crateType?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )}

                {reward.exclusiveTitle && (
                  <div className="p-2 rounded-xl bg-black/60 border border-amber-400/40 flex items-center gap-2 col-span-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Title Unlocked</span>
                      <span className="text-xs font-heading font-black text-amber-300">
                        "{reward.exclusiveTitle}"
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button / Status */}
              <div className="pt-2">
                {isClaimed ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>CLAIMED</span>
                  </div>
                ) : isUnlocked ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleClaim(reward)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>{isProcessing ? 'CLAIMING...' : `CLAIM LEVEL ${reward.level} REWARD`}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-black/50 border border-white/10 text-slate-400 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>UNLOCKS AT LEVEL {reward.level}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { 
  Sparkles, Check, Lock, ChevronRight, ChevronLeft, 
  Trophy, Gift, Award, Zap, Shield, Crown, Flame 
} from 'lucide-react';
import { BATTLE_PASS_LEVELS, BATTLE_PASS_REWARDS, getBattlePassXpInLevel, BATTLE_PASS_XP_PER_LEVEL, BattlePassRewardType } from '../../data/ascensionProgression';

export interface BattlePassTier {
  level: number;
  rewardType: BattlePassRewardType;
  rewardLabel: string;
  amount: number;
  icon: string;
  isMilestone: boolean;
  color: string;
  crateImage?: string;
}

export function generateBattlePassTiers(): BattlePassTier[] {
  return BATTLE_PASS_REWARDS.map(reward => ({
    level: reward.level,
    rewardType: reward.rewardType,
    rewardLabel: reward.label,
    amount: reward.amount,
    icon: reward.icon,
    isMilestone: reward.rewardType !== 'COINS',
    crateImage: reward.crateImage,
    color: reward.rewardType === 'MYTHIC_CRATE'
      ? 'from-amber-950 via-yellow-900 to-indigo-950 border-amber-400'
      : reward.rewardType === 'LEGENDARY_CRATE'
      ? 'from-amber-950 to-orange-950 border-amber-400'
      : reward.rewardType === 'EPIC_CRATE'
      ? 'from-purple-950 to-indigo-900 border-purple-400'
      : reward.rewardType === 'TOKEN_SHARD_CRATE'
      ? 'from-cyan-950 to-teal-900 border-cyan-400'
      : reward.rewardType === 'RARE_CRATE' || reward.rewardType === 'SHARD_CRATE'
      ? 'from-blue-950 to-slate-900 border-blue-400'
      : 'from-cyan-950 to-slate-900 border-cyan-500/30',
  }));
}

const ALL_PASS_TIERS = generateBattlePassTiers();

export function AscensionBattlePass() {
  const { user, claimBattlePassReward } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [claimingLevel, setClaimingLevel] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  const currentLevel = user?.battlePassLevel || 1;
  const currentXp = user?.battlePassXp || 0;
  const xpInLevel = getBattlePassXpInLevel(currentXp);
  const claimedSet = new Set(user?.battlePassClaimed || []);

  // Auto-scroll to near player's current level on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const targetScroll = Math.max(0, (currentLevel - 2) * 160);
      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [currentLevel]);

  // Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      soundManager.playClick();
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const jumpToLevel = (targetLvl: number) => {
    if (scrollContainerRef.current) {
      soundManager.playClick();
      scrollContainerRef.current.scrollTo({ left: Math.max(0, (targetLvl - 2) * 160), behavior: 'smooth' });
    }
  };

  const handleClaim = async (tier: BattlePassTier) => {
    if (!user) return;
    setClaimingLevel(tier.level);
    setClaimFeedback(null);

    const result = await claimBattlePassReward(tier.level);
    setClaimingLevel(null);

    if (result.success) {
      soundManager.playVictoryFanfare();
      setClaimFeedback(`🎉 Successfully claimed Level ${tier.level} reward! ${tier.rewardLabel}`);
      setTimeout(() => setClaimFeedback(null), 4000);
    } else {
      soundManager.playAttackHit();
      setClaimFeedback(result.error || 'Failed to claim reward.');
      setTimeout(() => setClaimFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#1C0A33] via-[#0E1738] to-[#120822] border-2 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>SEASON 1: COSMIC ASCENSION PASS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            LEVEL 1 → LEVEL 100 REWARD JOURNEY
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Gain Battle Pass XP through battles, auctions, and dungeons. Every fifth level grants a Random Shard Crate and every 25th level grants a Character Card Crate.
          </p>
        </div>

        {/* Level Status Badge & Jump Nav */}
        <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
          <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-400/50 shadow-glow-cyan text-right flex items-center gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                CURRENT LEVEL
              </span>
              <span className="text-2xl font-heading font-black text-white">
                LEVEL {currentLevel} / {BATTLE_PASS_LEVELS}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 font-heading font-black text-lg">
              {currentLevel}
            </div>
          </div>

          {/* Quick Travel Jump Buttons */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-black">
            <span className="text-[10px] text-slate-400">JUMP:</span>
            <button onClick={() => jumpToLevel(1)} className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer">1</button>
            <button onClick={() => jumpToLevel(currentLevel)} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/60 cursor-pointer">NOW</button>
            <button onClick={() => jumpToLevel(100)} className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer">100</button>
            <button onClick={() => jumpToLevel(100)} className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-purple-600 text-black border border-amber-300 cursor-pointer font-black">100</button>
          </div>
        </div>
      </div>

      {/* Claim Feedback Banner */}
      {claimFeedback && (
        <div className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-400 text-purple-200 text-xs font-bold text-center animate-fadeIn shadow-lg">
          {claimFeedback}
        </div>
      )}

      {/* Navigation Control Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
        <div className="flex-1">
          <span>← Drag or scroll horizontally to inspect all {BATTLE_PASS_LEVELS} levels →</span>
          <div className="mt-2 h-2 bg-black/60 rounded-full overflow-hidden border border-white/10 max-w-md">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${Math.min(100, (xpInLevel / BATTLE_PASS_XP_PER_LEVEL) * 100)}%` }} />
          </div>
          <span className="text-[10px] text-cyan-300">XP {xpInLevel.toLocaleString()} / {BATTLE_PASS_XP_PER_LEVEL.toLocaleString()} to next level</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScrollBy(-480)}
            className="p-2 rounded-xl bg-black/60 hover:bg-slate-800 border border-white/10 text-white cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScrollBy(480)}
            className="p-2 rounded-xl bg-black/60 hover:bg-slate-800 border border-white/10 text-white cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Battle Pass Track */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="overflow-x-auto no-scrollbar py-4 cursor-grab active:cursor-grabbing scroll-smooth"
      >
        <div className="flex items-stretch gap-3.5 min-w-max px-2">
          {ALL_PASS_TIERS.map(tier => {
            const isUnlocked = currentLevel >= tier.level;
            const isClaimed = claimedSet.has(tier.level);
            const isClaimable = isUnlocked && !isClaimed;
            const isCurrent = currentLevel === tier.level;

            return (
              <div
                key={tier.level}
                className={`w-40 sm:w-44 p-3.5 rounded-2xl border-2 flex flex-col justify-between transition-all select-none relative ${
                  isCurrent
                    ? 'ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-105'
                    : ''
                } ${
                  isClaimable
                    ? 'bg-gradient-to-b from-amber-950/80 to-purple-950/80 border-amber-400 shadow-glow-gold'
                    : isClaimed
                    ? 'bg-black/60 border-emerald-500/40 opacity-75'
                    : isUnlocked
                    ? `bg-gradient-to-b ${tier.color}`
                    : 'bg-black/40 border-white/5 opacity-50'
                }`}
              >
                {/* Level Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-heading font-black text-xs sm:text-sm text-white">
                    TIER {tier.level}
                  </span>
                  {tier.isMilestone && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-400 text-black font-mono">
                      MILESTONE
                    </span>
                  )}
                </div>

                {/* Reward Center Preview */}
                <div className="py-3 text-center space-y-1.5 flex flex-col items-center justify-center">
                  {tier.crateImage ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 relative flex items-center justify-center my-1 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                      <img
                        src={tier.crateImage}
                        alt={tier.rewardLabel}
                        className="w-full h-full object-contain filter hover:brightness-110 transition-transform duration-300 transform hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-4xl mx-auto">{tier.icon}</div>
                  )}
                  <div className="font-heading font-black text-xs sm:text-sm text-white leading-tight">
                    {tier.rewardLabel}
                  </div>
                </div>

                {/* Claim / Lock Action Button */}
                <div className="pt-2 border-t border-white/10">
                  {isClaimed ? (
                    <div className="py-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono font-black text-[10px] uppercase rounded-xl flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>CLAIMED</span>
                    </div>
                  ) : isClaimable ? (
                    <button
                      type="button"
                      disabled={claimingLevel === tier.level}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaim(tier);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-glow-gold transition-all animate-bounce cursor-pointer"
                    >
                      {claimingLevel === tier.level ? 'CLAIMING...' : 'CLAIM REWARD'}
                    </button>
                  ) : (
                    <div className="py-2 bg-black/60 border border-white/10 text-slate-500 font-mono font-bold text-[10px] uppercase rounded-xl flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>LVL {tier.level}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { 
  Sparkles, Check, Lock, ChevronRight, ChevronLeft, 
  Trophy, Gift, Award, Zap, Shield, Crown, Flame 
} from 'lucide-react';

export interface BattlePassTier {
  level: number;
  rewardType: 'COINS' | 'RELIC' | 'SKILL' | 'SHARDS' | 'CHARACTER' | 'ULTIMATE';
  rewardLabel: string;
  amount: number;
  icon: string;
  isMilestone: boolean;
  color: string;
}

export function generateBattlePassTiers(): BattlePassTier[] {
  const tiers: BattlePassTier[] = [];

  for (let lvl = 1; lvl <= 1000; lvl++) {
    const isMilestone = lvl === 100 || lvl === 250 || lvl === 500 || lvl === 750 || lvl === 1000;
    let rewardType: BattlePassTier['rewardType'] = 'COINS';
    let rewardLabel = '';
    let amount = 0;
    let icon = '✨';
    let color = 'from-cyan-950 to-slate-900 border-cyan-500/30';

    if (lvl === 1000) {
      rewardType = 'ULTIMATE';
      rewardLabel = '🌟 100,000 ASTRA & COSMIC GOD OMNIPOTENCE';
      amount = 100000;
      icon = '👑';
      color = 'from-amber-500 via-rose-600 to-purple-700 border-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.8)]';
    } else if (lvl === 750) {
      rewardType = 'CHARACTER';
      rewardLabel = '✨ 50,000 ASTRA & MYTHIC CRATE';
      amount = 50000;
      icon = '🦸‍♂️';
      color = 'from-purple-900 to-indigo-900 border-purple-400 shadow-glow-cosmic';
    } else if (lvl === 500) {
      rewardType = 'CHARACTER';
      rewardLabel = '✨ 25,000 ASTRA & CELESTIAL RELIC';
      amount = 25000;
      icon = '💎';
      color = 'from-amber-900 to-yellow-900 border-amber-400 shadow-glow-gold';
    } else if (lvl === 250) {
      rewardType = 'RELIC';
      rewardLabel = '✨ 10,000 ASTRA & TITAN ARTIFACT';
      amount = 10000;
      icon = '⚡';
      color = 'from-rose-900 to-pink-900 border-rose-400 shadow-glow-red';
    } else if (lvl === 100) {
      rewardType = 'SKILL';
      rewardLabel = '✨ 5,000 ASTRA & MASTER SKILL VAULT';
      amount = 5000;
      icon = '🔥';
      color = 'from-blue-900 to-cyan-900 border-cyan-400 shadow-glow-cyan';
    } else if (lvl % 50 === 0) {
      rewardType = 'SHARDS';
      rewardLabel = `+50 Hero Shards & ✨ ${(lvl * 50).toLocaleString()} Astra`;
      amount = lvl * 50;
      icon = '🧩';
      color = 'from-purple-950 to-slate-900 border-purple-400';
    } else if (lvl % 25 === 0) {
      rewardType = 'RELIC';
      rewardLabel = `Tactical Relic & ✨ ${(lvl * 25).toLocaleString()} Astra`;
      amount = lvl * 25;
      icon = '💎';
      color = 'from-cyan-950 to-slate-900 border-cyan-400';
    } else {
      amount = Math.min(1000, Math.floor(150 + (lvl * 1.5)));
      rewardLabel = `✨ ${amount.toLocaleString()} ASTRA`;
      icon = '✨';
    }

    tiers.push({
      level: lvl,
      rewardType,
      rewardLabel,
      amount,
      icon,
      isMilestone,
      color
    });
  }

  return tiers;
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

  const currentLevel = user?.level || 1;
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

    const result = await claimBattlePassReward(tier.level, tier.rewardType, tier.amount);
    setClaimingLevel(null);

    if (result.success) {
      soundManager.playVictoryFanfare();
      setClaimFeedback(`🎉 Successfully claimed Level ${tier.level} reward! (+${(tier.amount || 0).toLocaleString()} ASTRA)`);
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
            LEVEL 1 → LEVEL 1000 REWARD JOURNEY
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Gain XP in PvP and Dungeons to advance through all 1,000 cosmic levels. Earn up to <strong>750,000+ ASTRA</strong>, Relics, Skills, and the <strong>Level 1000 Ultimate Cosmic God jackpot</strong>!
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
                LEVEL {currentLevel}
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
            <button onClick={() => jumpToLevel(250)} className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer">250</button>
            <button onClick={() => jumpToLevel(500)} className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer">500</button>
            <button onClick={() => jumpToLevel(750)} className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer">750</button>
            <button onClick={() => jumpToLevel(1000)} className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-purple-600 text-black border border-amber-300 cursor-pointer font-black">1000</button>
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
        <span>← Drag or scroll horizontally to inspect 1,000 Levels →</span>
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
                <div className="py-3 text-center space-y-1.5">
                  <div className="text-3xl sm:text-4xl mx-auto">{tier.icon}</div>
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

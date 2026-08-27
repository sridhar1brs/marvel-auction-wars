import React, { useState } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { AscensionGiftingModal } from './AscensionGiftingModal';
import { 
  Sparkles, Swords, Trophy, Gift, Check, Calendar, 
  Flame, Crown, ArrowRight, Shield, Zap, Package, Award
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: 'HOME' | 'CHARACTERS' | 'SHOP' | 'RELICS' | 'SKILLS' | 'BATTLE' | 'INVENTORY' | 'BATTLE_PASS' | 'RANKED' | 'LEADERBOARDS') => void;
}

export function AscensionHome({ onNavigateTab }: Props) {
  const { user, claimDailyLogin } = useAuth();
  const [isClaimingLogin, setIsClaimingLogin] = useState(false);
  const [loginClaimToast, setLoginClaimToast] = useState<{ success: boolean; text: string } | null>(null);
  const [isGiftingOpen, setIsGiftingOpen] = useState(false);

  // Daily 7-Day rewards array in Astra
  const dailyRewards = [
    { day: 1, astra: 250, label: 'Day 1' },
    { day: 2, astra: 350, label: 'Day 2' },
    { day: 3, astra: 500, label: 'Day 3' },
    { day: 4, astra: 750, label: 'Day 4' },
    { day: 5, astra: 1000, label: 'Day 5' },
    { day: 6, astra: 1500, label: 'Day 6' },
    { day: 7, astra: 3000, label: '🌟 Grand Jackpot' }
  ];

  const currentStreak = user?.dailyLoginStreak || 0;
  const canClaimToday = user?.canClaimDailyLogin ?? true;

  // Spotlight character
  const spotlightHero = ALL_CHARACTERS.find(c => c.name === 'Iron Man' || c.grade === 'MYTHIC') || ALL_CHARACTERS[0];

  const handleClaimDaily = async () => {
    if (!user) {
      soundManager.playAttackHit();
      setLoginClaimToast({ success: false, text: 'Please sign in to claim daily Astra rewards.' });
      return;
    }

    if (!canClaimToday) {
      soundManager.playAttackHit();
      setLoginClaimToast({ success: false, text: "Today's Astra reward has already been claimed! Return tomorrow." });
      return;
    }

    setIsClaimingLogin(true);
    setLoginClaimToast(null);

    const res = await claimDailyLogin();
    setIsClaimingLogin(false);

    if (res.success) {
      soundManager.playVictoryFanfare();
      setLoginClaimToast({
        success: true,
        text: `🎉 Successfully claimed +✨ ${(res.astraAwarded || res.coinsAwarded || 250).toLocaleString()} ASTRA! (Streak: Day ${res.streak})`
      });
      setTimeout(() => setLoginClaimToast(null), 5000);
    } else {
      soundManager.playAttackHit();
      setLoginClaimToast({
        success: false,
        text: res.error || "Today's reward has already been claimed."
      });
      setTimeout(() => setLoginClaimToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* 1. HERO SPOTLIGHT & QUICK PLAY BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1C0A33] via-[#0D153A] to-[#120826] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Glow Nebula Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="space-y-3 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>SEASON 1: COSMIC ASCENSION IS LIVE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider leading-tight">
            FORGE YOUR MULTIVERSE LEGEND
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Recruit 350 Marvel Heroes, level them up from 1 to 50, conquer 1v1–5v5 Online Battles, unlock competitive Ranked at Level 10, advance through the <strong>1,000-Level Horizontal Battle Pass</strong>, and become an <strong>⚡ ASCENDER</strong>!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigateTab('BATTLE');
              }}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-glow-cyan flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
            >
              <Swords className="w-4 h-4" />
              <span>ONLINE BATTLE ARENA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigateTab('RANKED');
              }}
              className="py-3 px-6 rounded-2xl bg-black/60 hover:bg-black/90 border border-purple-500/50 text-purple-200 font-heading font-black text-xs uppercase tracking-wider shadow-glow-purple flex items-center gap-2 cursor-pointer transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>COMPETITIVE RANKED</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigateTab('SHOP');
              }}
              className="py-3 px-6 rounded-2xl bg-black/60 hover:bg-black/90 border border-amber-500/50 text-amber-300 font-heading font-black text-xs uppercase tracking-wider shadow-glow-gold flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>ASTRA SHOP</span>
            </button>
          </div>
        </div>

        {/* Hero Spotlight Display Card */}
        <div className="relative p-4 rounded-3xl bg-black/60 border-2 border-purple-500/50 shadow-glow-cosmic shrink-0 text-center space-y-2 z-10 group">
          <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-md bg-black">
            <CharacterPortrait character={spotlightHero} size="lg" className="w-full h-full object-cover" />
          </div>
          <div className="font-heading font-black text-base text-white uppercase">
            {spotlightHero.name}
          </div>
          <div className="inline-block px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-purple-500 text-black text-[10px] font-black uppercase font-mono">
            ★ {spotlightHero.grade} TIER SPOTLIGHT
          </div>
        </div>
      </div>

      {/* 2. DAILY ASTRA LOGIN REWARDS (7-DAY STREAK) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#0B0F22]/90 border border-cyan-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="font-heading font-black text-base sm:text-lg text-white uppercase tracking-wider">
              DAILY ASTRA LOGIN SUPPLY DROP (7-DAY CYCLE)
            </h2>
          </div>
          <div className="text-xs font-mono font-bold text-slate-300">
            Current Streak: <span className="text-amber-300 font-black">Day {currentStreak} of 7</span>
          </div>
        </div>

        {/* 7 Day Streak Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {dailyRewards.map((r, idx) => {
            const isCompleted = currentStreak > r.day || (currentStreak === r.day && !canClaimToday);
            const isToday = (canClaimToday && currentStreak + 1 === r.day) || (currentStreak === 0 && r.day === 1);

            return (
              <div
                key={r.day}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-gradient-to-b from-amber-950/80 to-purple-950/80 border-amber-400 shadow-glow-gold scale-105'
                    : isCompleted
                    ? 'bg-black/50 border-emerald-500/40 opacity-75'
                    : 'bg-black/30 border-white/5 opacity-50'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {r.label}
                </div>
                <div className="text-2xl my-1.5">{r.day === 7 ? '🌟' : '✨'}</div>
                <div className="text-xs font-heading font-black text-amber-300">
                  +{r.astra.toLocaleString()} ASTRA
                </div>

                <div className="mt-2 pt-1 border-t border-white/5 text-[9px] font-mono font-bold">
                  {isCompleted ? (
                    <span className="text-emerald-400 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> CLAIMED
                    </span>
                  ) : isToday ? (
                    <span className="text-amber-300 font-black animate-pulse">
                      READY TODAY!
                    </span>
                  ) : (
                    <span className="text-slate-500">LOCKED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily Claim Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {loginClaimToast ? (
            <div className={`p-3 rounded-xl text-xs font-bold w-full sm:w-auto ${
              loginClaimToast.success ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200' : 'bg-rose-950/80 border border-rose-500 text-rose-200'
            }`}>
              {loginClaimToast.text}
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              {canClaimToday
                ? 'Claim your daily Astra reward now to increase your consecutive login streak!'
                : '✅ You have claimed today’s Astra supply drop. Return tomorrow for the next tier!'}
            </div>
          )}

          <button
            type="button"
            disabled={!canClaimToday || isClaimingLogin}
            onClick={handleClaimDaily}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black shadow-glow-gold"
          >
            {isClaimingLogin ? 'CLAIMING...' : canClaimToday ? '✨ CLAIM TODAY (+ASTRA)' : '✓ CLAIMED TODAY'}
          </button>
        </div>
      </div>

      {/* 3. FOUR CORE ASCENSION HUBS NAVIGATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Relic Vault */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('RELICS');
          }}
          className="p-5 rounded-3xl bg-gradient-to-b from-[#161D3B] to-[#0A0E1F] border-2 border-blue-500/30 hover:border-blue-400 shadow-lg cursor-pointer transition-all hover:scale-105 group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-400/60 flex items-center justify-center text-2xl shadow-glow-blue">
            🛡️
          </div>
          <h3 className="font-heading font-black text-white text-base uppercase group-hover:text-blue-300 transition-colors">
            50 Relic Vault
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Arm your heroes with 50 distinct tactical artifacts, reality-warping Infinity Gauntlets, and healing serums.
          </p>
          <span className="text-[11px] font-mono font-bold text-blue-400 flex items-center gap-1 pt-1">
            OPEN RELIC VAULT →
          </span>
        </div>

        {/* Card 2: Skill Vault */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('SKILLS');
          }}
          className="p-5 rounded-3xl bg-gradient-to-b from-[#2B1B0E] to-[#120B05] border-2 border-yellow-500/30 hover:border-yellow-400 shadow-lg cursor-pointer transition-all hover:scale-105 group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-yellow-950/80 border border-yellow-400/60 flex items-center justify-center text-2xl shadow-glow-gold">
            ⚡
          </div>
          <h3 className="font-heading font-black text-white text-base uppercase group-hover:text-yellow-300 transition-colors">
            Signature Skills
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Master 5 unique character-specific combat abilities per hero. Skills unlock at character Levels 5, 10, 20, 30, 40!
          </p>
          <span className="text-[11px] font-mono font-bold text-yellow-400 flex items-center gap-1 pt-1">
            TRAIN SKILLS →
          </span>
        </div>

        {/* Card 3: 1000 Level Battle Pass */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('BATTLE_PASS');
          }}
          className="p-5 rounded-3xl bg-gradient-to-b from-[#280D2D] to-[#100412] border-2 border-purple-500/30 hover:border-purple-400 shadow-lg cursor-pointer transition-all hover:scale-105 group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-400/60 flex items-center justify-center text-2xl shadow-glow-cosmic">
            👑
          </div>
          <h3 className="font-heading font-black text-white text-base uppercase group-hover:text-purple-300 transition-colors">
            1,000 Battle Pass
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Progress horizontally through 1,000 tiers of Astra, Epic Heroes, and the Level 1000 Cosmic God jackpot!
          </p>
          <span className="text-[11px] font-mono font-bold text-purple-400 flex items-center gap-1 pt-1">
            VIEW BATTLE PASS →
          </span>
        </div>

        {/* Card 4: Top 50 Leaderboards */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('LEADERBOARDS');
          }}
          className="p-5 rounded-3xl bg-gradient-to-b from-[#1A1A10] to-[#0A0A04] border-2 border-amber-500/30 hover:border-amber-400 shadow-lg cursor-pointer transition-all hover:scale-105 group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/60 flex items-center justify-center text-2xl shadow-glow-gold">
            🏆
          </div>
          <h3 className="font-heading font-black text-white text-base uppercase group-hover:text-amber-300 transition-colors">
            Top 50 Leaderboards
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Compete across Ranked MMR, Career Wins, Level XP, and MVP accolades for global supremacy.
          </p>
          <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1 pt-1">
            VIEW RANKINGS →
          </span>
        </div>

      </div>

      {/* Multiverse Gifting Modal */}
      {isGiftingOpen && (
        <AscensionGiftingModal onClose={() => setIsGiftingOpen(false)} />
      )}

    </div>
  );
}

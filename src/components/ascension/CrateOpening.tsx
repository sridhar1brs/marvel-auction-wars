import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { Character } from '../../types/game';
import confetti from 'canvas-confetti';
import { 
  X, Package, Sparkles, Star, Zap, Gift, ChevronRight, Check, Shield, 
  Flame, Crown, FastForward, Award, Layers, RefreshCw
} from 'lucide-react';

export interface CrateInfo {
  level: number;
  type: 'ASTRA' | 'MYSTERY_CARD' | 'LEGENDARY' | 'SHARD_CRATE' | 'CHARACTER_CRATE' | 'RARE_CRATE' | 'EPIC_CRATE' | 'MYTHIC_CRATE' | 'TOKEN_SHARD_CRATE';
  canClaim: boolean;
  inventory?: boolean;
  id?: string;
}

interface Props {
  crates: CrateInfo[];
  onClose: () => void;
  onClaimed: () => void;
}

export const CRATE_CONFIG: Record<string, {
  label: string;
  icon: string;
  image: string;
  color: string;
  glow: string;
  borderColor: string;
  bgColor: string;
  accentColor: string;
  description: string;
  rarityTitle: string;
}> = {
  MYTHIC_CRATE: {
    label: 'Mythic Cosmic Relic',
    icon: '🌌',
    image: '/images/crates/mythic_crate.png',
    color: 'from-amber-300 via-rose-500 to-purple-600',
    glow: 'shadow-[0_0_80px_rgba(236,72,153,0.9)]',
    borderColor: 'border-rose-400',
    bgColor: 'bg-rose-950/90',
    accentColor: '#ec4899',
    description: 'Supreme Cosmic Relic containing Multiverse Mythic Gods & Titans',
    rarityTitle: 'MYTHIC COSMIC',
  },
  LEGENDARY: {
    label: '⚡ Legendary Relic Crate',
    icon: '👑',
    image: '/images/crates/legendary_crate.png',
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    glow: 'shadow-[0_0_80px_rgba(245,158,11,0.9)]',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-950/90',
    accentColor: '#f59e0b',
    description: 'Contains high-tier Mythic / Grade-A Heroes & massive Astra',
    rarityTitle: 'LEGENDARY TIER',
  },
  LEGENDARY_CRATE: {
    label: '⚡ Legendary Relic Crate',
    icon: '👑',
    image: '/images/crates/legendary_crate.png',
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    glow: 'shadow-[0_0_80px_rgba(245,158,11,0.9)]',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-950/90',
    accentColor: '#f59e0b',
    description: 'Contains high-tier Mythic / Grade-A Heroes & massive Astra',
    rarityTitle: 'LEGENDARY TIER',
  },
  EPIC_CRATE: {
    label: 'Epic Vault Container',
    icon: '💎',
    image: '/images/crates/epic_crate.png',
    color: 'from-purple-500 via-fuchsia-500 to-indigo-600',
    glow: 'shadow-[0_0_70px_rgba(168,85,247,0.8)]',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-950/90',
    accentColor: '#a855f7',
    description: 'Grade-A Champions & Rare Token Shards',
    rarityTitle: 'EPIC VAULT',
  },
  RARE_CRATE: {
    label: 'Rare Matrix Crate',
    icon: '📦',
    image: '/images/crates/rare_crate.png',
    color: 'from-blue-500 via-cyan-500 to-indigo-600',
    glow: 'shadow-[0_0_60px_rgba(59,130,246,0.8)]',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-950/90',
    accentColor: '#3b82f6',
    description: 'Draft Shards, Grade-B Heroes, and Astra Crystals',
    rarityTitle: 'RARE MATRIX',
  },
  CHARACTER_CRATE: {
    label: 'Hero Recruitment Crate',
    icon: '🃏',
    image: '/images/crates/epic_crate.png',
    color: 'from-purple-500 via-indigo-600 to-blue-700',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.8)]',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-950/90',
    accentColor: '#8b5cf6',
    description: 'Recruit 1 guaranteed Marvel Hero Card into your collection',
    rarityTitle: 'HERO RECRUITMENT',
  },
  SHARD_CRATE: {
    label: 'Shard Chamber Crate',
    icon: '💠',
    image: '/images/crates/shard_crate.png',
    color: 'from-cyan-400 via-teal-500 to-blue-600',
    glow: 'shadow-[0_0_60px_rgba(6,182,212,0.8)]',
    borderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-950/90',
    accentColor: '#06b6d4',
    description: 'Draft Shards, Token Shards & Astra Energy',
    rarityTitle: 'SHARD CHAMBER',
  },
  TOKEN_SHARD_CRATE: {
    label: 'Token Shard Crate',
    icon: '⚡',
    image: '/images/crates/shard_crate.png',
    color: 'from-teal-400 via-emerald-500 to-cyan-600',
    glow: 'shadow-[0_0_60px_rgba(20,184,166,0.8)]',
    borderColor: 'border-teal-400',
    bgColor: 'bg-teal-950/90',
    accentColor: '#14b8a6',
    description: 'Contains Token Shards for the Character Token Forge',
    rarityTitle: 'TOKEN FORGE',
  },
  MYSTERY_CARD: {
    label: 'Mystery Card Crate',
    icon: '🃏',
    image: '/images/crates/epic_crate.png',
    color: 'from-purple-500 to-indigo-600',
    glow: 'shadow-[0_0_50px_rgba(139,92,246,0.7)]',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-950/80',
    accentColor: '#8b5cf6',
    description: 'Contains a random character card',
    rarityTitle: 'MYSTERY REVEAL',
  },
  ASTRA: {
    label: 'Astra Crystal Crate',
    icon: '✨',
    image: '/images/crates/rare_crate.png',
    color: 'from-cyan-500 to-blue-600',
    glow: 'shadow-[0_0_50px_rgba(6,182,212,0.7)]',
    borderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-950/80',
    accentColor: '#06b6d4',
    description: 'Contains Astra Coins, Card Shards, and XP',
    rarityTitle: 'ASTRA VAULT',
  },
};

export function CrateOpening({ crates, onClose, onClaimed }: Props) {
  const { user, claimLevelCrate, openCrate, openAllCrates } = useAuth();
  const [selectedCrate, setSelectedCrate] = useState<CrateInfo | null>(null);
  const [phase, setPhase] = useState<'select' | 'opening' | 'reveal' | 'open_all_results'>('select');
  const [animStage, setAnimStage] = useState<'charging' | 'tremor' | 'burst' | 'emerge'>('charging');
  const [progress, setProgress] = useState(0);
  const [singleResult, setSingleResult] = useState<any>(null);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [isOpening, setIsOpening] = useState(false);

  const animTimerRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const claimable = crates.filter(c => c.canClaim);
  const upcoming = crates.filter(c => !c.canClaim);

  // Group inventory counts
  const shardCrateCount = user?.crateInventory?.shard || 0;
  const characterCrateCount = user?.crateInventory?.character || 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    };
  }, []);

  const triggerConfetti = (rarity?: string) => {
    try {
      const isMythic = rarity === 'MYTHIC' || rarity === 'MYTHIC_CRATE';
      confetti({
        particleCount: isMythic ? 120 : 70,
        spread: isMythic ? 100 : 70,
        origin: { y: 0.6 },
        colors: isMythic 
          ? ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ffffff']
          : ['#3b82f6', '#06b6d4', '#a855f7', '#f59e0b'],
      });
    } catch {
      // Canvas confetti fallback
    }
  };

  const handleOpenSingle = async (crate: CrateInfo) => {
    if (!crate.canClaim || isOpening) return;
    setSelectedCrate(crate);
    setPhase('opening');
    setAnimStage('charging');
    setProgress(0);
    setIsOpening(true);
    soundManager.playClick();
    soundManager.playAbilityTrigger();

    const startTime = Date.now();
    const duration = 3600; // 3.6s cinematic build-up

    animTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (pct < 35) {
        setAnimStage('charging');
      } else if (pct < 70) {
        setAnimStage('tremor');
      } else if (pct < 90) {
        setAnimStage('burst');
      } else {
        setAnimStage('emerge');
      }
    }, 30);

    openTimeoutRef.current = setTimeout(async () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
      
      const crateTypeArg = crate.type;
      const data = crate.inventory
        ? await openCrate(crateTypeArg)
        : await claimLevelCrate(crate.level);

      setSingleResult(data);
      setIsOpening(false);
      setPhase('reveal');

      if (data.success) {
        soundManager.playVictoryFanfare();
        triggerConfetti(crate.type);
        onClaimed();
      } else {
        soundManager.playAttackHit();
      }
    }, duration);
  };

  const handleSkipAnimation = async () => {
    if (!selectedCrate || !isOpening) return;
    if (animTimerRef.current) clearInterval(animTimerRef.current);
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);

    const crateTypeArg = selectedCrate.type;
    const data = selectedCrate.inventory
      ? await openCrate(crateTypeArg)
      : await claimLevelCrate(selectedCrate.level);

    setSingleResult(data);
    setIsOpening(false);
    setPhase('reveal');

    if (data.success) {
      soundManager.playVictoryFanfare();
      triggerConfetti(selectedCrate.type);
      onClaimed();
    }
  };

  const handleOpenAll = async (crateType: string) => {
    if (isOpening) return;
    setIsOpening(true);
    soundManager.playClick();

    const res = await openAllCrates(crateType);
    setIsOpening(false);

    if (res.success) {
      setBatchResult(res);
      setPhase('open_all_results');
      soundManager.playVictoryFanfare();
      triggerConfetti('MYTHIC');
      onClaimed();
    } else {
      alert(res.error || 'Failed to open crates in batch.');
    }
  };

  const handleReset = () => {
    setPhase('select');
    setSelectedCrate(null);
    setSingleResult(null);
    setBatchResult(null);
    setProgress(0);
    setIsOpening(false);
  };

  const cfg = selectedCrate ? (CRATE_CONFIG[selectedCrate.type] || CRATE_CONFIG.SHARD_CRATE) : null;

  return (
    <div className="fixed inset-0 z-[200] w-screen h-screen overflow-y-auto bg-[#030712] text-white flex flex-col no-scrollbar select-none">
      {/* Dynamic Cosmic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-5 border-b border-white/10 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-black shadow-glow-cyan">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-black tracking-wider uppercase bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Crate Vault
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              MULTIVERSE REWARD CHAMBER • TIER UNLOCKS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Inventory Count Badges */}
          <div className="hidden sm:flex items-center gap-3 bg-black/50 border border-white/10 px-4 py-2 rounded-2xl font-mono text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span>💠 Shard Crates:</span>
              <span className="text-white font-black">{shardCrateCount}</span>
            </div>
            <div className="w-[1px] h-3 bg-white/20" />
            <div className="flex items-center gap-1.5 text-purple-400 font-bold">
              <span>🃏 Hero Crates:</span>
              <span className="text-white font-black">{characterCrateCount}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            title="Close Crate Chamber"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto p-4 sm:p-8">
        
        {/* ========================================================================= */}
        {/* 1. SELECT CRATE SCREEN                                                    */}
        {/* ========================================================================= */}
        {phase === 'select' && (
          <div className="space-y-8 animate-fadeIn py-4">
            
            {/* Inventory Crates Section with OPEN ALL */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base sm:text-lg font-heading font-black uppercase tracking-wider text-white">
                    Inventory Crates Available
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {claimable.filter(c => c.inventory).length} Total Ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shard Crates Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-900/90 to-black border border-cyan-500/40 shadow-glow-cyan flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 p-2 relative flex items-center justify-center shrink-0">
                      <img src="/images/crates/shard_crate.png" alt="Shard Crate" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        CURRENCY & CRAFTING
                      </div>
                      <div className="text-lg font-heading font-black text-white">
                        Shard Chamber Crates
                      </div>
                      <div className="text-xs text-slate-300">
                        Contains Draft Shards, Token Forge Shards, and Astra Coins.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="text-sm font-mono font-bold text-cyan-300">
                      Owned: <span className="text-white text-lg font-black">{shardCrateCount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={shardCrateCount < 1}
                        onClick={() => handleOpenSingle({ level: 0, type: 'SHARD_CRATE', canClaim: true, inventory: true })}
                        className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        Open 1
                      </button>
                      <button
                        disabled={shardCrateCount < 1}
                        onClick={() => handleOpenAll('SHARD_CRATE')}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 text-black font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-glow-amber"
                      >
                        Open All ({shardCrateCount})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Character Crates Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-black border border-purple-500/40 shadow-glow-purple flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-purple-950/90 border border-purple-400/50 p-2 relative flex items-center justify-center shrink-0">
                      <img src="/images/crates/epic_crate.png" alt="Character Crate" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                        HERO RECRUITMENT
                      </div>
                      <div className="text-lg font-heading font-black text-white">
                        Character Card Crates
                      </div>
                      <div className="text-xs text-slate-300">
                        Unlocks 1 guaranteed Marvel Hero Card or +10 duplicate shards.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="text-sm font-mono font-bold text-purple-300">
                      Owned: <span className="text-white text-lg font-black">{characterCrateCount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={characterCrateCount < 1}
                        onClick={() => handleOpenSingle({ level: 0, type: 'CHARACTER_CRATE', canClaim: true, inventory: true })}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        Open 1
                      </button>
                      <button
                        disabled={characterCrateCount < 1}
                        onClick={() => handleOpenAll('CHARACTER_CRATE')}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 text-black font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-glow-amber"
                      >
                        Open All ({characterCrateCount})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progression Milestones */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-base sm:text-lg font-heading font-black uppercase tracking-wider text-white">
                    Commander Level Milestones
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Your Level: {user?.level || 1}
                </span>
              </div>

              {/* Ready to Claim Level Crates */}
              {claimable.filter(c => !c.inventory).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {claimable.filter(c => !c.inventory).map(crate => {
                    const c = CRATE_CONFIG[crate.type] || CRATE_CONFIG.SHARD_CRATE;
                    return (
                      <button
                        key={`${crate.type}-${crate.level}`}
                        onClick={() => handleOpenSingle(crate)}
                        className={`p-5 rounded-3xl border ${c.borderColor} ${c.bgColor} ${c.glow} hover:scale-[1.03] active:scale-95 transition-all text-left flex items-center gap-4 cursor-pointer group`}
                      >
                        <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                          <img
                            src={c.image}
                            alt={c.label}
                            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-black text-amber-400 uppercase font-mono">
                            LEVEL {crate.level} REWARD
                          </div>
                          <div className="font-heading font-black text-white text-base truncate">
                            {c.label}
                          </div>
                          <div className="text-xs text-slate-300 truncate mt-0.5">
                            {c.description}
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                  <div className="text-sm font-bold text-slate-300">All available level milestone crates claimed!</div>
                  <div className="text-xs text-slate-500 font-mono">Level up by playing Ranked Battles and Dungeons to unlock more milestone vaults.</div>
                </div>
              )}

              {/* Upcoming Milestones Preview */}
              {upcoming.length > 0 && (
                <div className="space-y-3 pt-3">
                  <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-widest">
                    Next Milestone Crates
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {upcoming.slice(0, 6).map(crate => {
                      const c = CRATE_CONFIG[crate.type] || CRATE_CONFIG.SHARD_CRATE;
                      return (
                        <div
                          key={`up-${crate.type}-${crate.level}`}
                          className="p-3.5 rounded-2xl border border-white/5 bg-white/5 opacity-60 text-center flex flex-col items-center justify-center gap-1"
                        >
                          <div className="w-12 h-12 mb-1">
                            <img src={c.image} alt={c.label} className="w-full h-full object-contain filter grayscale" />
                          </div>
                          <div className="text-xs text-amber-400 font-mono font-bold">LVL {crate.level}</div>
                          <div className="text-[11px] text-slate-300 font-bold truncate w-full">{c.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. FULL-SCREEN 3D CINEMATIC CRATE OPENING                                  */}
        {/* ========================================================================= */}
        {phase === 'opening' && cfg && selectedCrate && (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12 space-y-8 select-none">
            
            {/* 3D Scene Viewport */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center" style={{ perspective: '1200px' }}>
              
              {/* Radial Energy Vortex Glow */}
              <div 
                className="absolute inset-0 rounded-full blur-[90px] pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle, ${cfg.accentColor} 0%, rgba(139,92,246,0.5) 50%, transparent 80%)`,
                  opacity: 0.4 + (progress / 120),
                  transform: `scale(${1 + progress / 150})`,
                }}
              />

              {/* Energy Ring Shockwaves */}
              {progress > 50 && (
                <>
                  <div className="absolute w-[120%] h-[120%] rounded-full border-2 border-cyan-400 animate-ping opacity-40 pointer-events-none" />
                  <div className="absolute w-[140%] h-[140%] rounded-full border border-amber-300 animate-pulse opacity-30 pointer-events-none" />
                </>
              )}

              {/* 3D Physical Crate Model */}
              <div 
                className="relative w-64 h-64 sm:w-80 sm:h-80 transition-transform duration-75 flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `
                    rotateY(${progress * 4.5}deg) 
                    rotateX(${Math.sin(progress / 8) * 15}deg) 
                    scale(${1 + progress / 350})
                    translateY(${animStage === 'tremor' ? (Math.random() - 0.5) * 14 : 0}px)
                    translateX(${animStage === 'tremor' ? (Math.random() - 0.5) * 14 : 0}px)
                  `,
                }}
              >
                {/* Lower Crate Base */}
                <img
                  src={cfg.image}
                  alt={cfg.label}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
                />

                {/* 3D Burst Energy Rays shooting upwards */}
                {progress > 75 && (
                  <div className="absolute -top-16 inset-x-0 flex justify-center pointer-events-none">
                    <div 
                      className="w-32 h-64 bg-gradient-to-t from-white via-cyan-300 to-transparent blur-md opacity-80 animate-pulse"
                      style={{ transform: 'rotateX(-30deg)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cinematic Stage Title & Progress */}
            <div className="text-center space-y-3 max-w-lg">
              <div className={`text-2xl sm:text-4xl font-heading font-black bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent uppercase tracking-widest`}>
                {cfg.label}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-slate-200 font-mono text-sm font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>
                  {animStage === 'charging' && 'Channeling Cosmic Energy Core...'}
                  {animStage === 'tremor' && 'Breaking Quantum Relic Seals...'}
                  {animStage === 'burst' && 'BURSTING OPEN CHAMBER...'}
                  {animStage === 'emerge' && 'REVEALING LEGENDARY SPOILS...'}
                </span>
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>

              {/* Glowing Charge Progress Bar */}
              <div className="w-80 sm:w-96 mx-auto h-3 bg-black/80 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 transition-all duration-75 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.9)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Fast Skip Option */}
              <button
                onClick={handleSkipAnimation}
                className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 mx-auto transition-all cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                <span>Skip Animation</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. FULL-SCREEN SINGLE REVEAL PHASE                                         */}
        {/* ========================================================================= */}
        {phase === 'reveal' && singleResult && cfg && selectedCrate && (
          <div className="flex flex-col items-center justify-center py-6 space-y-6 animate-fadeIn max-w-2xl mx-auto w-full">
            {singleResult.success ? (
              <>
                <div className="text-center space-y-1">
                  <div className="text-xs font-mono font-black text-amber-400 tracking-widest uppercase">
                    {cfg.rarityTitle} ACQUISITION
                  </div>
                  <h2 className={`text-3xl sm:text-5xl font-heading font-black bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent uppercase`}>
                    {singleResult.isDuplicate ? 'Duplicate Converted' : 'Reward Unlocked!'}
                  </h2>
                </div>

                {/* Main Reward Card Showcase */}
                <div className="w-full space-y-4">
                  {singleResult.reward?.character && (
                    <div className="p-6 rounded-3xl bg-gradient-to-b from-white/15 to-black/80 border border-white/25 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-36 h-36 shrink-0 relative drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]">
                        <CharacterPortrait character={singleResult.reward.character} size="xl" />
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500 text-black font-black text-xs font-mono">
                          {singleResult.reward.character.grade} GRADE HERO
                        </div>
                        <div className="text-2xl sm:text-3xl font-heading font-black text-white">
                          {singleResult.reward.character.name}
                        </div>
                        <div className="text-xs text-slate-300 font-semibold">
                          {singleResult.reward.character.powers || singleResult.reward.character.description}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold">
                            ⚔️ Combat: {singleResult.reward.character.stats?.combat || 80}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                            ⚡ Energy: {singleResult.reward.character.stats?.energy || 80}
                          </span>
                        </div>
                        {singleResult.isDuplicate && (
                          <div className="text-amber-400 text-sm font-black font-mono pt-1">
                            +{singleResult.cardShardsAwarded || 10} 🔷 Shards Credited to Forge
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {singleResult.reward?.category && (
                    <div className="p-5 rounded-2xl bg-cyan-950/70 border border-cyan-400/50 shadow-glow-cyan flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-900/80 flex items-center justify-center text-2xl shrink-0">
                        💠
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-mono text-cyan-300 font-bold uppercase">Token Shards</div>
                        <div className="text-xl font-heading font-black text-white">
                          +{singleResult.reward.amount} {singleResult.reward.category} Category Shards
                        </div>
                      </div>
                    </div>
                  )}

                  {singleResult.reward?.astraAwarded && (
                    <div className="p-5 rounded-2xl bg-amber-950/70 border border-amber-400/50 shadow-glow-amber flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-900/80 flex items-center justify-center text-2xl shrink-0">
                        ✨
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-mono text-amber-300 font-bold uppercase">Astra Energy Currency</div>
                        <div className="text-xl font-heading font-black text-white">
                          +{singleResult.reward.astraAwarded.toLocaleString()} Astra Coins
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex gap-4 w-full pt-4">
                  {claimable.length > 1 && (
                    <button
                      onClick={handleReset}
                      className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-heading font-black text-sm uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Open Another
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className={`flex-1 py-4 rounded-2xl bg-gradient-to-r ${cfg.color} text-black font-heading font-black text-sm uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-2xl`}
                  >
                    Collect & Continue
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="text-5xl">⚠️</div>
                <div className="text-xl font-heading font-black text-red-400">{singleResult.error || 'Failed to open crate.'}</div>
                <button onClick={handleReset} className="px-8 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer">
                  Back to Crate Chamber
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. FULL-SCREEN BATCH "OPEN ALL" RESULTS VAULT                              */}
        {/* ========================================================================= */}
        {phase === 'open_all_results' && batchResult && (
          <div className="space-y-6 animate-fadeIn py-4 max-w-5xl mx-auto w-full">
            <div className="text-center space-y-2">
              <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs font-mono uppercase tracking-widest shadow-glow-amber">
                BATCH VAULT EXTRACTION COMPLETED
              </div>
              <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider">
                Extracted {batchResult.countOpened} Crates
              </h2>
            </div>

            {/* Aggregated Loot Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(batchResult.summary?.categoryShards || {}).map(([cat, amount]: [string, any]) => {
                if (!amount) return null;
                return (
                  <div key={cat} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center">
                    <div className="text-xs font-mono font-bold text-cyan-400">{cat} Shards</div>
                    <div className="text-2xl font-heading font-black text-white">+{amount}</div>
                  </div>
                );
              })}
            </div>

            {/* Unlocked Characters Grid */}
            {batchResult.summary?.newCharacters?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-heading font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Star className="w-4 h-4" /> New Heroes Unlocked ({batchResult.summary.newCharacters.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {batchResult.summary.newCharacters.map((hero: Character) => (
                    <div key={hero.id} className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3">
                      <CharacterPortrait character={hero} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="font-heading font-black text-white text-sm truncate">{hero.name}</div>
                        <div className="text-xs font-mono text-emerald-300 font-bold">{hero.grade} Grade</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicates Converted Grid */}
            {batchResult.summary?.duplicateCharacters?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-heading font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Duplicates Converted to Shards ({batchResult.summary.duplicateCharacters.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                  {batchResult.summary.duplicateCharacters.map((dup: any, idx: number) => (
                    <div key={`${dup.character.id}-${idx}`} className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-2.5">
                      <CharacterPortrait character={dup.character} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="font-heading font-bold text-white text-xs truncate">{dup.character.name}</div>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">+{dup.shardsAwarded} 🔷 Shards</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bottom */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-heading font-black text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                Back to Vault
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-black text-sm uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-glow-cyan"
              >
                Collect All Rewards
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

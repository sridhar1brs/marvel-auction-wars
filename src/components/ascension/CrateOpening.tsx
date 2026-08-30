import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { X, Package, Sparkles, Star, Zap, Gift, ChevronRight, Check, Shield } from 'lucide-react';

interface CrateInfo {
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

const CRATE_CONFIG: Record<string, {
  label: string;
  icon: string;
  image: string;
  color: string;
  glow: string;
  borderColor: string;
  bgColor: string;
  description: string;
}> = {
  RARE_CRATE: {
    label: 'Rare Crate',
    icon: '📦',
    image: '/images/crates/rare_crate.png',
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-[0_0_50px_rgba(59,130,246,0.6)]',
    borderColor: 'border-blue-400/80',
    bgColor: 'bg-blue-950/90',
    description: 'Rare Draft Shards, Card Shards, and Astra',
  },
  EPIC_CRATE: {
    label: 'Epic Container Crate',
    icon: '💎',
    image: '/images/crates/epic_crate.png',
    color: 'from-purple-500 to-pink-600',
    glow: 'shadow-[0_0_50px_rgba(168,85,247,0.7)]',
    borderColor: 'border-purple-400/80',
    bgColor: 'bg-purple-950/90',
    description: 'Epic Draft Shards & high-grade Heroes',
  },
  LEGENDARY: {
    label: '⚡ Legendary Crate',
    icon: '👑',
    image: '/images/crates/legendary_crate.png',
    color: 'from-amber-400 to-yellow-500',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.8)]',
    borderColor: 'border-amber-400/80',
    bgColor: 'bg-amber-950/90',
    description: 'Contains MYTHIC/Epic character + massive Astra',
  },
  LEGENDARY_CRATE: {
    label: '⚡ Legendary Crate',
    icon: '👑',
    image: '/images/crates/legendary_crate.png',
    color: 'from-amber-400 to-yellow-500',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.8)]',
    borderColor: 'border-amber-400/80',
    bgColor: 'bg-amber-950/90',
    description: 'Contains MYTHIC/Epic character + massive Astra',
  },
  MYTHIC_CRATE: {
    label: 'Mythic Cosmic Relic',
    icon: '🌌',
    image: '/images/crates/mythic_crate.png',
    color: 'from-amber-300 via-rose-500 to-purple-600',
    glow: 'shadow-[0_0_70px_rgba(236,72,153,0.8)]',
    borderColor: 'border-rose-400/90',
    bgColor: 'bg-rose-950/90',
    description: 'Supreme Cosmic Relic with guaranteed top-tier rewards',
  },
  SHARD_CRATE: {
    label: 'Shard Chamber Crate',
    icon: '📦',
    image: '/images/crates/shard_crate.png',
    color: 'from-cyan-400 to-blue-600',
    glow: 'shadow-[0_0_50px_rgba(6,182,212,0.6)]',
    borderColor: 'border-cyan-400/80',
    bgColor: 'bg-cyan-950/90',
    description: 'Contains random Draft Shards & Astra Crystals',
  },
  TOKEN_SHARD_CRATE: {
    label: 'Token Shard Crate',
    icon: '⚡',
    image: '/images/crates/shard_crate.png',
    color: 'from-teal-400 to-emerald-600',
    glow: 'shadow-[0_0_50px_rgba(20,184,166,0.6)]',
    borderColor: 'border-teal-400/80',
    bgColor: 'bg-teal-950/90',
    description: 'Contains Token Shards for Token Forge',
  },
  CHARACTER_CRATE: {
    label: 'Character Card Crate',
    icon: '🃏',
    image: '/images/crates/epic_crate.png',
    color: 'from-purple-500 to-indigo-600',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]',
    borderColor: 'border-purple-400/60',
    bgColor: 'bg-purple-950/80',
    description: 'Contains one random character card',
  },
  MYSTERY_CARD: {
    label: 'Mystery Card Crate',
    icon: '🃏',
    image: '/images/crates/epic_crate.png',
    color: 'from-purple-500 to-indigo-600',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]',
    borderColor: 'border-purple-400/60',
    bgColor: 'bg-purple-950/80',
    description: 'Contains a random character card',
  },
  ASTRA: {
    label: 'Astra Crate',
    icon: '✨',
    image: '/images/crates/rare_crate.png',
    color: 'from-cyan-500 to-blue-600',
    glow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
    borderColor: 'border-cyan-400/60',
    bgColor: 'bg-cyan-950/80',
    description: 'Contains Astra, Card Shards, and XP',
  },
};

export function CrateOpening({ crates, onClose, onClaimed }: Props) {
  const { claimLevelCrate, openCrate } = useAuth();
  const [selectedCrate, setSelectedCrate] = useState<CrateInfo | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [phase, setPhase] = useState<'select' | 'opening' | 'reveal'>('select');
  const [animProgress, setAnimProgress] = useState(0);

  const claimable = crates.filter(c => c.canClaim);
  const upcoming = crates.filter(c => !c.canClaim);

  const handleOpen = async (crate: CrateInfo) => {
    if (!crate.canClaim || isOpening) return;
    setSelectedCrate(crate);
    setPhase('opening');
    setIsOpening(true);
    setAnimProgress(0);
    soundManager.playClick();

    // 3D cinematic opening timer
    const interval = setInterval(() => {
      setAnimProgress(p => Math.min(100, p + 5));
    }, 100);

    setTimeout(async () => {
      clearInterval(interval);
      const crateTypeArg = crate.type;
      const data = crate.inventory
        ? await openCrate(crateTypeArg as any)
        : await claimLevelCrate(crate.level);

      setResult(data);
      setIsOpening(false);
      setPhase('reveal');
      if (data.success) {
        soundManager.playVictoryFanfare();
        onClaimed();
      } else {
        soundManager.playAttackHit();
      }
    }, 2200);
  };

  const handleReset = () => {
    setPhase('select');
    setSelectedCrate(null);
    setResult(null);
    setAnimProgress(0);
  };

  const cfg = selectedCrate ? (CRATE_CONFIG[selectedCrate.type] || CRATE_CONFIG.SHARD_CRATE) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-2xl bg-[#07091A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#0D0F24] to-[#0A0C20]">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">Crate Chamber</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          {phase === 'select' && (
            <>
              {/* Claimable Crates */}
              {claimable.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-heading font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <Gift className="w-4 h-4" /> Ready to Open ({claimable.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {claimable.map(crate => {
                      const c = CRATE_CONFIG[crate.type] || CRATE_CONFIG.SHARD_CRATE;
                      return (
                        <button
                          key={`${crate.type}-${crate.level}`}
                          onClick={() => handleOpen(crate)}
                          className={`p-4 rounded-2xl border ${c.borderColor} ${c.bgColor} ${c.glow} hover:scale-[1.02] active:scale-95 transition-all text-left flex items-center gap-4 cursor-pointer group`}
                        >
                          <div className="w-14 h-14 shrink-0 relative flex items-center justify-center">
                            <img
                              src={c.image}
                              alt={c.label}
                              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-black text-amber-400 uppercase font-mono">
                              {crate.inventory ? 'INVENTORY' : `LEVEL ${crate.level} REWARD`}
                            </div>
                            <div className="font-heading font-black text-white text-base truncate">
                              {c.label}
                            </div>
                            <div className="text-xs text-slate-300 truncate mt-0.5">
                              {c.description}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming Crates */}
              {upcoming.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-heading font-bold text-slate-400 uppercase tracking-widest">
                    Upcoming Level Milestones
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {upcoming.slice(0, 8).map(crate => {
                      const c = CRATE_CONFIG[crate.type] || CRATE_CONFIG.SHARD_CRATE;
                      return (
                        <div key={`up-${crate.type}-${crate.level}`}
                          className="p-3 rounded-xl border border-white/5 bg-white/5 opacity-60 text-center flex flex-col items-center justify-center">
                          <div className="w-10 h-10 mb-1">
                            <img src={c.image} alt={c.label} className="w-full h-full object-contain filter grayscale" />
                          </div>
                          <div className="text-xs text-slate-300 font-bold">Tier {crate.level}</div>
                          <div className="text-[10px] text-slate-500 truncate w-full">{c.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 3D Cinematic Opening Phase */}
          {phase === 'opening' && cfg && selectedCrate && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6 select-none" style={{ perspective: '1000px' }}>
              {/* 3D Interactive Container */}
              <div
                className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${animProgress * 3.6}deg) rotateX(${Math.sin(animProgress / 10) * 12}deg) scale(${1 + animProgress / 400})`,
                }}
              >
                {/* Radial energy halo */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(245,158,11,0.8) 0%, rgba(139,92,246,0.4) 60%, transparent 100%)',
                    opacity: 0.3 + animProgress / 150,
                  }}
                />

                {/* Shaking 3D Crate Image */}
                <img
                  src={cfg.image}
                  alt={cfg.label}
                  className={`w-full h-full object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.7)] ${
                    animProgress > 40 ? 'animate-pulse' : ''
                  }`}
                  style={{
                    transform: animProgress > 60
                      ? `translate(${(Math.random() - 0.5) * 8}px, ${(Math.random() - 0.5) * 8}px)`
                      : 'none',
                  }}
                />

                {/* Energy burst beams */}
                {animProgress > 70 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-72 h-72 rounded-full border-2 border-amber-300 animate-ping opacity-60" />
                    <div className="w-80 h-80 rounded-full border border-cyan-400 animate-pulse opacity-40" />
                  </div>
                )}
              </div>

              {/* Title & Energy Meter */}
              <div className="text-center space-y-2">
                <div className={`text-2xl font-heading font-black bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent uppercase tracking-wider`}>
                  {cfg.label}
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-sm font-bold">Releasing Ancient Relic Energy...</span>
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              </div>

              {/* Energy Charge Bar */}
              <div className="w-64 h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 transition-all duration-100 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                  style={{ width: `${animProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Reveal Phase */}
          {phase === 'reveal' && result && cfg && selectedCrate && (
            <div className="flex flex-col items-center py-6 space-y-5 animate-fadeIn">
              {result.success ? (
                <>
                  <div className="w-24 h-24 relative flex items-center justify-center drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]">
                    <img src={cfg.image} alt={cfg.label} className="w-full h-full object-contain" />
                  </div>

                  <div className={`text-2xl font-heading font-black bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent uppercase`}>
                    {result.isDuplicate ? 'Duplicate Converted' : 'Reward Unlocked!'}
                  </div>

                  {/* Rewards Breakdown */}
                  <div className="w-full space-y-2.5">
                    {result.reward?.character && (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg">
                        <CharacterPortrait character={result.reward.character} size="md" />
                        <div className="flex-1">
                          <div className="font-heading font-black text-white text-lg">
                            {result.reward.character.name}
                          </div>
                          <div className="text-xs text-slate-300 font-bold">
                            {result.reward.character.grade} Grade • {result.reward.character.alignment} • Power {result.reward.character.overallPower}
                          </div>
                        </div>
                        {result.isDuplicate && (
                          <div className="text-amber-400 text-sm font-black font-mono">
                            +{result.cardShardsAwarded} 🔷 Shards
                          </div>
                        )}
                      </div>
                    )}

                    {result.reward?.astraAwarded && (
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-black text-sm">+{result.reward.astraAwarded.toLocaleString()} ✨ ASTRA COINS</span>
                      </div>
                    )}

                    {result.reward?.shardsAwarded && (
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40">
                        <span className="text-indigo-400 font-black text-lg">🔷</span>
                        <span className="text-white font-black text-sm">+{result.reward.shardsAwarded} {result.reward.draftCategory?.toUpperCase() || ''} DRAFT SHARDS</span>
                      </div>
                    )}

                    {result.reward?.type === 'TOKEN_SHARDS' && (
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-black text-sm">+{result.reward.amount} {result.reward.category} TOKEN SHARDS</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 w-full pt-2">
                    {claimable.filter(c => c.level !== selectedCrate.level && c.canClaim).length > 0 && (
                      <button
                        onClick={handleReset}
                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer text-sm"
                      >
                        Open Another
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${cfg.color} text-white font-black transition-all hover:scale-105 cursor-pointer shadow-lg`}
                    >
                      Collect & Continue
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="text-4xl text-red-400">⚠️</div>
                  <div className="text-red-300 font-bold">{result.error || 'Failed to open crate.'}</div>
                  <button onClick={handleReset} className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

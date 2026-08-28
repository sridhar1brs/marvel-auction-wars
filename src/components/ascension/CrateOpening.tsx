import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { X, Package, Sparkles, Star, Zap, Gift, ChevronRight } from 'lucide-react';

interface CrateInfo {
  level: number;
  type: 'ASTRA' | 'MYSTERY_CARD' | 'LEGENDARY';
  canClaim: boolean;
}

interface Props {
  crates: CrateInfo[];
  onClose: () => void;
  onClaimed: () => void;
}

const CRATE_CONFIG = {
  ASTRA: {
    label: 'Astra Crate',
    icon: '✨',
    color: 'from-cyan-500 to-blue-600',
    glow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
    borderColor: 'border-cyan-400/60',
    bgColor: 'bg-cyan-950/80',
    description: 'Contains Astra, Card Shards, and XP',
  },
  MYSTERY_CARD: {
    label: 'Mystery Card Crate',
    icon: '🃏',
    color: 'from-purple-500 to-indigo-600',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]',
    borderColor: 'border-purple-400/60',
    bgColor: 'bg-purple-950/80',
    description: 'Contains a random character card',
  },
  LEGENDARY: {
    label: '⚡ Legendary Crate',
    icon: '👑',
    color: 'from-amber-400 to-yellow-500',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.8)]',
    borderColor: 'border-amber-400/80',
    bgColor: 'bg-amber-950/80',
    description: 'Contains MYTHIC/Epic character + massive Astra',
  },
};

export function CrateOpening({ crates, onClose, onClaimed }: Props) {
  const { claimLevelCrate } = useAuth();
  const [selectedCrate, setSelectedCrate] = useState<CrateInfo | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [phase, setPhase] = useState<'select' | 'opening' | 'reveal'>('select');
  const shakeRef = useRef<HTMLDivElement>(null);

  const claimable = crates.filter(c => c.canClaim);
  const upcoming = crates.filter(c => !c.canClaim);

  const handleOpen = async (crate: CrateInfo) => {
    if (!crate.canClaim) return;
    setSelectedCrate(crate);
    setPhase('opening');
    setIsOpening(true);
    soundManager.playClick();

    // Shake animation
    setTimeout(async () => {
      const data = await claimLevelCrate(crate.level);
      setResult(data);
      setIsOpening(false);
      setPhase('reveal');
      if (data.success) {
        soundManager.playVictoryFanfare();
        onClaimed();
      } else {
        soundManager.playAttackHit();
      }
    }, 1800);
  };

  const handleReset = () => {
    setPhase('select');
    setSelectedCrate(null);
    setResult(null);
  };

  const cfg = selectedCrate ? CRATE_CONFIG[selectedCrate.type] : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#07091A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#0D0F24] to-[#0A0C20]">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">Level Milestone Crates</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {phase === 'select' && (
            <>
              {/* Claimable Crates */}
              {claimable.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-heading font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <Gift className="w-4 h-4" /> Ready to Claim ({claimable.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {claimable.map(crate => {
                      const c = CRATE_CONFIG[crate.type];
                      return (
                        <button
                          key={`${crate.type}-${crate.level}`}
                          onClick={() => handleOpen(crate)}
                          className={`relative p-4 rounded-2xl border ${c.borderColor} ${c.bgColor} ${c.glow} hover:scale-105 transition-all cursor-pointer text-left group overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10">
                            <div className="text-3xl mb-2">{c.icon}</div>
                            <div className="text-base font-heading font-black text-white">{c.label}</div>
                            <div className="text-xs text-slate-400 mt-1">{c.description}</div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${c.color} text-white`}>
                                Level {crate.level}
                              </span>
                              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> CLAIM
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {claimable.length === 0 && (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <Package className="w-12 h-12 mx-auto opacity-30" />
                  <p className="font-semibold">No crates available right now</p>
                  <p className="text-sm">Keep leveling up to unlock milestone crates!</p>
                </div>
              )}

              {/* Upcoming */}
              {upcoming.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-heading font-bold text-slate-500 uppercase tracking-widest">Upcoming Crates</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {upcoming.slice(0, 6).map(crate => {
                      const c = CRATE_CONFIG[crate.type];
                      return (
                        <div key={`up-${crate.type}-${crate.level}`}
                          className="p-3 rounded-xl border border-white/5 bg-white/3 opacity-50 text-center">
                          <div className="text-xl">{c.icon}</div>
                          <div className="text-xs text-slate-400 font-bold mt-1">Lv. {crate.level}</div>
                          <div className="text-[10px] text-slate-500">{crate.type.replace('_', ' ')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {phase === 'opening' && cfg && selectedCrate && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div ref={shakeRef}
                className={`text-8xl ${isOpening ? 'animate-bounce' : ''} transition-all`}
                style={{ filter: isOpening ? 'drop-shadow(0 0 30px currentColor)' : 'none' }}>
                {cfg.icon}
              </div>
              <div className={`text-2xl font-heading font-black bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent uppercase`}>
                {cfg.label}
              </div>
              <div className="flex items-center gap-2 text-slate-300 animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">Opening Level {selectedCrate.level} Crate...</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              {/* Spinning particles */}
              <div className="relative w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {phase === 'reveal' && result && cfg && selectedCrate && (
            <div className="flex flex-col items-center py-8 space-y-5 animate-fadeIn">
              {result.success ? (
                <>
                  <div className={`text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]`}>{cfg.icon}</div>
                  <div className={`text-xl font-heading font-black bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent`}>
                    {result.isDuplicate ? 'Duplicate — Converted!' : 'New Unlock!'}
                  </div>

                  {/* Rewards */}
                  <div className="w-full space-y-2">
                    {result.reward?.character && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-3xl">🦸</span>
                        <div>
                          <div className="font-bold text-white">{result.reward.character.name}</div>
                          <div className="text-xs text-slate-400">{result.reward.character.grade} • {result.reward.character.alignment}</div>
                        </div>
                        {result.isDuplicate && (
                          <div className="ml-auto text-amber-400 text-sm font-bold">
                            +{result.cardShardsAwarded} 🔷 Shards
                          </div>
                        )}
                      </div>
                    )}
                    {result.reward?.astra && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-bold">+{result.reward.astra.toLocaleString()} ASTRA</span>
                      </div>
                    )}
                    {result.reward?.cardShards && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/30">
                        <span className="text-indigo-400 font-bold">🔷</span>
                        <span className="text-white font-bold">+{result.reward.cardShards} Card Shards</span>
                      </div>
                    )}
                    {result.reward?.xp && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-950/50 border border-green-500/30">
                        <Star className="w-5 h-5 text-green-400" />
                        <span className="text-white font-bold">+{result.reward.xp.toLocaleString()} XP</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 w-full">
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
                      className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${cfg.color} text-white font-black transition-all hover:scale-105 cursor-pointer`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Awesome!</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-3">
                  <div className="text-red-400 font-bold">{result.error}</div>
                  <button onClick={handleReset} className="px-6 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all cursor-pointer">
                    Go Back
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

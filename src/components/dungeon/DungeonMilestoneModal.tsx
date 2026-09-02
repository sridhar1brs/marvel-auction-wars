import React, { useState } from 'react';
import { DungeonMilestoneReward, DungeonRelic, RelicSynergy } from '../../types/dungeon';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Trophy, Check, ArrowRight, Package, Coins, Gem, Layers } from 'lucide-react';

interface Props {
  reward: DungeonMilestoneReward;
  onConfirm: (chosenRelic: DungeonRelic | null) => void;
}

const SYNERGY_INFO: Record<RelicSynergy, { label: string; color: string; icon: string }> = {
  OFFENSIVE: { label: 'OFFENSIVE BUILD', color: 'text-red-400 bg-red-950/70 border-red-500/50', icon: '⚔️' },
  DEFENSIVE: { label: 'DEFENSIVE BUILD', color: 'text-blue-400 bg-blue-950/70 border-blue-500/50', icon: '🛡️' },
  SUSTAIN: { label: 'SUSTAIN BUILD', color: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50', icon: '💚' },
  ABILITY: { label: 'ABILITY BUILD', color: 'text-purple-400 bg-purple-950/70 border-purple-500/50', icon: '⚡' },
  COSMIC: { label: 'COSMIC BUILD', color: 'text-amber-400 bg-amber-950/70 border-amber-500/50', icon: '🪐' },
};

export function DungeonMilestoneModal({ reward, onConfirm }: Props) {
  const [selectedRelic, setSelectedRelic] = useState<DungeonRelic | null>(reward?.relicChoices?.[0] || null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePick = (relic: DungeonRelic) => {
    try { soundManager.playClick(); } catch (e) {}
    setSelectedRelic(relic);
  };

  const handleConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      soundManager.playVictoryFanfare();
    } catch (e) {
      console.warn('Audio playback warning:', e);
    }
    onConfirm(selectedRelic);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#211405] via-[#120B02] to-black border-2 border-amber-500/80 shadow-[0_0_80px_rgba(245,158,11,0.5)] p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="px-4 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[11px] font-mono font-bold rounded-full uppercase tracking-widest inline-flex items-center gap-2 shadow-glow-gold">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>SURVIVAL MILESTONE REACHED • WAVE {reward.wave}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider">
            MILESTONE SUPPLY DROP
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            You conquered Wave {reward.wave}! Your perseverance has earned valuable supplies. Choose 1 Relic to empower your squad for deeper survival!
          </p>
        </div>

        {/* Milestone Rewards Pill Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-black/80 border border-amber-500/40 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> Astra
            </div>
            <div className="text-lg font-heading font-black text-amber-300">
              +✨ {reward.astra.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/80 border border-blue-500/40 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Gem className="w-3.5 h-3.5 text-blue-400" /> Card Shards
            </div>
            <div className="text-lg font-heading font-black text-blue-300">
              +🧩 {reward.cardShards}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/80 border border-purple-500/40 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Draft Shards
            </div>
            <div className="text-lg font-heading font-black text-purple-300">
              +💎 {reward.draftShards}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/80 border border-emerald-500/40 text-center space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Package className="w-3.5 h-3.5 text-emerald-400" /> Mystery Crates
            </div>
            <div className="text-lg font-heading font-black text-emerald-300">
              +📦 {reward.crates} {reward.crateType === 'CHARACTER_CRATE' ? 'Hero Crate' : 'Shard Crate'}
            </div>
          </div>
        </div>

        {/* 3 Relic Choice Cards */}
        {reward.relicChoices && reward.relicChoices.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest text-center">
              ⚡ SELECT 1 TACTICAL RELIC TO AUGMENT YOUR SQUAD
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reward.relicChoices.map(relic => {
                const isSelected = selectedRelic?.id === relic.id;
                const synergy = SYNERGY_INFO[relic.synergy] || SYNERGY_INFO.COSMIC;

                return (
                  <div
                    key={relic.id}
                    onClick={() => handlePick(relic)}
                    className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 relative cursor-pointer transform hover:scale-[1.03] ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500/25 via-slate-900 to-black border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.6)] ring-2 ring-amber-400/50'
                        : 'bg-slate-900/80 border-white/10 hover:border-amber-500/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-black shadow-lg">
                        ✓
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{relic.icon}</span>
                        <div>
                          <span className={`px-2 py-0.5 rounded-full border text-[8px] font-mono font-bold tracking-wider ${synergy.color}`}>
                            {synergy.icon} {synergy.label}
                          </span>
                          <h4 className="text-base font-heading font-black text-white uppercase mt-0.5">
                            {relic.name}
                          </h4>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {relic.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Rarity: <strong className="text-amber-400">{relic.rarity}</strong></span>
                      <span className="text-emerald-400 font-bold">ACTIVE RUN BUFF</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <div className="text-xs text-slate-400 font-mono text-center sm:text-left">
            Dungeon runs scale infinitely. Prepare for <span className="text-white font-bold">Wave {reward.wave + 1}</span>!
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2.5 hover:scale-105 transition-all cursor-pointer"
          >
            <span>CLAIM & ENTER WAVE {reward.wave + 1}</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { DungeonRelic, RelicSynergy } from '../../types/dungeon';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Check, ArrowRight, Shield, Swords, Heart, Zap, Award } from 'lucide-react';

interface Props {
  relicChoices: DungeonRelic[];
  onSelectRelic: (relic: DungeonRelic) => void;
  onSkip?: () => void;
}

const SYNERGY_INFO: Record<RelicSynergy, { label: string; color: string; icon: string }> = {
  OFFENSIVE: { label: 'OFFENSIVE BUILD', color: 'text-red-400 bg-red-950/70 border-red-500/50', icon: '⚔️' },
  DEFENSIVE: { label: 'DEFENSIVE BUILD', color: 'text-blue-400 bg-blue-950/70 border-blue-500/50', icon: '🛡️' },
  SUSTAIN: { label: 'SUSTAIN BUILD', color: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50', icon: '💚' },
  ABILITY: { label: 'ABILITY BUILD', color: 'text-purple-400 bg-purple-950/70 border-purple-500/50', icon: '⚡' },
  COSMIC: { label: 'COSMIC BUILD', color: 'text-amber-400 bg-amber-950/70 border-amber-500/50', icon: '🪐' },
};

export function DungeonRelicPicker({ relicChoices, onSelectRelic, onSkip }: Props) {
  const [selectedRelic, setSelectedRelic] = useState<DungeonRelic | null>(null);

  const handlePick = (relic: DungeonRelic) => {
    soundManager.playClick();
    setSelectedRelic(relic);
  };

  const handleConfirm = () => {
    if (!selectedRelic) return;
    soundManager.playMythicReveal();
    onSelectRelic(selectedRelic);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-4xl rounded-3xl bg-gradient-to-b from-[#1C1405] via-[#100C02] to-black border-2 border-amber-500/70 shadow-[0_0_70px_rgba(245,158,11,0.5)] p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="px-3.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Relic Chamber Discovered
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            Choose 1 Tactical Relic
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Select a powerful roguelite artifact to augment your squad for the remainder of this expedition. Build synergies to unlock passive combat advantages!
          </p>
        </div>

        {/* 3 Relic Choice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relicChoices.map(relic => {
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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-black/80 border border-white/20 flex items-center justify-center text-3xl shadow-lg">
                      {relic.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono font-bold text-amber-400 uppercase">
                      {relic.rarity}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-heading font-black text-white">{relic.name}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{relic.description}</p>
                  </div>
                </div>

                {/* Synergy Tag */}
                <div className={`p-2 rounded-xl border text-[10px] font-heading font-black flex items-center gap-1.5 ${synergy.color}`}>
                  <span>{synergy.icon}</span>
                  <span>{synergy.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-heading font-black uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
            >
              Skip Relic
            </button>
          )}

          <button
            type="button"
            disabled={!selectedRelic}
            onClick={handleConfirm}
            className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-heading font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all transform ${
              selectedRelic
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-glow-gold hover:scale-105 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            <span>CONFIRM RELIC SELECTION</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}

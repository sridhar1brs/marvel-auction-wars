import React, { useState } from 'react';
import { TAG_TEAM_COMBOS, TagTeamCombo } from '../../engine/synergyEngine';
import { Search, Flame, Sparkles, X, Swords, Zap } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DuoHeroesModal({ isOpen, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [auraFilter, setAuraFilter] = useState('ALL');

  if (!isOpen) return null;

  const filteredCombos = TAG_TEAM_COMBOS.filter(combo => {
    const matchSearch = 
      combo.hero1Name.toLowerCase().includes(search.toLowerCase()) ||
      combo.hero2Name.toLowerCase().includes(search.toLowerCase()) ||
      combo.comboTitle.toLowerCase().includes(search.toLowerCase()) ||
      combo.comboDescription.toLowerCase().includes(search.toLowerCase());

    const matchAura = auraFilter === 'ALL' || combo.auraType.toUpperCase() === auraFilter;
    return matchSearch && matchAura;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border-2 border-pink-500/50 bg-[#0E0712]/95 max-w-4xl w-full max-h-[88vh] flex flex-col space-y-4 shadow-[0_0_50px_rgba(236,72,153,0.3)] animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-950/80 border border-pink-500/50 shadow-glow-pink">
              <Flame className="w-5 h-5 text-pink-400 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                TAG-TEAM DUO SYNERGIES ({TAG_TEAM_COMBOS.length})
              </h2>
              <p className="text-xs text-pink-300/80 font-medium">
                When both heroes are in your roster, unlock massive combat bonuses & in-battle Fusion!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-pink-900/50 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search heroes or combo names (e.g. Iron Man, Spider-Man)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/60 border border-pink-500/30 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-400"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {['ALL', 'LIGHTNING', 'COSMIC', 'FIRE', 'CHAOS', 'GAMMA', 'SYMBIOTE'].map(aura => (
              <button
                key={aura}
                type="button"
                onClick={() => setAuraFilter(aura)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap border ${
                  auraFilter === aura
                    ? 'bg-pink-600 text-white border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                    : 'bg-black/40 text-slate-400 border-white/10 hover:border-pink-500/40'
                }`}
              >
                {aura}
              </button>
            ))}
          </div>
        </div>

        {/* 230 Duo Combos List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[58vh] pr-1.5 custom-scrollbar">
          {filteredCombos.map((combo, idx) => (
            <div
              key={combo.id || idx}
              className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-pink-400/80 transition-all space-y-2 group shadow-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
            >
              {/* Top Row: Hero 1 + Hero 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm text-cyan-300">
                    {combo.hero1Name}
                  </span>
                  <span className="text-xs font-black text-pink-400">+</span>
                  <span className="font-heading font-black text-sm text-amber-300">
                    {combo.hero2Name}
                  </span>
                </div>

                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${combo.bannerColor}20`,
                    borderColor: `${combo.bannerColor}80`,
                    color: combo.bannerColor || '#EC4899',
                  }}
                >
                  +{combo.bonusDualDamage} DMG
                </span>
              </div>

              {/* Title */}
              <h4 className="font-heading font-black text-xs text-white uppercase tracking-wide group-hover:text-pink-300 transition-colors">
                {combo.comboTitle}
              </h4>

              {/* Description */}
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {combo.comboDescription}
              </p>

              {/* Aura Indicator */}
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/5">
                <span>AURA: <strong className="text-slate-300 uppercase">{combo.auraType}</strong></span>
                <span className="text-pink-400/80 font-bold">⚡ IN-BATTLE MERGEABLE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-2 text-center">
          <span className="text-xs text-slate-400">
            Showing <strong>{filteredCombos.length}</strong> of <strong>{TAG_TEAM_COMBOS.length}</strong> canonical Marvel synergies
          </span>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { MARVEL_ARTIFACTS } from '../../data/artifacts';
import { Character, ArtifactItem } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { AscensionUpgradeModal } from './AscensionUpgradeModal';
import { 
  Package, Shield, Zap, Sparkles, Filter, Search, 
  ArrowUpCircle, Check, Lock, ChevronRight, Layers, Sliders 
} from 'lucide-react';

export type InventoryTab = 'CHARACTERS' | 'RELICS' | 'SKILLS' | 'COSMETICS';

export function AscensionInventory() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<InventoryTab>('CHARACTERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeroForUpgrade, setSelectedHeroForUpgrade] = useState<Character | null>(null);

  const ownedCharIds = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);
  const ownedRelicIds = useMemo(() => new Set(user?.ownedRelics || []), [user?.ownedRelics]);
  const ownedSkillIds = useMemo(() => new Set(user?.ownedSkills || []), [user?.ownedSkills]);

  const ownedCharacters = useMemo(() => {
    return ALL_CHARACTERS.filter(c => ownedCharIds.has(c.id)).filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.powers.toLowerCase().includes(q);
    });
  }, [ownedCharIds, searchQuery]);

  const ownedRelics = useMemo(() => {
    return MARVEL_ARTIFACTS.filter(a => ownedRelicIds.has(a.id)).filter(a => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    });
  }, [ownedRelicIds, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Inventory Top Header */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#10142A] via-[#0A1024] to-[#120B24] border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Package className="w-3.5 h-3.5" />
            <span>COMMANDER VAULT & ARSENAL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            ASCENSION INVENTORY
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Inspect your persistent Marvel roster, level up heroes from 1 to 50, arm tactical relics, and configure your battle loadouts.
          </p>
        </div>

        {/* Vault Stats Counters */}
        <div className="grid grid-cols-3 gap-2.5 shrink-0 text-center">
          <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">HEROES</span>
            <span className="text-base sm:text-lg font-heading font-black text-cyan-300">
              {ownedCharIds.size} / 350
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">RELICS</span>
            <span className="text-base sm:text-lg font-heading font-black text-amber-300">
              {ownedRelicIds.size}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/30">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">SKILLS</span>
            <span className="text-base sm:text-lg font-heading font-black text-purple-300">
              {ownedSkillIds.size}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-black/50 border border-white/10">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('CHARACTERS');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'CHARACTERS'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Characters ({ownedCharIds.size})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('RELICS');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'RELICS'
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Relics ({ownedRelicIds.size})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('SKILLS');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'SKILLS'
                ? 'bg-purple-500 text-black shadow-glow-cosmic'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Skills ({ownedSkillIds.size})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* TAB 1: CHARACTERS VAULT */}
      {activeTab === 'CHARACTERS' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {ownedCharacters.map(char => {
            const charLevel = user?.characterLevels[char.id] || 1;
            const isMythic = char.grade === 'MYTHIC' || char.alignment === 'Cosmic';
            const shards = user?.characterShards[char.id] || 0;
            const boosts = user?.characterStatsBoosts[char.id] || { power: 0, hp: 0, defense: 0, speed: 0 };

            return (
              <div
                key={char.id}
                className="relative rounded-2xl bg-gradient-to-b from-[#141B32] to-[#0A0E1A] border-2 border-cyan-500/40 hover:border-cyan-300 shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Level & Power Badge */}
                <div className="p-2.5 flex items-center justify-between border-b border-white/10 bg-black/40">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-cyan-400 text-black">
                    {isMythic ? 'MYTHIC' : `LVL ${charLevel}`}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-300">
                    {char.overallPower + boosts.power} PWR
                  </span>
                </div>

                {/* Character Portrait */}
                <div className="p-3 text-center space-y-2">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl overflow-hidden border border-cyan-400/50 shadow-md group-hover:scale-105 transition-transform bg-black">
                    <CharacterPortrait 
                      character={char} 
                      size="md" 
                      showBadge={false} 
                      showPowerBadge={false} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-black text-xs sm:text-sm text-white uppercase line-clamp-2 min-h-[2.4rem] flex items-center justify-center text-center leading-snug group-hover:text-cyan-300 transition-colors">
                      {char.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {char.factions?.[0] || char.alignment}
                    </span>
                  </div>
                </div>

                {/* Upgrade Action Trigger */}
                <div className="p-2.5 bg-black/60 border-t border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-purple-300 px-1">
                    <span>Shards: {shards}</span>
                    <span className="text-emerald-400">+{boosts.hp} HP</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedHeroForUpgrade(char);
                    }}
                    className="w-full py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-200 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isMythic ? 'VIEW STATS' : 'UPGRADE HERO'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: RELICS VAULT */}
      {activeTab === 'RELICS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {ownedRelics.map(relic => (
            <div
              key={relic.id}
              className="p-4 rounded-2xl bg-gradient-to-b from-[#1C160E] to-[#0A0906] border-2 border-amber-500/40 hover:border-amber-400 shadow-glow-gold/20 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/60 flex items-center justify-center text-2xl shadow-sm">
                  {relic.icon}
                </div>
                <div>
                  <h3 className="font-heading font-black text-white text-sm uppercase">
                    {relic.name}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">
                    TACTICAL RELIC
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {relic.description}
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> UNLOCKED & READY
                </span>
                <span className="text-slate-400 font-mono">ID: {relic.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upgrade Hero Modal */}
      {selectedHeroForUpgrade && (
        <AscensionUpgradeModal
          character={selectedHeroForUpgrade}
          onClose={() => setSelectedHeroForUpgrade(null)}
        />
      )}

    </div>
  );
}

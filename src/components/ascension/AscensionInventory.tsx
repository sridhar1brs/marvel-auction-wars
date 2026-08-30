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
  ArrowUpCircle, Check, Lock, ChevronRight, Layers, Sliders, Trash2, AlertTriangle, X
} from 'lucide-react';

export type InventoryTab = 'CHARACTERS' | 'RELICS' | 'SKILLS' | 'COSMETICS';

export function AscensionInventory() {
  const { user, token, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<InventoryTab>('CHARACTERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeroForUpgrade, setSelectedHeroForUpgrade] = useState<Character | null>(null);
  const [discardTarget, setDiscardTarget] = useState<Character | null>(null);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const handleDiscardConfirm = async () => {
    if (!discardTarget || !token) return;
    setIsDiscarding(true);
    try {
      const res = await fetch('/api/inventory/discard-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ characterId: discardTarget.id }),
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playVictory();
        setFeedback({
          type: 'success',
          message: `Successfully discarded ${discardTarget.name}! Received +${data.refundAmount.toLocaleString()} Astra Coins (60% Refund).`,
        });
        refreshProfile();
        setDiscardTarget(null);
      } else {
        soundManager.playAttackHit();
        setFeedback({ type: 'error', message: data.error || 'Failed to discard character.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network connection failed.' });
    } finally {
      setIsDiscarding(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between animate-slideDown ${
          feedback.type === 'success' ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200' : 'bg-red-950/90 border-red-400 text-red-200'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Inventory Top Header */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#10142A] via-[#0A1024] to-[#120B24] border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Package className="w-3.5 h-3.5" />
            <span>COMMANDER VAULT & ARSENAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider">
            Inventory & Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your roster of heroes, tactical relics, skill augmentations, and discard unwanted heroes for 60% Astra refund.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('CHARACTERS'); }}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'CHARACTERS'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🦸 Heroes ({ownedCharacters.length})
          </button>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('RELICS'); }}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'RELICS'
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏺 Relics ({ownedRelics.length})
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-black/40 border border-white/10">
        <div className="relative flex-1 max-w-md">
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
            const charLevel = user?.characterLevels?.[char.id] || 1;
            const isMythic = char.grade === 'MYTHIC' || char.alignment === 'Cosmic';
            const shards = user?.characterShards?.[char.id] || 0;
            const boosts = user?.characterStatsBoosts?.[char.id] || { power: 0, hp: 0, defense: 0, speed: 0 };
            const baseValue = char.startingPrice ? char.startingPrice * 100 : 1000;
            const refundAmount = Math.max(100, Math.floor(baseValue * 0.6));

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

                {/* Actions: Upgrade + Discard */}
                <div className="p-2.5 bg-black/60 border-t border-white/10 space-y-1.5">
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

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setDiscardTarget(char);
                    }}
                    className="w-full py-1 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 hover:text-red-100 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                    <span>Discard (60% Refund)</span>
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

      {/* Discard Confirmation Modal (60% Money Value Refund) */}
      {discardTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1A0B0E] via-[#10070A] to-black border-2 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.35)] p-6 space-y-5 text-center">
            
            {/* Warning Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-3xl text-red-400 shadow-glow-red">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono">
                DISCARD CHARACTER CONFIRMATION
              </span>
              <h2 className="text-2xl font-heading font-black text-white uppercase">
                Discard {discardTarget.name}?
              </h2>
              <p className="text-xs text-slate-400">
                This hero will be permanently removed from your active roster in exchange for a 60% Astra refund.
              </p>
            </div>

            {/* Character Info Card */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/20 bg-black shrink-0">
                <CharacterPortrait character={discardTarget} size="sm" showBadge={false} showPowerBadge={false} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-black text-sm text-white truncate">{discardTarget.name}</h4>
                <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-cyan-400 font-bold">{discardTarget.grade} Grade</span>
                  <span>•</span>
                  <span>⚡ {discardTarget.overallPower} PWR</span>
                </div>
              </div>
            </div>

            {/* Refund Calculation Breakdown */}
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Original Valuation:</span>
                <span className="font-bold text-white">
                  {(discardTarget.startingPrice ? discardTarget.startingPrice * 100 : 1000).toLocaleString()} Astra
                </span>
              </div>
              <div className="flex items-center justify-between text-amber-300 font-bold pt-2 border-t border-red-500/20 text-sm">
                <span>60% Refund Payout:</span>
                <span className="text-amber-400 font-black text-base">
                  +{(Math.max(100, Math.floor((discardTarget.startingPrice ? discardTarget.startingPrice * 100 : 1000) * 0.6))).toLocaleString()} Astra
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDiscardTarget(null)}
                disabled={isDiscarding}
                className="py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-heading font-bold text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDiscardConfirm}
                disabled={isDiscarding}
                className="py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-heading font-black text-xs uppercase tracking-wider shadow-glow-red flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDiscarding ? 'Discarding...' : 'Confirm Discard'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

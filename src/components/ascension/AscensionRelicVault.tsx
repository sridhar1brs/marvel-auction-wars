import React, { useState, useMemo } from 'react';
import { MARVEL_ARTIFACTS } from '../../data/artifacts';
import { ArtifactItem } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { Shield, Sparkles, Zap, Check, Search, Filter } from 'lucide-react';

export function AscensionRelicVault() {
  const { user, buyRelic } = useAuth();
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  const ownedRelicIds = useMemo(() => new Set(user?.ownedRelics || []), [user?.ownedRelics]);

  const filteredRelics = useMemo(() => {
    return MARVEL_ARTIFACTS.filter(relic => {
      if (selectedRarity !== 'ALL' && relic.rarity !== selectedRarity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return relic.name.toLowerCase().includes(q) || relic.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedRarity, searchQuery]);

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case 'MYTHIC':
        return 'bg-purple-950/80 border-purple-400 text-purple-200 shadow-glow-cosmic';
      case 'LEGENDARY':
        return 'bg-amber-950/80 border-amber-400 text-amber-200';
      case 'EPIC':
        return 'bg-indigo-950/80 border-indigo-400 text-indigo-200';
      case 'RARE':
        return 'bg-blue-950/80 border-blue-400 text-blue-200';
      case 'UNCOMMON':
        return 'bg-emerald-950/80 border-emerald-400 text-emerald-200';
      default:
        return 'bg-slate-900 border-slate-600 text-slate-300';
    }
  };

  const handleBuyRelic = async (relic: ArtifactItem) => {
    const cost = relic.astraCost || 1000;
    if ((user?.astra || 0) < cost) {
      setFeedback({ id: relic.id, success: false, msg: `Insufficient Astra. Need ✨ ${cost.toLocaleString()} Astra.` });
      return;
    }

    soundManager.playClick();
    setIsPurchasing(relic.id);
    setFeedback(null);

    const res = await buyRelic(relic.id, cost);
    setIsPurchasing(null);

    if (res.success) {
      soundManager.playVictoryFanfare();
      setFeedback({ id: relic.id, success: true, msg: `🎉 Successfully acquired ${relic.name}!` });
    } else {
      setFeedback({ id: relic.id, success: false, msg: res.error || 'Failed to purchase relic.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Vault Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
              50 Tactical Artifacts
            </span>
            <span className="text-xs text-slate-400 font-mono">Omniverse Relic Arsenal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide mt-1">
            Ascension Relic Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-0.5">
            Acquire legendary cosmic artifacts to arm your heroes with lethal passive modifiers, shields, and reality-warping abilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-blue-500/30 text-center">
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Relics Owned</div>
            <div className="text-xl font-heading font-black text-blue-300">
              {ownedRelicIds.size} / 50
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-900/80 border border-white/10 rounded-2xl">
        {/* Rarity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['ALL', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'].map(rarity => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
                selectedRarity === rarity
                  ? 'bg-blue-500 text-black font-black shadow-glow-blue'
                  : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search relics..."
            className="w-full bg-black/60 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Relics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRelics.map(relic => {
          const isOwned = ownedRelicIds.has(relic.id);
          const astraPrice = relic.astraCost || 1000;
          const isBuying = isPurchasing === relic.id;

          return (
            <div
              key={relic.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isOwned
                  ? 'bg-gradient-to-b from-blue-950/40 via-slate-900/90 to-black border-blue-500/40 shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-2xl shadow-md">
                    {relic.icon}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black border ${getRarityBadge(relic.rarity)}`}>
                    {relic.rarity || 'COMMON'}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="font-heading font-black text-sm text-white leading-snug">
                  {relic.name}
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                  {relic.description}
                </p>

                {/* Stat Modifiers */}
                <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {relic.bonusPower && (
                    <span className="px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-500/30 rounded">
                      +PWR {relic.bonusPower}
                    </span>
                  )}
                  {relic.statModifiers?.hp && (
                    <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 rounded">
                      +{relic.statModifiers.hp} HP
                    </span>
                  )}
                  {relic.statModifiers?.defense && (
                    <span className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 rounded">
                      +{relic.statModifiers.defense} DEF
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback */}
              {feedback && feedback.id === relic.id && (
                <div className={`mt-3 p-2 rounded-lg text-[11px] font-medium border ${feedback.success ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-rose-950/70 border-rose-500 text-rose-300'}`}>
                  {feedback.msg}
                </div>
              )}

              {/* Purchase / Owned State */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                {isOwned ? (
                  <div className="w-full py-2 bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-bold font-mono rounded-xl flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>OWNED IN VAULT</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuyRelic(relic)}
                    disabled={isBuying}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isBuying ? 'Acquiring...' : 'Unlock Relic'}</span>
                    <span className="text-amber-300 font-mono">✨ {astraPrice.toLocaleString()} ASTRA</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

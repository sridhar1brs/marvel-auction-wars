import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { Hammer, Sparkles, Star, RotateCcw, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ForgeCategory {
  key: string;
  label: string;
  shardKey: 'rare' | 'epic' | 'mythic' | 'hero' | 'villain' | 'cosmic';
  cost: number;
  grades: string[];
  description: string;
  icon: string;
}

const FORGE_CATEGORIES: Record<string, ForgeCategory> = {
  random_b:      { key: 'random_b',      label: 'Rare Draft',    shardKey: 'rare',    cost: 10, grades: ['B'],          icon: '🔷', description: 'Craft ONLY Rare (B-Grade) Marvel Heroes' },
  random_a:      { key: 'random_a',      label: 'Epic Draft',    shardKey: 'epic',    cost: 10, grades: ['A'],          icon: '💜', description: 'Craft ONLY Epic (A-Grade) Marvel Heroes' },
  random_mythic: { key: 'random_mythic', label: 'Mythic Draft',  shardKey: 'mythic',  cost: 10, grades: ['MYTHIC'],     icon: '🌟', description: 'Craft ONLY Supreme MYTHIC Characters' },
  random_hero:   { key: 'random_hero',   label: 'Hero Draft',    shardKey: 'hero',    cost: 10, grades: ['HERO'],       icon: '🦸‍♂️', description: 'Craft ONLY Hero & Anti-Hero Characters' },
  random_villain:{ key: 'random_villain',label: 'Villain Draft', shardKey: 'villain', cost: 10, grades: ['VILLAIN'],    icon: '🦹‍♂️', description: 'Craft ONLY Villain-aligned Characters' },
  random_cosmic: { key: 'random_cosmic', label: 'Cosmic Draft',  shardKey: 'cosmic',  cost: 10, grades: ['COSMIC'],     icon: '🪐', description: 'Craft ONLY Cosmic & Universal Entities' },
};

const GRADE_COLORS: Record<string, string> = {
  C: 'text-slate-300',
  B: 'text-blue-400',
  A: 'text-purple-400',
  MYTHIC: 'text-amber-400',
  HERO: 'text-emerald-400',
  VILLAIN: 'text-red-400',
  COSMIC: 'text-violet-400',
};

const CATEGORY_COLORS: Record<string, string> = {
  random_b:      'from-blue-600 to-blue-700',
  random_a:      'from-purple-600 to-indigo-700',
  random_mythic: 'from-amber-500 to-yellow-600',
  random_hero:   'from-emerald-600 to-teal-700',
  random_villain:'from-red-600 to-rose-700',
  random_cosmic: 'from-violet-600 to-purple-700',
};

export function CardForge() {
  const { user, craftCard } = useAuth();
  const [crafting, setCrafting] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const cardShards = user?.cardShards ?? 0;
  const draftShards = (user as any)?.draftShards || {};

  const getAvailableShards = (shardKey: string) => {
    return (draftShards[shardKey] || 0) + cardShards;
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCraft = async (categoryKey: string) => {
    const cat = FORGE_CATEGORIES[categoryKey];
    const available = getAvailableShards(cat.shardKey);
    if (available < cat.cost) {
      showToast('error', `Not enough ${cat.label} Shards! Need ${cat.cost}, you have ${available}.`);
      return;
    }

    setCrafting(categoryKey);
    setResult(null);
    soundManager.playClick();

    try {
      const data = await craftCard(categoryKey);
      setResult({ ...data, category: categoryKey });
      if (data.success) {
        soundManager.playVictoryFanfare();
        setHistory(prev => [{ ...data, category: categoryKey, timestamp: Date.now() }, ...prev.slice(0, 9)]);
        showToast('success', data.isDuplicate
          ? `Duplicate! +${data.cardShardsAwarded} Card Shards refunded`
          : `Crafted ${data.character?.name}!`
        );
      } else {
        soundManager.playAttackHit();
        showToast('error', data.error || 'Craft failed.');
      }
    } finally {
      setCrafting(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-2 ${
          toastMsg.type === 'success' ? 'bg-emerald-900 border border-emerald-500 text-emerald-200' : 'bg-red-900 border border-red-500 text-red-200'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-[#1A0B2E] via-[#120D2A] to-[#0D1535] border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.2)] overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Hammer className="w-7 h-7 text-amber-400" />
              <h1 className="text-2xl font-heading font-black text-white uppercase tracking-wider">Card Forge</h1>
            </div>
            <p className="text-slate-400 text-sm">Forge specific character categories with dedicated Draft Shards (Strict Category Enforcement)</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-right px-4 py-2 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Universal Shards</div>
              <div className="text-xl font-black text-indigo-300 flex items-center gap-1.5 justify-end">
                🔷 {cardShards.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-sm text-blue-200">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
        <div>
          <strong>Strict Category Isolation:</strong> Hero Draft unlocks only Heroes, Villain Draft unlocks only Villains, Rare unlocks only Rare, etc. Cross-category drafting is strictly prevented.
        </div>
      </div>

      {/* Forge Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(FORGE_CATEGORIES).map(([key, cat]) => {
          const available = getAvailableShards(cat.shardKey);
          const canAfford = available >= cat.cost;
          const isCrafting = crafting === key;
          const gradClass = CATEGORY_COLORS[key] || 'from-slate-600 to-slate-700';

          return (
            <div key={key}
              className={`relative rounded-2xl border transition-all overflow-hidden ${
                canAfford
                  ? 'border-white/20 hover:border-white/40 hover:scale-[1.02] cursor-pointer'
                  : 'border-white/5 opacity-60'
              } bg-[#0B0D1E]`}
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${gradClass}`} />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-heading font-black text-white text-sm uppercase tracking-wide">{cat.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {cat.grades.map(g => (
                      <span key={g} className={`text-[10px] font-black px-1.5 py-0.5 rounded ${GRADE_COLORS[g] || 'text-white'} bg-white/10`}>{g}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400">{cat.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 block text-[10px]">YOUR SHARDS:</span>
                    <span className="font-black text-sm text-cyan-300 font-mono">{available} / {cat.cost}</span>
                  </div>
                  <button
                    onClick={() => canAfford && handleCraft(key)}
                    disabled={!canAfford || isCrafting || crafting !== null}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all ${
                      isCrafting
                        ? 'bg-purple-700 text-white animate-pulse cursor-not-allowed'
                        : canAfford
                        ? `bg-gradient-to-r ${gradClass} text-white hover:opacity-90 active:scale-95 cursor-pointer shadow-md`
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isCrafting ? (
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        <span>Forging...</span>
                      </div>
                    ) : canAfford ? 'Forge Hero' : 'Need Shards'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last Craft Result */}
      {result && result.success && (
        <div className={`rounded-2xl p-5 border animate-fadeIn ${
          result.isDuplicate
            ? 'bg-amber-950/40 border-amber-500/30'
            : 'bg-emerald-950/40 border-emerald-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              {result.isDuplicate ? '🔄' : '🎉'}
            </div>
            <div>
              <div className="font-heading font-black text-white text-lg">
                {result.isDuplicate ? 'Duplicate Converted!' : `Crafted: ${result.character?.name}`}
              </div>
              <div className="text-sm text-slate-400">
                {result.isDuplicate
                  ? `Already owned — received +${result.cardShardsAwarded} 🔷 Card Shards instead`
                  : `${result.character?.grade} grade • ${result.character?.alignment} • Cost: ${result.cost} shards`
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Craft History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-heading font-bold text-slate-500 uppercase tracking-widest">Recent Crafts</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/3 border border-white/5 text-sm">
                <div className="flex items-center gap-2">
                  {h.isDuplicate ? (
                    <span className="text-amber-400">🔄</span>
                  ) : (
                    <span className="text-emerald-400">✓</span>
                  )}
                  <span className="text-white font-medium">{h.character?.name || 'Unknown'}</span>
                  <span className={`text-xs ${GRADE_COLORS[h.character?.grade] || 'text-slate-400'}`}>{h.character?.grade}</span>
                </div>
                <div className="text-slate-400 text-xs">
                  {h.isDuplicate ? `+${h.cardShardsAwarded} shards` : FORGE_CATEGORIES[h.category]?.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Earn Shards */}
      <div className="rounded-2xl p-5 bg-[#0B0D1E] border border-white/5 space-y-3">
        <h3 className="text-sm font-heading font-black text-white uppercase tracking-wider">How to Earn Card Shards 🔷</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-400">
          {[
            ['📦 Level Crates', 'Claim milestone crates'],
            ['🎯 Daily Missions', 'Complete daily tasks'],
            ['📅 Weekly Challenges', 'Weekly mission rewards'],
            ['🏆 Achievements', 'One-time unlock bonuses'],
            ['🎰 Mystery Wheel', 'Random shard prizes'],
            ['🔄 Duplicates', '60% shard refund on dupes'],
          ].map(([icon, desc]) => (
            <div key={icon} className="flex items-start gap-2 p-2 rounded-lg bg-white/3">
              <span>{icon}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

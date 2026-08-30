import React, { useMemo, useState } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { useAuth } from '../../context/AuthContext';
import { CharacterShardCategory, getCharacterShardCategory } from '../../data/ascensionProgression';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { Hammer, Sparkles, Check, AlertCircle, Zap } from 'lucide-react';

const CATEGORIES: CharacterShardCategory[] = ['C', 'B', 'A', 'MYTHIC', 'HERO', 'VILLAIN'];

const TOKEN_STYLES: Record<CharacterShardCategory, {
  label: string; icon: string; gradient: string; border: string;
  text: string; glow: string; craftBtn: string; headerGradient: string;
}> = {
  C:      { label: 'C',      icon: '⚔️', gradient: 'from-slate-700 to-slate-800',    border: 'border-slate-500/50',   text: 'text-slate-200',   glow: 'shadow-[0_0_20px_rgba(100,116,139,0.3)]', craftBtn: 'from-slate-500 to-slate-600',     headerGradient: 'from-slate-900 via-slate-800 to-slate-900' },
  B:      { label: 'B',      icon: '🔷', gradient: 'from-blue-700 to-blue-900',      border: 'border-blue-500/50',    text: 'text-blue-200',    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',  craftBtn: 'from-blue-500 to-blue-700',       headerGradient: 'from-blue-950 via-blue-900 to-slate-900' },
  A:      { label: 'A',      icon: '💜', gradient: 'from-purple-700 to-indigo-900',  border: 'border-purple-500/50',  text: 'text-purple-200',  glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]',  craftBtn: 'from-purple-500 to-indigo-600',   headerGradient: 'from-purple-950 via-indigo-950 to-slate-900' },
  MYTHIC: { label: 'MYTHIC', icon: '🌟', gradient: 'from-amber-600 to-yellow-800',   border: 'border-amber-400/60',  text: 'text-amber-200',   glow: 'shadow-[0_0_30px_rgba(245,158,11,0.5)]',  craftBtn: 'from-amber-400 to-yellow-500',    headerGradient: 'from-amber-950 via-yellow-950 to-slate-900' },
  HERO:   { label: 'HERO',   icon: '🦸', gradient: 'from-emerald-700 to-teal-900',   border: 'border-emerald-500/50', text: 'text-emerald-200', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',  craftBtn: 'from-emerald-500 to-teal-600',    headerGradient: 'from-emerald-950 via-teal-950 to-slate-900' },
  VILLAIN:{ label: 'VILLAIN',icon: '💀', gradient: 'from-red-700 to-rose-900',       border: 'border-red-500/50',    text: 'text-red-200',     glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',   craftBtn: 'from-red-500 to-rose-700',        headerGradient: 'from-red-950 via-rose-950 to-slate-900' },
};

export function CharacterTokenForge() {
  const { user, craftCharacterToken, redeemCharacterToken } = useAuth();
  const [category, setCategory] = useState<CharacterShardCategory>('C');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const style = TOKEN_STYLES[category];

  const characters = useMemo(() => {
    if (category === 'HERO') return ALL_CHARACTERS.filter(c => c.alignment === 'Hero' || c.alignment === 'Anti-Hero');
    if (category === 'VILLAIN') return ALL_CHARACTERS.filter(c => c.alignment === 'Villain');
    return ALL_CHARACTERS.filter(c => getCharacterShardCategory(c) === category);
  }, [category]);

  const shards = (user as any)?.tokenShards?.[category] ?? user?.categoryShards?.[category] ?? 0;
  const tokens = user?.characterTokens?.[category] || 0;

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const craft = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await craftCharacterToken(category);
      showMsg(result.success ? 'success' : 'error',
        result.success ? `✅ ${style.label} Token crafted!` : result.error || 'Unable to craft token.');
    } finally { setBusy(false); }
  };

  const redeem = async (characterId: string) => {
    if (busy) return;
    setBusy(true); setRedeemingId(characterId);
    try {
      const result = await redeemCharacterToken(category, characterId);
      showMsg(result.success ? 'success' : 'error',
        result.success ? '🎉 Character permanently added to your collection!' : result.error || 'Unable to redeem token.');
    } finally { setBusy(false); setRedeemingId(null); }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className={`relative p-6 rounded-3xl bg-gradient-to-r ${style.headerGradient} border ${style.border} ${style.glow} overflow-hidden`}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-10 bg-white pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Hammer className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-heading font-black text-white uppercase tracking-wider">Token Forge</h2>
            </div>
            <p className="text-sm text-slate-300">Collect 10 matching shards → craft a Token → unlock any character in that pool</p>
          </div>
          <div className={`text-2xl font-black flex items-center gap-2 ${style.text}`}>{style.icon} {style.label}</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => {
          const s = TOKEN_STYLES[cat];
          const isActive = category === cat;
          return (
            <button key={cat} type="button" onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive ? `bg-gradient-to-r ${s.gradient} border ${s.border} ${s.text} scale-105` : 'bg-black/40 text-slate-400 border border-white/10 hover:border-white/20'
              }`}>
              <span>{s.icon}</span><span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Shards + Craft Row */}
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${style.gradient} border ${style.border} flex flex-wrap items-center justify-between gap-4`}>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="text-center"><div className={`text-3xl font-black ${style.text}`}>{shards}</div><div className="text-xs text-slate-400 uppercase">Shards</div></div>
            <div className="text-slate-400 text-xl">/</div>
            <div className="text-center"><div className="text-3xl font-black text-white">10</div><div className="text-xs text-slate-400 uppercase">Needed</div></div>
            <div className="text-slate-400 text-xl">→</div>
            <div className="text-center"><div className={`text-3xl font-black ${style.text}`}>{tokens}</div><div className="text-xs text-slate-400 uppercase">Tokens</div></div>
          </div>
          <div className="w-48 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div className={`h-full bg-gradient-to-r ${style.craftBtn} rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, (shards / 10) * 100)}%` }} />
          </div>
        </div>
        <button type="button" disabled={busy || shards < 10} onClick={craft}
          className={`px-6 py-3 rounded-xl bg-gradient-to-r ${style.craftBtn} text-white font-black text-sm disabled:opacity-40 transition-all hover:scale-105 flex items-center gap-2`}>
          <Sparkles className="w-4 h-4" /> CRAFT {style.label} TOKEN
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm ${message.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-red-950/60 border-red-500/40 text-red-200'}`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {tokens > 0 && (
        <div className={`p-3 rounded-xl border ${style.border} bg-black/30 flex items-center gap-2 text-sm ${style.text}`}>
          <Zap className="w-4 h-4 flex-shrink-0" />
          You have <strong className="mx-1">{tokens} {style.label} Token{tokens !== 1 ? 's' : ''}</strong> — click any unowned character below to unlock them!
        </div>
      )}

      {/* Characters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[540px] overflow-y-auto">
        {characters.map(character => {
          const owned = user?.ownedCharacters?.includes(character.id);
          const isRedeeming = redeemingId === character.id;
          return (
            <div key={character.id} className={`p-3 rounded-2xl border text-center transition-all ${owned ? 'bg-emerald-950/30 border-emerald-500/20' : `bg-black/40 border-white/10 hover:${style.border}`}`}>
              <CharacterPortrait character={character} size="sm" showBadge={false} className="mx-auto" />
              <div className="mt-2 text-xs font-black text-white line-clamp-2 min-h-[2rem] flex items-center justify-center text-center leading-tight">{character.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{character.grade} • {character.alignment}</div>
              <button type="button" disabled={busy || tokens < 1 || !!owned} onClick={() => redeem(character.id)}
                className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  owned ? 'bg-emerald-900/50 text-emerald-300 cursor-default'
                    : tokens >= 1 ? `bg-gradient-to-r ${style.craftBtn} text-white hover:opacity-90`
                    : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                }`}>
                {isRedeeming ? '...' : owned ? '✓ OWNED' : tokens >= 1 ? 'USE TOKEN' : 'NO TOKENS'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


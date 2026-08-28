import React, { useMemo, useState } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { useAuth } from '../../context/AuthContext';
import { CharacterShardCategory } from '../../data/ascensionProgression';
import { CharacterPortrait } from '../common/CharacterPortrait';

const CATEGORIES: CharacterShardCategory[] = ['C', 'B', 'A', 'MYTHIC'];

export function CharacterTokenForge() {
  const { user, craftCharacterToken, redeemCharacterToken } = useAuth();
  const [category, setCategory] = useState<CharacterShardCategory>('C');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const characters = useMemo(() => ALL_CHARACTERS.filter(character => character.grade === category), [category]);
  const shards = user?.categoryShards?.[category] || 0;
  const tokens = user?.characterTokens?.[category] || 0;

  const craft = async () => {
    if (busy) return;
    setBusy(true);
    const result = await craftCharacterToken(category);
    setMessage(result.success ? `Token crafted for ${category} characters.` : result.error || 'Unable to craft token.');
    setBusy(false);
  };

  const redeem = async (characterId: string) => {
    if (busy) return;
    setBusy(true);
    const result = await redeemCharacterToken(category, characterId);
    setMessage(result.success ? 'Character permanently added to your collection.' : result.error || 'Unable to redeem token.');
    setBusy(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950 to-purple-950 border border-purple-400/40">
        <h2 className="text-2xl font-heading font-black text-white uppercase">Character Token Forge</h2>
        <p className="text-sm text-slate-300 mt-1">10 shards of the same category craft one token. Tokens unlock a character you choose.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {CATEGORIES.map(item => <button key={item} type="button" onClick={() => setCategory(item)}
          className={`px-4 py-2 rounded-xl font-black text-xs ${category === item ? 'bg-cyan-400 text-black' : 'bg-black/40 text-slate-300 border border-white/10'}`}>{item} CATEGORY</button>)}
      </div>
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-200">Shards: <strong className="text-cyan-300">{shards}</strong> / 10 • Tokens: <strong className="text-amber-300">{tokens}</strong></div>
        <button type="button" disabled={busy || shards < 10} onClick={craft}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs disabled:opacity-40">CRAFT TOKEN</button>
      </div>
      {message && <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/50 text-emerald-200 text-sm">{message}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[540px] overflow-y-auto">
        {characters.map(character => {
          const owned = user?.ownedCharacters?.includes(character.id);
          return <div key={character.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
            <CharacterPortrait character={character} size="sm" className="mx-auto" />
            <div className="mt-2 text-xs font-black text-white truncate">{character.name}</div>
            <button type="button" disabled={busy || tokens < 1 || owned} onClick={() => redeem(character.id)}
              className="mt-2 w-full py-2 rounded-lg bg-purple-600 text-white text-[10px] font-black disabled:opacity-40">{owned ? 'OWNED' : 'USE TOKEN'}</button>
          </div>;
        })}
      </div>
    </div>
  );
}

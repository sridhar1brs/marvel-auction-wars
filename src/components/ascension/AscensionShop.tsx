import React, { useState, useMemo } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { 
  ShoppingBag, Sparkles, Filter, Search, Check, Zap, 
  Shield, Flame, Layers, AlertCircle, Award
} from 'lucide-react';

export type AscensionRarity = 'ALL' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export function getCharacterAscensionRarity(char: Character): { rarity: 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'; cost: number; badgeColor: string } {
  if (char.name === 'J. Jonah Jameson') {
    return { rarity: 'RARE', cost: 3500, badgeColor: 'from-blue-500 to-cyan-400' };
  }
  if (char.grade === 'MYTHIC' || char.alignment === 'Cosmic') {
    return { rarity: 'MYTHIC', cost: 50000, badgeColor: 'from-amber-400 via-rose-500 to-purple-600' };
  }
  if (char.overallPower >= 90) {
    return { rarity: 'LEGENDARY', cost: 15000, badgeColor: 'from-amber-500 to-yellow-400' };
  }
  if (char.grade === 'A' || char.overallPower >= 80) {
    return { rarity: 'EPIC', cost: 7500, badgeColor: 'from-purple-500 to-indigo-400' };
  }
  if (char.grade === 'B' || char.overallPower >= 70) {
    return { rarity: 'RARE', cost: 3500, badgeColor: 'from-blue-500 to-cyan-400' };
  }
  return { rarity: 'RARE', cost: 1500, badgeColor: 'from-emerald-500 to-green-400' };
}

export function AscensionShop() {
  const { user, buyCharacter } = useAuth();
  const [selectedRarity, setSelectedRarity] = useState<AscensionRarity>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaction, setSelectedFaction] = useState('ALL');
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [purchaseNotice, setPurchaseNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const ownedCharacterIds = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);

  const filteredCharacters = useMemo(() => {
    return ALL_CHARACTERS.filter(char => {
      const { rarity } = getCharacterAscensionRarity(char);
      if (selectedRarity !== 'ALL' && rarity !== selectedRarity) return false;
      if (selectedFaction !== 'ALL' && !char.factions?.includes(selectedFaction as any)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = char.name.toLowerCase().includes(q);
        const matchAlias = char.alias?.toLowerCase().includes(q);
        const matchPower = char.powers.toLowerCase().includes(q);
        if (!matchName && !matchAlias && !matchPower) return false;
      }
      return true;
    });
  }, [selectedRarity, selectedFaction, searchQuery]);

  const handleBuy = async (char: Character) => {
    if (!user) {
      soundManager.playAttackHit();
      setPurchaseNotice({ type: 'error', text: 'Please sign in to recruit characters in Astra Shop.' });
      return;
    }

    const { cost } = getCharacterAscensionRarity(char);
    const userAstra = user.astra ?? 0;
    if (userAstra < cost) {
      soundManager.playAttackHit();
      setPurchaseNotice({ type: 'error', text: `Insufficient Astra! Need ✨ ${cost.toLocaleString()} Astra, you have ✨ ${userAstra.toLocaleString()}.` });
      return;
    }

    setIsPurchasing(char.id);
    setPurchaseNotice(null);

    const result = await buyCharacter(char.id, cost);
    setIsPurchasing(null);

    if (result.success) {
      soundManager.playVictory();
      if (result.isDuplicate) {
        setPurchaseNotice({
          type: 'success',
          text: `Duplicate ${char.name} recruited! Converted into +${result.shardsAwarded || 20} Character Shards for upgrades.`
        });
      } else {
        setPurchaseNotice({
          type: 'success',
          text: `Successfully recruited ${char.name} to your persistent Ascension collection!`
        });
      }
      setTimeout(() => setPurchaseNotice(null), 4000);
    } else {
      soundManager.playAttackHit();
      setPurchaseNotice({ type: 'error', text: result.error || 'Failed to purchase character.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* Shop Header Banner */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#1A0C2E] via-[#0E1533] to-[#120822] border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>MULTIVERSE HERO RECRUITMENT REPOSITORY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            ASTRA CHARACTER SHOP
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Spend earned <strong>Astra (✨)</strong> to recruit permanent Marvel heroes. Duplicates automatically convert to <strong>Character Shards</strong> for Level 1–50 upgrades!
          </p>
        </div>

        {/* Player Balance Card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/40 shadow-glow-gold flex items-center gap-3.5 shrink-0 z-10">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-400 flex items-center justify-center text-2xl shadow-sm animate-pulse">
            ✨
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
              AVAILABLE BALANCE
            </span>
            <span className="text-2xl font-heading font-black text-white">
              {(user?.astra ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">ASTRA</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {purchaseNotice && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-fadeIn ${
          purchaseNotice.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-glow-green'
            : 'bg-red-950/90 border-red-500 text-red-200 shadow-glow-red'
        }`}>
          {purchaseNotice.type === 'success' ? <Check className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          <span>{purchaseNotice.text}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/10">
        
        {/* Rarity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {(['ALL', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'] as AscensionRarity[]).map(rarity => (
            <button
              key={rarity}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedRarity(rarity);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedRarity === rarity
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 350 characters..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filteredCharacters.map(char => {
          const { rarity, cost, badgeColor } = getCharacterAscensionRarity(char);
          const isOwned = ownedCharacterIds.has(char.id);
          const shardCount = user?.characterShards[char.id] || 0;
          const charLevel = user?.characterLevels[char.id] || 1;

          return (
            <div
              key={char.id}
              className={`relative rounded-2xl bg-gradient-to-b from-[#121526] to-[#080A14] border-2 transition-all flex flex-col justify-between overflow-hidden group shadow-lg ${
                isOwned
                  ? 'border-emerald-500/50 hover:border-emerald-400 shadow-glow-green/20'
                  : 'border-white/10 hover:border-cyan-400/80 hover:shadow-glow-cyan/30'
              }`}
            >
              {/* Rarity & Power Header Badge */}
              <div className="p-2.5 flex items-center justify-between border-b border-white/5 bg-black/40">
                <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-gradient-to-r ${badgeColor} text-black`}>
                  {rarity}
                </span>
                <span className="text-[11px] font-mono font-black text-amber-300">
                  {char.overallPower} PWR
                </span>
              </div>

              {/* Character Portrait */}
              <div className="p-3 text-center space-y-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-md group-hover:scale-105 transition-transform bg-black">
                  <CharacterPortrait character={char} size="lg" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-heading font-black text-xs sm:text-sm text-white uppercase truncate group-hover:text-cyan-300 transition-colors">
                    {char.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {char.factions?.[0] || char.alignment}
                  </span>
                </div>
              </div>

              {/* Status / Purchase Action Button */}
              <div className="p-2.5 bg-black/50 border-t border-white/10 space-y-1.5">
                {isOwned && (
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold px-1">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> OWNED (LVL {charLevel})
                    </span>
                    {shardCount > 0 && (
                      <span className="text-purple-300 font-mono">{shardCount} Shards</span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  disabled={isPurchasing === char.id}
                  onClick={() => handleBuy(char)}
                  className={`w-full py-2 px-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isOwned
                      ? 'bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/50'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-glow-gold'
                  }`}
                >
                  {isPurchasing === char.id ? (
                    <span>RECRUITING...</span>
                  ) : isOwned ? (
                    <span className="flex items-center gap-1">
                      <span>BUY DUPE (+20 🧩)</span>
                      <span className="text-amber-300 font-mono">✨{cost.toLocaleString()}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span>RECRUIT</span>
                      <span className="font-mono font-bold">✨{cost.toLocaleString()}</span>
                    </span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

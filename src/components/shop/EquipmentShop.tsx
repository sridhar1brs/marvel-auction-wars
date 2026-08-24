import { useState } from 'react';
import { Player, Character, ArtifactItem } from '../../types/game';
import { MARVEL_ARTIFACTS } from '../../data/artifacts';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, DollarSign, Shield, Zap, Swords, ArrowRight, Check, ShoppingBag } from 'lucide-react';

interface Props {
  players: Player[];
  onUpdatePlayerCollection: (playerId: string, updatedCollection: Character[], updatedMoney: number) => void;
  onProceedToBattles: () => void;
  onBack?: () => void;
  isLocalMode?: boolean;
  controllingPlayerId?: string;
}

export function EquipmentShop({
  players,
  onUpdatePlayerCollection,
  onProceedToBattles,
  onBack,
  isLocalMode = true,
  controllingPlayerId,
}: Props) {
  const initialPlayerId = (!isLocalMode && controllingPlayerId)
    ? (players.find(p => p.id === controllingPlayerId)?.id || players[0]?.id || '')
    : (players[0]?.id || '');

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(initialPlayerId);
  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number>(0);

  const activePlayer = players.find(p => p.id === selectedPlayerId) || players[0];
  const selectedHero: Character | undefined = activePlayer?.collection[selectedHeroIndex];

  const handleBuyAndEquip = (artifact: ArtifactItem) => {
    if (!activePlayer || !selectedHero) return;
    
    const refund = selectedHero.equippedArtifact ? selectedHero.equippedArtifact.cost : 0;
    if (activePlayer.money + refund < artifact.cost) return;

    soundManager.playClick();
    soundManager.playAbilityTrigger();

    const updatedCollection = activePlayer.collection.map((hero, idx) => {
      if (idx === selectedHeroIndex) {
        return {
          ...hero,
          equippedArtifact: artifact,
        };
      }
      return hero;
    });

    const newMoney = activePlayer.money + refund - artifact.cost;
    onUpdatePlayerCollection(activePlayer.id, updatedCollection, newMoney);
  };

  const handleRemoveArtifact = () => {
    if (!activePlayer || !selectedHero || !selectedHero.equippedArtifact) return;
    soundManager.playClick();

    const refund = selectedHero.equippedArtifact.cost;
    const updatedCollection = activePlayer.collection.map((hero, idx) => {
      if (idx === selectedHeroIndex) {
        return {
          ...hero,
          equippedArtifact: null,
        };
      }
      return hero;
    });

    onUpdatePlayerCollection(activePlayer.id, updatedCollection, activePlayer.money + refund);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-shake">
      {/* Title */}
      <div className="text-center relative">
        {onBack && (
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="sm:absolute left-0 top-0 mb-3 sm:mb-0 px-3.5 py-1.5 bg-black/40 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
          >
            ← Return to Match
          </button>
        )}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 shadow-glow-cosmic text-purple-200 text-xs font-black uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>MID-GAME RELIC VAULT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider">
          TACTICAL ARTIFACTS SHOP
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1">
          Spend your remaining auction cash ($) to forge and equip legendary Marvel artifacts onto your heroes before entering the tournament arena!
        </p>
      </div>

      {/* Local Mode Player Switcher */}
      {isLocalMode && players.length > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedPlayerId(p.id);
                setSelectedHeroIndex(0);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-black transition-all border ${
                p.id === selectedPlayerId
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-400 shadow-glow-cosmic'
                  : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <span>{p.avatar}</span>
              <span>{p.name} (${p.money})</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Left Roster Heroes (5 cols), Right Artifacts Catalog (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Player Roster & Selected Hero (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">CURRENT SQUAD</span>
              <h2 className="text-base font-heading font-black text-white">{activePlayer.name}'s Roster</h2>
            </div>
            <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-xl text-emerald-300 font-black text-sm">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${activePlayer.money} Left</span>
            </div>
          </div>

          {/* Hero Selection Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activePlayer.collection.map((hero, idx) => (
              <div
                key={hero.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedHeroIndex(idx);
                }}
                className={`p-2 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                  selectedHeroIndex === idx
                    ? 'border-purple-500 bg-purple-950/40 shadow-glow-cosmic'
                    : 'border-white/10 bg-black/40 hover:border-slate-500'
                }`}
              >
                <CharacterPortrait character={hero} size="sm" showBadge={true} />
                <span className="font-bold text-[11px] text-white mt-1 truncate w-full">{hero.name}</span>
                {hero.equippedArtifact ? (
                  <span className="text-[9px] text-amber-400 font-extrabold flex items-center gap-0.5 mt-0.5 truncate">
                    <span>{hero.equippedArtifact.icon}</span>
                    <span className="truncate">{hero.equippedArtifact.name}</span>
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500 font-semibold mt-0.5">No Item</span>
                )}
              </div>
            ))}
          </div>

          {/* Selected Hero Showcase & Equipped Item */}
          {selectedHero && (
            <div className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <CharacterPortrait character={selectedHero} size="sm" showBadge={false} />
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-400">EQUIPPING TARGET:</span>
                  <h3 className="font-heading font-black text-base text-white">{selectedHero.name}</h3>
                  <span className="text-xs text-slate-400 font-semibold">PWR {selectedHero.overallPower} • {selectedHero.grade} Tier</span>
                </div>
              </div>

              {selectedHero.equippedArtifact ? (
                <div className="p-3 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/50 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <span className="text-base">{selectedHero.equippedArtifact.icon}</span>
                      <span>{selectedHero.equippedArtifact.name}</span>
                    </span>
                    <button
                      onClick={handleRemoveArtifact}
                      className="text-[10px] bg-red-950 hover:bg-red-900 text-red-200 border border-red-500/40 px-2 py-0.5 rounded font-bold transition-colors"
                    >
                      Unequip (+${selectedHero.equippedArtifact.cost})
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {selectedHero.equippedArtifact.description}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-black/40 border border-dashed border-white/10 rounded-xl text-center text-xs text-slate-400">
                  Select any artifact on the right to equip onto {selectedHero.name}.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Marvel Artifacts Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-heading font-black text-white uppercase tracking-wider">
                  Available Marvel Relics
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">8 Relics in Stock</span>
            </div>

            {/* Artifact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {MARVEL_ARTIFACTS.map(artifact => {
                const refundAmount = selectedHero?.equippedArtifact ? selectedHero.equippedArtifact.cost : 0;
                const canAfford = (activePlayer.money + refundAmount) >= artifact.cost;
                const isEquippedOnHero = selectedHero?.equippedArtifact?.id === artifact.id;

                return (
                  <div
                    key={artifact.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isEquippedOnHero
                        ? 'bg-purple-950/60 border-purple-500 shadow-glow-cosmic'
                        : 'bg-black/40 border-white/10 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{artifact.icon}</span>
                          <span className="font-heading font-black text-xs sm:text-sm text-white">
                            {artifact.name}
                          </span>
                        </div>
                        <span className="font-black text-emerald-400 text-xs bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          ${artifact.cost}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug mb-3">
                        {artifact.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBuyAndEquip(artifact)}
                      disabled={!canAfford || isEquippedOnHero || !selectedHero}
                      className={`w-full py-1.5 rounded-lg text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                        isEquippedOnHero
                          ? 'bg-purple-900 text-purple-200 border border-purple-400 cursor-default'
                          : canAfford
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md'
                          : 'bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {isEquippedOnHero ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>EQUIPPED</span>
                        </>
                      ) : canAfford ? (
                        <>
                          <span>BUY & EQUIP (${artifact.cost})</span>
                        </>
                      ) : (
                        <span>NEED ${artifact.cost}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proceed to Tournament Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onProceedToBattles();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-heading font-black text-base uppercase tracking-wider shadow-glow-red transition-all flex items-center justify-center gap-2"
          >
            <span>PROCEED TO TOURNAMENT BATTLES</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

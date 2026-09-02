import React, { useState } from 'react';
import { DungeonRunState, DungeonShopItem } from '../../types/dungeon';
import { soundManager } from '../../audio/soundManager';
import { 
  ShoppingBag, Sparkles, Shield, Swords, Heart, Zap, 
  Check, ArrowRight, AlertCircle, Coins, X
} from 'lucide-react';

interface Props {
  runState: DungeonRunState;
  shopItems: DungeonShopItem[];
  onPurchaseItem: (item: DungeonShopItem) => void;
  onClose: () => void;
}

export function DungeonShopModal({ runState, shopItems, onPurchaseItem, onClose }: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBuy = (item: DungeonShopItem) => {
    if (item.isPurchased) return;
    if (runState.dungeonAstra < item.costAstra) {
      soundManager.playOutbid();
      setErrorMsg(`Insufficient Dungeon Astra! Need ✨ ${item.costAstra.toLocaleString()}, you have ✨ ${runState.dungeonAstra.toLocaleString()}.`);
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    soundManager.playBidPlaced();
    onPurchaseItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#091524] via-[#050D18] to-black border-2 border-cyan-500/70 shadow-[0_0_60px_rgba(6,182,212,0.4)] p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Outpost Merchant
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide mt-1">
              Mid-Dungeon Supply Vault
            </h2>
            <p className="text-xs text-slate-300">
              Spend run Astra to buy tactical relics, field medkits, revival defibrillators, or draft shard caches!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-black/80 border border-cyan-500/40 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-mono font-bold uppercase">Expedition Astra</div>
                <div className="text-sm font-heading font-black text-amber-300">✨ {runState.dungeonAstra.toLocaleString()}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-950/90 border border-red-500 text-red-300 text-xs font-mono flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shopItems.map(item => {
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
                  item.isPurchased
                    ? 'bg-emerald-950/30 border-emerald-500/60 opacity-80'
                    : 'bg-slate-900/90 border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-cyan-400/40 flex items-center justify-center text-xl shadow">
                      {item.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold uppercase">
                      {item.rarity} {item.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-heading font-black text-white">{item.name}</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    ✨ {item.costAstra.toLocaleString()} Astra
                  </span>

                  <button
                    type="button"
                    disabled={item.isPurchased}
                    onClick={() => handleBuy(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      item.isPurchased
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-md hover:scale-105'
                    }`}
                  >
                    {item.isPurchased ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Purchased</span>
                      </>
                    ) : (
                      <span>Buy Item</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            CONTINUE EXPEDITION
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { DungeonShopItem } from '../../types/dungeon';
import { generatePrepShopInventory } from '../../engine/dungeonRogueliteEngine';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { 
  ShoppingBag, Sparkles, Shield, Swords, Heart, Zap, 
  Check, ArrowLeft, AlertCircle, Coins
} from 'lucide-react';

interface Props {
  purchasedItems: DungeonShopItem[];
  onPurchaseItem: (item: DungeonShopItem) => void;
  onClose: () => void;
}

export function DungeonPrepShop({ purchasedItems, onPurchaseItem, onClose }: Props) {
  const { user, deductAstra } = useAuth();
  const [shopItems, setShopItems] = useState<DungeonShopItem[]>(() => generatePrepShopInventory());
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const purchasedIds = new Set(purchasedItems.map(p => p.id));
  const userAstra = user?.astra || 0;

  const handleBuy = async (item: DungeonShopItem) => {
    if (purchasedIds.has(item.id) || isProcessing) return;
    if (userAstra < item.costAstra) {
      soundManager.playOutbid();
      setPurchaseError(`Insufficient Astra! Need ✨ ${item.costAstra.toLocaleString()}, you have ✨ ${userAstra.toLocaleString()}.`);
      setTimeout(() => setPurchaseError(null), 3000);
      return;
    }

    setIsProcessing(item.id);
    const res = await deductAstra(item.costAstra, `Dungeon Prep: ${item.name}`);
    setIsProcessing(null);

    if (res.success) {
      soundManager.playBidPlaced();
      onPurchaseItem(item);
    } else {
      soundManager.playOutbid();
      setPurchaseError(res.error || 'Purchase failed.');
      setTimeout(() => setPurchaseError(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1C1205] via-[#100B02] to-black border-2 border-amber-500/70 shadow-[0_0_60px_rgba(245,158,11,0.4)] p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Pre-Expedition Armory
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide mt-1">
              Dungeon Preparation Shop
            </h2>
            <p className="text-xs text-slate-300">
              Spend Astra to purchase field healing kits, core power matrices, and defensive stimulants before stepping into the ruins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-black/80 border border-amber-500/40 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-mono font-bold uppercase">Available Astra</div>
                <div className="text-sm font-heading font-black text-amber-300">✨ {userAstra.toLocaleString()}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {purchaseError && (
          <div className="p-3.5 rounded-2xl bg-red-950/90 border border-red-500 text-red-300 text-xs font-mono flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{purchaseError}</span>
          </div>
        )}

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shopItems.map(item => {
            const isOwned = purchasedIds.has(item.id);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
                  isOwned
                    ? 'bg-emerald-950/30 border-emerald-500/60 opacity-90'
                    : 'bg-slate-900/90 border-white/10 hover:border-amber-500/50 hover:bg-slate-800/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-amber-400/40 flex items-center justify-center text-xl shadow">
                      {item.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase">
                      {item.type.replace('_', ' ')}
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
                    disabled={isOwned}
                    onClick={() => handleBuy(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      isOwned
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-md hover:scale-105'
                    }`}
                  >
                    {isOwned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Equipped</span>
                      </>
                    ) : (
                      <span>Purchase</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            RETURN TO SQUAD SELECTION
          </button>
        </div>
      </div>
    </div>
  );
}

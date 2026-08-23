import { useState } from 'react';
import { Player, AuctionState, GameSettings } from '../../types/game';
import { DollarSign, ArrowUp, FastForward, CheckCircle, ShieldAlert, Lock, EyeOff } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { getScaledStartingPrice } from '../../../server/auctionEngine';

interface Props {
  activePlayer: Player;
  auction: AuctionState;
  settings: GameSettings;
  onPlaceBid: (playerId: string, amount: number) => void;
  onVoteSkip: (playerId: string) => void;
  onConcede?: () => void;
  isLocalMode?: boolean;
  eligiblePlayersCount: number;
}

export function BidControls({
  activePlayer,
  auction,
  settings,
  onPlaceBid,
  onVoteSkip,
  onConcede,
  isLocalMode,
  eligiblePlayersCount,
}: Props) {
  const [customBid, setCustomBid] = useState<string>('');
  const isBlindBidding = settings.gameMode === 'blind_bidding';

  const scaledStartingPrice = auction.currentCharacter
    ? getScaledStartingPrice(auction.currentCharacter.startingPrice, settings.startingMoney)
    : 1;

  const currentBid = auction.currentBid > 0 
    ? auction.currentBid 
    : scaledStartingPrice;

  const minNextBid = auction.currentBid > 0 
    ? auction.currentBid + 1 
    : scaledStartingPrice;

  const isHighestBidder = auction.highestBidderId === activePlayer.id;
  const isFull = activePlayer.collection.length >= settings.characterLimit;
  const hasBidded = auction.hasBidded.includes(activePlayer.id);
  const hasVotedSkip = auction.skipVotes.includes(activePlayer.id);
  const canAffordMin = activePlayer.money >= minNextBid;

  const handleQuickBid = (increment: number) => {
    const target = currentBid + increment;
    if (target <= activePlayer.money) {
      soundManager.playClick();
      onPlaceBid(activePlayer.id, target);
    }
  };

  const handleCustomBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customBid, 10);
    if (!isNaN(amount) && amount >= minNextBid && amount <= activePlayer.money) {
      soundManager.playClick();
      onPlaceBid(activePlayer.id, amount);
      setCustomBid('');
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
      {/* Blind Bidding Notification Banner */}
      {isBlindBidding && (
        <div className="p-2.5 bg-purple-950/80 border border-purple-500/60 rounded-xl flex items-center gap-2 text-xs text-purple-200">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>SEALED BLIND BIDDING:</strong> Rival bids are classified ($???). Place your secret bid!
          </span>
        </div>
      )}

      {/* Current Bidder & Active Player Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-800 rounded-lg text-lg">
            {activePlayer.avatar}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              {isLocalMode ? 'CURRENT TURN:' : 'CONTROLLING PLAYER:'}
            </span>
            <span className="font-heading font-black text-sm text-white">
              {activePlayer.name} (${activePlayer.money} Available)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase">
            {isBlindBidding ? 'START PRICE:' : 'MIN BID:'}
          </span>
          <span className="font-heading font-black text-emerald-400 text-base bg-black/60 px-3 py-0.5 rounded-lg border border-emerald-500/40">
            ${minNextBid}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      {isFull ? (
        <div className="p-3 bg-slate-900/80 border border-white/10 rounded-xl text-center text-xs font-bold text-slate-400">
          ✓ Character limit reached ({settings.characterLimit}/{settings.characterLimit}). Spectating current auctions.
        </div>
      ) : isHighestBidder ? (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-center text-xs font-black text-emerald-300 shadow-glow-gold animate-pulse">
          👑 YOU CURRENTLY LEAD THIS AUCTION {isBlindBidding ? '(Sealed Bid Placed)' : `($${auction.currentBid})`}
        </div>
      ) : !canAffordMin ? (
        <div className="space-y-3">
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-center text-xs font-bold text-red-200">
            ⚠️ Insufficient funds. Next minimum bid is ${minNextBid}, but you have ${activePlayer.money}.
          </div>
          {auction.highestBidderId && onConcede && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onConcede();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-900/80 to-red-950/80 hover:from-amber-800 hover:to-red-900 border border-amber-500/50 text-amber-200 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>🏳️ GIVE UP / CONCEDE CARD</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Quick Increment Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onPlaceBid(activePlayer.id, minNextBid)}
              disabled={activePlayer.money < minNextBid}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-40 text-white font-heading font-black text-sm uppercase tracking-wide shadow-glow-red transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>BID ${minNextBid}</span>
            </button>

            <button
              onClick={() => handleQuickBid(2)}
              disabled={activePlayer.money < currentBid + 2}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-heading font-black text-xs uppercase tracking-wide border border-white/10 transition-all flex items-center justify-center gap-1"
            >
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>+ $2 (${currentBid + 2})</span>
            </button>

            <button
              onClick={() => handleQuickBid(5)}
              disabled={activePlayer.money < currentBid + 5}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-heading font-black text-xs uppercase tracking-wide border border-white/10 transition-all flex items-center justify-center gap-1"
            >
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span>+ $5 (${currentBid + 5})</span>
            </button>

            <button
              onClick={() => onPlaceBid(activePlayer.id, activePlayer.money)}
              disabled={activePlayer.money < minNextBid}
              className="py-2.5 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 disabled:opacity-40 text-purple-200 font-heading font-black text-xs uppercase tracking-wide border border-purple-500/50 shadow-glow-cosmic transition-all flex items-center justify-center gap-1"
            >
              <FastForward className="w-3 h-3 text-purple-400" />
              <span>ALL-IN (${activePlayer.money})</span>
            </button>
          </div>

          {/* Custom Bid Input Form */}
          <form onSubmit={handleCustomBidSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-bold">$</span>
              <input
                type="number"
                min={minNextBid}
                max={activePlayer.money}
                value={customBid}
                onChange={e => setCustomBid(e.target.value)}
                placeholder={`Secret Custom Bid ($${minNextBid} - $${activePlayer.money})`}
                className="w-full bg-black/50 border border-white/10 pl-7 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={!customBid || parseInt(customBid, 10) < minNextBid || parseInt(customBid, 10) > activePlayer.money}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors shrink-0 flex items-center gap-1"
            >
              {isBlindBidding && <Lock className="w-3 h-3 text-amber-400" />}
              <span>{isBlindBidding ? 'Seal Bid' : 'Submit Bid'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Skip Card Action */}
      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <FastForward className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>
            Passing on this lot? Click skip to immediately advance to next hero.
          </span>
        </div>

        <button
          onClick={() => onVoteSkip(activePlayer.id)}
          disabled={!auction.isActive}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 hover:bg-purple-900/80 text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-400 shadow-md hover:shadow-glow-cosmic transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FastForward className="w-4 h-4 text-purple-300" />
          <span>⏭️ SKIP THIS CARD NOW</span>
        </button>
      </div>
    </div>
  );
}

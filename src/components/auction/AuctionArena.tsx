import { useState } from 'react';
import { GameState, Player } from '../../types/game';
import { CharacterCard } from '../common/CharacterCard';
import { MysteryCrateCard } from '../common/MysteryCrateCard';
import { PlayerHUD } from './PlayerHUD';
import { AuctionTimer } from './AuctionTimer';
import { BidControls } from './BidControls';
import { soundManager } from '../../audio/soundManager';
import { Activity, Crown, Clock, ArrowRight, ShieldAlert, Sparkles, Columns, LayoutGrid, Lock, ShoppingBag } from 'lucide-react';

interface Props {
  state: GameState;
  socketId?: string;
  onPlaceBid: (playerId: string, amount: number) => void;
  onVoteSkip: (playerId: string) => void;
  onOpenRelicShop?: () => void;
  isLocalMode?: boolean;
}

export function AuctionArena({
  state,
  socketId,
  onPlaceBid,
  onVoteSkip,
  onOpenRelicShop,
  isLocalMode = true,
}: Props) {
  const [localTurnPlayerId, setLocalTurnPlayerId] = useState<string>(
    state.players.find(p => !p.isBot)?.id || state.players[0]?.id || ''
  );
  const [isDualSplitScreen, setIsDualSplitScreen] = useState<boolean>(false);

  const char = state.auction.currentCharacter;
  const isBlindBidding = state.settings.gameMode === 'blind_bidding';

  // In Local mode, controlling player is chosen via turn or selector
  const controllingPlayer = isLocalMode
    ? (state.players.find(p => p.id === localTurnPlayerId) || state.players[0])
    : (state.players.find(p => p.id === socketId) || state.players[0]);

  const eligiblePlayers = state.players.filter(
    p => p.collection.length < state.settings.characterLimit
  );

  const humanPlayers = state.players.filter(p => !p.isBot);

  const handleNextLocalTurn = () => {
    soundManager.playClick();
    const humanEligible = state.players.filter(p => !p.isBot && p.collection.length < state.settings.characterLimit);
    if (humanEligible.length === 0) return;
    const currentIdx = humanEligible.findIndex(p => p.id === localTurnPlayerId);
    const nextIdx = (currentIdx + 1) % humanEligible.length;
    setLocalTurnPlayerId(humanEligible[nextIdx].id);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top HUD & Options Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          {isBlindBidding && (
            <span className="flex items-center gap-1 bg-purple-950/90 text-purple-200 border border-purple-500/60 px-3 py-1 rounded-xl text-xs font-black">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>BLIND SEALED BIDDING</span>
            </span>
          )}
          <span className="text-xs font-bold text-slate-300">
            Round: {state.purchasedCharacters.length + state.skippedCharacters.length + 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual Split Screen Toggle Option for 2+ Players */}
          {isLocalMode && humanPlayers.length >= 2 && (
            <button
              onClick={() => {
                soundManager.playClick();
                setIsDualSplitScreen(prev => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isDualSplitScreen
                  ? 'bg-purple-900/90 text-purple-200 border-purple-400 shadow-glow-cosmic'
                  : 'bg-marvel-card text-slate-300 border-white/10 hover:border-slate-500'
              }`}
            >
              {isDualSplitScreen ? <LayoutGrid className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
              <span>{isDualSplitScreen ? 'Full Arena View' : '2-Screen Dual View'}</span>
            </button>
          )}

          {/* Quick Relic Shop launcher */}
          {onOpenRelicShop && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenRelicShop();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50 hover:bg-amber-900 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Relic Vault</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Player HUD */}
      <PlayerHUD
        players={state.players}
        auction={state.auction}
        settings={state.settings}
        activeTurnPlayerId={isLocalMode ? localTurnPlayerId : socketId}
        onSelectPlayerTurn={setLocalTurnPlayerId}
        isLocalMode={isLocalMode}
      />

      {/* DUAL SPLIT SCREEN 2-PLAYER VIEW */}
      {isDualSplitScreen && humanPlayers.length >= 2 ? (
        <div className="space-y-4">
          {/* Center Compact Spotlight Card & Timer */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              {char && (
                <CharacterCard 
                  character={char} 
                  size="sm" 
                  isSpotlight={true} 
                  startingMoney={state.settings.startingMoney} 
                />
              )}
            </div>
            <div className="md:col-span-4 glass-panel p-4 rounded-2xl border border-white/10">
              <AuctionTimer
                timeRemaining={state.auction.timeRemaining}
                totalTime={state.settings.auctionTimerSeconds}
                antiSnipingActive={true}
              />
            </div>
          </div>

          {/* 2 Split Player Stations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 Screen Half */}
            <div className="glass-panel p-4 rounded-2xl border border-red-500/40 bg-red-950/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-heading font-black text-white flex items-center gap-2">
                  <span className="text-xl">{humanPlayers[0].avatar}</span>
                  <span>{humanPlayers[0].name} (Screen 1)</span>
                </span>
                <span className="text-emerald-400 font-black text-sm">${humanPlayers[0].money}</span>
              </div>
              <BidControls
                activePlayer={humanPlayers[0]}
                auction={state.auction}
                settings={state.settings}
                onPlaceBid={onPlaceBid}
                onVoteSkip={onVoteSkip}
                isLocalMode={false}
                eligiblePlayersCount={eligiblePlayers.length}
              />
            </div>

            {/* Player 2 Screen Half */}
            <div className="glass-panel p-4 rounded-2xl border border-blue-500/40 bg-blue-950/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-heading font-black text-white flex items-center gap-2">
                  <span className="text-xl">{humanPlayers[1].avatar}</span>
                  <span>{humanPlayers[1].name} (Screen 2)</span>
                </span>
                <span className="text-emerald-400 font-black text-sm">${humanPlayers[1].money}</span>
              </div>
              <BidControls
                activePlayer={humanPlayers[1]}
                auction={state.auction}
                settings={state.settings}
                onPlaceBid={onPlaceBid}
                onVoteSkip={onVoteSkip}
                isLocalMode={false}
                eligiblePlayersCount={eligiblePlayers.length}
              />
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD ARENA LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Spotlight Character Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full">
              {/* Status Announcement Banner */}
              <div className="mb-3 flex items-center justify-between gap-2 px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-extrabold text-slate-200">
                    {state.auction.statusMessage}
                  </span>
                </div>

                {state.auction.highestBidderName && (
                  <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>
                      {state.auction.highestBidderName}{' '}
                      {isBlindBidding && state.auction.isActive ? '(Sealed)' : `($${state.auction.currentBid})`}
                    </span>
                  </div>
                )}
              </div>

              {/* In Blind Bidding, character card IS revealed as requested, and amounts are sealed! */}
              {char ? (
                <CharacterCard 
                  character={char} 
                  size="lg" 
                  isSpotlight={true} 
                  startingMoney={state.settings.startingMoney} 
                />
              ) : (
                <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center text-slate-400">
                  Waiting for next character reveal...
                </div>
              )}
            </div>
          </div>

          {/* Right Stage: Timer, Bidding Controls & Live Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Auction Countdown Timer */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <AuctionTimer
                timeRemaining={state.auction.timeRemaining}
                totalTime={state.settings.auctionTimerSeconds}
                antiSnipingActive={true}
              />
            </div>

            {/* Local Mode Pass-Device Quick Switcher */}
            {isLocalMode && eligiblePlayers.filter(p => !p.isBot).length > 1 && (
              <div className="flex items-center justify-between p-3 bg-red-950/40 border border-red-500/40 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{controllingPlayer.avatar}</span>
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Pass Device to:</span>
                    <strong className="text-white font-black">{controllingPlayer.name}</strong>
                  </div>
                </div>
                <button
                  onClick={handleNextLocalTurn}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  <span>Pass Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Bid Controls Panel */}
            <BidControls
              activePlayer={controllingPlayer}
              auction={state.auction}
              settings={state.settings}
              onPlaceBid={onPlaceBid}
              onVoteSkip={onVoteSkip}
              isLocalMode={isLocalMode}
              eligiblePlayersCount={eligiblePlayers.length}
            />

            {/* Live Bids History Feed */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-slate-200">
                  {isBlindBidding ? 'Sealed Bids Log' : 'Live Bid Log'}
                </h3>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {state.auction.bidsHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No bids placed yet.</p>
                ) : (
                  state.auction.bidsHistory.slice().reverse().map((bid, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-black/40 border border-white/5"
                    >
                      <span className="font-bold text-slate-200">{bid.playerName}</span>
                      <span className="font-extrabold text-emerald-400">
                        {isBlindBidding && state.auction.isActive ? '[🔒 SEALED BID]' : `$${bid.amount}`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

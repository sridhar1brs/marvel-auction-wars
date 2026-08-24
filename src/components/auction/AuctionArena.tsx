import { useState, useEffect } from 'react';
import { GameState, Player } from '../../types/game';
import { CharacterCard } from '../common/CharacterCard';
import { MysteryCrateCard } from '../common/MysteryCrateCard';
import { PlayerHUD } from './PlayerHUD';
import { AuctionTimer } from './AuctionTimer';
import { BidControls } from './BidControls';
import { FloatingReactions } from '../common/FloatingReactions';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import { Activity, Crown, Clock, ArrowRight, ShieldAlert, Sparkles, Columns, LayoutGrid, Lock, ShoppingBag, Radio, Zap, Eye } from 'lucide-react';

interface Props {
  state: GameState;
  socketId?: string;
  onPlaceBid: (playerId: string, amount: number) => void;
  onVoteSkip: (playerId: string) => void;
  onInstantSkip?: () => void;
  onConcede?: () => void;
  onOpenRelicShop?: () => void;
  isLocalMode?: boolean;
}

export function AuctionArena({
  state,
  socketId,
  onPlaceBid,
  onVoteSkip,
  onInstantSkip,
  onConcede,
  onOpenRelicShop,
  isLocalMode = true,
}: Props) {
  const [localTurnPlayerId, setLocalTurnPlayerId] = useState<string>(
    state.players.find(p => !p.isBot)?.id || state.players[0]?.id || ''
  );
  const [isSplitScreen, setIsSplitScreen] = useState<boolean>(false);
  const [empActiveUntil, setEmpActiveUntil] = useState<number>(0);
  const [spyDroneActiveUntil, setSpyDroneActiveUntil] = useState<number>(0);
  const [tacticalMessage, setTacticalMessage] = useState<string | null>(null);

  const char = state.auction.currentCharacter;
  const isBlindBidding = state.settings.gameMode === 'blind_bidding';
  const isBlitz = state.settings.gameMode === 'blitz';

  const isEmpGlitched = Date.now() < empActiveUntil;
  const isSpyDroneScanning = Date.now() < spyDroneActiveUntil;

  // In Local mode, controlling player is chosen via turn or selector
  const controllingPlayer = isLocalMode
    ? (state.players.find(p => p.id === localTurnPlayerId) || state.players[0])
    : (state.players.find(p => p.id === socketId) || state.players[0]);

  const handleTriggerEmp = (player: Player) => {
    if (player.money < 3) return;
    player.money -= 3;
    playSound('clash');
    setEmpActiveUntil(Date.now() + 2500);
    setTacticalMessage(`⚡ ${player.name} detonated an EMP BLAST! Bidding systems jammed for 2.5s!`);
    setTimeout(() => setTacticalMessage(null), 3000);
  };

  const handleTriggerSpyDrone = (player: Player) => {
    if (player.money < 2) return;
    player.money -= 2;
    playSound('powerUp');
    setSpyDroneActiveUntil(Date.now() + 5000);
    setTacticalMessage(`📡 ${player.name} launched a SPY DRONE! Revealing opponent stashes for 5s!`);
    setTimeout(() => setTacticalMessage(null), 5000);
  };

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

  const getSplitGridCols = () => {
    if (humanPlayers.length === 2) return 'grid-cols-1 md:grid-cols-2';
    if (humanPlayers.length === 3) return 'grid-cols-1 md:grid-cols-3';
    if (humanPlayers.length === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top HUD & Options Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          {isBlindBidding && (
            <div className="px-3 py-1 bg-purple-950/80 border border-purple-500 rounded-full flex items-center gap-1 text-[11px] font-bold text-purple-200">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Blind Bidding</span>
            </div>
          )}
          <span className="text-xs font-bold text-slate-400">
            Card <strong className="text-white">{state.purchasedCharacters.length + state.skippedCharacters.length + 1}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Instant Give Up / Concede to Highest Bidder Button */}
          {state.auction.highestBidderId && state.auction.currentBid > 0 && onConcede && (
            <button
              onClick={() => {
                soundManager.playClick();
                onConcede();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border border-amber-400/50 shadow-sm transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              <span>🏳️ GIVE UP / SELL TO {state.auction.highestBidderName}</span>
            </button>
          )}

          {/* Instant Skip Button for All Players */}
          <button
            onClick={() => {
              soundManager.playClick();
              if (onInstantSkip) {
                onInstantSkip();
              } else {
                // Trigger unanimous skip vote for controlling player
                onVoteSkip(controllingPlayer.id);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border border-red-400/50 shadow-glow-red transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>⚡ SKIP CARD (ALL)</span>
          </button>

          {/* Multi-Split Screen Toggle Option for 2+ Players */}
          {isLocalMode && humanPlayers.length >= 2 && (
            <button
              onClick={() => {
                soundManager.playClick();
                setIsSplitScreen(prev => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isSplitScreen
                  ? 'bg-purple-900/90 text-purple-200 border-purple-400 shadow-glow-cosmic'
                  : 'bg-marvel-card text-slate-300 border-white/10 hover:border-slate-500'
              }`}
            >
              {isSplitScreen ? <LayoutGrid className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
              <span>{isSplitScreen ? 'Standard Focus' : `${humanPlayers.length}-Player Split View`}</span>
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

      {/* MULTI-PLAYER SPLIT SCREEN VIEW (2, 3, 4+ PLAYERS) */}
      {isSplitScreen && humanPlayers.length >= 2 ? (
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

          {/* Dynamic N-Player Split Stations */}
          <div className={`grid ${getSplitGridCols()} gap-3`}>
            {humanPlayers.map((player, idx) => {
              const borderColors = [
                'border-red-500/50 bg-red-950/20',
                'border-blue-500/50 bg-blue-950/20',
                'border-emerald-500/50 bg-emerald-950/20',
                'border-purple-500/50 bg-purple-950/20',
                'border-amber-500/50 bg-amber-950/20',
                'border-cyan-500/50 bg-cyan-950/20',
              ];
              const colorClass = borderColors[idx % borderColors.length];

              return (
                <div key={player.id} className={`glass-panel p-3.5 rounded-2xl border ${colorClass} space-y-3 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-heading font-black text-white text-xs sm:text-sm flex items-center gap-1.5 truncate">
                      <span className="text-lg">{player.avatar}</span>
                      <span className="truncate">{player.name} (P{idx + 1})</span>
                    </span>
                    <span className="text-emerald-400 font-black text-xs bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      ${player.money}
                    </span>
                  </div>
                  <BidControls
                    activePlayer={player}
                    auction={state.auction}
                    settings={state.settings}
                    onPlaceBid={onPlaceBid}
                    onVoteSkip={onVoteSkip}
                    onConcede={onConcede}
                    isLocalMode={false}
                    eligiblePlayersCount={eligiblePlayers.length}
                  />
                </div>
              );
            })}
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
                  <div className="flex items-center gap-1.5 text-emerald-300 font-black">
                    <Crown className="w-4 h-4 text-marvel-gold animate-bounce" />
                    <span>Top: {state.auction.highestBidderName}</span>
                  </div>
                )}
              </div>

              {/* Character Card / Mystery Crate Display */}
              {char && (
                state.auction.isMysteryCrate ? (
                  <MysteryCrateCard
                    isRevealing={!state.auction.isActive && !!state.auction.unboxedCharacter}
                  />
                ) : (
                  <CharacterCard
                    character={char}
                    size="lg"
                    isSpotlight={true}
                    startingMoney={state.settings.startingMoney}
                  />
                )
              )}
            </div>
          </div>

          {/* Right Stage: Timer, Bidding Controls & Live Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-4 w-full">
            {/* Auction Countdown Timer */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10">
              <AuctionTimer
                timeRemaining={state.auction.timeRemaining}
                totalTime={state.settings.auctionTimerSeconds}
                antiSnipingActive={true}
              />
            </div>

            {/* Local Mode Pass-Device Quick Switcher */}
            {isLocalMode && (
              <div className="glass-panel px-4 py-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold uppercase">Pass device to:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{controllingPlayer.avatar}</span>
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
              onConcede={onConcede}
              isLocalMode={isLocalMode}
              eligiblePlayersCount={eligiblePlayers.length}
            />

            {/* Tactical Sabotage Tools (EMP Blast & Spy Drone) */}
            <div className="glass-panel p-3 rounded-2xl border border-cyan-500/30 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-cyan-300 uppercase tracking-widest flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  Tactical Bidding Sabotage
                </span>
                <span className="text-[10px] text-gray-400 font-bold">1-Use Perks</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTriggerEmp(controllingPlayer)}
                  disabled={controllingPlayer.money < 3 || isEmpGlitched}
                  className={`px-2.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all ${
                    controllingPlayer.money >= 3 && !isEmpGlitched
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white border-red-400 shadow-glow-red'
                      : 'bg-slate-800/60 text-gray-500 border-slate-700 cursor-not-allowed'
                  }`}
                  title="EMP Blast: Freeze opponents bidding buttons for 2.5s"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  <span>⚡ EMP BLAST ($3)</span>
                </button>

                <button
                  onClick={() => handleTriggerSpyDrone(controllingPlayer)}
                  disabled={controllingPlayer.money < 2 || isSpyDroneScanning}
                  className={`px-2.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all ${
                    controllingPlayer.money >= 2 && !isSpyDroneScanning
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white border-cyan-400 shadow-glow-blue'
                      : 'bg-slate-800/60 text-gray-500 border-slate-700 cursor-not-allowed'
                  }`}
                  title="Spy Drone: Scan opponent funds & blind bids for 5s"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-300" />
                  <span>📡 SPY DRONE ($2)</span>
                </button>
              </div>

              {tacticalMessage && (
                <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-[11px] text-cyan-200 font-bold text-center animate-pulse">
                  {tacticalMessage}
                </div>
              )}

              {isSpyDroneScanning && (
                <div className="p-2 rounded-lg bg-black/60 border border-emerald-500/50 text-[10px] space-y-1">
                  <span className="font-extrabold text-emerald-400 block uppercase tracking-wider">📡 Spy Radar Active:</span>
                  <div className="grid grid-cols-2 gap-1 text-slate-300">
                    {state.players.map(p => (
                      <div key={p.id} className="flex justify-between bg-black/40 px-1.5 py-0.5 rounded">
                        <span>{p.name}:</span>
                        <strong className="text-emerald-300">${p.money}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                        {isBlindBidding && state.auction.isActive && !isSpyDroneScanning ? '[🔒 SEALED BID]' : `$${bid.amount}`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Comic Reactions Drawer */}
      <FloatingReactions playerName={controllingPlayer.name} />
    </div>
  );
}

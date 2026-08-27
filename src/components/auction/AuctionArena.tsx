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
import { Activity, Crown, Clock, ArrowRight, ShieldAlert, Sparkles, Columns, LayoutGrid, Lock, ShoppingBag, Radio, Zap, Eye, Flame } from 'lucide-react';

interface Props {
  state: GameState;
  socketId?: string;
  onPlaceBid: (playerId: string, amount: number) => void;
  onVoteSkip: (playerId: string) => void;
  onInstantSkip?: () => void;
  onConcede?: () => void;
  onOpenRelicShop?: () => void;
  onTriggerFlashbang?: (targetId: string) => void;
  onDiscardCharacter?: (playerId: string, characterId: string) => void;
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
  onTriggerFlashbang,
  onDiscardCharacter,
  isLocalMode = true,
}: Props) {
  const [localTurnPlayerId, setLocalTurnPlayerId] = useState<string>(
    state.players.find(p => !p.isBot)?.id || state.players[0]?.id || ''
  );
  const [isSplitScreen, setIsSplitScreen] = useState<boolean>(false);
  const [flashbangActiveUntil, setFlashbangActiveUntil] = useState<number>(0);
  const [flashbangAttacker, setFlashbangAttacker] = useState<string>('');
  const [tacticalMessage, setTacticalMessage] = useState<string | null>(null);

  const char = state.auction.currentCharacter;
  const isBlindBidding = state.settings.gameMode === 'blind_bidding';
  const isBlitz = state.settings.gameMode === 'blitz';

  // Dynamic Flashbang cost based on starting money (5% of starting treasury, min $2)
  const flashbangCost = Math.max(2, Math.round(state.settings.startingMoney * 0.05));

  // In Local mode, controlling player is chosen via turn or selector
  const controllingPlayer = isLocalMode
    ? (state.players.find(p => p.id === localTurnPlayerId) || state.players[0])
    : (state.players.find(p => p.id === socketId) || state.players[0]);

  // Flashbang only blinds OPPONENTS, never the player who detonated it! (TODO-035)
  const isBlinded = (Date.now() < flashbangActiveUntil && controllingPlayer.name !== flashbangAttacker) || 
    !!(controllingPlayer?.flashbangedUntil && Date.now() < controllingPlayer.flashbangedUntil);

  const handleTriggerFlashbang = (player: Player) => {
    if (player.money < flashbangCost) return;
    player.money -= flashbangCost;
    soundManager.playAbilityTrigger();
    setFlashbangActiveUntil(Date.now() + 4000);
    setFlashbangAttacker(player.name);
    setTacticalMessage(`💥 FLASH DETONATED! Opponent screens blinded & locked for 4s!`);
    setTimeout(() => setTacticalMessage(null), 4500);
    if (!isLocalMode && onTriggerFlashbang) {
      const opponent = state.players.find(p => p.id !== player.id);
      onTriggerFlashbang(opponent?.id || 'all');
    }
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
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <div className="relative max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
            {isBlindBidding ? 'SEALED BLIND DRAFT ARENA' : isBlitz ? '⚡ BLITZ AUCTION ARENA' : 'MARVEL DRAFT ARENA'}
          </span>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
            LOT {state.purchasedCharacters.length + state.skippedCharacters.length + 1} / {state.availableCharacters.length + state.purchasedCharacters.length + state.skippedCharacters.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Instant Skip All Lot Button */}
          {onInstantSkip && (
            <button
              onClick={() => {
                soundManager.playClick();
                onInstantSkip();
              }}
              disabled={!state.auction.isActive}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border border-red-400/50 shadow-glow-red transition-all transform hover:scale-105 active:scale-95"
              title="Instantly skip current draft lot immediately for all players"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>⚡ Skip All (Instant)</span>
            </button>
          )}

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
        onDiscardCharacter={onDiscardCharacter}
        isLocalMode={isLocalMode}
      />

      {/* 🎲 CHAOS AUCTION EVENT ANNOUNCEMENT BANNER */}
      {state.activeChaosEvent && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-amber-950/90 to-red-950/90 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 animate-bounce">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="font-heading font-black text-xs uppercase tracking-widest text-amber-400">
                  🎲 CHAOS AUCTION EVENT:
                </span>
                <span className="font-heading font-black text-sm text-white uppercase">
                  {state.activeChaosEvent.name}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {state.activeChaosEvent.description}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-amber-400 text-black text-xs font-heading font-black uppercase shadow tracking-wider shrink-0 animate-pulse">
            {state.activeChaosEvent.badge}
          </span>
        </div>
      )}

      {/* MULTI-PLAYER SPLIT SCREEN VIEW (2, 3, 4+ PLAYERS) */}
      {isSplitScreen && humanPlayers.length >= 2 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8">
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
            <div className="lg:col-span-4 glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-center">
              <AuctionTimer
                timeRemaining={state.auction.timeRemaining}
                totalTime={state.settings.auctionTimerSeconds}
                antiSnipingActive={true}
              />
            </div>
          </div>

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
                    onInstantSkip={onInstantSkip}
                    onConcede={onConcede}
                    isLocalMode={isLocalMode}
                    eligiblePlayersCount={eligiblePlayers.length}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STANDARD DRAFT ARENA STAGE (2 Columns) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Stage: Center Lot Card Showcase (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-amber-300 uppercase tracking-wide">
                    {state.auction.isMysteryCrate ? '❓ MYSTERY COSMIC CRATE' : 'CURRENT ACTIVE DRAFT LOT'}
                  </span>
                </div>

                {state.auction.highestBidderName && (
                  <div className="flex items-center gap-1.5 text-emerald-300 font-black">
                    <Crown className="w-4 h-4 text-marvel-gold animate-bounce" />
                    <span>Top: {state.auction.highestBidderName}</span>
                  </div>
                )}
              </div>

              {/* Character Card / Mystery Crate Display with Non-Obstructive Floating SOLD Banner */}
              <div className="relative">
                {!state.auction.isActive && state.auction.highestBidderName && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1 animate-bounce">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-heading font-black text-xs sm:text-sm px-4 py-1.5 rounded-full border-2 border-white shadow-[0_0_30px_rgba(255,215,0,0.9)] uppercase tracking-wider">
                      <span className="text-base">🔨</span>
                      <span>SOLD TO {state.auction.highestBidderName.toUpperCase()} FOR ${state.auction.currentBid}!</span>
                    </div>
                  </div>
                )}

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
          </div>

          {/* Right Stage: Timer, Bidding Controls & Live Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-4 w-full">
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10">
              <AuctionTimer
                timeRemaining={state.auction.timeRemaining}
                totalTime={state.settings.auctionTimerSeconds}
                antiSnipingActive={true}
              />
            </div>

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

            <BidControls
              activePlayer={controllingPlayer}
              auction={state.auction}
              settings={state.settings}
              onPlaceBid={onPlaceBid}
              onVoteSkip={onVoteSkip}
              onInstantSkip={onInstantSkip}
              onConcede={onConcede}
              isLocalMode={isLocalMode}
              eligiblePlayersCount={eligiblePlayers.length}
            />

            <div className="glass-panel p-3 rounded-2xl border border-amber-500/40 bg-slate-900/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Tactical Bidding Sabotage
                </span>
                <span className="text-[10px] text-gray-400 font-bold">1-Use Perk</span>
              </div>

              <div>
                <button
                  onClick={() => handleTriggerFlashbang(controllingPlayer)}
                  disabled={controllingPlayer.money < flashbangCost || isBlinded}
                  className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all ${
                    controllingPlayer.money >= flashbangCost && !isBlinded
                      ? 'bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:brightness-110 text-white border-amber-400 shadow-glow-gold transform hover:scale-[1.01]'
                      : 'bg-slate-800/60 text-gray-500 border-slate-700 cursor-not-allowed'
                  }`}
                  title="Tactical Flashbang: Blinds opponents with a whiteout flash and disables their bidding for 4s!"
                >
                  <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
                  <span>💥 BUY TACTICAL FLASHBANG (${flashbangCost}) • 4S BLIND OPPONENTS</span>
                </button>
              </div>

              {tacticalMessage && (
                <div className="p-2.5 rounded-xl bg-amber-950/90 border border-amber-400/60 text-xs text-amber-200 font-extrabold text-center animate-pulse shadow-glow-gold">
                  {tacticalMessage}
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

      {/* Floating Comic Reactions Drawer */}
      <FloatingReactions playerName={controllingPlayer.name} />

      {/* Tactical Flashbang Blinding Whiteout Overlay */}
      {isBlinded && (
        <div className="fixed inset-0 z-50 pointer-events-auto bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="p-6 bg-red-600 text-white rounded-3xl border-4 border-black shadow-2xl flex flex-col items-center gap-2 transform rotate-1 scale-110">
            <Flame className="w-16 h-16 text-yellow-300 animate-bounce" />
            <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-widest uppercase">
              💥 BLINDED BY FLASHBANG!
            </h2>
            <p className="text-sm font-black text-yellow-200 uppercase">
              {flashbangAttacker} Detonated a Tactical Flashbang!
            </p>
            <span className="text-xs bg-black text-white px-4 py-1.5 rounded-full font-mono font-bold mt-2">
              BIDDING SYSTEMS LOCKED FOR {Math.max(1, Math.ceil((flashbangActiveUntil - Date.now()) / 1000))}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

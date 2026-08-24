import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Navbar } from './components/common/Navbar';
import { HomeScreen } from './components/home/HomeScreen';
import { HowToPlayModal } from './components/home/HowToPlayModal';
import { LocalSetup } from './components/setup/LocalSetup';
import { OnlineLobby } from './components/setup/OnlineLobby';
import { AuctionArena } from './components/auction/AuctionArena';
import { MythicCinematic } from './components/common/MythicCinematic';
import { BattlePhase } from './components/battle/BattlePhase';
import { TournamentBracket } from './components/tournament/TournamentBracket';
import { VictoryScreen } from './components/champion/VictoryScreen';
import { CharacterDatabase } from './components/encyclopedia/CharacterDatabase';
import { BattleSandbox } from './components/sandbox/BattleSandbox';
import { EquipmentShop } from './components/shop/EquipmentShop';
import { GradeVotingModal } from './components/auction/GradeVotingModal';
import { MarvelCinematicIntro } from './components/common/MarvelCinematicIntro';
import { BossRaidManager } from './components/raid/BossRaidManager';
import { GamePhase } from './types/game';
import { soundManager } from './audio/soundManager';
import { Sparkles, Swords, Film } from 'lucide-react';

export function App() {
  const {
    state,
    isOnlineMode,
    setIsOnlineMode,
    socketHook,
    setPhase,
    updateLocalSettings,
    addLocalPlayer,
    removeLocalPlayer,
    startLocalGame,
    placeBid,
    voteSkip,
    instantSkipCurrentAuction,
    concedeCurrentAuction,
    submitGradeVotes,
    executeBattleRoundAction,
    playMatch,
    restartGame,
    updatePlayerCollection,
    proceedFromShopToBattles,
  } = useGameState();

  const [showBootIntro, setShowBootIntro] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [previousPhaseBeforeBrowse, setPreviousPhaseBeforeBrowse] = useState<GamePhase>('HOME');

  const handleNavigate = (targetPhase: GamePhase) => {
    soundManager.playClick();
    if (targetPhase === 'HOW_TO_PLAY') {
      setShowHowToPlay(true);
    } else if (targetPhase === 'ENCYCLOPEDIA') {
      setPreviousPhaseBeforeBrowse(state.phase);
      setPhase('ENCYCLOPEDIA');
    } else {
      setPhase(targetPhase);
    }
  };

  const handleReturnHome = () => {
    soundManager.playClick();
    if (isOnlineMode) {
      setIsOnlineMode(false);
    }
    setPhase('HOME');
  };

  return (
    <div className="min-h-screen flex flex-col bg-marvel-darker text-slate-100 relative selection:bg-marvel-red selection:text-white">
      {/* Marvel Cinematic Intro on Website Boot */}
      {showBootIntro && (
        <MarvelCinematicIntro onComplete={() => setShowBootIntro(false)} />
      )}

      {/* Scanline Comic Overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-30" />

      {/* Navigation Header */}
      <Navbar
        phase={state.phase}
        roomId={state.roomId}
        isOnline={isOnlineMode}
        onNavigate={handleNavigate}
        onHomeClick={handleReturnHome}
      />

      {/* Main Content Router */}
      <main className="flex-1 relative z-20">
        {/* 1. HOME SCREEN */}
        {state.phase === 'HOME' && (
          <HomeScreen
            onPlayLocal={() => {
              setIsOnlineMode(false);
              updateLocalSettings({ gameMode: 'classic', auctionTimerSeconds: 15 });
              setPhase('LOCAL_SETUP');
            }}
            onPlayBlindBidding={() => {
              setIsOnlineMode(false);
              updateLocalSettings({ gameMode: 'blind_bidding', auctionTimerSeconds: 15 });
              setPhase('LOCAL_SETUP');
            }}
            onPlayBlitz={() => {
              setIsOnlineMode(false);
              updateLocalSettings({ gameMode: 'blitz', auctionTimerSeconds: 5 });
              setPhase('LOCAL_SETUP');
            }}
            onPlayBossRaid={() => {
              setPreviousPhaseBeforeBrowse('HOME');
              setPhase('BOSS_RAID');
            }}
            onPlayMultiplayer={() => {
              setIsOnlineMode(true);
              setPhase('ONLINE_LOBBY');
            }}
            onOpenEncyclopedia={() => {
              setPreviousPhaseBeforeBrowse('HOME');
              setPhase('ENCYCLOPEDIA');
            }}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            onOpenSandbox={() => {
              setPreviousPhaseBeforeBrowse('HOME');
              setPhase('SANDBOX');
            }}
            onOpenRelicShop={() => {
              setPreviousPhaseBeforeBrowse('HOME');
              setPhase('EQUIPMENT_SHOP');
            }}
            onPlayIntro={() => setShowBootIntro(true)}
          />
        )}

        {/* 2. LOCAL SETUP */}
        {state.phase === 'LOCAL_SETUP' && (
          <LocalSetup
            players={state.players}
            settings={state.settings}
            onUpdateSettings={updateLocalSettings}
            onAddPlayer={addLocalPlayer}
            onRemovePlayer={removeLocalPlayer}
            onStartGame={startLocalGame}
            onBack={() => setPhase('HOME')}
          />
        )}

        {/* 3. ONLINE LOBBY */}
        {state.phase === 'ONLINE_LOBBY' && (
          <OnlineLobby
            state={state}
            socketId={socketHook.socket?.id}
            isConnected={socketHook.isConnected}
            onSetReady={socketHook.setReady}
            onAddBot={socketHook.addBot}
            onUpdateSettings={socketHook.updateSettings}
            onStartGame={socketHook.startGame}
            onLeaveRoom={() => {
              setIsOnlineMode(false);
              setPhase('HOME');
            }}
            onCreateRoom={socketHook.createRoom}
            onJoinRoom={socketHook.joinRoom}
            isInRoom={!!socketHook.onlineState}
            error={socketHook.lastError}
          />
        )}

        {/* 4. AUCTION INTRO TRANSITION */}
        {state.phase === 'AUCTION_INTRO' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-shake">
            <div className="p-4 bg-red-950/80 rounded-full border border-red-500 shadow-glow-red">
              <Sparkles className="w-10 h-10 text-marvel-gold animate-spin" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-heading font-black text-white uppercase tracking-wider">
              AUCTIONS ARE COMMENCING
            </h1>
            <p className="text-sm font-bold text-red-300 uppercase tracking-widest animate-pulse">
              GET READY TO BID ON 300 MARVEL HEROES & VILLAINS
            </p>
          </div>
        )}

        {/* 5. MYTHIC CINEMATIC OVERLAY */}
        {state.phase === 'AUCTION_REVEAL_MYTHIC' && state.auction.currentCharacter && (
          <MythicCinematic
            character={state.auction.currentCharacter}
            onDismiss={() => setPhase('AUCTION')}
          />
        )}

        {/* 5B. 3-ROUND GRADE TIER VOTING MODAL */}
        {state.phase === 'GRADE_VOTING' && (
          <GradeVotingModal
            players={state.players}
            onVoteSubmit={submitGradeVotes}
            isLocalMode={!isOnlineMode}
            controllingPlayerId={socketHook.socket?.id}
          />
        )}

        {/* 6. AUCTION ARENA & WINNER REVEAL */}
        {(state.phase === 'AUCTION' || state.phase === 'AUCTION_WINNER') && (
          <AuctionArena
            state={state}
            socketId={socketHook.socket?.id}
            onPlaceBid={placeBid}
            onVoteSkip={voteSkip}
            onInstantSkip={instantSkipCurrentAuction}
            onConcede={concedeCurrentAuction}
            onOpenRelicShop={() => {
              setPreviousPhaseBeforeBrowse(state.phase);
              setPhase('EQUIPMENT_SHOP');
            }}
            isLocalMode={!isOnlineMode}
          />
        )}

        {/* 7. AUCTION COMPLETE & EQUIPMENT SHOP */}
        {state.phase === 'AUCTION_COMPLETE' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-shake">
            <div className="p-4 bg-purple-950/80 rounded-full border border-purple-500 shadow-glow-cosmic">
              <Sparkles className="w-12 h-12 text-marvel-gold animate-pulse" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-500">
              ROSTER RECRUITMENT COMPLETE
            </span>
            <h1 className="text-4xl sm:text-7xl font-heading font-black text-marvel-gradient uppercase tracking-widest">
              RELIC VAULT OPENING
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Entering the Tactical Artifacts & Equipment Shop...
            </p>
          </div>
        )}

        {/* 8. TACTICAL ARTIFACTS & EQUIPMENT SHOP */}
        {state.phase === 'EQUIPMENT_SHOP' && (
          <EquipmentShop
            players={state.players}
            onUpdatePlayerCollection={updatePlayerCollection}
            onProceedToBattles={proceedFromShopToBattles}
            onBack={() => setPhase(previousPhaseBeforeBrowse || 'HOME')}
            isLocalMode={!isOnlineMode}
            controllingPlayerId={socketHook.socket?.id}
          />
        )}

        {/* 9. BATTLE TRANSITION MARVEL INTRO */}
        {state.phase === 'BATTLE_TRANSITION' && (
          <MarvelCinematicIntro
            title="MARVEL"
            subtitle="THE TOURNAMENT BATTLES COMMENCE"
            onComplete={() => setPhase('TOURNAMENT_TREE')}
          />
        )}

        {/* 10. TOURNAMENT BRACKET */}
        {(state.phase === 'TOURNAMENT_TREE' || state.phase === 'MATCH_RESULT') && (
          <TournamentBracket
            state={state}
            onPlayMatch={playMatch}
          />
        )}

        {/* 11. BATTLE FIGHT PHASE */}
        {state.phase === 'BATTLE_FIGHT' && (
          <BattlePhase
            state={state}
            onReturnToTree={() => setPhase('TOURNAMENT_TREE')}
            onExecuteAction={executeBattleRoundAction}
            isOnlineMode={isOnlineMode}
            controllingPlayerId={socketHook.socket?.id}
          />
        )}

        {/* 12. CHAMPION VICTORY SCREEN */}
        {state.phase === 'CHAMPION' && state.champion && (
          <VictoryScreen
            champion={state.champion}
            state={state}
            onPlayAgain={restartGame}
          />
        )}

        {/* 13. ENCYCLOPEDIA */}
        {state.phase === 'ENCYCLOPEDIA' && (
          <CharacterDatabase
            onBack={() => setPhase(previousPhaseBeforeBrowse)}
          />
        )}

        {/* 14. BATTLE SANDBOX */}
        {state.phase === 'SANDBOX' && (
          <BattleSandbox
            onBack={() => setPhase(previousPhaseBeforeBrowse)}
          />
        )}

        {/* 15. CO-OP BOSS RAID CAMPAIGN (1-6 PLAYERS, SHARED FUNDS, RELIC VAULT & 9 TITANS) */}
        {state.phase === 'BOSS_RAID' && (
          <BossRaidManager
            onExit={() => setPhase('HOME')}
          />
        )}
      </main>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}

export default App;

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameState, 
  Player, 
  Character,
  GameSettings, 
  BotPersonality,
  GamePhase,
  GradeVoteOption,
  BattleActionType
} from '../types/game';
import { ALL_CHARACTERS } from '../data/characters/index';
import { soundManager } from '../audio/soundManager';
import { voiceManager } from '../audio/voiceManager';
import { validateBid, validateSkipVote, calculateBotBid } from '../../server/auctionEngine';
import { generateTournamentBracket, advanceTournamentMatches } from '../../server/tournamentEngine';
import { simulateRoundDuel, getTierMatchedPairings } from '../../server/battleEngine';
import { useSocket } from './useSocket';

const DEFAULT_SETTINGS: GameSettings = {
  playerCount: 4,
  startingMoney: 30,
  characterLimit: 4,
  auctionTimerSeconds: 15,
  antiSnipingSeconds: 6,
};

export function useGameState() {
  const socketHook = useSocket();
  const [isOnlineMode, setIsOnlineMode] = useState<boolean>(false);
  const [activePlayerTurnIndex, setActivePlayerTurnIndex] = useState<number>(0);

  // Local Game State
  const [localState, setLocalState] = useState<GameState>({
    roomId: 'LOCAL-PASS-PLAY',
    isOnline: false,
    phase: 'HOME',
    settings: DEFAULT_SETTINGS,
    players: [
      {
        id: 'p-1',
        name: 'Player 1',
        avatar: '🦸‍♂️',
        money: 30,
        collection: [],
        isHost: true,
        isReady: true,
        isBot: false,
        stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
      },
      {
        id: 'p-2',
        name: 'Player 2',
        avatar: '🦹‍♂️',
        money: 30,
        collection: [],
        isHost: false,
        isReady: true,
        isBot: false,
        stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
      },
      {
        id: 'bot-1',
        name: 'JARVIS AI',
        avatar: '🤖',
        money: 30,
        collection: [],
        isHost: false,
        isReady: true,
        isBot: true,
        botPersonality: 'Balanced',
        stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
      },
      {
        id: 'bot-2',
        name: 'FRIDAY AI',
        avatar: '🤖',
        money: 30,
        collection: [],
        isHost: false,
        isReady: true,
        isBot: true,
        botPersonality: 'Cosmic',
        stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
      },
    ],
    activePlayerIndex: 0,
    availableCharacters: [...ALL_CHARACTERS].sort(() => Math.random() - 0.5),
    purchasedCharacters: [],
    skippedCharacters: [],
    auction: {
      currentCharacter: null,
      currentBid: 0,
      highestBidderId: null,
      highestBidderName: null,
      timeRemaining: 15,
      isActive: false,
      bidsHistory: [],
      skipVotes: [],
      hasBidded: [],
      statusMessage: 'Ready to auction.',
    },
    tournamentMatches: [],
    currentMatchId: null,
    champion: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Effective State (Online or Local)
  const currentState: GameState = isOnlineMode && socketHook.onlineState 
    ? socketHook.onlineState 
    : localState;

  // Local Auction Timer & AI Bot Loop
  const stopLocalTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishLocalAuctionPhase = useCallback(() => {
    stopLocalTimer();
    setLocalState(prev => ({
      ...prev,
      phase: 'AUCTION_COMPLETE',
    }));

    setTimeout(() => {
      setLocalState(prev => ({
        ...prev,
        phase: 'EQUIPMENT_SHOP',
      }));
    }, 1800);
  }, [stopLocalTimer]);

  const proceedFromShopToBattles = useCallback(() => {
    setLocalState(prev => {
      const matches = generateTournamentBracket(prev.players);
      return {
        ...prev,
        phase: 'BATTLE_TRANSITION',
        tournamentMatches: matches,
      };
    });

    setTimeout(() => {
      setLocalState(prev => ({
        ...prev,
        phase: 'TOURNAMENT_TREE',
      }));
    }, 2200);
  }, []);

  const updatePlayerCollection = useCallback((playerId: string, updatedCollection: Character[], updatedMoney: number) => {
    setLocalState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, collection: updatedCollection, money: updatedMoney } : p
      ),
    }));
  }, []);

  const startNextLocalAuction = useCallback(() => {
    stopLocalTimer();

    setLocalState(prev => {
      // 1. Check if all players completed roster limit OR all active players are broke (cannot afford any bids)
      // 1. Check if all players completed roster limit OR all active players are broke
      const activePlayers = prev.players.filter(
        p => p.collection.length < prev.settings.characterLimit
      );

      const maxPlayerFunds = Math.max(0, ...activePlayers.map(p => p.money));

      if (activePlayers.length === 0 || maxPlayerFunds <= 0) {
        setTimeout(finishLocalAuctionPhase, 500);
        return prev;
      }

      // 2. Check 3-Round Cosmic Grade Tier Voting Checkpoint (Rounds 3, 6, 9, 12, 15...)
      const completedRounds = prev.purchasedCharacters.length + prev.skippedCharacters.length;
      const currentCheckpoint = Math.floor(completedRounds / 3);

      if (
        completedRounds > 0 && 
        completedRounds % 3 === 0 && 
        prev.lastVotedCheckpoint !== currentCheckpoint && 
        prev.phase !== 'GRADE_VOTING'
      ) {
        soundManager.playAbilityTrigger();
        return {
          ...prev,
          lastVotedCheckpoint: currentCheckpoint,
          phase: 'GRADE_VOTING',
        };
      }

      let available = [...prev.availableCharacters];
      let skipped = [...prev.skippedCharacters];

      if (available.length === 0) {
        available = [...skipped].sort(() => Math.random() - 0.5);
        skipped = [];
      }

      // If a grade was queued from player voting, prioritize finding an affordable character of that tier!
      let nextCharIndex = -1;
      if (prev.queuedGrade && prev.queuedGrade !== 'MYSTERY') {
        nextCharIndex = available.findIndex(
          c => c.grade === prev.queuedGrade && c.startingPrice <= maxPlayerFunds
        );
        if (nextCharIndex === -1) {
          nextCharIndex = available.findIndex(c => c.grade === prev.queuedGrade);
        }
      }

      // If no queued grade or not found, find a character that active drafting players can afford!
      if (nextCharIndex === -1) {
        nextCharIndex = available.findIndex(c => c.startingPrice <= maxPlayerFunds);
      }

      let nextChar: Character | null = null;
      if (nextCharIndex !== -1) {
        nextChar = available.splice(nextCharIndex, 1)[0];
      } else {
        nextChar = available.pop() || null;
      }

      if (!nextChar) {
        setTimeout(finishLocalAuctionPhase, 500);
        return prev;
      }

      // Dynamic Affordability Guarantee:
      // If character's base starting price is higher than active players' funds,
      // cap startingPrice so players can ALWAYS afford to bid and buy them!
      if (nextChar.startingPrice > maxPlayerFunds) {
        nextChar = {
          ...nextChar,
          startingPrice: Math.max(1, maxPlayerFunds),
        };
      }

      const isMythic = nextChar.grade === 'MYTHIC';
      const isBlindMode = prev.settings.gameMode === 'blind_bidding' || prev.queuedGrade === 'MYSTERY';
      // In blind bidding mode, 100% of crates are mystery. In classic, 20% if not mythic.
      const isMystery = isBlindMode || (!isMythic && Math.random() < 0.20);

      if (isMythic && !isBlindMode) {
        soundManager.playMythicReveal();
      } else if (isMystery) {
        soundManager.playAbilityTrigger();
      }

      // The queued grade applies to THIS NEXT ROUND ONLY, and is cleared immediately
      const nextQueuedGrade = null;

      return {
        ...prev,
        availableCharacters: available,
        skippedCharacters: skipped,
        queuedGrade: nextQueuedGrade,
        phase: (isMythic && !isBlindMode) ? 'AUCTION_REVEAL_MYTHIC' : 'AUCTION',
        auction: {
          currentCharacter: nextChar,
          currentBid: 0,
          highestBidderId: null,
          highestBidderName: null,
          timeRemaining: prev.settings.auctionTimerSeconds,
          isActive: true,
          bidsHistory: [],
          skipVotes: [],
          hasBidded: [],
          statusMessage: (isMythic && !isBlindMode)
            ? '⚡ MYTHIC CHARACTER DETECTED!' 
            : isMystery 
            ? '🎲 MYSTERY COSMIC CRATE DETECTED!'
            : `Auctioning ${nextChar.name}`,
          isMythicRevealed: isMythic && !isBlindMode,
          isMysteryCrate: isMystery,
          unboxedCharacter: null,
        },
      };
    });
  }, [stopLocalTimer, finishLocalAuctionPhase]);

  const handleLocalTimeExpired = useCallback(() => {
    stopLocalTimer();

    setLocalState(prev => {
      // Prevent double-execution if the timer queued multiple calls or phase changed
      if (prev.phase !== 'AUCTION') return prev;

      const winnerId = prev.auction.highestBidderId;
      const finalBid = prev.auction.currentBid;
      const char = prev.auction.currentCharacter;

      let updatedPurchased = [...prev.purchasedCharacters];
      let updatedSkipped = [...prev.skippedCharacters];

      const updatedPlayers = prev.players.map(p => {
        if (winnerId && p.id === winnerId && char && finalBid > 0) {
          // Strict duplicate prevention: never add the same card twice
          const alreadyOwned = p.collection.some(c => c.id === char.id);
          if (alreadyOwned) return p;

          return {
            ...p,
            money: Math.max(0, p.money - finalBid),
            collection: [...p.collection, char],
            stats: {
              ...p.stats,
              moneySpent: p.stats.moneySpent + finalBid,
              highestBid: Math.max(p.stats.highestBid, finalBid),
            },
          };
        }
        return {
          ...p,
          collection: [...p.collection],
          stats: { ...p.stats },
        };
      });

      if (winnerId && char && finalBid > 0) {
        if (!updatedPurchased.some(c => c.id === char.id)) {
          updatedPurchased.push(char);
        }
        soundManager.playGavelWon();
      } else if (char) {
        if (!updatedSkipped.some(c => c.id === char.id)) {
          updatedSkipped.push(char);
        }
      }

      return {
        ...prev,
        phase: 'AUCTION_WINNER',
        players: updatedPlayers,
        purchasedCharacters: updatedPurchased,
        skippedCharacters: updatedSkipped,
        auction: {
          ...prev.auction,
          isActive: false,
          isMysteryCrate: false,
          unboxedCharacter: char,
          statusMessage: winnerId 
            ? `🎉 Won by ${prev.auction.highestBidderName} for $${finalBid}! (${char?.name})` 
            : 'NO BIDS PLACED - Card remains unsold.',
        },
      };
    });

    setTimeout(() => {
      startNextLocalAuction();
    }, 3200);
  }, [stopLocalTimer, startNextLocalAuction]);

  // Local auction countdown and AI bot bidding tick
  useEffect(() => {
    if (isOnlineMode) return;

    if (localState.phase === 'AUCTION_REVEAL_MYTHIC') {
      const t = setTimeout(() => {
        setLocalState(prev => ({ ...prev, phase: 'AUCTION' }));
      }, 3500);
      return () => clearTimeout(t);
    }

    if (localState.phase === 'AUCTION' && localState.auction.isActive) {
      stopLocalTimer();
      timerRef.current = setInterval(() => {
        setLocalState(prev => {
          if (!prev.auction.isActive) return prev;

          // Sound tick on low seconds
          if (prev.auction.timeRemaining <= 5 && prev.auction.timeRemaining > 0) {
            soundManager.playTick(prev.auction.timeRemaining <= 3);
          }

          // Simulate Bots
          const bots = prev.players.filter(
            p => p.isBot && p.collection.length < prev.settings.characterLimit
          );
          for (const bot of bots) {
            const botBid = calculateBotBid(bot, prev.auction, prev.settings);
            if (botBid !== null) {
              const val = validateBid(bot, botBid, prev.auction, prev.settings);
              if (val.valid) {
                soundManager.playBidPlaced();
                return {
                  ...prev,
                  auction: {
                    ...prev.auction,
                    currentBid: val.newBid!,
                    highestBidderId: val.newHighestBidderId!,
                    highestBidderName: val.newHighestBidderName!,
                    timeRemaining: val.timeRemaining!,
                    statusMessage: `Bid of $${val.newBid} placed by ${bot.name}`,
                    hasBidded: prev.auction.hasBidded.includes(bot.id) 
                      ? prev.auction.hasBidded 
                      : [...prev.auction.hasBidded, bot.id],
                    bidsHistory: [
                      {
                        playerId: bot.id,
                        playerName: bot.name,
                        amount: val.newBid!,
                        timestamp: Date.now(),
                      },
                      ...prev.auction.bidsHistory,
                    ],
                  },
                };
              }
            }
          }

          if (prev.auction.timeRemaining <= 1) {
            setTimeout(handleLocalTimeExpired, 50);
            return {
              ...prev,
              auction: {
                ...prev.auction,
                timeRemaining: 0,
              },
            };
          }

          return {
            ...prev,
            auction: {
              ...prev.auction,
              timeRemaining: prev.auction.timeRemaining - 1,
            },
          };
        });
      }, 1000);

      return () => stopLocalTimer();
    }
  }, [localState.phase, localState.auction.isActive, isOnlineMode, stopLocalTimer, handleLocalTimeExpired]);

  // Actions
  const setPhase = (phase: GamePhase) => {
    if (isOnlineMode) return;
    setLocalState(prev => ({ ...prev, phase }));
  };

  const updateLocalSettings = (settings: Partial<GameSettings>) => {
    setLocalState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  const addLocalPlayer = (name: string, isBot: boolean = false, personality: BotPersonality = 'Balanced') => {
    if (localState.players.length >= 8) return;
    const newId = `p-${Date.now()}`;
    const avatars = ['🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '⚡', '🔥', '🛡️', '🤖'];
    const avatar = isBot ? '🤖' : avatars[localState.players.length % avatars.length];

    const newPlayer: Player = {
      id: newId,
      name: name || (isBot ? `AI BOT ${localState.players.length + 1}` : `Player ${localState.players.length + 1}`),
      avatar,
      money: localState.settings.startingMoney,
      collection: [],
      isHost: false,
      isReady: true,
      isBot,
      botPersonality: isBot ? personality : undefined,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    setLocalState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  };

  const removeLocalPlayer = (id: string) => {
    if (localState.players.length <= 2) return;
    setLocalState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id),
    }));
  };

  const startLocalGame = () => {
    setLocalState(prev => {
      const resetPlayers = prev.players.map(p => ({
        ...p,
        money: prev.settings.startingMoney,
        collection: [],
        stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
      }));

      return {
        ...prev,
        players: resetPlayers,
        phase: 'AUCTION_INTRO',
        availableCharacters: [...ALL_CHARACTERS].sort(() => Math.random() - 0.5),
        purchasedCharacters: [],
        skippedCharacters: [],
        lastVotedCheckpoint: 0,
        queuedGrade: null,
      };
    });

    setTimeout(() => {
      startNextLocalAuction();
    }, 2000);
  };

  const placeBid = async (playerId: string, amount: number) => {
    soundManager.playClick();
    if (isOnlineMode) {
      return await socketHook.placeBid(amount);
    }

    const player = localState.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found' };

    const validation = validateBid(player, amount, localState.auction, localState.settings);
    if (!validation.valid) {
      soundManager.playOutbid();
      return { success: false, error: validation.error };
    }

    soundManager.playBidPlaced();
    setLocalState(prev => ({
      ...prev,
      auction: {
        ...prev.auction,
        currentBid: validation.newBid!,
        highestBidderId: validation.newHighestBidderId!,
        highestBidderName: validation.newHighestBidderName!,
        timeRemaining: validation.timeRemaining!,
        statusMessage: `Bid of $${amount} placed by ${player.name}`,
        hasBidded: prev.auction.hasBidded.includes(player.id)
          ? prev.auction.hasBidded
          : [...prev.auction.hasBidded, player.id],
        bidsHistory: [
          {
            playerId: player.id,
            playerName: player.name,
            amount,
            timestamp: Date.now(),
          },
          ...prev.auction.bidsHistory,
        ],
      },
    }));

    return { success: true };
  };

  const voteSkip = async (playerId: string) => {
    soundManager.playClick();
    if (isOnlineMode) {
      return await socketHook.voteSkip();
    }

    const player = localState.players.find(p => p.id === playerId);
    if (!player) return { success: false, isSkipped: false, error: 'Player not found' };

    const res = validateSkipVote(player, localState.auction, localState.players);
    if (!res.valid) {
      return { success: false, isSkipped: false, error: res.error };
    }

    if (res.isSkipped) {
      soundManager.playSkip();
      stopLocalTimer();
      setLocalState(prev => ({
        ...prev,
        skippedCharacters: prev.auction.currentCharacter 
          ? [...prev.skippedCharacters, prev.auction.currentCharacter] 
          : prev.skippedCharacters,
        auction: {
          ...prev.auction,
          isActive: false,
          skipVotes: res.newVotes,
          statusMessage: 'CARD SKIPPED BY UNANIMOUS VOTE!',
        },
      }));

      setTimeout(startNextLocalAuction, 1500);
      return { success: true, isSkipped: true };
    }

    setLocalState(prev => ({
      ...prev,
      auction: {
        ...prev.auction,
        skipVotes: res.newVotes,
      },
    }));

    return { success: true, isSkipped: false };
  };

  const instantSkipCurrentAuction = () => {
    soundManager.playClick();
    soundManager.playSkip();
    stopLocalTimer();

    setLocalState(prev => ({
      ...prev,
      skippedCharacters: prev.auction.currentCharacter 
        ? [...prev.skippedCharacters, prev.auction.currentCharacter] 
        : prev.skippedCharacters,
      auction: {
        ...prev.auction,
        isActive: false,
        statusMessage: 'CARD INSTANTLY SKIPPED!',
      },
    }));

    setTimeout(startNextLocalAuction, 600);
  };

  const submitGradeVotes = (votes: Record<string, GradeVoteOption>) => {
    soundManager.playAbilityTrigger();
    // Count votes
    const counts: Record<string, number> = {};
    Object.values(votes).forEach(vote => {
      counts[vote] = (counts[vote] || 0) + 1;
    });

    let topChoice: GradeVoteOption = 'MYTHIC';
    let maxCount = -1;
    Object.entries(counts).forEach(([opt, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        topChoice = opt as GradeVoteOption;
      }
    });

    setLocalState(prev => ({
      ...prev,
      queuedGrade: topChoice,
      phase: 'AUCTION',
    }));

    setTimeout(startNextLocalAuction, 400);
  };

  const executeBattleRoundAction = (
    matchId: string,
    action1: BattleActionType,
    action2: BattleActionType,
    selectedHero1Index: number = 0,
    selectedHero2Index: number = 0
  ) => {
    const match = localState.tournamentMatches.find(m => m.id === matchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') return;

    const p1Char = match.player1.collection[selectedHero1Index] || match.player1.collection[0];
    const p2Char = match.player2.collection[selectedHero2Index] || match.player2.collection[0];

    const currentRoundNum = match.rounds.length + 1;
    const result = simulateRoundDuel(
      match.player1,
      p1Char,
      match.player2,
      p2Char,
      currentRoundNum,
      action1,
      action2
    );

    soundManager.playAttackHit();
    if (result.player1AbilityTriggered || result.player2AbilityTriggered) {
      soundManager.playAbilityTrigger();
    }

    // Update live HP on heroes
    p1Char.currentHp = result.player1Character.currentHp;
    p1Char.isFainted = (p1Char.currentHp ?? 100) <= 0;

    p2Char.currentHp = result.player2Character.currentHp;
    p2Char.isFainted = (p2Char.currentHp ?? 100) <= 0;

    // Track knockout scoreboard (total enemy heroes defeated)
    const p1Knockouts = match.player2.collection.filter(c => (c.currentHp ?? 100) <= 0).length;
    const p2Knockouts = match.player1.collection.filter(c => (c.currentHp ?? 100) <= 0).length;
    match.player1Score = p1Knockouts;
    match.player2Score = p2Knockouts;

    // True Team Knockout Elimination: Battle continues until all heroes on one team are KO'd (0 HP)
    const p1LivingCount = match.player1.collection.filter(c => (c.currentHp ?? 100) > 0).length;
    const p2LivingCount = match.player2.collection.filter(c => (c.currentHp ?? 100) > 0).length;

    if (p1LivingCount === 0 || p2LivingCount === 0) {
      const winner = p1LivingCount > 0 ? match.player1 : match.player2;
      match.winner = winner;
      match.status = 'COMPLETED';
      winner.stats.battlesWon += 1;

      const { updatedMatches, champion } = advanceTournamentMatches(localState.tournamentMatches);
      if (champion) {
        soundManager.playVictory();
      }

      setLocalState(prev => ({
        ...prev,
        tournamentMatches: updatedMatches,
        champion,
        phase: champion ? 'CHAMPION' : 'MATCH_RESULT',
      }));
      return;
    }

    setLocalState(prev => ({ ...prev }));
  };

  const concedeCurrentAuction = () => {
    // Instantly triggers auction expiration to award to highest bidder with zero delay
    soundManager.playClick();
    handleLocalTimeExpired();
  };

  const playMatch = (matchId: string) => {
    if (isOnlineMode) {
      socketHook.playMatch(matchId);
      return;
    }

    const match = localState.tournamentMatches.find(m => m.id === matchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') return;

    match.status = 'IN_PROGRESS';
    match.rounds = [];
    match.player1Score = 0;
    match.player2Score = 0;

    // Transition to interactive player-controlled battle arena
    setLocalState(prev => ({
      ...prev,
      currentMatchId: matchId,
      phase: 'BATTLE_FIGHT',
    }));
  };

  const restartGame = () => {
    if (isOnlineMode) {
      socketHook.restartGame();
      return;
    }
    stopLocalTimer();
    setLocalState(prev => ({
      ...prev,
      phase: 'LOCAL_SETUP',
      availableCharacters: [...ALL_CHARACTERS].sort(() => Math.random() - 0.5),
      purchasedCharacters: [],
      skippedCharacters: [],
      tournamentMatches: [],
      currentMatchId: null,
      champion: null,
      queuedGrade: null,
      players: prev.players.map(p => ({
        ...p,
        money: prev.settings.startingMoney,
        collection: [],
        stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
      })),
    }));
  };

  return {
    state: currentState,
    isOnlineMode,
    setIsOnlineMode,
    activePlayerTurnIndex,
    setActivePlayerTurnIndex,
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
  };
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameState, 
  Player, 
  Character,
  CharacterGrade,
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
import { getRandomChaosEvent } from '../data/chaosEvents';
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
  const [clientPhaseOverride, setClientPhaseOverride] = useState<GamePhase | null>(null);

  // Active Effective State (Online or Local, with Client Phase Override if user is browsing auxiliary screens)
  const baseState = isOnlineMode && socketHook.onlineState 
    ? socketHook.onlineState 
    : localState;

  const currentState: GameState = clientPhaseOverride 
    ? { ...baseState, phase: clientPhaseOverride }
    : baseState;

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
    if (isOnlineMode) {
      setClientPhaseOverride(null);
      socketHook.proceedToBattles();
      return;
    }

    setLocalState(prev => {
      // Guarantee every player has at least 1 hero to enter battle!
      const guaranteedPlayers = prev.players.map((p, idx) => {
        if (p.collection.length === 0) {
          const emergencyHero = ALL_CHARACTERS[idx % ALL_CHARACTERS.length] || ALL_CHARACTERS[0];
          return {
            ...p,
            collection: [{ ...emergencyHero, currentHp: 100, maxHp: 100, isFainted: false }],
          };
        }
        return p;
      });

      const matches = generateTournamentBracket(guaranteedPlayers);
      return {
        ...prev,
        players: guaranteedPlayers,
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
  }, [isOnlineMode, socketHook]);

  const updatePlayerCollection = useCallback((playerId: string, updatedCollection: Character[], updatedMoney: number) => {
    if (isOnlineMode) {
      socketHook.updateCollection(updatedCollection, updatedMoney);
      return;
    }
    setLocalState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, collection: updatedCollection, money: updatedMoney } : p
      ),
    }));
  }, [isOnlineMode, socketHook]);

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

      const isBlindMode = prev.settings.gameMode === 'blind_bidding' || prev.queuedGrade === 'MYSTERY';

      let targetGrade: CharacterGrade | null = null;
      if (isBlindMode) {
        // Blind Bidding Rarity Probability: Mythic 5%, A 25%, B 45%, C 25%
        const roll = Math.random();
        if (roll < 0.05) targetGrade = 'MYTHIC';
        else if (roll < 0.30) targetGrade = 'A';
        else if (roll < 0.75) targetGrade = 'B';
        else targetGrade = 'C';
      } else if (prev.queuedGrade && prev.queuedGrade !== 'MYSTERY') {
        targetGrade = prev.queuedGrade;
      }

      let nextCharIndex = -1;
      if (targetGrade) {
        nextCharIndex = available.findIndex(c => c.grade === targetGrade);
      }

      // If no target grade or not found, find a character that active drafting players can afford!
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

      // In Blind Bidding mode, every card has the exact uniform $5 starting price!
      if (isBlindMode) {
        nextChar = {
          ...nextChar,
          startingPrice: 5,
        };
      } else if (nextChar.name.includes('The One-Above-All')) {
        nextChar = {
          ...nextChar,
          startingPrice: prev.settings.startingMoney,
        };
      } else if (nextChar.startingPrice > maxPlayerFunds) {
        nextChar = {
          ...nextChar,
          startingPrice: Math.max(1, maxPlayerFunds),
        };
      }

      const isMythic = nextChar.grade === 'MYTHIC';
      // In blind bidding mode, 100% of crates are mystery. In classic, 20% if not mythic.
      const isMystery = isBlindMode || (!isMythic && Math.random() < 0.20);

      if (isMythic && !isBlindMode) {
        soundManager.playMythicReveal();
      } else if (isMystery) {
        soundManager.playAbilityTrigger();
      }

      // 🎲 CHAOS AUCTION GAME MODE (20 MULTIVERSE RULES)
      let activeChaosEvent = null;
      if (prev.settings.gameMode === 'chaos_auction') {
        activeChaosEvent = getRandomChaosEvent();
        if (activeChaosEvent.effectType === 'cheap_round') {
          nextChar.startingPrice = Math.max(2, nextChar.startingPrice - 4);
        } else if (activeChaosEvent.effectType === 'expensive_round') {
          nextChar.startingPrice += 5;
        } else if (activeChaosEvent.effectType === 'deadpool_chaos') {
          nextChar.startingPrice = 1;
        } else if (activeChaosEvent.effectType === 'super_soldier_serum') {
          nextChar.maxHp = 130;
          nextChar.currentHp = 130;
        } else if (activeChaosEvent.effectType === 'random_grade') {
          nextChar.overallPower += 5;
        }
      }

      const nextQueuedGrade = null;

      return {
        ...prev,
        availableCharacters: available,
        skippedCharacters: skipped,
        queuedGrade: nextQueuedGrade,
        activeChaosEvent,
        phase: (isMythic && !isBlindMode) ? 'AUCTION_REVEAL_MYTHIC' : 'AUCTION',
        auction: {
          currentCharacter: nextChar,
          currentBid: 0,
          highestBidderId: null,
          highestBidderName: null,
          timeRemaining: (activeChaosEvent && activeChaosEvent.effectType === 'speed_auction') ? 5 : prev.settings.auctionTimerSeconds,
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

          let actualDeduction = finalBid;
          const chaos = prev.activeChaosEvent;

          // 🛡️ Vibranium Rebate: 50% Cashback Refund
          if (chaos && chaos.effectType === 'vibranium_rebate') {
            actualDeduction = Math.max(0, finalBid - Math.floor(finalBid * 0.5));
          }

          // 🕸️ Web-Snare Tax
          if (chaos && chaos.effectType === 'web_snare_tax' && p.money >= 2) {
            actualDeduction += 2;
            char.stats.speed += 4;
          }

          // 📈 Premium Lot: +3 Permanent Power
          if (chaos && chaos.effectType === 'expensive_round') {
            char.overallPower += 3;
          }

          const newCollection = [...p.collection, char];

          // 🎁 Dual Crate Bonus Drop: Add 1 bonus ally
          if (chaos && chaos.effectType === 'double_auction' && prev.availableCharacters.length > 0 && newCollection.length < prev.settings.characterLimit) {
            const bonusChar = prev.availableCharacters[0];
            if (bonusChar && !newCollection.some(c => c.id === bonusChar.id)) {
              newCollection.push(bonusChar);
              if (!updatedPurchased.some(c => c.id === bonusChar.id)) {
                updatedPurchased.push(bonusChar);
              }
            }
          }

          return {
            ...p,
            money: Math.max(0, p.money - actualDeduction),
            collection: newCollection,
            relics: (chaos && chaos.effectType === 'god_tier_bounty') ? [...(p.relics || []), 'relic-health-potion'] : p.relics,
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
    }, 5200);
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
    if (isOnlineMode) {
      if (phase === 'HOME') {
        setClientPhaseOverride(null);
        setIsOnlineMode(false);
        setLocalState(prev => ({ ...prev, phase: 'HOME' }));
        return;
      }
      if (['EQUIPMENT_SHOP', 'ENCYCLOPEDIA', 'SANDBOX', 'HOW_TO_PLAY'].includes(phase)) {
        setClientPhaseOverride(phase);
        return;
      }
      setClientPhaseOverride(null);
      return;
    }

    setClientPhaseOverride(null);
    setLocalState(prev => ({ ...prev, phase }));
  };

  const updateLocalSettings = (settings: Partial<GameSettings>) => {
    const validated = { ...settings };
    if (validated.startingMoney !== undefined) {
      validated.startingMoney = Math.min(1000, Math.max(10, Number(validated.startingMoney) || 10));
    }
    setLocalState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...validated },
    }));
  };

  const addLocalPlayer = (name: string, isBot: boolean = false, personality: BotPersonality = 'Balanced') => {
    if (localState.players.length >= 10) return;
    const newId = `p-${Date.now()}`;
    const avatars = ['🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '⚡', '🔥', '🛡️', '🤖', '👑', '🌟'];
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
        statusMessage: `⏭️ CARD SKIPPED BY ${player.name.toUpperCase()}!`,
      },
    }));

    setTimeout(startNextLocalAuction, 400);
    return { success: true, isSkipped: true };
  };

  const instantSkipCurrentAuction = async () => {
    soundManager.playClick();
    soundManager.playSkip();
    if (isOnlineMode) {
      return await socketHook.instantSkipAuction();
    }
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

    setTimeout(startNextLocalAuction, 400);
  };

  const submitGradeVotes = async (votes: Record<string, GradeVoteOption>) => {
    soundManager.playAbilityTrigger();

    if (isOnlineMode) {
      const myId = socketHook.socket?.id || '';
      const myVote = votes[myId] || Object.values(votes)[0] || 'MYTHIC';
      return await socketHook.submitGradeVote(myVote);
    }

    // Count votes for local mode
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
    selectedHero2Index: number = 0,
    p1SkillId?: string,
    p2SkillId?: string
  ) => {
    if (isOnlineMode) {
      const matches = socketHook.onlineState?.tournamentMatches || [];
      const match = matches.find(m => m.id === matchId);
      if (!match || !match.player1 || !match.player2) return;
      const isP1 = match.player1.id === socketHook.socket?.id;
      const myAction = isP1 ? action1 : action2;
      const myHeroIdx = isP1 ? selectedHero1Index : selectedHero2Index;
      const mySkillId = isP1 ? p1SkillId : p2SkillId;
      socketHook.executeBattleAction(myAction, myHeroIdx, mySkillId);
      return;
    }

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
      action2,
      p1SkillId,
      p2SkillId
    );

    match.rounds.push(result);

    soundManager.playAttackHit();
    if (result.player1AbilityTriggered || result.player2AbilityTriggered) {
      soundManager.playAbilityTrigger();
    }

    // Update live HP on heroes
    p1Char.currentHp = result.player1HpRemaining;
    p1Char.isFainted = (p1Char.currentHp ?? 100) <= 0;

    p2Char.currentHp = result.player2HpRemaining;
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
        tournamentMatches: [...updatedMatches],
        champion,
        phase: champion ? 'CHAMPION' : 'MATCH_RESULT',
      }));
      return;
    }

    setLocalState(prev => ({
      ...prev,
      tournamentMatches: [...prev.tournamentMatches],
    }));
  };

  const triggerFlashbang = async (targetId: string) => {
    if (isOnlineMode) {
      return await socketHook.triggerFlashbang(targetId);
    }
    const target = localState.players.find(p => p.id === targetId);
    if (!target) return { success: false, error: 'Target not found' };
    target.flashbangedUntil = Date.now() + 4000;
    target.flashbangedBy = 'Local Opponent';
    setLocalState(prev => ({ ...prev, players: [...prev.players] }));
    return { success: true };
  };

  const useHealingPotion = async (heroId?: string) => {
    if (isOnlineMode) {
      return await socketHook.useHealingPotion(heroId);
    }
    return { success: true };
  };

  const concedeCurrentAuction = () => {
    soundManager.playClick();
    if (isOnlineMode) {
      socketHook.concedeAuction();
      return;
    }
    handleLocalTimeExpired();
  };

  const concedeCurrentMatch = (matchId?: string) => {
    soundManager.playClick();
    if (isOnlineMode) {
      socketHook.concedeMatch();
      return;
    }

    const currentId = matchId || localState.currentMatchId;
    const match = localState.tournamentMatches.find(m => m.id === currentId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') return;

    // In local mode, Player 1 concedes to Player 2
    const winner = match.player2;
    const loser = match.player1;

    loser.collection.forEach(c => {
      c.currentHp = 0;
      c.isFainted = true;
    });

    match.winner = winner;
    match.status = 'COMPLETED';
    winner.stats.battlesWon += 1;

    const { updatedMatches, champion } = advanceTournamentMatches(localState.tournamentMatches);
    if (champion) {
      soundManager.playVictory();
    }

    setLocalState(prev => ({
      ...prev,
      tournamentMatches: [...updatedMatches],
      champion,
      phase: champion ? 'CHAMPION' : 'MATCH_RESULT',
    }));
  };

  const skipCurrentMatch = (matchId?: string) => {
    soundManager.playClick();
    if (isOnlineMode) {
      socketHook.skipMatch();
      return;
    }

    const currentId = matchId || localState.currentMatchId;
    const match = localState.tournamentMatches.find(m => m.id === currentId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') return;

    let safety = 0;
    while ((match.status as string) !== 'COMPLETED' && safety < 30) {
      safety++;
      const p1Alive = match.player1.collection.some(c => (c.currentHp ?? 100) > 0);
      const p2Alive = match.player2.collection.some(c => (c.currentHp ?? 100) > 0);
      if (!p1Alive || !p2Alive) break;

      const p1Idx = match.player1.collection.findIndex(c => (c.currentHp ?? 100) > 0);
      const p2Idx = match.player2.collection.findIndex(c => (c.currentHp ?? 100) > 0);
      const p1Hero = match.player1.collection[p1Idx !== -1 ? p1Idx : 0];
      const p2Hero = match.player2.collection[p2Idx !== -1 ? p2Idx : 0];

      const roundResult = simulateRoundDuel(
        match.player1,
        p1Hero,
        match.player2,
        p2Hero,
        match.rounds.length + 1,
        'ATTACK',
        'ATTACK'
      );

      match.rounds.push(roundResult);
      p1Hero.currentHp = roundResult.player1HpRemaining;
      p1Hero.isFainted = (p1Hero.currentHp ?? 100) <= 0;
      p2Hero.currentHp = roundResult.player2HpRemaining;
      p2Hero.isFainted = (p2Hero.currentHp ?? 100) <= 0;

      const p1Dead = match.player1.collection.every(c => (c.currentHp ?? 100) <= 0);
      const p2Dead = match.player2.collection.every(c => (c.currentHp ?? 100) <= 0);
      if (p1Dead || p2Dead) {
        const winner = p2Dead ? match.player1 : match.player2;
        match.winner = winner;
        match.status = 'COMPLETED';
        winner.stats.battlesWon += 1;
        break;
      }
    }

    const { updatedMatches, champion } = advanceTournamentMatches(localState.tournamentMatches);
    if (champion) {
      soundManager.playVictory();
    }

    setLocalState(prev => ({
      ...prev,
      tournamentMatches: [...updatedMatches],
      champion,
      phase: champion ? 'CHAMPION' : 'MATCH_RESULT',
    }));
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

  const sendSpectatorChat = (message: string) => {
    if (isOnlineMode) {
      socketHook.sendSpectatorChat(message);
    } else {
      const activePlayer = localState.players[activePlayerTurnIndex] || localState.players[0];
      const chatMsg = {
        id: `${Date.now()}-local`,
        senderId: activePlayer.id,
        senderName: activePlayer.name,
        senderAvatar: activePlayer.avatar,
        message: message.trim().slice(0, 200),
        timestamp: Date.now(),
        isSpectator: false,
      };
      setLocalState(prev => ({
        ...prev,
        spectatorChat: [...(prev.spectatorChat || []), chatMsg].slice(-100),
      }));
    }
  };

  const discardCharacter = (playerId: string, characterId: string) => {
    if (isOnlineMode) {
      socketHook.discardCharacter(playerId, characterId);
      return;
    }

    setLocalState(prev => {
      const updatedPlayers = prev.players.map(p => {
        if (p.id === playerId) {
          return {
            ...p,
            collection: p.collection.filter(c => c.id !== characterId),
            // Strictly $0 refund: p.money remains unchanged!
          };
        }
        return p;
      });

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  const voteRematch = () => {
    if (isOnlineMode) {
      socketHook.voteRematch();
    } else {
      restartGame();
    }
  };

  const updateHostSettings = (settings: Partial<GameSettings>) => {
    if (isOnlineMode) {
      socketHook.updateHostSettings(settings);
    } else {
      updateLocalSettings(settings);
    }
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
    triggerFlashbang,
    useHealingPotion,
    submitGradeVotes,
    executeBattleRoundAction,
    concedeCurrentMatch,
    skipCurrentMatch,
    playMatch,
    discardCharacter,
    restartGame,
    updatePlayerCollection,
    proceedFromShopToBattles,
    sendSpectatorChat,
    voteRematch,
    updateHostSettings,
  };
}

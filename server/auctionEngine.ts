import { Character, Player, AuctionState, GameSettings, BotPersonality } from '../src/types/game';

export interface AuctionValidationResult {
  valid: boolean;
  error?: string;
  newBid?: number;
  newHighestBidderId?: string;
  newHighestBidderName?: string;
  timeRemaining?: number;
}

export function getScaledStartingPrice(basePrice: number, startingMoney: number = 30, characterName?: string): number {
  if (characterName && characterName.includes('The One-Above-All')) {
    return startingMoney;
  }
  const factor = startingMoney / 30;
  return Math.max(1, Math.round(basePrice * factor));
}

export function validateBid(
  player: Player,
  bidAmount: number,
  auction: AuctionState,
  settings: GameSettings
): AuctionValidationResult {
  if (!auction.isActive || !auction.currentCharacter) {
    return { valid: false, error: 'Auction is not active.' };
  }

  if (player.collection.length >= settings.characterLimit) {
    return { valid: false, error: 'Player has reached the maximum character limit.' };
  }

  if (bidAmount > player.money) {
    return { valid: false, error: 'Insufficient funds for this bid.' };
  }

  const scaledStartingPrice = getScaledStartingPrice(
    auction.currentCharacter.startingPrice, 
    settings.startingMoney
  );

  // If no bids placed yet, bid must be >= scaled starting price
  const minRequiredBid = auction.currentBid > 0 
    ? auction.currentBid + 1 
    : scaledStartingPrice;

  if (bidAmount < minRequiredBid) {
    return { 
      valid: false, 
      error: `Bid must be at least $${minRequiredBid}. Current bid is $${auction.currentBid || scaledStartingPrice}.` 
    };
  }

  // Anti-sniping logic: if less than antiSnipingSeconds remain, bump timer
  let newTime = auction.timeRemaining;
  if (auction.timeRemaining < settings.antiSnipingSeconds) {
    newTime = Math.max(auction.timeRemaining, settings.antiSnipingSeconds);
  }

  return {
    valid: true,
    newBid: bidAmount,
    newHighestBidderId: player.id,
    newHighestBidderName: player.name,
    timeRemaining: newTime,
  };
}

export function validateSkipVote(
  player: Player,
  auction: AuctionState,
  activePlayers: Player[]
): { valid: boolean; error?: string; isSkipped: boolean; newVotes: string[] } {
  if (!auction.isActive || !auction.currentCharacter) {
    return { valid: false, error: 'No active auction.', isSkipped: false, newVotes: auction.skipVotes };
  }

  // If player already placed a bid, they cannot vote to skip
  if (auction.hasBidded.includes(player.id)) {
    return { valid: false, error: 'Cannot skip after placing a bid.', isSkipped: false, newVotes: auction.skipVotes };
  }

  // If already voted, noop or toggle
  const newVotes = auction.skipVotes.includes(player.id)
    ? auction.skipVotes
    : [...auction.skipVotes, player.id];

  // Eligible players = players who haven't reached collection limit
  const eligiblePlayers = activePlayers.filter(p => p.collection.length < 4); // or dynamic limit
  const allVoted = eligiblePlayers.length > 0 && eligiblePlayers.every(p => newVotes.includes(p.id));

  return {
    valid: true,
    isSkipped: allVoted,
    newVotes,
  };
}

// AI Bot Decision Engine during auction ticks
export function calculateBotBid(
  bot: Player,
  auction: AuctionState,
  settings: GameSettings
): number | null {
  if (!auction.isActive || !auction.currentCharacter) return null;
  if (bot.collection.length >= settings.characterLimit) return null;
  if (auction.highestBidderId === bot.id) return null; // Already highest bidder

  const char = auction.currentCharacter;
  const scaledStart = getScaledStartingPrice(char.startingPrice, settings.startingMoney);
  const currentBid = auction.currentBid > 0 ? auction.currentBid : scaledStart;
  const nextMinBid = auction.currentBid > 0 ? auction.currentBid + 1 : scaledStart;

  if (nextMinBid > bot.money) return null;

  const personality: BotPersonality = bot.botPersonality || 'Balanced';
  const remainingSlots = settings.characterLimit - bot.collection.length;
  const avgMoneyPerRemainingSlot = (bot.money - nextMinBid) / Math.max(1, remainingSlots - 1);

  // Decision logic based on personality & character grade
  let willingness = 0.5; // Base probability to bid
  let maxWillingBid = nextMinBid;

  switch (personality) {
    case 'Easy':
      willingness = 0.35;
      maxWillingBid = scaledStart + (char.grade === 'C' ? 1 : 0);
      break;

    case 'Medium':
      willingness = 0.60;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 3 : char.grade === 'A' ? 2 : 1));
      break;

    case 'Hard':
      willingness = 0.80;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 6 : char.grade === 'A' ? 4 : 2));
      break;

    case 'Extreme':
      // Extreme bots bid aggressively, especially when auction time is running low (sniping behavior)
      willingness = auction.timeRemaining <= 4 ? 0.95 : 0.85;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 8 : char.grade === 'A' ? 5 : 3));
      break;

    case 'Aggressive':
      willingness = 0.85;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 6 : char.grade === 'A' ? 4 : 2));
      break;

    case 'Cosmic':
      if (char.grade === 'MYTHIC' || char.grade === 'A') {
        willingness = 0.9;
        maxWillingBid = Math.min(bot.money, scaledStart + 5);
      } else {
        willingness = 0.3; // Save money for top tiers
        maxWillingBid = scaledStart;
      }
      break;

    case 'Value':
      if (char.grade === 'C' || char.grade === 'B') {
        willingness = 0.75;
        maxWillingBid = scaledStart + 1;
      } else {
        willingness = 0.25;
        maxWillingBid = scaledStart;
      }
      break;

    case 'Balanced':
    default:
      willingness = 0.65;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 4 : 2));
      break;
  }

  // Ensure bot does not bankrupt themselves prematurely if multiple slots remain
  if (remainingSlots > 1 && avgMoneyPerRemainingSlot < 2 && char.grade !== 'MYTHIC') {
    return null;
  }

  if (nextMinBid <= maxWillingBid && Math.random() < willingness) {
    return nextMinBid;
  }

  return null;
}

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

  // Synergy detection with existing bot roster
  let synergyBonus = 0;
  if (bot.collection.length > 0) {
    const matchingAlignments = bot.collection.filter(c => c.alignment === char.alignment).length;
    const matchingFactions = bot.collection.flatMap(c => (c.factions || []) as string[]).filter(f => (char.factions || []).includes(f as any)).length;
    if (matchingAlignments >= 2 || matchingFactions >= 1) {
      synergyBonus = 2;
    }
  }

  // Decision logic based on personality & character grade
  let willingness = 0.5; // Base probability to bid
  let maxWillingBid = nextMinBid;

  switch (personality) {
    case 'Easy':
      // Easy bots bid casually, avoid high bidding wars, and never snipe
      willingness = 0.30;
      maxWillingBid = scaledStart + (char.grade === 'C' ? 1 : 0);
      break;

    case 'Medium':
      // Medium bots value decent cards and moderate power
      willingness = 0.60;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 4 : char.grade === 'A' ? 3 : 1) + synergyBonus);
      break;

    case 'Hard':
      // Hard bots actively target high tiers and build strong synergies
      willingness = auction.timeRemaining <= 5 ? 0.90 : 0.75;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 7 : char.grade === 'A' ? 5 : 2) + synergyBonus * 1.5);
      break;

    case 'Extreme':
      // Extreme bots snipe decisively in the final 3 seconds and aggressively contest MYTHIC/A grades
      willingness = auction.timeRemaining <= 3 ? 0.98 : 0.80;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 10 : char.grade === 'A' ? 6 : 3) + synergyBonus * 2);
      break;

    case 'Aggressive':
      willingness = 0.85;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 6 : char.grade === 'A' ? 4 : 2) + synergyBonus);
      break;

    case 'Cosmic':
      if (char.grade === 'MYTHIC' || char.grade === 'A') {
        willingness = 0.92;
        maxWillingBid = Math.min(bot.money, scaledStart + 6 + synergyBonus);
      } else {
        willingness = 0.25; // Save money for cosmic entities
        maxWillingBid = scaledStart;
      }
      break;

    case 'Value':
      if (char.grade === 'C' || char.grade === 'B') {
        willingness = 0.75;
        maxWillingBid = scaledStart + 1;
      } else {
        willingness = 0.20;
        maxWillingBid = scaledStart;
      }
      break;

    case 'Balanced':
    default:
      willingness = 0.65;
      maxWillingBid = Math.min(bot.money, scaledStart + (char.grade === 'MYTHIC' ? 5 : 2) + synergyBonus);
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

export function shouldBotSkip(bot: Player, auction: AuctionState, settings: GameSettings): boolean {
  if (!auction.isActive || !auction.currentCharacter) return false;
  const personality = bot.botPersonality || 'Balanced';
  const char = auction.currentCharacter;

  if (personality === 'Easy') {
    return Math.random() < 0.35;
  }
  if (personality === 'Cosmic' && char.grade === 'C') {
    return Math.random() < 0.60;
  }
  if ((personality === 'Hard' || personality === 'Extreme') && char.grade === 'C' && bot.money > 20) {
    return Math.random() < 0.50; // Skip weak cards to get to high-tier rounds faster
  }
  return false;
}

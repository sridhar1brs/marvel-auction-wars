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
    settings.startingMoney,
    auction.currentCharacter.name
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

const GRADE_VALUE: Record<Character['grade'], number> = {
  C: 35,
  B: 52,
  A: 72,
  MYTHIC: 100,
};

/**
 * Gives bots a player-like estimate of a card.  Price, power, and roster
 * synergy all matter; a rare card is not automatically a good purchase.
 */
export function evaluateBotCharacter(bot: Player, char: Character, settings: GameSettings): number {
  const power = Math.max(0, Math.min(100, char.overallPower || 0));
  const matchingAlignment = bot.collection.some(c => c.alignment === char.alignment) ? 5 : 0;
  const matchingFaction = bot.collection.some(c =>
    (c.factions || []).some(f => (char.factions || []).includes(f))
  ) ? 7 : 0;
  const synergy = Math.min(14, matchingAlignment + matchingFaction);
  const scaledPrice = getScaledStartingPrice(char.startingPrice, settings.startingMoney, char.name);
  const value = GRADE_VALUE[char.grade] * 0.55 + power * 0.45 + synergy;
  // Grade floor prevents expensive Mythics from looking worse than cheap C
  // cards while still rewarding genuinely good bargains.
  return value / Math.max(1, scaledPrice) + GRADE_VALUE[char.grade] / 6;
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
  if (auction.skipVotes.includes(bot.id)) return null; // The bot has passed on this lot

  const char = auction.currentCharacter;
  const scaledStart = getScaledStartingPrice(char.startingPrice, settings.startingMoney, char.name);
  const currentBid = auction.currentBid > 0 ? auction.currentBid : scaledStart;
  const nextMinBid = auction.currentBid > 0 ? auction.currentBid + 1 : scaledStart;

  if (nextMinBid > bot.money) return null;

  const personality: BotPersonality = bot.botPersonality || 'Balanced';
  const remainingSlots = settings.characterLimit - bot.collection.length;
  const cardValue = evaluateBotCharacter(bot, char, settings);
  const gradeBase = GRADE_VALUE[char.grade];
  const reserve = remainingSlots > 1 ? (remainingSlots - 1) * Math.max(2, Math.ceil(scaledStart * 0.45)) : 0;
  const availableAfterBid = bot.money - nextMinBid;
  if (availableAfterBid < reserve && char.grade !== 'MYTHIC') {
    return null;
  }

  // Difficulty changes both card selectivity and how far a bot will contest.
  // Legacy personalities remain supported for online rooms.
  let minValue: number;
  let bidPremium: number;
  let willingness: number;
  switch (personality) {
    case 'Easy':
      minValue = 18; bidPremium = 0.10; willingness = 0.55; break;
    case 'Medium':
      minValue = 14; bidPremium = 0.28; willingness = 0.72; break;
    case 'Hard':
      minValue = 11; bidPremium = 0.48; willingness = auction.timeRemaining <= 4 ? 0.98 : 0.88; break;
    case 'Extreme':
      minValue = 10; bidPremium = 0.65; willingness = auction.timeRemaining <= 3 ? 1 : 0.94; break;
    case 'Cosmic':
      minValue = char.grade === 'MYTHIC' || char.grade === 'A' ? 12 : 18;
      bidPremium = 0.5; willingness = 0.9; break;
    case 'Value':
      minValue = 16; bidPremium = 0.18; willingness = 0.8; break;
    case 'Aggressive':
      minValue = 11; bidPremium = 0.42; willingness = 0.9; break;
    case 'Balanced':
    default:
      minValue = 13; bidPremium = 0.3; willingness = 0.78; break;
  }

  const maxWillingBid = Math.min(bot.money - reserve, Math.floor(scaledStart * (1 + bidPremium) + Math.max(0, (cardValue - minValue) * 2)));
  if (cardValue >= minValue && nextMinBid <= maxWillingBid && Math.random() < willingness) {
    return nextMinBid;
  }

  return null;
}

export function shouldBotSkip(bot: Player, auction: AuctionState, settings: GameSettings): boolean {
  if (!auction.isActive || !auction.currentCharacter) return false;
  const personality = bot.botPersonality || 'Balanced';
  const char = auction.currentCharacter;

  const value = evaluateBotCharacter(bot, char, settings);
  const thresholds: Record<string, number> = {
    // Value is a quality-plus-power-per-dollar estimate (typically 10-25).
    Easy: 18, Medium: 15, Hard: 12, Extreme: 10,
    Balanced: 14, Aggressive: 12, Value: 16, Cosmic: 15,
  };
  const threshold = thresholds[personality] || thresholds.Balanced;
  // A skip is a deliberate pass, not a random veto. Small uncertainty keeps
  // easy bots from behaving identically every round.
  return value < threshold && Math.random() < (personality === 'Hard' || personality === 'Extreme' ? 0.85 : 0.65);
}

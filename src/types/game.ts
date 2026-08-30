export type CharacterGrade = 'C' | 'B' | 'A' | 'MYTHIC';
export type CharacterAlignment = 'Hero' | 'Villain' | 'Anti-Hero' | 'Cosmic' | 'Neutral';
export type Faction = 
  | 'Avengers' 
  | 'X-Men' 
  | 'Spider-Verse' 
  | 'Midnight Sons' 
  | 'Black Order' 
  | 'Guardians' 
  | 'Cosmic Entities' 
  | 'Brotherhood' 
  | 'Sinister Six' 
  | 'Defenders';

export interface SpecialAbility {
  name: string;
  description: string;
  bonusPower: number; // Battle roll bonus modifier
  triggerRate: number; // 0.0 to 1.0 probability of triggering in battle
  type: 'attack' | 'defense' | 'cosmic' | 'tactical';
}

export interface ArtifactItem {
  id: string;
  name: string;
  cost: number;
  astraCost?: number;
  rarity?: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  icon: string;
  description: string;
  bonusPower?: number;
  statModifiers?: { power?: number; hp?: number; defense?: number; speed?: number };
  effectType: 
    | 'double_roll' 
    | 'shield_negate' 
    | 'shrink_enemy' 
    | 'lightning_strike' 
    | 'speed_evasion' 
    | 'stat_boost'
    | 'life_drain'
    | 'reroll'
    | 'lethal_strike'
    | 'invulnerable'
    | 'all_stats'
    | 'cosmic_supremacy'
    | 'speed_slow'
    | 'undo_round'
    | 'revive_hero'
    | 'freeze';
}

export type BattleActionType = 
  | 'ATTACK' 
  | 'SPECIAL' 
  | 'DEFEND' 
  | 'ARTIFACT' 
  | 'SKILL_1' 
  | 'SKILL_2' 
  | 'SKILL_3' 
  | 'SKILL_4' 
  | 'SKILL_5' 
  | 'DUAL_STRIKE';
export type GradeVoteOption = CharacterGrade | 'MYSTERY';

export interface BountyReward {
  type: 'cash' | 'shield' | 'power';
  value: number;
  label: string;
}

export interface Character {
  id: string;
  name: string;
  alias?: string;
  grade: CharacterGrade;
  alignment: CharacterAlignment;
  factions?: Faction[];
  startingPrice: number;
  powers: string;
  description: string;
  imageUrl: string;
  color: string; // Hex accent color
  stats: {
    strength: number;    // 1-100
    speed: number;       // 1-100
    durability: number;  // 1-100
    intelligence: number;// 1-100
    energy: number;      // 1-100
    combat: number;      // 1-100
  };
  specialAbilities: SpecialAbility[];
  overallPower: number;  // 50-99 scale
  equippedArtifact?: ArtifactItem | null;
  equippedSkills?: any[];
  usedSkillIds?: string[]; // Authoritative tracking of 1-time signature skills used in combat
  currentHp?: number;    // Default 100
  maxHp?: number;        // Default 100
  isFainted?: boolean;
  lastStandActive?: boolean; // Comeback mechanic: activated when HP <= 25%
  bounty?: BountyReward;
}

export type BotPersonality = 'Aggressive' | 'Value' | 'Cosmic' | 'Balanced' | 'Easy' | 'Medium' | 'Hard' | 'Extreme';
export type GameMode = 'classic' | 'blind_bidding' | 'boss_raid' | 'blitz' | 'chaos_auction';
export type ArenaBackgroundId = 'wakanda' | 'asgard' | 'quantum' | 'avengers' | 'knowhere';

export interface BossRaidState {
  bossId: 'galactus' | 'infinity_ultron';
  bossName: string;
  bossTitle: string;
  bossHp: number;
  bossMaxHp: number;
  bossPhase: number;
  bossSpecialMeter: number;
  bossImageUrl: string;
  combatLog: string[];
  isDefeated: boolean;
  isTeamWiped: boolean;
}

export type PlayerStatus = 
  | 'ONLINE' 
  | 'CHOOSING' 
  | 'READY' 
  | 'IN_BATTLE' 
  | 'SPECTATING' 
  | 'BIDDING' 
  | 'WAITING' 
  | 'DISCONNECTED' 
  | 'ELIMINATED';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: number;
  isSpectator?: boolean;
}

export type ChaosEffectType = 
  | 'double_money' 
  | 'expensive_round' 
  | 'cheap_round' 
  | 'hidden_character' 
  | 'speed_auction' 
  | 'no_skip' 
  | 'double_auction' 
  | 'random_grade' 
  | 'market_chaos'
  | 'vibranium_rebate'
  | 'overdrive_clash'
  | 'quantum_reroll'
  | 'god_tier_bounty'
  | 'infinity_gem'
  | 'super_soldier_serum'
  | 'web_snare_tax'
  | 'bloodstone_drain'
  | 'mjolnir_blessing'
  | 'deadpool_chaos'
  | 'agamotto_prevision';

export interface ChaosEvent {
  id: string;
  name: string;
  description: string;
  effectType: ChaosEffectType;
  badge: string;
  multiplier?: number;
}

export interface PlayerProfile {
  id: string;
  username: string;
  displayName?: string;
  avatar: string;
  level: number;
  xp: number;
  currentLevelXp?: number;
  xpForNextLevel?: number;
  progressPercent?: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  favoriteCharacterId?: string;
  charactersPurchased: number;
  battlesWon: number;
  battlesLost?: number;
  mvpAwards: number;
  tournamentWins: number;
  totalMoneySpent?: number;
  highestBid?: number;
  dungeonMaxWave?: number;
  dungeonPeak?: number;
  astra: number;
  ascensionCoins?: number; // Legacy alias for backward compatibility
  role?: 'admin' | 'player';
  isAdmin?: boolean;
  rankedTier?: string;
  rankedDivision?: number;
  rankedRating?: number;
  placementMatchesPlayed?: number; // 0 to 10
  placementMatchesTotal?: number; // 10
  isPlacementsCompleted?: boolean;
  highestRank?: string;
  highestRating?: number;
  currentWinStreak?: number;
  bestWinStreak?: number;
  totalDamageDealt?: number;
  bossesDefeated?: number;
  dungeonsCompleted?: number;
  customAvatarUrl?: string;
  bio?: string;
  favoriteGameMode?: string;
  playtimeSeconds?: number;
  playtimeFormatted?: string;
  createdAt?: number;
  lastActiveAt?: number;
}

export interface RedeemCode {
  code: string; // 10 characters uppercase alphanumeric (e.g. A7K9X2PQ4M)
  astraReward: number;
  rewardType?: 'ASTRA' | 'CHARACTER' | 'SHARD' | 'CRATE';
  rewardAmount?: number;
  characterId?: string;
  crateType?: string;
  maxUses: number;
  usedCount: number;
  expiresAt: string; // YYYY-MM-DD
  isActive: boolean;
  createdAt: number;
  redeemedBy: string[]; // Array of user IDs
  creatorUsername?: string;
}

export interface AdminActionLog {
  id: string;
  action: string;
  details: string;
  adminUsername: string;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  collection: Character[];
  relics?: string[]; // Owned artifact/relic IDs (e.g. 'art-025' for Healing Potion, 'art-026' for Flashbang)
  usedSkillIds?: string[]; // Authoritative 1-time skill usages
  flashbangedUntil?: number; // Timestamp until which player actions are locked
  flashbangedBy?: string; // Name/ID of player who detonated flashbang
  isHost: boolean;
  isReady: boolean;
  isBot: boolean;
  level?: number;
  status?: PlayerStatus;
  profile?: PlayerProfile;
  botPersonality?: BotPersonality;
  isDisconnected?: boolean;
  activeSynergies?: SynergyBonus[];
  stats: {
    battlesWon: number;
    moneySpent: number;
    highestBid: number;
    damageDealt?: number;
    damageReceived?: number;
    charactersDefeated?: number;
  };
}

export interface SynergyBonus {
  faction: Faction;
  title: string;
  count: number;
  bonusPower: number;
  description: string;
}

export interface GameSettings {
  playerCount: number;
  startingMoney: number;
  characterLimit: number;
  auctionTimerSeconds: number;
  antiSnipingSeconds: number;
  gameMode?: GameMode;
  mysteryCratesEnabled?: boolean;
  chaosAuctionEnabled?: boolean;
}

export type GamePhase =
  | 'HOME'
  | 'ASCENSION'
  | 'MODE_SELECT'
  | 'LOCAL_SETUP'
  | 'ONLINE_LOBBY'
  | 'AUCTION_INTRO'
  | 'GRADE_VOTING'
  | 'AUCTION'
  | 'AUCTION_REVEAL_MYTHIC'
  | 'AUCTION_MYSTERY_REVEAL'
  | 'AUCTION_WINNER'
  | 'AUCTION_COMPLETE'
  | 'SKILL_VAULT'
  | 'EQUIPMENT_SHOP'
  | 'BATTLE_TRANSITION'
  | 'TOURNAMENT_TREE'
  | 'BATTLE_SELECT'
  | 'BATTLE_FIGHT'
  | 'BATTLE_ROUND_RESULT'
  | 'MATCH_RESULT'
  | 'CHAMPION'
  | 'BOSS_RAID'
  | 'DUNGEON'
  | 'ENCYCLOPEDIA'
  | 'HOW_TO_PLAY'
  | 'SANDBOX';

export interface Bid {
  playerId: string;
  playerName: string;
  amount: number;
  timestamp: number;
}

export interface AuctionState {
  currentCharacter: Character | null;
  currentBid: number;
  highestBidderId: string | null;
  highestBidderName: string | null;
  timeRemaining: number;
  isActive: boolean;
  bidsHistory: Bid[];
  skipVotes: string[]; // Player IDs who voted to skip
  hasBidded: string[]; // Player IDs who placed at least 1 bid on this card
  statusMessage: string;
  isMythicRevealed?: boolean;
  isMysteryCrate?: boolean;
  unboxedCharacter?: Character | null;
}

export interface BattleRound {
  roundNumber: number;
  tier: CharacterGrade;
  player1Character: Character;
  player2Character: Character;
  player1Action?: BattleActionType;
  player2Action?: BattleActionType;
  player1Roll: number;
  player2Roll: number;
  player1SynergyBonus?: number;
  player2SynergyBonus?: number;
  player1ArtifactUsed?: ArtifactItem;
  player2ArtifactUsed?: ArtifactItem;
  player1AbilityTriggered?: SpecialAbility;
  player2AbilityTriggered?: SpecialAbility;
  player1TotalPower: number;
  player2TotalPower: number;
  player1DamageDealt: number;
  player2DamageDealt: number;
  player1HpRemaining: number;
  player2HpRemaining: number;
  winnerPlayerId: string;
  log: string[];
}

export interface TournamentMatch {
  id: string;
  roundName: 'Round of 16' | 'Quarterfinals' | 'Semifinals' | 'Final' | 'Match';
  roundIndex: number; // 0, 1, 2...
  matchIndex: number;
  player1: Player | null;
  player2: Player | null;
  winner: Player | null;
  isBye?: boolean;
  status: 'PENDING' | 'READY' | 'IN_PROGRESS' | 'COMPLETED';
  rounds: BattleRound[];
  player1Score: number;
  player2Score: number;
  targetWins: number;
  player1SelectedHeroIndex?: number;
  player2SelectedHeroIndex?: number;
  player1Action?: BattleActionType;
  player2Action?: BattleActionType;
  player1SkillId?: string;
  player2SkillId?: string;
  player1Ready?: boolean;
  player2Ready?: boolean;
}

export interface GameState {
  roomId: string;
  isOnline: boolean;
  phase: GamePhase;
  settings: GameSettings;
  players: Player[];
  activePlayerIndex: number;
  availableCharacters: Character[];
  purchasedCharacters: Character[];
  skippedCharacters: Character[];
  auction: AuctionState;
  tournamentMatches: TournamentMatch[];
  currentMatchId: string | null;
  champion: Player | null;
  gradeVotes?: Record<string, GradeVoteOption>;
  auctionRoundCount?: number;
  queuedGrade?: GradeVoteOption | null;
  lastVotedCheckpoint?: number;
  spectatorChat?: ChatMessage[];
  activeChaosEvent?: ChaosEvent | null;
  rematchVotes?: string[]; // Player IDs who voted to rematch
}

/** State exchanged by the Socket.IO Ascension battle service.  Character
 * stats are always populated by the server from ALL_CHARACTERS. */
export type AscensionBattlePhase = 'LOBBY' | 'MATCHMAKING' | 'BATTLE' | 'RESULT' | 'CANCELLED';

export interface AscensionBattlePlayer {
  id: string;
  profileId?: string;
  name: string;
  avatar: string;
  rating: number;
  team: Character[];
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

export interface AscensionBattleState {
  roomId: string;
  mode: 'casual' | 'ranked';
  format: '1v1' | '2v2' | '3v3' | '4v4' | '5v5' | 'custom';
  phase: AscensionBattlePhase;
  maxPlayers: number;
  hostId: string;
  players: AscensionBattlePlayer[];
  currentRound: number;
  activePlayerIds: string[];
  selectedHeroIndexes: Record<string, number>;
  pendingActions: Record<string, BattleActionType>;
  rounds: BattleRound[];
  combatLogs: string[];
  winnerId?: string;
  rewards?: Record<string, {
    isWin: boolean;
    astraAwarded: number;
    xpAwarded: number;
    ratingDelta: number;
    newRating: number;
    newTier: string;
  }>;
  error?: string;
}

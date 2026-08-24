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
  icon: string;
  description: string;
  bonusPower?: number;
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
  currentHp?: number;    // Default 100
  maxHp?: number;        // Default 100
  isFainted?: boolean;
  bounty?: BountyReward;
}

export type BotPersonality = 'Aggressive' | 'Value' | 'Cosmic' | 'Balanced';
export type GameMode = 'classic' | 'blind_bidding' | 'boss_raid' | 'blitz';
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

export interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  collection: Character[];
  isHost: boolean;
  isReady: boolean;
  isBot: boolean;
  botPersonality?: BotPersonality;
  isDisconnected?: boolean;
  activeSynergies?: SynergyBonus[];
  stats: {
    battlesWon: number;
    moneySpent: number;
    highestBid: number;
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
}

export type GamePhase =
  | 'HOME'
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
  roundName: 'Quarterfinals' | 'Semifinals' | 'Final' | 'Match';
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
}

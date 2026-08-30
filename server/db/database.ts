import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getLevelFromXp, calculateMatchXp, formatPlaytime, MatchXpParams, XpBreakdown } from '../progression';
import {
  BATTLE_PASS_LEVELS,
  BATTLE_PASS_XP_PER_LEVEL,
  getBattlePassLevelForXp,
  getBattlePassReward,
  getCharacterShardCategory,
  CharacterShardCategory,
  ALL_RANK_DEFINITIONS,
  RankedTierReward,
} from '../../src/data/ascensionProgression';
import { ALL_CHARACTERS } from '../../src/data/characters/index';

// ============================================================
// NEW SYSTEM INTERFACES (v4.0 — Complete Overhaul)
// ============================================================

export interface SavedTeam {
  id: string;
  name: string;
  characterIds: string[]; // Up to 8 character IDs
  createdAt: number;
  updatedAt: number;
}

export interface DailyMissionState {
  missionId: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardType: 'astra' | 'cardShards' | 'xp';
  rewardAmount: number;
  eventType: string;
  isCompleted: boolean;
  isClaimed: boolean;
  expiresAt: string; // YYYY-MM-DD
}

export interface WeeklyMissionState {
  missionId: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardType: 'astra' | 'cardShards' | 'xp';
  rewardAmount: number;
  eventType: string;
  isCompleted: boolean;
  isClaimed: boolean;
  expiresAt: string; // YYYY-MM-DD (end of week)
}

export interface AchievementState {
  progress: number;
  isClaimed: boolean;
  unlockedAt?: number;
}

export interface CharacterMasteryState {
  xp: number;
  level: number; // 1-10
}

export interface WheelReward {
  type: 'astra' | 'cardShards' | 'xp' | 'wheelSpin';
  amount: number;
  label: string;
  color: string;
}

// Static daily mission pool
const DAILY_MISSION_POOL = [
  { missionId: 'battle_win_1', title: 'First Blood', description: 'Win 1 battle', target: 1, rewardType: 'astra' as const, rewardAmount: 500, eventType: 'battle_win' },
  { missionId: 'battle_win_2', title: 'Warrior', description: 'Win 2 battles', target: 2, rewardType: 'astra' as const, rewardAmount: 900, eventType: 'battle_win' },
  { missionId: 'battle_win_3', title: 'Battle Master', description: 'Win 3 battles', target: 3, rewardType: 'astra' as const, rewardAmount: 1200, eventType: 'battle_win' },
  { missionId: 'battle_play_3', title: 'In the Arena', description: 'Play 3 battles', target: 3, rewardType: 'astra' as const, rewardAmount: 600, eventType: 'battle_play' },
  { missionId: 'battle_play_5', title: 'Gladiator', description: 'Play 5 battles', target: 5, rewardType: 'astra' as const, rewardAmount: 800, eventType: 'battle_play' },
  { missionId: 'ranked_play_1', title: 'Competitor', description: 'Play 1 ranked match', target: 1, rewardType: 'astra' as const, rewardAmount: 700, eventType: 'ranked_play' },
  { missionId: 'ranked_win_1', title: 'Rank Climber', description: 'Win 1 ranked match', target: 1, rewardType: 'astra' as const, rewardAmount: 1000, eventType: 'ranked_win' },
  { missionId: 'dungeon_wave_5', title: 'Dungeon Crawler', description: 'Clear 5 dungeon waves', target: 5, rewardType: 'cardShards' as const, rewardAmount: 50, eventType: 'dungeon_wave' },
  { missionId: 'dungeon_wave_10', title: 'Ancient Ruins Veteran', description: 'Clear 10 dungeon waves', target: 10, rewardType: 'cardShards' as const, rewardAmount: 100, eventType: 'dungeon_wave' },
  { missionId: 'dungeon_complete', title: 'Dungeon Conqueror', description: 'Complete a dungeon run', target: 1, rewardType: 'astra' as const, rewardAmount: 1500, eventType: 'dungeon_complete' },
  { missionId: 'buy_char_1', title: 'Recruitment Drive', description: 'Purchase 1 character', target: 1, rewardType: 'cardShards' as const, rewardAmount: 25, eventType: 'buy_char' },
  { missionId: 'buy_char_3', title: 'Team Builder', description: 'Purchase 3 characters', target: 3, rewardType: 'cardShards' as const, rewardAmount: 75, eventType: 'buy_char' },
  { missionId: 'open_crate_1', title: 'Crate Opener', description: 'Open 1 crate', target: 1, rewardType: 'astra' as const, rewardAmount: 300, eventType: 'open_crate' },
  { missionId: 'spin_wheel_1', title: 'Wheel of Fortune', description: 'Spin the Mystery Wheel', target: 1, rewardType: 'astra' as const, rewardAmount: 250, eventType: 'spin_wheel' },
  { missionId: 'use_card_forge', title: 'The Forge', description: 'Craft a card in the Card Forge', target: 1, rewardType: 'cardShards' as const, rewardAmount: 30, eventType: 'card_forge' },
];

// Static weekly mission pool
const WEEKLY_MISSION_POOL = [
  { missionId: 'w_battle_win_10', title: 'Seasoned Warrior', description: 'Win 10 battles this week', target: 10, rewardType: 'astra' as const, rewardAmount: 5000, eventType: 'battle_win' },
  { missionId: 'w_battle_win_15', title: 'Battle Hardened', description: 'Win 15 battles this week', target: 15, rewardType: 'astra' as const, rewardAmount: 7500, eventType: 'battle_win' },
  { missionId: 'w_ranked_win_5', title: 'Ranked Warrior', description: 'Win 5 ranked matches', target: 5, rewardType: 'astra' as const, rewardAmount: 6000, eventType: 'ranked_win' },
  { missionId: 'w_ranked_win_10', title: 'Rank Dominator', description: 'Win 10 ranked matches', target: 10, rewardType: 'astra' as const, rewardAmount: 10000, eventType: 'ranked_win' },
  { missionId: 'w_dungeon_3', title: 'Dungeon Veteran', description: 'Complete 3 dungeon runs', target: 3, rewardType: 'cardShards' as const, rewardAmount: 300, eventType: 'dungeon_complete' },
  { missionId: 'w_dungeon_5', title: 'Ancient Ruins Master', description: 'Complete 5 dungeon runs', target: 5, rewardType: 'cardShards' as const, rewardAmount: 500, eventType: 'dungeon_complete' },
  { missionId: 'w_buy_10', title: 'Grand Recruiter', description: 'Purchase 10 characters', target: 10, rewardType: 'astra' as const, rewardAmount: 3000, eventType: 'buy_char' },
  { missionId: 'w_battle_play_20', title: 'Weekend Warrior', description: 'Play 20 battles', target: 20, rewardType: 'astra' as const, rewardAmount: 4000, eventType: 'battle_play' },
  { missionId: 'w_open_crate_5', title: 'Crate Fanatic', description: 'Open 5 crates', target: 5, rewardType: 'cardShards' as const, rewardAmount: 200, eventType: 'open_crate' },
  { missionId: 'w_craft_3', title: 'Master Forger', description: 'Craft 3 cards in the Forge', target: 3, rewardType: 'astra' as const, rewardAmount: 2000, eventType: 'card_forge' },
];

// Static achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Record<string, { title: string; description: string; target: number; rewardType: 'astra' | 'cardShards'; rewardAmount: number; icon: string }> = {
  'first_blood':         { title: 'First Blood', description: 'Win your first battle', target: 1, rewardType: 'astra', rewardAmount: 500, icon: '⚔️' },
  'battle_10':          { title: 'Gladiator', description: 'Win 10 battles', target: 10, rewardType: 'astra', rewardAmount: 1500, icon: '🗡️' },
  'battle_50':          { title: 'Battle-Hardened', description: 'Win 50 battles', target: 50, rewardType: 'astra', rewardAmount: 5000, icon: '🛡️' },
  'battle_100':         { title: 'War Hero', description: 'Win 100 battles', target: 100, rewardType: 'astra', rewardAmount: 15000, icon: '🏆' },
  'collector_10':       { title: 'Collector', description: 'Own 10 characters', target: 10, rewardType: 'cardShards', rewardAmount: 100, icon: '🃏' },
  'collector_50':       { title: 'Major Collector', description: 'Own 50 characters', target: 50, rewardType: 'cardShards', rewardAmount: 500, icon: '📦' },
  'collector_100':      { title: 'Master Collector', description: 'Own 100 characters', target: 100, rewardType: 'cardShards', rewardAmount: 1500, icon: '🌟' },
  'dungeon_1':          { title: 'Dungeon Delver', description: 'Complete a dungeon run', target: 1, rewardType: 'astra', rewardAmount: 1000, icon: '🏰' },
  'dungeon_10':         { title: 'Dungeon Master', description: 'Complete 10 dungeon runs', target: 10, rewardType: 'astra', rewardAmount: 5000, icon: '🔮' },
  'crate_opener_5':    { title: 'Crate Hunter', description: 'Open 5 crates', target: 5, rewardType: 'cardShards', rewardAmount: 100, icon: '📦' },
  'crate_opener_25':   { title: 'Crate Fanatic', description: 'Open 25 crates', target: 25, rewardType: 'cardShards', rewardAmount: 500, icon: '🎁' },
  'ranked_bronze':     { title: 'Bronze Contender', description: 'Reach Bronze rank', target: 1, rewardType: 'astra', rewardAmount: 1000, icon: '🥉' },
  'ranked_gold':       { title: 'Gold Warrior', description: 'Reach Gold rank', target: 1, rewardType: 'astra', rewardAmount: 3000, icon: '🥇' },
  'ranked_diamond':    { title: 'Diamond Elite', description: 'Reach Diamond rank', target: 1, rewardType: 'astra', rewardAmount: 8000, icon: '💎' },
  'ranked_ascender':   { title: 'Ascender', description: 'Reach the legendary Ascender rank', target: 1, rewardType: 'astra', rewardAmount: 50000, icon: '⚡' },
  'multiversal':       { title: 'Multiversal', description: 'Play all 3 game modes', target: 3, rewardType: 'astra', rewardAmount: 2000, icon: '🌌' },
  'mvp_5':             { title: 'MVP', description: 'Earn 5 MVP awards', target: 5, rewardType: 'astra', rewardAmount: 3000, icon: '⭐' },
  'forge_10':          { title: 'Forge Master', description: 'Craft 10 cards in the Card Forge', target: 10, rewardType: 'astra', rewardAmount: 2000, icon: '🔨' },
  'wheel_spin_10':     { title: 'Wheel Addict', description: 'Spin the Mystery Wheel 10 times', target: 10, rewardType: 'astra', rewardAmount: 1500, icon: '🎰' },
  'daily_streak_7':    { title: 'Weekly Devotee', description: 'Claim 7-day login streak', target: 7, rewardType: 'astra', rewardAmount: 5000, icon: '📅' },
  'mastery_level_5':   { title: 'Character Expert', description: 'Reach Mastery Level 5 with any character', target: 5, rewardType: 'cardShards', rewardAmount: 200, icon: '🎖️' },
  'mastery_level_10':  { title: 'Character Master', description: 'Reach Mastery Level 10 with any character', target: 10, rewardType: 'cardShards', rewardAmount: 500, icon: '👑' },
  'team_builder':      { title: 'Team Builder', description: 'Save 3 team presets', target: 3, rewardType: 'astra', rewardAmount: 1000, icon: '👥' },
};

// Wheel prizes (weights determine probability)
const WHEEL_PRIZES: Array<WheelReward & { weight: number }> = [
  { type: 'astra', amount: 200,   label: '200 ASTRA',    color: '#06b6d4', weight: 20 },
  { type: 'astra', amount: 500,   label: '500 ASTRA',    color: '#8b5cf6', weight: 15 },
  { type: 'astra', amount: 1000,  label: '1K ASTRA',     color: '#f59e0b', weight: 10 },
  { type: 'astra', amount: 2500,  label: '2.5K ASTRA',   color: '#ec4899', weight: 5 },
  { type: 'astra', amount: 5000,  label: '5K ASTRA',     color: '#10b981', weight: 2 },
  { type: 'cardShards', amount: 25,  label: '25 SHARDS', color: '#6366f1', weight: 18 },
  { type: 'cardShards', amount: 75,  label: '75 SHARDS', color: '#0ea5e9', weight: 10 },
  { type: 'cardShards', amount: 150, label: '150 SHARDS',color: '#7c3aed', weight: 5 },
  { type: 'xp', amount: 500,   label: '500 XP',          color: '#22c55e', weight: 18 },
  { type: 'xp', amount: 1500,  label: '1.5K XP',         color: '#84cc16', weight: 8 },
  { type: 'wheelSpin', amount: 1, label: '+1 SPIN',       color: '#f97316', weight: 5 },
  { type: 'wheelSpin', amount: 3, label: '+3 SPINS',      color: '#ef4444', weight: 2 },
];

// Card Forge crafting categories
const FORGE_CATEGORIES: Record<string, { label: string; cost: number; grades: string[]; description: string }> = {
  'random_b':      { label: 'Rare Draft',   cost: 10, grades: ['B'],           description: 'Craft a random B-grade character' },
  'random_a':      { label: 'Epic Draft',   cost: 10, grades: ['A'],           description: 'Craft a random A-grade character' },
  'random_mythic': { label: 'Mythic Draft', cost: 10, grades: ['MYTHIC'],      description: 'Craft a random MYTHIC character' },
  'random_hero':   { label: 'Hero Draft',   cost: 10, grades: ['C','B','A'],   description: 'Craft a random Hero-aligned character' },
  'random_villain':{ label: 'Villain Draft',cost: 10, grades: ['C','B','A'],   description: 'Craft a random Villain character' },
  'random_cosmic': { label: 'Cosmic Draft', cost: 10, grades: ['A','MYTHIC'],  description: 'Craft a random Cosmic tier character' },
};

// Card Shard values by grade (for duplicate conversion)
const GRADE_SHARD_VALUES: Record<string, number> = {
  'C': 25,
  'B': 100,
  'A': 250,
  'MYTHIC': 500,
};

export interface GiftRecord {
  id: string;
  senderUsername: string;
  recipientUsername: string;
  giftType: 'COINS' | 'CHARACTER' | 'RELIC' | 'SKILL' | 'COSMETIC';
  itemId?: string;
  itemName?: string;
  itemAmount?: number;
  message?: string;
  timestamp: number;
}

export interface RedeemCode {
  code: string; // Exactly 10 uppercase alphanumeric chars (e.g. A7K9X2PQ4M)
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
  redeemedBy: string[]; // Array of User IDs
  creatorUsername?: string;
}

export interface AdminActionLog {
  id: string;
  action: string;
  details: string;
  adminUsername: string;
  timestamp: number;
}

export interface UserAccount {
  id: string;
  username: string; // Lowercase unique key
  displayName: string; // Display name
  passwordHash: string; // PBKDF2 hash
  salt: string;
  avatar: string;
  customAvatarUrl?: string;
  bio?: string;
  favoriteGameMode?: string;
  role: 'admin' | 'player';
  isAdmin: boolean;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
  battlesWon: number;
  battlesLost: number;
  tournamentWins: number;
  mvpAwards: number;
  charactersPurchased: number;
  totalMoneySpent: number;
  highestBid: number;
  dungeonMaxWave: number;
  dungeonPeak: number;
  playtimeSeconds: number;
  favoriteCharacterId?: string;
  createdAt: number;
  lastActiveAt: number;

  // 🌌 MARVEL ASCENSION PERSISTENT PROGRESSION & ECONOMY (ASTRA)
  astra: number; // Dedicated persistent currency
  ascensionCoins?: number; // Legacy alias for backward compatibility
  characterShards: Record<string, number>; // characterId -> shards count
  ownedCharacters: string[]; // List of unlocked character IDs
  characterLevels: Record<string, number>; // characterId -> level (1-50)
  characterStatsBoosts: Record<string, { power: number; hp: number; defense: number; speed: number }>;
  ownedRelics: string[]; // Relic IDs owned
  ownedSkills: string[]; // Skill IDs owned
  equippedRelics: Record<string, string[]>; // characterId -> relic IDs (max 2)
  equippedSkills: Record<string, string[]>; // characterId -> skill IDs (max 3)
  
  // Competitive Ranked System
  rankedRating: number; // MMR (e.g. 0 - 5000+)
  rankedTier: string; // UNRANKED, BRONZE, SILVER, GOLD, PLATINUM, VIBRANIUM, COSMIC, CELESTIAL, ASCENDER
  rankedDivision: number; // 5 -> 1 (Celestial has 3 -> 1; Ascender has 0)
  placementMatchesPlayed: number; // 0 to 10
  placementMatchesTotal: number; // 10
  placementWins: number;
  isPlacementsCompleted: boolean;
  highestRank: string;
  highestRating: number;
  
  // Battle Pass & Daily
  battlePassLevel: number; // 1 - 100
  battlePassXp: number;
  battlePassClaimed: number[]; // Claimed level reward integers
  crateInventory: { shard: number; character: number };
  categoryShards: Record<string, number>;
  characterTokens: Record<string, number>;
  onboardingCompleted: boolean;
  onboardingChoices: string[];
  dailyLoginStreak: number; // 1 to 7 cycle
  lastDailyLoginDate: string; // YYYY-MM-DD
  currentWinStreak: number;
  bestWinStreak: number;
  totalDamageDealt: number;
  bossesDefeated: number;
  dungeonsCompleted: number;
  giftsSent: GiftRecord[];
  giftsReceived: GiftRecord[];

  // v4.0 — New Systems
  cardShards: number;                       // Card Forge crafting currency
  claimedLevelCrates: number[];             // Level milestone crates claimed
  cratesOpened: number;                     // Total crates opened
  characterMastery: Record<string, CharacterMasteryState>; // Per-character mastery
  savedTeams: SavedTeam[];                  // Team Builder presets
  dailyMissions: DailyMissionState[];       // Active daily missions
  weeklyMissions: WeeklyMissionState[];     // Active weekly challenges
  achievements: Record<string, AchievementState>; // Achievement progress
  wheelSpins: number;                       // Available mystery wheel spins
  lastWheelSpinDate: string;                // Last free-spin date (YYYY-MM-DD)
  totalWheelSpins: number;                  // Total wheel spins ever
  gameModesPlayed: string[];                // Tracks unique game modes for achievements
  adminRewardHistory: string[];             // Prevent duplicate admin reward grants
  starterCharactersGranted?: boolean;       // Permanent 5 starter characters granted flag
  claimedRankRewards?: string[];            // Claimed rank tier reward IDs
  friends?: string[];                       // Friend user IDs (max 100)
  friendRequestsIncoming?: string[];        // Incoming friend request user IDs
  friendRequestsOutgoing?: string[];        // Outgoing friend request user IDs
}

export interface SanitizedUserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  customAvatarUrl?: string;
  bio?: string;
  favoriteGameMode?: string;
  role: 'admin' | 'player';
  isAdmin: boolean;
  level: number;
  xp: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
  winRate: number;
  battlesWon: number;
  battlesLost: number;
  tournamentWins: number;
  mvpAwards: number;
  charactersPurchased: number;
  totalMoneySpent: number;
  highestBid: number;
  dungeonMaxWave: number;
  dungeonPeak: number;
  playtimeSeconds: number;
  playtimeFormatted: string;
  favoriteCharacterId?: string;
  createdAt: number;
  lastActiveAt: number;

  // 🌌 Ascension Profile Fields
  astra: number;
  ascensionCoins: number; // Legacy alias
  characterShards: Record<string, number>;
  ownedCharacters: string[];
  characterLevels: Record<string, number>;
  characterStatsBoosts: Record<string, { power: number; hp: number; defense: number; speed: number }>;
  ownedRelics: string[];
  ownedSkills: string[];
  equippedRelics: Record<string, string[]>;
  equippedSkills: Record<string, string[]>;
  rankedRating: number;
  rankedTier: string;
  rankedDivision: number;
  placementMatchesPlayed: number;
  placementMatchesTotal: number;
  isPlacementsCompleted: boolean;
  highestRank: string;
  highestRating: number;
  battlePassLevel: number;
  battlePassXp: number;
  battlePassClaimed: number[];
  crateInventory: { shard: number; character: number };
  categoryShards: Record<string, number>;
  characterTokens: Record<string, number>;
  onboardingCompleted: boolean;
  onboardingChoices: string[];
  dailyLoginStreak: number;
  lastDailyLoginDate: string;
  canClaimDailyLogin: boolean;
  currentWinStreak: number;
  bestWinStreak: number;
  totalDamageDealt: number;
  bossesDefeated: number;
  dungeonsCompleted: number;
  giftsSentCount: number;
  giftsReceivedCount: number;

  // v4.0 — New Systems
  cardShards: number;
  claimedLevelCrates: number[];
  cratesOpened: number;
  characterMastery: Record<string, CharacterMasteryState>;
  savedTeams: SavedTeam[];
  dailyMissions: DailyMissionState[];
  weeklyMissions: WeeklyMissionState[];
  achievements: Record<string, AchievementState>;
  wheelSpins: number;
  lastWheelSpinDate: string;
  totalWheelSpins: number;
  gameModesPlayed: string[];
  starterCharactersGranted?: boolean;
  claimedRankRewards?: string[];
  friendsCount?: number;
  friends?: string[];
  friendRequestsIncoming?: string[];
  friendRequestsOutgoing?: string[];
}

export interface MatchRecordResult {
  success: boolean;
  user: SanitizedUserProfile;
  xpAwarded: XpBreakdown;
  coinsAwarded?: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
}

const JWT_SECRET = process.env.AUTH_SECRET || (process.env.NODE_ENV !== 'production'
  ? 'mcu_auction_wars_super_secret_jwt_key_2026_infinity'
  : '');
if (!JWT_SECRET) {
  throw new Error('AUTH_SECRET must be configured before starting MARVEL ASCENSION in production.');
}
const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'accounts.json');
const CODES_FILE = path.join(DATA_DIR, 'redeem_codes.json');
const LOGS_FILE = path.join(DATA_DIR, 'admin_logs.json');
// Administration is bound to an authenticated account on the server, never to a
// client-supplied role. Configure ADMIN_USERNAME in production if it differs.
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'darksenseify').trim().toLowerCase();

class DatabaseManager {
  private users: Map<string, UserAccount> = new Map(); // username -> UserAccount
  private redeemCodes: Map<string, RedeemCode> = new Map(); // code -> RedeemCode
  private adminLogs: AdminActionLog[] = [];
  private processedMatchTokens: Set<string> = new Set(); // Prevent duplicate match stats

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // Load Users
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.users)) {
          for (const u of data.users) {
            this.users.set(u.username.toLowerCase(), this.migrateUserFields(u));
          }
        }
        if (Array.isArray(data.processedMatchTokens)) {
          for (const t of data.processedMatchTokens) {
            this.processedMatchTokens.add(t);
          }
        }
      } else {
        this.save();
      }

      // Load Redeem Codes
      if (fs.existsSync(CODES_FILE)) {
        const rawCodes = fs.readFileSync(CODES_FILE, 'utf8');
        const codesData = JSON.parse(rawCodes);
        if (Array.isArray(codesData.codes)) {
          for (const c of codesData.codes) {
            this.redeemCodes.set(c.code.toUpperCase(), c);
          }
        }
      } else {
        // Codes are created by the administrator; never ship a live sample code.
        this.saveCodes();
      }

      // Load Admin Logs
      if (fs.existsSync(LOGS_FILE)) {
        const rawLogs = fs.readFileSync(LOGS_FILE, 'utf8');
        const logsData = JSON.parse(rawLogs);
        if (Array.isArray(logsData.logs)) {
          this.adminLogs = logsData.logs;
        }
      }

      console.log(`[Database] Loaded ${this.users.size} accounts, ${this.redeemCodes.size} redeem codes from ${DATA_DIR}`);
    } catch (err) {
      console.error('[Database] Error initializing database:', err);
    }
  }

  private migrateUserFields(u: any): UserAccount {
    const isOwner = (u.username || '').toLowerCase() === ADMIN_USERNAME;
    const realAstra = typeof u.astra === 'number' ? u.astra : (typeof u.ascensionCoins === 'number' ? u.ascensionCoins : 0);

    return {
      ...u,
      // Legacy role flags are deliberately ignored: only the configured owner
      // account may hold administrative privileges.
      role: isOwner ? 'admin' : 'player',
      isAdmin: isOwner,
      dungeonPeak: u.dungeonPeak || u.dungeonMaxWave || 0,
      astra: realAstra,
      ascensionCoins: realAstra,
      characterShards: u.characterShards || {},
      ownedCharacters: Array.isArray(u.ownedCharacters) ? u.ownedCharacters : [],
      characterLevels: u.characterLevels || {},
      characterStatsBoosts: u.characterStatsBoosts || {},
      ownedRelics: Array.isArray(u.ownedRelics) ? u.ownedRelics : [],
      ownedSkills: Array.isArray(u.ownedSkills) ? u.ownedSkills : [],
      equippedRelics: u.equippedRelics || {},
      equippedSkills: u.equippedSkills || {},
      rankedRating: typeof u.rankedRating === 'number' ? u.rankedRating : 0,
      rankedTier: u.rankedTier || 'UNRANKED',
      rankedDivision: typeof u.rankedDivision === 'number' ? u.rankedDivision : 0,
      placementMatchesPlayed: typeof u.placementMatchesPlayed === 'number' ? u.placementMatchesPlayed : 0,
      placementMatchesTotal: 10,
      placementWins: typeof u.placementWins === 'number' ? u.placementWins : 0,
      isPlacementsCompleted: u.isPlacementsCompleted || false,
      highestRank: u.highestRank || u.rankedTier || 'UNRANKED',
      highestRating: typeof u.highestRating === 'number' ? u.highestRating : (u.rankedRating || 0),
      battlePassLevel: Math.min(BATTLE_PASS_LEVELS, typeof u.battlePassLevel === 'number' ? u.battlePassLevel : getBattlePassLevelForXp(u.battlePassXp || 0)),
      battlePassXp: typeof u.battlePassXp === 'number' ? u.battlePassXp : 0,
      battlePassClaimed: Array.isArray(u.battlePassClaimed) ? u.battlePassClaimed : [],
      crateInventory: {
        shard: Math.max(0, Number(u.crateInventory?.shard) || 0),
        character: Math.max(0, Number(u.crateInventory?.character) || 0),
      },
      categoryShards: u.categoryShards && typeof u.categoryShards === 'object' ? u.categoryShards : {},
      characterTokens: u.characterTokens && typeof u.characterTokens === 'object' ? u.characterTokens : {},
      // Existing accounts are never forced through onboarding. Only newly
      // created accounts opt in explicitly below.
      onboardingCompleted: u.onboardingCompleted !== false,
      onboardingChoices: Array.isArray(u.onboardingChoices) ? u.onboardingChoices : [],
      dailyLoginStreak: typeof u.dailyLoginStreak === 'number' ? u.dailyLoginStreak : 0,
      lastDailyLoginDate: u.lastDailyLoginDate || '',
      currentWinStreak: typeof u.currentWinStreak === 'number' ? u.currentWinStreak : 0,
      bestWinStreak: typeof u.bestWinStreak === 'number' ? u.bestWinStreak : 0,
      totalDamageDealt: typeof u.totalDamageDealt === 'number' ? u.totalDamageDealt : 0,
      bossesDefeated: typeof u.bossesDefeated === 'number' ? u.bossesDefeated : 0,
      dungeonsCompleted: typeof u.dungeonsCompleted === 'number' ? u.dungeonsCompleted : 0,
      giftsSent: Array.isArray(u.giftsSent) ? u.giftsSent : [],
      giftsReceived: Array.isArray(u.giftsReceived) ? u.giftsReceived : [],
      // v4.0 fields
      cardShards: typeof u.cardShards === 'number' ? u.cardShards : 0,
      claimedLevelCrates: Array.isArray(u.claimedLevelCrates) ? u.claimedLevelCrates : [],
      cratesOpened: typeof u.cratesOpened === 'number' ? u.cratesOpened : 0,
      characterMastery: u.characterMastery || {},
      savedTeams: Array.isArray(u.savedTeams) ? u.savedTeams : [],
      dailyMissions: Array.isArray(u.dailyMissions) ? u.dailyMissions : [],
      weeklyMissions: Array.isArray(u.weeklyMissions) ? u.weeklyMissions : [],
      achievements: u.achievements || {},
      wheelSpins: typeof u.wheelSpins === 'number' ? u.wheelSpins : 1,
      lastWheelSpinDate: u.lastWheelSpinDate || '',
      totalWheelSpins: typeof u.totalWheelSpins === 'number' ? u.totalWheelSpins : 0,
      gameModesPlayed: Array.isArray(u.gameModesPlayed) ? u.gameModesPlayed : [],
      adminRewardHistory: Array.isArray(u.adminRewardHistory) ? u.adminRewardHistory : [],
      starterCharactersGranted: u.starterCharactersGranted !== undefined ? !!u.starterCharactersGranted : (Array.isArray(u.ownedCharacters) && u.ownedCharacters.length > 0),
      claimedRankRewards: Array.isArray(u.claimedRankRewards) ? u.claimedRankRewards : [],
      friends: Array.isArray(u.friends) ? u.friends : [],
      friendRequestsIncoming: Array.isArray(u.friendRequestsIncoming) ? u.friendRequestsIncoming : [],
      friendRequestsOutgoing: Array.isArray(u.friendRequestsOutgoing) ? u.friendRequestsOutgoing : [],
    };
  }

  private save() {
    try {
      const data = {
        version: '3.0.0',
        lastUpdated: new Date().toISOString(),
        users: Array.from(this.users.values()),
        processedMatchTokens: Array.from(this.processedMatchTokens)
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Database] Error saving database:', err);
    }
  }

  private saveCodes() {
    try {
      const data = {
        lastUpdated: new Date().toISOString(),
        codes: Array.from(this.redeemCodes.values())
      };
      fs.writeFileSync(CODES_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Database] Error saving redeem codes:', err);
    }
  }

  private isAuthorizedAdmin(user: unknown): user is UserAccount {
    const candidate = user as UserAccount | null;
    return !!candidate && candidate.username.toLowerCase() === ADMIN_USERNAME && candidate.role === 'admin' && candidate.isAdmin;
  }

  private saveLogs() {
    try {
      const data = {
        lastUpdated: new Date().toISOString(),
        logs: this.adminLogs.slice(0, 500)
      };
      fs.writeFileSync(LOGS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Database] Error saving admin logs:', err);
    }
  }

  public logAdminAction(adminUsername: string, action: string, details: string) {
    const record: AdminActionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action,
      details,
      adminUsername,
      timestamp: Date.now()
    };
    this.adminLogs.unshift(record);
    if (this.adminLogs.length > 500) this.adminLogs.pop();
    this.saveLogs();
  }

  public sanitizeUser(u: UserAccount): SanitizedUserProfile {
    const levelInfo = getLevelFromXp(u.xp);
    const winRate = u.matchesPlayed > 0 ? Math.round((u.wins / u.matchesPlayed) * 100) : 0;
    const todayStr = new Date().toISOString().slice(0, 10);
    const canClaimDailyLogin = u.lastDailyLoginDate !== todayStr;
    const astraAmount = typeof u.astra === 'number' ? u.astra : 0;

    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName || u.username,
      avatar: u.avatar,
      customAvatarUrl: u.customAvatarUrl,
      bio: u.bio,
      favoriteGameMode: u.favoriteGameMode,
      role: u.role || 'player',
      isAdmin: u.isAdmin || u.role === 'admin' || false,
      level: levelInfo.level,
      xp: u.xp,
      currentLevelXp: levelInfo.currentLevelXp,
      xpForNextLevel: levelInfo.xpForNextLevel,
      progressPercent: levelInfo.progressPercent,
      wins: u.wins,
      losses: u.losses,
      matchesPlayed: u.matchesPlayed,
      winRate,
      battlesWon: u.battlesWon,
      battlesLost: u.battlesLost,
      tournamentWins: u.tournamentWins,
      mvpAwards: u.mvpAwards,
      charactersPurchased: u.charactersPurchased,
      totalMoneySpent: u.totalMoneySpent,
      highestBid: u.highestBid,
      dungeonMaxWave: u.dungeonMaxWave,
      dungeonPeak: u.dungeonPeak || u.dungeonMaxWave || 0,
      playtimeSeconds: u.playtimeSeconds || 0,
      playtimeFormatted: formatPlaytime(u.playtimeSeconds || 0),
      favoriteCharacterId: u.favoriteCharacterId,
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,

      // Ascension Fields (Astra)
      astra: astraAmount,
      ascensionCoins: astraAmount,
      characterShards: u.characterShards || {},
      ownedCharacters: u.ownedCharacters || [],
      characterLevels: u.characterLevels || {},
      characterStatsBoosts: u.characterStatsBoosts || {},
      ownedRelics: u.ownedRelics || [],
      ownedSkills: u.ownedSkills || [],
      equippedRelics: u.equippedRelics || {},
      equippedSkills: u.equippedSkills || {},
      rankedRating: u.rankedRating || 0,
      rankedTier: u.rankedTier || 'UNRANKED',
      rankedDivision: u.rankedDivision || 0,
      placementMatchesPlayed: u.placementMatchesPlayed || 0,
      placementMatchesTotal: 10,
      isPlacementsCompleted: u.isPlacementsCompleted || false,
      highestRank: u.highestRank || 'UNRANKED',
      highestRating: u.highestRating || 0,
      battlePassLevel: Math.min(BATTLE_PASS_LEVELS, getBattlePassLevelForXp(u.battlePassXp || 0)),
      battlePassXp: u.battlePassXp || 0,
      battlePassClaimed: u.battlePassClaimed || [],
      crateInventory: u.crateInventory || { shard: 0, character: 0 },
      categoryShards: u.categoryShards || {},
      characterTokens: u.characterTokens || {},
      onboardingCompleted: u.onboardingCompleted !== false,
      onboardingChoices: u.onboardingChoices || [],
      dailyLoginStreak: u.dailyLoginStreak || 0,
      lastDailyLoginDate: u.lastDailyLoginDate || '',
      canClaimDailyLogin,
      currentWinStreak: u.currentWinStreak || 0,
      bestWinStreak: u.bestWinStreak || 0,
      totalDamageDealt: u.totalDamageDealt || 0,
      bossesDefeated: u.bossesDefeated || 0,
      dungeonsCompleted: u.dungeonsCompleted || 0,
      giftsSentCount: (u.giftsSent || []).length,
      giftsReceivedCount: (u.giftsReceived || []).length,
      // v4.0
      cardShards: u.cardShards || 0,
      claimedLevelCrates: u.claimedLevelCrates || [],
      cratesOpened: u.cratesOpened || 0,
      characterMastery: u.characterMastery || {},
      savedTeams: u.savedTeams || [],
      dailyMissions: this.getOrResetDailyMissionsInternal(u),
      weeklyMissions: this.getOrResetWeeklyMissionsInternal(u),
      achievements: u.achievements || {},
      wheelSpins: u.wheelSpins ?? 1,
      lastWheelSpinDate: u.lastWheelSpinDate || '',
      totalWheelSpins: u.totalWheelSpins || 0,
      gameModesPlayed: u.gameModesPlayed || [],
      starterCharactersGranted: u.starterCharactersGranted !== undefined ? !!u.starterCharactersGranted : ((u.ownedCharacters || []).length > 0),
      claimedRankRewards: u.claimedRankRewards || [],
      friendsCount: (u.friends || []).length,
      friends: u.friends || [],
      friendRequestsIncoming: u.friendRequestsIncoming || [],
      friendRequestsOutgoing: u.friendRequestsOutgoing || [],
    };
  }

  // Generate a unique 10-digit code using cryptographically secure randomness.
  public generateCodeString(): string {
    for (let attempt = 0; attempt < 100; attempt++) {
      let res = '';
      for (let i = 0; i < 10; i++) res += crypto.randomInt(0, 10).toString();
      if (!this.redeemCodes.has(res)) return res;
    }
    throw new Error('Unable to generate a unique redeem code. Please try again.');
  }

  // ==========================================
  // 🎟️ REDEEM CODE SYSTEM
  // ==========================================

  public redeemCode(userId: string, inputCode: string): { success: boolean; astraAwarded?: number; message?: string; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User account not found.' };

    const formattedCode = (inputCode || '').trim().toUpperCase();
    if (!formattedCode || formattedCode.length !== 10) {
      return { success: false, error: 'Redeem code must be exactly 10 characters.' };
    }

    const codeObj = this.redeemCodes.get(formattedCode);
    if (!codeObj) {
      return { success: false, error: 'Invalid promotional code. Please check and try again.' };
    }

    if (!codeObj.isActive) {
      return { success: false, error: 'This redeem code is currently inactive or revoked.' };
    }

    if (new Date(codeObj.expiresAt).getTime() < Date.now()) {
      return { success: false, error: 'This redeem code has expired.' };
    }

    if (codeObj.usedCount >= codeObj.maxUses) {
      return { success: false, error: 'This redeem code has reached its maximum global usage limit.' };
    }

    if (codeObj.redeemedBy.includes(user.id)) {
      return { success: false, error: 'You have already redeemed this promotional code.' };
    }

    // Grant the configured reward atomically. Legacy codes remain Astra codes.
    const rewardType = codeObj.rewardType || 'ASTRA';
    const reward = codeObj.rewardAmount ?? codeObj.astraReward ?? 1000;
    if (rewardType === 'CHARACTER') {
      const character = ALL_CHARACTERS.find(candidate => candidate.id === codeObj.characterId);
      if (!character) return { success: false, error: 'This code references an invalid character.' };
      if (!user.ownedCharacters.includes(character.id)) user.ownedCharacters.push(character.id);
      else user.categoryShards[getCharacterShardCategory(character.grade)] = (user.categoryShards[getCharacterShardCategory(character.grade)] || 0) + 10;
    } else if (rewardType === 'SHARD') {
      const shardCategoryMap: Record<string, CharacterShardCategory> = {
        RARE: 'B',
        EPIC: 'A',
        MYTHIC: 'MYTHIC',
        HERO: 'C',
        VILLAIN: 'C',
        COSMIC: 'A',
      };
      const category = shardCategoryMap[String(codeObj.characterId || 'C').toUpperCase()] || getCharacterShardCategory(codeObj.characterId || 'C');
      user.categoryShards[category] = (user.categoryShards[category] || 0) + Math.max(1, reward);
    } else if (rewardType === 'CRATE') {
      if (!user.crateInventory) user.crateInventory = { shard: 0, character: 0 };
      if (String(codeObj.crateType || '').startsWith('CHARACTER_CRATE')) user.crateInventory.character += Math.max(1, reward);
      else user.crateInventory.shard += Math.max(1, reward);
    } else {
      user.astra = (user.astra || 0) + Math.max(0, reward);
      user.ascensionCoins = user.astra;
    }
    codeObj.usedCount += 1;
    codeObj.redeemedBy.push(user.id);

    this.save();
    this.saveCodes();

    return {
      success: true,
      astraAwarded: rewardType === 'ASTRA' ? reward : 0,
      message: rewardType === 'CHARACTER'
        ? '🎉 Character added to your collection.'
        : rewardType === 'CRATE'
        ? `🎉 ${reward} crate added to your inventory.`
        : rewardType === 'SHARD'
        ? `🎉 ${reward} category shards added to your vault.`
        : `🎉 Successfully redeemed! +${reward.toLocaleString()} ASTRA credited to your vault.`,
      user: this.sanitizeUser(user)
    };
  }

  // ==========================================
  // 🔐 OWNER ADMIN PANEL METHODS
  // ==========================================

  public createRedeemCode(
    adminUserId: string,
    payload: {
      code?: string;
      astraReward: number;
      rewardType?: 'ASTRA' | 'CHARACTER' | 'SHARD' | 'CRATE';
      rewardAmount?: number;
      characterId?: string;
      crateType?: 'SHARD_CRATE' | 'CHARACTER_CRATE';
      maxUses: number;
      expiresAt: string;
      isActive?: boolean;
    }
  ): { success: boolean; code?: RedeemCode; error?: string } {
    const admin = this.getRawUser(adminUserId);
    if (!this.isAuthorizedAdmin(admin)) {
      return { success: false, error: 'ACCESS DENIED: Owner-only authorization required.' };
    }

    const requestedCode = (payload.code || '').trim().toUpperCase();
    let codeStr: string;
    if (requestedCode) {
      if (!/^\d{10}$/.test(requestedCode)) {
        return { success: false, error: 'New codes must contain exactly 10 digits.' };
      }
      codeStr = requestedCode;
    } else {
      try {
        codeStr = this.generateCodeString();
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unable to generate a code.' };
      }
    }

    if (this.redeemCodes.has(codeStr)) {
      return { success: false, error: `Code "${codeStr}" already exists in the database.` };
    }
    if (payload.rewardType && !['ASTRA', 'CHARACTER', 'SHARD', 'CRATE'].includes(payload.rewardType)) {
      return { success: false, error: 'Invalid redeem reward type.' };
    }

    const expiry = new Date(`${payload.expiresAt}T23:59:59.999Z`);
    if (!payload.expiresAt || Number.isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) {
      return { success: false, error: 'Choose an expiration date in the future.' };
    }

    if (payload.rewardType === 'CHARACTER' && !ALL_CHARACTERS.some(character => character.id === payload.characterId)) {
      return { success: false, error: 'Select a valid character from the character database.' };
    }
    if (payload.rewardType === 'CRATE' && !/^(SHARD_CRATE|CHARACTER_CRATE)_(RARE|EPIC|LEGENDARY|MYTHIC)$/.test(payload.crateType || '')) {
      return { success: false, error: 'Select a valid crate type.' };
    }
    const newCode: RedeemCode = {
      code: codeStr,
      astraReward: Math.max(100, Math.min(1000000, Number(payload.astraReward) || 5000)),
      rewardType: payload.rewardType || 'ASTRA',
      rewardAmount: Math.max(1, Number(payload.rewardAmount ?? payload.astraReward) || 1),
      characterId: payload.characterId,
      crateType: payload.crateType,
      maxUses: Math.max(1, Math.min(100000, Number(payload.maxUses) || 1000)),
      usedCount: 0,
      expiresAt: payload.expiresAt || '2026-12-31',
      isActive: payload.isActive ?? true,
      createdAt: Date.now(),
      redeemedBy: [],
      creatorUsername: admin.username
    };

    this.redeemCodes.set(codeStr, newCode);
    this.saveCodes();
    this.logAdminAction(admin.username, 'OWNER CREATED CODE', `Created code ${codeStr} (+${newCode.astraReward} Astra, Max: ${newCode.maxUses})`);

    return { success: true, code: newCode };
  }

  public toggleRedeemCode(adminUserId: string, code: string, isActive: boolean): { success: boolean; error?: string } {
    const admin = this.getRawUser(adminUserId);
    if (!this.isAuthorizedAdmin(admin)) {
      return { success: false, error: 'ACCESS DENIED: Owner authorization required.' };
    }

    const target = this.redeemCodes.get(code.toUpperCase());
    if (!target) return { success: false, error: 'Code not found.' };

    target.isActive = isActive;
    this.saveCodes();
    this.logAdminAction(admin.username, isActive ? 'OWNER ACTIVATED CODE' : 'OWNER DEACTIVATED CODE', `Code ${code.toUpperCase()} set to ${isActive ? 'ACTIVE' : 'INACTIVE'}`);

    return { success: true };
  }

  public deleteRedeemCode(adminUserId: string, code: string): { success: boolean; error?: string } {
    const admin = this.getRawUser(adminUserId);
    if (!this.isAuthorizedAdmin(admin)) {
      return { success: false, error: 'ACCESS DENIED: Owner authorization required.' };
    }

    const upper = code.toUpperCase();
    if (!this.redeemCodes.has(upper)) return { success: false, error: 'Code not found.' };

    this.redeemCodes.delete(upper);
    this.saveCodes();
    this.logAdminAction(admin.username, 'OWNER REVOKED CODE', `Permanently deleted code ${upper}`);

    return { success: true };
  }

  public getAllRedeemCodes(adminUserId: string): { success: boolean; codes?: RedeemCode[]; error?: string } {
    const admin = this.getRawUser(adminUserId);
    if (!this.isAuthorizedAdmin(admin)) {
      return { success: false, error: 'ACCESS DENIED.' };
    }
    return { success: true, codes: Array.from(this.redeemCodes.values()).sort((a, b) => b.createdAt - a.createdAt) };
  }

  public getAdminStats(adminUserId: string): { success: boolean; stats?: any; actionLogs?: AdminActionLog[]; error?: string } {
    const admin = this.getRawUser(adminUserId);
    if (!this.isAuthorizedAdmin(admin)) {
      return { success: false, error: 'ACCESS DENIED: Owner authorization required.' };
    }

    let totalAstra = 0;
    let totalCharactersOwned = 0;
    let totalMatches = 0;
    const rankDistribution: Record<string, number> = {};

    for (const u of this.users.values()) {
      totalAstra += (u.astra || 0);
      totalCharactersOwned += (u.ownedCharacters || []).length;
      totalMatches += (u.matchesPlayed || 0);
      const tier = u.rankedTier || 'UNRANKED';
      rankDistribution[tier] = (rankDistribution[tier] || 0) + 1;
    }

    const totalCodes = this.redeemCodes.size;
    let totalRedemptions = 0;
    for (const c of this.redeemCodes.values()) {
      totalRedemptions += c.usedCount;
    }

    return {
      success: true,
      stats: {
        totalPlayers: this.users.size,
        onlinePlayers: Math.max(1, Array.from(this.users.values()).filter(u => Date.now() - (u.lastActiveAt || 0) < 300000).length),
        totalMatches,
        totalAstraInCirculation: totalAstra,
        totalCharactersOwned,
        totalRedeemCodes: totalCodes,
        totalCodeRedemptions: totalRedemptions,
        rankDistribution
      },
      actionLogs: this.adminLogs.slice(0, 50)
    };
  }

  // ==========================================
  // 🌌 AUTH & CORE USER METHODS
  // ==========================================

  public async signup(username: string, password: string, avatar: string = '🦸‍♂️'): Promise<{ success: boolean; user?: SanitizedUserProfile; token?: string; error?: string }> {
    const cleanUsername = (username || '').trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 20) {
      return { success: false, error: 'Username must be between 3 and 20 characters.' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    if (this.users.has(cleanUsername)) {
      return { success: false, error: 'Commander username already taken.' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    if (cleanUsername === ADMIN_USERNAME) {
      return { success: false, error: 'This commander name is reserved. Please sign in to the existing account.' };
    }

    const newUser: UserAccount = {
      id,
      username: cleanUsername,
      displayName: username.trim(),
      passwordHash,
      salt,
      avatar: avatar || '🦸‍♂️',
      role: 'player',
      isAdmin: false,
      level: 1,
      xp: 0,
      wins: 0,
      losses: 0,
      matchesPlayed: 0,
      battlesWon: 0,
      battlesLost: 0,
      tournamentWins: 0,
      mvpAwards: 0,
      charactersPurchased: 0,
      totalMoneySpent: 0,
      highestBid: 0,
      dungeonMaxWave: 0,
      dungeonPeak: 0,
      playtimeSeconds: 0,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),

      // Fresh Account 0-State with 5 Permanent Unique Starter Heroes (Grade B/C only)
      astra: 500, // Starter bonus
      ascensionCoins: 500,
      characterShards: {},
      ownedCharacters: (() => {
        const bAndCPool = ALL_CHARACTERS.filter(c => c.grade === 'B' || c.grade === 'C');
        return [...new Set([...bAndCPool].sort(() => Math.random() - 0.5).map(c => c.id))].slice(0, 5);
      })(),
      characterLevels: {},
      characterStatsBoosts: {},
      ownedRelics: [],
      ownedSkills: [],
      equippedRelics: {},
      equippedSkills: {},
      rankedRating: 0,
      rankedTier: 'UNRANKED',
      rankedDivision: 0,
      placementMatchesPlayed: 0,
      placementMatchesTotal: 10,
      placementWins: 0,
      isPlacementsCompleted: false,
      highestRank: 'UNRANKED',
      highestRating: 0,
      battlePassLevel: 1,
      battlePassXp: 0,
      battlePassClaimed: [],
      crateInventory: { shard: 0, character: 0 },
      categoryShards: {},
      characterTokens: {},
      starterCharactersGranted: true,
      onboardingCompleted: true,
      onboardingChoices: [],
      dailyLoginStreak: 0,
      lastDailyLoginDate: '',
      currentWinStreak: 0,
      bestWinStreak: 0,
      totalDamageDealt: 0,
      bossesDefeated: 0,
      dungeonsCompleted: 0,
      giftsSent: [],
      giftsReceived: [],
      // v4.0
      cardShards: 100, // Starter card shards
      claimedLevelCrates: [],
      cratesOpened: 0,
      characterMastery: {},
      savedTeams: [],
      dailyMissions: [],
      weeklyMissions: [],
      achievements: {},
      wheelSpins: 3, // 3 starter spins
      lastWheelSpinDate: '',
      totalWheelSpins: 0,
      gameModesPlayed: [],
      adminRewardHistory: [],
      claimedRankRewards: [],
      friends: [],
      friendRequestsIncoming: [],
      friendRequestsOutgoing: [],
    };

    // Initialize level 1 for all granted starter characters
    newUser.ownedCharacters.forEach(id => {
      newUser.characterLevels[id] = 1;
    });
    newUser.onboardingChoices = [...newUser.ownedCharacters];

    this.users.set(cleanUsername, newUser);
    this.save();

    const token = this.generateToken(newUser);
    return {
      success: true,
      user: this.sanitizeUser(newUser),
      token
    };
  }

  public async signin(username: string, password: string): Promise<{ success: boolean; user?: SanitizedUserProfile; token?: string; error?: string }> {
    const cleanUsername = (username || '').trim().toLowerCase();
    const user = this.users.get(cleanUsername);
    if (!user) {
      return { success: false, error: 'Invalid username or commander credentials.' };
    }

    const testHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    if (testHash !== user.passwordHash) {
      return { success: false, error: 'Invalid username or commander credentials.' };
    }

    user.lastActiveAt = Date.now();
    this.save();

    const token = this.generateToken(user);
    return {
      success: true,
      user: this.sanitizeUser(user),
      token
    };
  }

  public generateToken(user: UserAccount): string {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(body).digest('base64url');
    return `${body}.${signature}`;
  }

  public verifyToken(token: string): { id: string; username: string; role?: string } | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [body, signature] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(body).digest('base64url');
    if (signature !== expected) return null;

    try {
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
      if (payload.exp && payload.exp < Date.now()) return null;
      return payload;
    } catch {
      return null;
    }
  }

  public getUserById(id: string): SanitizedUserProfile | null {
    for (const u of this.users.values()) {
      if (u.id === id) return this.sanitizeUser(u);
    }
    return null;
  }

  public getUserByUsername(username: string): SanitizedUserProfile | null {
    const user = this.users.get((username || '').toLowerCase());
    return user ? this.sanitizeUser(user) : null;
  }

  public getRawUser(idOrUsername: string): UserAccount | null {
    const direct = this.users.get(idOrUsername.toLowerCase());
    if (direct) return direct;
    for (const u of this.users.values()) {
      if (u.id === idOrUsername) return u;
    }
    return null;
  }

  // ==========================================
  // 🌌 ASCENSION ECONOMY & PROGRESSION (ASTRA)
  // ==========================================

  // Daily Login Claim (7-Day Cycle)
  public claimDailyLogin(userId: string): { success: boolean; coinsAwarded?: number; astraAwarded?: number; streak?: number; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    const todayStr = new Date().toISOString().slice(0, 10);
    if (user.lastDailyLoginDate === todayStr) {
      return { success: false, error: 'Daily coins already claimed today. Return tomorrow!' };
    }

    let nextStreak = (user.dailyLoginStreak || 0) + 1;
    if (nextStreak > 7) nextStreak = 1;

    // Day 1: 250, Day 2: 350, Day 3: 500, Day 4: 750, Day 5: 1000, Day 6: 1500, Day 7: 3000
    const rewards = [250, 350, 500, 750, 1000, 1500, 3000];
    const astraGained = rewards[nextStreak - 1] || 250;

    user.dailyLoginStreak = nextStreak;
    user.lastDailyLoginDate = todayStr;
    user.astra = (user.astra || 0) + astraGained;
    user.ascensionCoins = user.astra;
    user.lastActiveAt = Date.now();
    this.save();

    return {
      success: true,
      coinsAwarded: astraGained,
      astraAwarded: astraGained,
      streak: nextStreak,
      user: this.sanitizeUser(user)
    };
  }

  // Purchase Character in Shop (Duplicates convert to +20 shards)
  public buyAscensionCharacter(userId: string, characterId: string, cost: number): { success: boolean; isDuplicate?: boolean; shardsAwarded?: number; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    const character = ALL_CHARACTERS.find(candidate => candidate.id === characterId);
    if (!character) return { success: false, error: 'Character not found.' };
    const serverCost = character.name === 'J. Jonah Jameson'
      ? 3500
      : character.grade === 'MYTHIC' || character.alignment === 'Cosmic'
      ? 50000
      : character.overallPower >= 90
      ? 15000
      : character.grade === 'A' || character.overallPower >= 80
      ? 7500
      : character.grade === 'B' || character.overallPower >= 70
      ? 3500
      : 1500;

    if ((user.astra || 0) < serverCost) {
      return { success: false, error: `Insufficient Astra. Need ✨ ${serverCost.toLocaleString()} Astra, you have ✨ ${(user.astra || 0).toLocaleString()}.` };
    }

    user.astra = (user.astra || 0) - serverCost;
    user.ascensionCoins = user.astra;
    const isOwned = (user.ownedCharacters || []).includes(characterId);

    if (isOwned) {
      const currentShards = user.characterShards[characterId] || 0;
      user.characterShards[characterId] = currentShards + 20;
      // Track mission + achievement for purchase (duplicates count)
      this.updateMissionProgressForUser(user, 'buy_char', 1);
      this.updateAchievementProgressForUser(user, 'collector_10', (user.ownedCharacters || []).length);
      this.updateAchievementProgressForUser(user, 'collector_50', (user.ownedCharacters || []).length);
      this.updateAchievementProgressForUser(user, 'collector_100', (user.ownedCharacters || []).length);
      this.save();
      return {
        success: true,
        isDuplicate: true,
        shardsAwarded: 20,
        user: this.sanitizeUser(user)
      };
    } else {
      if (!user.ownedCharacters) user.ownedCharacters = [];
      user.ownedCharacters.push(characterId);
      user.charactersPurchased += 1;
      // Track mission + achievement for new purchase
      this.updateMissionProgressForUser(user, 'buy_char', 1);
      this.updateAchievementProgressForUser(user, 'collector_10', (user.ownedCharacters || []).length);
      this.updateAchievementProgressForUser(user, 'collector_50', (user.ownedCharacters || []).length);
      this.updateAchievementProgressForUser(user, 'collector_100', (user.ownedCharacters || []).length);
      this.save();
      return {
        success: true,
        isDuplicate: false,
        user: this.sanitizeUser(user)
      };
    }
  }

  // Upgrade Character (Levels 1 - 50) -- Strict Mythic Lock
  public upgradeAscensionCharacter(
    userId: string,
    characterId: string,
    isMythic: boolean
  ): { success: boolean; newLevel?: number; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    const character = ALL_CHARACTERS.find(candidate => candidate.id === characterId);
    if (!character) return { success: false, error: 'Character not found.' };
    const serverIsMythic = character.grade === 'MYTHIC' || character.alignment === 'Cosmic';
    if (serverIsMythic) {
      return { success: false, error: 'MYTHIC CHARACTERS CANNOT BE UPGRADED. Mythics possess permanent cosmic supremacy.' };
    }

    if (!(user.ownedCharacters || []).includes(characterId)) {
      return { success: false, error: 'You do not own this character yet.' };
    }

    const currentLevel = user.characterLevels[characterId] || 1;
    if (currentLevel >= 50) {
      return { success: false, error: 'This character is already at MAX LEVEL 50!' };
    }

    const requiredAstra = currentLevel * 150;
    if ((user.astra || 0) < requiredAstra) {
      return { success: false, error: `Need ✨ ${requiredAstra} Astra to upgrade to Level ${currentLevel + 1}.` };
    }

    user.astra = (user.astra || 0) - requiredAstra;
    user.ascensionCoins = user.astra;
    const nextLevel = currentLevel + 1;
    user.characterLevels[characterId] = nextLevel;

    user.characterStatsBoosts[characterId] = {
      power: (nextLevel - 1) * 2,
      hp: (nextLevel - 1) * 5,
      defense: (nextLevel - 1) * 2,
      speed: (nextLevel - 1) * 1
    };

    this.save();
    return {
      success: true,
      newLevel: nextLevel,
      user: this.sanitizeUser(user)
    };
  }

  // Buy Relic
  public buyAscensionRelic(userId: string, relicId: string, cost: number): { success: boolean; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    if (!user.ownedRelics) user.ownedRelics = [];
    if (user.ownedRelics.includes(relicId)) {
      return { success: false, error: 'You already own this Tactical Relic.' };
    }

    if ((user.astra || 0) < cost) {
      return { success: false, error: `Insufficient Astra. Need ✨ ${cost}.` };
    }

    user.astra = (user.astra || 0) - cost;
    user.ascensionCoins = user.astra;
    user.ownedRelics.push(relicId);
    this.save();
    return { success: true, user: this.sanitizeUser(user) };
  }

  // Buy Skill (with Character Level validation)
  public buyAscensionSkill(
    userId: string,
    skillId: string,
    characterId: string,
    requiredLevel: number,
    cost: number
  ): { success: boolean; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    if (!user.ownedSkills) user.ownedSkills = [];
    if (user.ownedSkills.includes(skillId)) {
      return { success: false, error: 'You already unlocked this Signature Skill.' };
    }

    const heroLevel = (user.characterLevels || {})[characterId] || 1;
    if (heroLevel < requiredLevel) {
      return { success: false, error: `🔒 Skill locked! Reach Character Level ${requiredLevel} with this hero to unlock (Current: Level ${heroLevel}).` };
    }

    if ((user.astra || 0) < cost) {
      return { success: false, error: `Insufficient Astra. Need ✨ ${cost}.` };
    }

    user.astra = (user.astra || 0) - cost;
    user.ascensionCoins = user.astra;
    user.ownedSkills.push(skillId);
    this.save();
    return { success: true, user: this.sanitizeUser(user) };
  }

  // Equip Loadout
  public equipAscensionLoadout(
    userId: string,
    characterId: string,
    relicIds: string[],
    skillIds: string[]
  ): { success: boolean; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    user.equippedRelics[characterId] = (relicIds || []).slice(0, 2);
    user.equippedSkills[characterId] = (skillIds || []).slice(0, 3);
    this.save();
    return { success: true, user: this.sanitizeUser(user) };
  }

  // Claim Battle Pass Level Reward. The reward is resolved on the server from
  // the shared definition; client supplied reward values are intentionally ignored.
  public claimBattlePassReward(
    userId: string,
    level: number,
    _rewardType?: string,
    _rewardAmount: number = 0,
    _rewardItemId?: string
  ): { success: boolean; rewardType?: string; rewardAmount?: number; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    const safeLevel = Math.floor(Number(level));
    if (!Number.isInteger(safeLevel) || safeLevel < 1 || safeLevel > BATTLE_PASS_LEVELS) {
      return { success: false, error: `Battle Pass level must be between 1 and ${BATTLE_PASS_LEVELS}.` };
    }

    if (!user.battlePassClaimed) user.battlePassClaimed = [];
    if (user.battlePassClaimed.includes(safeLevel)) {
      return { success: false, error: `Battle Pass Level ${safeLevel} reward already claimed.` };
    }

    const effectiveLevel = getBattlePassLevelForXp(user.battlePassXp || 0);
    if (effectiveLevel < safeLevel) {
      return { success: false, error: `Earn ${safeLevel * BATTLE_PASS_XP_PER_LEVEL} Battle Pass XP to claim this reward (Current level: ${effectiveLevel}).` };
    }

    const reward = getBattlePassReward(safeLevel);
    let astraGiven = 0;
    if (reward.rewardType === 'COINS') {
      astraGiven = reward.amount;
      user.astra = (user.astra || 0) + astraGiven;
      user.ascensionCoins = user.astra;
    } else {
      if (!user.crateInventory) user.crateInventory = { shard: 0, character: 0 };
      if (reward.rewardType === 'SHARD_CRATE') user.crateInventory.shard += 1;
      if (reward.rewardType === 'CHARACTER_CRATE') user.crateInventory.character += 1;
    }

    user.battlePassClaimed.push(safeLevel);
    this.save();

    return {
      success: true,
      rewardType: reward.rewardType,
      rewardAmount: reward.amount,
      user: this.sanitizeUser(user)
    };
  }

  public awardBattlePassXp(userId: string, amount: number): { success: boolean; battlePassLevel?: number; battlePassXp?: number; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false };
    const safeAmount = Math.max(0, Math.min(10000, Math.floor(Number(amount) || 0)));
    user.battlePassXp = Math.max(0, (user.battlePassXp || 0) + safeAmount);
    user.battlePassLevel = getBattlePassLevelForXp(user.battlePassXp);
    this.save();
    return { success: true, battlePassLevel: user.battlePassLevel, battlePassXp: user.battlePassXp, user: this.sanitizeUser(user) };
  }

  // Record Ascension PvP / Ranked Match with Exact Tier Hierarchy
  public recordAscensionMatch(
    userId: string,
    params: {
      isWin: boolean;
      matchFormat: '1v1' | '2v2' | '3v3' | '4v4' | '5v5' | 'custom';
      isRanked?: boolean;
      isMvp?: boolean;
      isComeback?: boolean;
      isFlawless?: boolean;
      damageDealt?: number;
      matchToken?: string;
    }
  ): { success: boolean; coinsAwarded: number; astraAwarded: number; xpAwarded: number; newRating: number; newTier: string; user: SanitizedUserProfile } | null {
    const user = this.getRawUser(userId);
    if (!user) return null;
    if (params.matchToken && this.processedMatchTokens.has(params.matchToken)) {
      return {
        success: true,
        coinsAwarded: 0,
        astraAwarded: 0,
        xpAwarded: 0,
        newRating: user.rankedRating,
        newTier: user.rankedTier,
        user: this.sanitizeUser(user),
      };
    }

    // Check Ranked Level 10 lock
    if (params.isRanked && (user.level || 1) < 10) {
      return null;
    }

    user.matchesPlayed += 1;
    let baseAstra = 0;

    if (params.matchFormat === '1v1') baseAstra = params.isWin ? 1000 : 350;
    else if (params.matchFormat === '2v2') baseAstra = params.isWin ? 1500 : 450;
    else if (params.matchFormat === '3v3') baseAstra = params.isWin ? 1800 : 500;
    else if (params.matchFormat === '4v4') baseAstra = params.isWin ? 2200 : 550;
    else if (params.matchFormat === '5v5') baseAstra = params.isWin ? 3000 : 600;
    else baseAstra = params.isWin ? 1200 : 400;

    let bonusAstra = 0;
    if (params.isMvp) {
      bonusAstra += 500;
      user.mvpAwards += 1;
    }
    if (params.isComeback) bonusAstra += 400;
    if (params.isFlawless) bonusAstra += 600;

    if (params.isWin) {
      user.wins += 1;
      user.currentWinStreak += 1;
      if (user.currentWinStreak > user.bestWinStreak) {
        user.bestWinStreak = user.currentWinStreak;
      }
      if (user.currentWinStreak === 3) bonusAstra += 500;
      if (user.currentWinStreak === 5) bonusAstra += 1500;
      if (user.currentWinStreak === 10) bonusAstra += 5000;
      if (user.currentWinStreak >= 20) bonusAstra += 15000;
    } else {
      user.losses += 1;
      user.currentWinStreak = 0;
    }

    if (params.damageDealt) {
      user.totalDamageDealt += params.damageDealt;
    }

    const totalAstra = baseAstra + bonusAstra;
    user.astra = (user.astra || 0) + totalAstra;
    user.ascensionCoins = user.astra;

    // Ranked Placement Matches & MMR
    if (params.isRanked) {
      if (!user.isPlacementsCompleted) {
        user.placementMatchesPlayed = (user.placementMatchesPlayed || 0) + 1;
        if (params.isWin) user.placementWins = (user.placementWins || 0) + 1;

        if (user.placementMatchesPlayed >= 10) {
          user.isPlacementsCompleted = true;
          // Calculate Initial Rank based on 10 placement wins
          const pw = user.placementWins || 0;
          if (pw >= 9) {
            user.rankedTier = 'PLATINUM';
            user.rankedDivision = 5;
            user.rankedRating = 1500 + (pw - 9) * 100;
          } else if (pw >= 7) {
            user.rankedTier = 'GOLD';
            user.rankedDivision = 5 - (pw - 7);
            user.rankedRating = 1000 + (pw - 7) * 200;
          } else if (pw >= 5) {
            user.rankedTier = 'SILVER';
            user.rankedDivision = 5 - (pw - 5);
            user.rankedRating = 500 + (pw - 5) * 200;
          } else {
            user.rankedTier = 'BRONZE';
            user.rankedDivision = Math.max(1, 5 - pw);
            user.rankedRating = pw * 100;
          }
        }
      } else {
        // Standard Ranked MMR Delta (+25 on Win, -15 on Loss with major tier demotion protection)
        const delta = params.isWin ? 25 : -15;
        user.rankedRating = Math.max(0, user.rankedRating + delta);

        // Derive Exact Ranked Tier Hierarchy
        if (user.rankedRating >= 4500) {
          user.rankedTier = 'ASCENDER';
          user.rankedDivision = 0; // Infinite ceiling
        } else if (user.rankedRating >= 3000) {
          user.rankedTier = 'CELESTIAL';
          const offset = user.rankedRating - 3000;
          user.rankedDivision = offset >= 334 ? 3 : offset >= 167 ? 4 : 5;
        } else if (user.rankedRating >= 2500) {
          user.rankedTier = 'COSMIC';
          const offset = user.rankedRating - 2500;
          user.rankedDivision = offset >= 334 ? 3 : offset >= 167 ? 4 : 5;
        } else if (user.rankedRating >= 2000) {
          user.rankedTier = 'VIBRANIUM';
          user.rankedDivision = Math.max(1, Math.min(5, 5 - Math.floor((user.rankedRating - 2000) / 100)));
        } else if (user.rankedRating >= 1500) {
          user.rankedTier = 'PLATINUM';
          user.rankedDivision = Math.max(1, Math.min(5, 5 - Math.floor((user.rankedRating - 1500) / 100)));
        } else if (user.rankedRating >= 1000) {
          user.rankedTier = 'GOLD';
          user.rankedDivision = Math.max(1, Math.min(5, 5 - Math.floor((user.rankedRating - 1000) / 100)));
        } else if (user.rankedRating >= 500) {
          user.rankedTier = 'SILVER';
          user.rankedDivision = Math.max(1, Math.min(5, 5 - Math.floor((user.rankedRating - 500) / 100)));
        } else {
          user.rankedTier = 'BRONZE';
          user.rankedDivision = Math.max(1, Math.min(5, 5 - Math.floor(user.rankedRating / 100)));
        }

        if (user.rankedRating > (user.highestRating || 0)) {
          user.highestRating = user.rankedRating;
          user.highestRank = user.rankedTier === 'ASCENDER' ? '⚡ ASCENDER' : `${user.rankedTier} ${user.rankedDivision}`;
        }
      }
    }

    // Award XP
    const xpGain = params.isWin ? 350 : 150;
    user.xp += xpGain;
    user.battlePassXp = Math.max(0, (user.battlePassXp || 0) + (params.isWin ? 200 : 100));
    user.battlePassLevel = getBattlePassLevelForXp(user.battlePassXp);

    // ─── v4.0: Track mission + achievement progress ───
    this.updateMissionProgressForUser(user, 'battle_play', 1);
    if (params.isRanked) this.updateMissionProgressForUser(user, 'ranked_play', 1);
    if (params.isWin) {
      this.updateMissionProgressForUser(user, 'battle_win', 1);
      if (params.isRanked) this.updateMissionProgressForUser(user, 'ranked_win', 1);
    }
    this.updateAchievementProgressForUser(user, 'first_blood', user.wins);
    this.updateAchievementProgressForUser(user, 'battle_10', user.wins);
    this.updateAchievementProgressForUser(user, 'battle_50', user.wins);
    this.updateAchievementProgressForUser(user, 'battle_100', user.wins);
    this.updateAchievementProgressForUser(user, 'collector_10', (user.ownedCharacters || []).length);
    this.updateAchievementProgressForUser(user, 'collector_50', (user.ownedCharacters || []).length);
    this.updateAchievementProgressForUser(user, 'collector_100', (user.ownedCharacters || []).length);
    // ─────────────────────────────────────────────────

    user.lastActiveAt = Date.now();
    if (params.matchToken) this.processedMatchTokens.add(params.matchToken);
    this.save();

    return {
      success: true,
      coinsAwarded: totalAstra,
      astraAwarded: totalAstra,
      xpAwarded: xpGain,
      newRating: user.rankedRating,
      newTier: user.rankedTier,
      user: this.sanitizeUser(user)
    };
  }

  // Multiverse Gifting
  public sendGift(
    senderId: string,
    recipientUsername: string,
    giftType: 'COINS' | 'CHARACTER' | 'RELIC' | 'SKILL',
    itemId?: string,
    itemAmount?: number,
    message?: string
  ): { success: boolean; error?: string; user?: SanitizedUserProfile } {
    const sender = this.getRawUser(senderId);
    if (!sender) return { success: false, error: 'Sender not found.' };

    const recipient = this.getRawUser(recipientUsername);
    if (!recipient) return { success: false, error: `Recipient commander "${recipientUsername}" not found.` };

    if (sender.id === recipient.id) {
      return { success: false, error: 'You cannot send gifts to your own account.' };
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const sentToday = (sender.giftsSent || []).filter(g => new Date(g.timestamp).toISOString().slice(0, 10) === todayStr).length;
    if (sentToday >= 5) {
      return { success: false, error: 'Daily gift transfer limit reached (5 gifts per day).' };
    }

    if (giftType === 'COINS') {
      const astraToSend = Math.max(100, Math.min(10000, Number(itemAmount) || 500));
      if ((sender.astra || 0) < astraToSend) {
        return { success: false, error: `Insufficient Astra. You have ✨ ${(sender.astra || 0).toLocaleString()}.` };
      }
      sender.astra = (sender.astra || 0) - astraToSend;
      sender.ascensionCoins = sender.astra;
      recipient.astra = (recipient.astra || 0) + astraToSend;
      recipient.ascensionCoins = recipient.astra;
    } else if (giftType === 'CHARACTER') {
      if (!itemId || !(sender.ownedCharacters || []).includes(itemId)) {
        return { success: false, error: 'You do not own this character to gift.' };
      }
      if (!recipient.ownedCharacters.includes(itemId)) {
        recipient.ownedCharacters.push(itemId);
      } else {
        recipient.characterShards[itemId] = (recipient.characterShards[itemId] || 0) + 20;
      }
    }

    const giftRecord: GiftRecord = {
      id: `gift-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderUsername: sender.username,
      recipientUsername: recipient.username,
      giftType,
      itemId,
      itemAmount,
      message: message || '',
      timestamp: Date.now()
    };

    if (!sender.giftsSent) sender.giftsSent = [];
    if (!recipient.giftsReceived) recipient.giftsReceived = [];
    sender.giftsSent.unshift(giftRecord);
    recipient.giftsReceived.unshift(giftRecord);
    this.save();

    return { success: true, user: this.sanitizeUser(sender) };
  }

  // Leaderboards Top 50
  public getTop50Leaderboards(
    category: 'WINS' | 'LEVEL_XP' | 'MVP' | 'DUNGEON_PEAK' | 'PLAY_TIME' | 'RANK' = 'RANK'
  ): SanitizedUserProfile[] {
    const all = Array.from(this.users.values()).map(u => this.sanitizeUser(u));

    if (category === 'RANK') {
      all.sort((a, b) => b.rankedRating - a.rankedRating || b.wins - a.wins);
    } else if (category === 'WINS') {
      all.sort((a, b) => b.wins - a.wins || b.rankedRating - a.rankedRating);
    } else if (category === 'LEVEL_XP') {
      all.sort((a, b) => b.xp - a.xp || b.level - a.level);
    } else if (category === 'MVP') {
      all.sort((a, b) => b.mvpAwards - a.mvpAwards || b.wins - a.wins);
    } else if (category === 'DUNGEON_PEAK') {
      all.sort((a, b) => b.dungeonPeak - a.dungeonPeak || b.wins - a.wins);
    } else if (category === 'PLAY_TIME') {
      all.sort((a, b) => b.playtimeSeconds - a.playtimeSeconds);
    }

    return all.slice(0, 50);
  }

  public getLeaderboard(limit: number = 20): SanitizedUserProfile[] {
    return this.getTop50Leaderboards('RANK').slice(0, limit);
  }

  // Update Custom Profile Picture (Data URI / URL) & Bio
  public updateCustomAvatar(
    userId: string,
    customAvatarUrl?: string,
    bio?: string,
    favoriteGameMode?: string
  ): SanitizedUserProfile | null {
    const user = this.getRawUser(userId);
    if (!user) return null;

    if (customAvatarUrl !== undefined) user.customAvatarUrl = customAvatarUrl;
    if (bio !== undefined) user.bio = bio;
    if (favoriteGameMode !== undefined) user.favoriteGameMode = favoriteGameMode;

    this.save();
    return this.sanitizeUser(user);
  }

  // Update Standard Avatar
  public updateAvatar(userId: string, avatar: string, favoriteCharacterId?: string): SanitizedUserProfile | null {
    const user = this.getRawUser(userId);
    if (!user) return null;

    user.avatar = avatar;
    if (favoriteCharacterId) user.favoriteCharacterId = favoriteCharacterId;
    this.save();
    return this.sanitizeUser(user);
  }

  // Update Profile Username
  public updateProfile(userId: string, username?: string, avatar?: string): { success: boolean; user?: SanitizedUserProfile; token?: string; error?: string } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    if (username) {
      const clean = username.trim().toLowerCase();
      if (clean !== user.username) {
        if (user.username === ADMIN_USERNAME || clean === ADMIN_USERNAME) {
          return { success: false, error: 'The administrator identity is reserved and cannot be renamed or claimed.' };
        }
        if (this.users.has(clean)) {
          return { success: false, error: 'Username already in use.' };
        }
        this.users.delete(user.username);
        user.username = clean;
        user.displayName = username.trim();
        this.users.set(clean, user);
      }
    }

    if (avatar) {
      user.avatar = avatar;
    }

    this.save();
    const token = this.generateToken(user);
    return { success: true, user: this.sanitizeUser(user), token };
  }

  // Add Playtime Heartbeat
  public addPlaytime(userId: string, seconds: number = 60): number {
    const user = this.getRawUser(userId);
    if (!user) return 0;

    user.playtimeSeconds = (user.playtimeSeconds || 0) + seconds;
    user.lastActiveAt = Date.now();
    this.save();
    return user.playtimeSeconds;
  }

  // Classic Match Result
  public recordMatchResult(userId: string, params: MatchXpParams, matchToken?: string): MatchRecordResult | null {
    if (matchToken && this.processedMatchTokens.has(matchToken)) {
      const u = this.getRawUser(userId);
      if (!u) return null;
      return {
        success: true,
        user: this.sanitizeUser(u),
        xpAwarded: { total: 0, reasons: [] },
        coinsAwarded: 0,
        leveledUp: false,
        oldLevel: getLevelFromXp(u.xp).level,
        newLevel: getLevelFromXp(u.xp).level
      };
    }

    const user = this.getRawUser(userId);
    if (!user) return null;

    const oldLevel = getLevelFromXp(user.xp).level;
    const xpBreakdown = calculateMatchXp(params);
    user.xp += xpBreakdown.total;
    user.battlePassXp = Math.max(0, (user.battlePassXp || 0) + Math.max(25, Math.floor(xpBreakdown.total / 2)));
    user.battlePassLevel = getBattlePassLevelForXp(user.battlePassXp);

    user.matchesPlayed += 1;
    if (params.isWin) user.wins += 1;
    else user.losses += 1;

    if (params.battlesWon) user.battlesWon += params.battlesWon;
    if (params.charactersPurchased) user.charactersPurchased += params.charactersPurchased;
    if (params.isTournamentChampion) user.tournamentWins += 1;
    if (params.isMvp) user.mvpAwards += 1;
    if (params.durationSeconds) user.playtimeSeconds = (user.playtimeSeconds || 0) + params.durationSeconds;

    // Classic match gives Astra
    const astraAwarded = params.isTournamentChampion ? 1000 : params.isWin ? 500 : 150;
    user.astra = (user.astra || 0) + astraAwarded;
    user.ascensionCoins = user.astra;

    const newLevel = getLevelFromXp(user.xp).level;
    const leveledUp = newLevel > oldLevel;

    // ─── v4.0: Track mission + achievement progress ───
    this.updateMissionProgressForUser(user, 'battle_play', 1);
    if (params.isWin) this.updateMissionProgressForUser(user, 'battle_win', 1);
    // Achievements: wins, collector
    this.updateAchievementProgressForUser(user, 'first_blood', user.wins);
    this.updateAchievementProgressForUser(user, 'battle_10', user.wins);
    this.updateAchievementProgressForUser(user, 'battle_50', user.wins);
    this.updateAchievementProgressForUser(user, 'battle_100', user.wins);
    this.updateAchievementProgressForUser(user, 'collector_10', (user.ownedCharacters || []).length);
    this.updateAchievementProgressForUser(user, 'collector_50', (user.ownedCharacters || []).length);
    this.updateAchievementProgressForUser(user, 'collector_100', (user.ownedCharacters || []).length);
    // ─────────────────────────────────────────────────

    if (matchToken) this.processedMatchTokens.add(matchToken);
    user.lastActiveAt = Date.now();
    this.save();

    return {
      success: true,
      user: this.sanitizeUser(user),
      xpAwarded: xpBreakdown,
      coinsAwarded: astraAwarded,
      leveledUp,
      oldLevel,
      newLevel
    };
  }

  // Dungeon Result
  public recordDungeonResult(userId: string, wavesCleared: number, isVictory: boolean, matchToken?: string): MatchRecordResult | null {
    if (matchToken && this.processedMatchTokens.has(matchToken)) {
      const u = this.getRawUser(userId);
      if (!u) return null;
      return {
        success: true,
        user: this.sanitizeUser(u),
        xpAwarded: { total: 0, reasons: [] },
        coinsAwarded: 0,
        leveledUp: false,
        oldLevel: getLevelFromXp(u.xp).level,
        newLevel: getLevelFromXp(u.xp).level
      };
    }

    const user = this.getRawUser(userId);
    if (!user) return null;

    const oldLevel = getLevelFromXp(user.xp).level;
    const xpBreakdown = calculateMatchXp({
      isWin: isVictory,
      matchType: 'dungeon',
      dungeonWavesCleared: wavesCleared
    });
    user.xp += xpBreakdown.total;
    user.battlePassXp = Math.max(0, (user.battlePassXp || 0) + Math.max(25, Math.floor(xpBreakdown.total / 2)));
    user.battlePassLevel = getBattlePassLevelForXp(user.battlePassXp);

    if (wavesCleared > (user.dungeonMaxWave || 0)) {
      user.dungeonMaxWave = wavesCleared;
      user.dungeonPeak = wavesCleared;
    }

    if (isVictory) {
      user.dungeonsCompleted = (user.dungeonsCompleted || 0) + 1;
      user.wins += 1;
    } else {
      user.losses += 1;
    }

    const astraAwarded = wavesCleared * 100 + (isVictory ? 1500 : 0);
    user.astra = (user.astra || 0) + astraAwarded;
    user.ascensionCoins = user.astra;

    const newLevel = getLevelFromXp(user.xp).level;
    const leveledUp = newLevel > oldLevel;

    // ─── v4.0: Track dungeon mission + achievement progress ───
    this.updateMissionProgressForUser(user, 'dungeon_wave', wavesCleared);
    if (isVictory) {
      this.updateMissionProgressForUser(user, 'dungeon_complete', 1);
    }
    // Track dungeon achievements globally (works from any game mode)
    this.updateAchievementProgressForUser(user, 'dungeon_1', user.dungeonsCompleted || 0);
    this.updateAchievementProgressForUser(user, 'dungeon_10', user.dungeonsCompleted || 0);
    this.updateAchievementProgressForUser(user, 'dungeon_master', user.dungeonsCompleted || 0);
    // ─────────────────────────────────────────────────────────

    if (matchToken) this.processedMatchTokens.add(matchToken);
    user.lastActiveAt = Date.now();
    this.save();

    return {
      success: true,
      user: this.sanitizeUser(user),
      xpAwarded: xpBreakdown,
      coinsAwarded: astraAwarded,
      leveledUp,
      oldLevel,
      newLevel
    };
  }

  // Backward-compatible method aliases
  public createUser(username: string, password: string, avatar: string = '🦸‍♂️') {
    return this.signup(username, password, avatar);
  }

  public verifyUser(username: string, password: string) {
    return this.signin(username, password);
  }

  public updateUserAvatar(userId: string, avatar: string, favoriteCharacterId?: string) {
    return this.updateAvatar(userId, avatar, favoriteCharacterId);
  }

  public updateUserProfile(userId: string, username?: string, avatar?: string) {
    return this.updateProfile(userId, username, avatar);
  }

  public recordDungeonProgress(userId: string, wavesCleared: number, isVictory: boolean, matchToken?: string) {
    return this.recordDungeonResult(userId, wavesCleared, isVictory, matchToken);
  }

  // ============================================================
  // v4.0 — INTERNAL HELPERS
  // ============================================================

  private getOrResetDailyMissionsInternal(user: UserAccount): DailyMissionState[] {
    const todayStr = new Date().toISOString().slice(0, 10);
    const missions = user.dailyMissions || [];
    if (missions.length > 0 && missions[0].expiresAt === todayStr) {
      return missions;
    }
    // Reset: Pick 5 random missions from pool
    const shuffled = [...DAILY_MISSION_POOL].sort(() => Math.random() - 0.5).slice(0, 5);
    const newMissions: DailyMissionState[] = shuffled.map(m => ({
      ...m,
      progress: 0,
      isCompleted: false,
      isClaimed: false,
      expiresAt: todayStr,
    }));
    user.dailyMissions = newMissions;
    return newMissions;
  }

  private getOrResetWeeklyMissionsInternal(user: UserAccount): WeeklyMissionState[] {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    const weekEnd = nextSunday.toISOString().slice(0, 10);

    const missions = user.weeklyMissions || [];
    if (missions.length > 0 && missions[0].expiresAt === weekEnd) {
      return missions;
    }
    const shuffled = [...WEEKLY_MISSION_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
    const newMissions: WeeklyMissionState[] = shuffled.map(m => ({
      ...m,
      progress: 0,
      isCompleted: false,
      isClaimed: false,
      expiresAt: weekEnd,
    }));
    user.weeklyMissions = newMissions;
    return newMissions;
  }

  private pickRandomCharacterFromGrades(
    grades: string[],
    alignment?: string
  ): { id: string; name: string; grade: string; alignment: string } | null {
    // Dynamically import ALL_CHARACTERS from source
    // We cache it once to avoid re-requiring every call
    try {
      const chars = require('../../src/data/characters/index').ALL_CHARACTERS as any[];
      let pool = chars.filter(c => grades.includes(c.grade));
      if (alignment) pool = pool.filter(c => c.alignment === alignment);
      if (pool.length === 0) pool = chars.filter(c => grades.includes(c.grade));
      if (pool.length === 0) return null;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      return { id: picked.id, name: picked.name, grade: picked.grade, alignment: picked.alignment };
    } catch { return null; }
  }

  private updateMissionProgressForUser(user: UserAccount, eventType: string, amount: number = 1) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const missions = this.getOrResetDailyMissionsInternal(user);
    missions.forEach(m => {
      if (m.isClaimed || m.expiresAt !== todayStr) return;
      if (m.eventType === eventType) {
        m.progress = Math.min(m.target, m.progress + amount);
        if (m.progress >= m.target) m.isCompleted = true;
      }
    });
    user.dailyMissions = missions;

    const weekly = this.getOrResetWeeklyMissionsInternal(user);
    weekly.forEach(m => {
      if (m.isClaimed) return;
      if (m.eventType === eventType) {
        m.progress = Math.min(m.target, m.progress + amount);
        if (m.progress >= m.target) m.isCompleted = true;
      }
    });
    user.weeklyMissions = weekly;
  }

  private updateAchievementProgressForUser(user: UserAccount, achievementId: string, progress: number) {
    const def = ACHIEVEMENT_DEFINITIONS[achievementId];
    if (!def) return;
    if (!user.achievements) user.achievements = {};
    const current = user.achievements[achievementId] || { progress: 0, isClaimed: false };
    current.progress = Math.max(current.progress, progress);
    if (current.progress >= def.target && !current.unlockedAt) {
      current.unlockedAt = Date.now();
    }
    user.achievements[achievementId] = current;
  }

  public getOnboardingChoices(userId: string): { success: boolean; choices?: any[]; completed?: boolean; error?: string } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    // If user already has characters granted or has existing roster, return their roster
    if (user.starterCharactersGranted || (user.ownedCharacters || []).length > 0) {
      user.onboardingCompleted = true;
      user.starterCharactersGranted = true;
      return {
        success: true,
        choices: (user.ownedCharacters || []).map(id => ALL_CHARACTERS.find(character => character.id === id)).filter(Boolean),
        completed: true,
      };
    }

    // New player: Generate exactly 5 random unique characters (Grade B or Grade C ONLY)
    const bAndCPool = ALL_CHARACTERS.filter(c => c.grade === 'B' || c.grade === 'C');
    const pool = bAndCPool.length >= 5 ? bAndCPool : ALL_CHARACTERS;
    const selectedIds = [...new Set([...pool].sort(() => Math.random() - 0.5).map(character => character.id))].slice(0, 5);
    
    // Give ALL 5 characters directly to the player's collection
    user.ownedCharacters = selectedIds;
    if (!user.characterLevels) user.characterLevels = {};
    selectedIds.forEach(id => {
      user.characterLevels[id] = 1;
    });
    user.starterCharactersGranted = true;
    user.onboardingCompleted = true;
    user.onboardingChoices = selectedIds;
    this.save();

    return {
      success: true,
      choices: selectedIds.map(id => ALL_CHARACTERS.find(character => character.id === id)).filter(Boolean),
      completed: true,
    };
  }

  public chooseOnboardingCharacter(userId: string, _characterId?: string): { success: boolean; user?: SanitizedUserProfile; error?: string } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    
    // If not yet granted, grant all 5
    if (!user.starterCharactersGranted || (user.ownedCharacters || []).length === 0) {
      const bAndCPool = ALL_CHARACTERS.filter(c => c.grade === 'B' || c.grade === 'C');
      const pool = bAndCPool.length >= 5 ? bAndCPool : ALL_CHARACTERS;
      const selectedIds = [...new Set([...pool].sort(() => Math.random() - 0.5).map(character => character.id))].slice(0, 5);
      user.ownedCharacters = selectedIds;
      if (!user.characterLevels) user.characterLevels = {};
      selectedIds.forEach(id => {
        user.characterLevels[id] = 1;
      });
      user.starterCharactersGranted = true;
      user.onboardingCompleted = true;
      user.onboardingChoices = selectedIds;
      this.save();
    }
    return { success: true, user: this.sanitizeUser(user) };
  }

  public craftCharacterToken(userId: string, category: string): { success: boolean; category?: string; tokenCount?: number; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    const normalized = String(category || '').toUpperCase();
    if (!user) return { success: false, error: 'User not found.' };
    if (!['C', 'B', 'A', 'MYTHIC', 'HERO', 'VILLAIN'].includes(normalized)) return { success: false, error: 'Invalid shard category.' };
    const current = Number(user.categoryShards?.[normalized]) || 0;
    if (current < 10) return { success: false, error: `Need 10 ${normalized} category shards.` };
    user.categoryShards[normalized] = current - 10;
    user.characterTokens[normalized] = (user.characterTokens[normalized] || 0) + 1;
    this.save();
    return { success: true, category: normalized, tokenCount: user.characterTokens[normalized], user: this.sanitizeUser(user) };
  }

  public redeemCharacterToken(userId: string, category: string, characterId: string): { success: boolean; character?: any; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    const normalized = String(category || '').toUpperCase();
    const character = ALL_CHARACTERS.find(candidate => candidate.id === characterId);
    if (!user) return { success: false, error: 'User not found.' };
    if (!['C', 'B', 'A', 'MYTHIC', 'HERO', 'VILLAIN'].includes(normalized) || !character) {
      return { success: false, error: 'Character is not valid for this token category.' };
    }
    const expectedCategories = new Set([
      getCharacterShardCategory(character),
      getCharacterShardCategory(character.grade),
      character.alignment === 'Hero' || character.alignment === 'Anti-Hero' ? 'HERO' : character.alignment === 'Villain' ? 'VILLAIN' : undefined,
    ].filter(Boolean) as string[]);
    if (!expectedCategories.has(normalized)) {
      return { success: false, error: 'Character is not valid for this token category.' };
    }
    if ((user.characterTokens[normalized] || 0) < 1) return { success: false, error: 'You do not have a token for this category.' };
    if ((user.ownedCharacters || []).includes(characterId)) return { success: false, error: 'You already own this character.' };
    user.characterTokens[normalized] -= 1;
    user.ownedCharacters.push(characterId);
    user.characterLevels[characterId] = 1;
    this.save();
    return { success: true, character, user: this.sanitizeUser(user) };
  }

  public openCrate(userId: string, crateType: 'SHARD_CRATE' | 'CHARACTER_CRATE'): { success: boolean; crateType?: string; reward?: any; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    if (!user.crateInventory) user.crateInventory = { shard: 0, character: 0 };
    const key = crateType === 'SHARD_CRATE' ? 'shard' : 'character';
    if (crateType !== 'SHARD_CRATE' && crateType !== 'CHARACTER_CRATE') return { success: false, error: 'Invalid crate type.' };
    if (user.crateInventory[key] < 1) return { success: false, error: 'You do not have this crate.' };
    user.crateInventory[key] -= 1;
    if (crateType === 'SHARD_CRATE') {
      const categories: CharacterShardCategory[] = ['C', 'B', 'A', 'MYTHIC', 'HERO', 'VILLAIN'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const amount = category === 'MYTHIC' ? 2 : category === 'A' ? 4 : category === 'B' ? 7 : category === 'HERO' || category === 'VILLAIN' ? 8 : 12;
      user.categoryShards[category] = (user.categoryShards[category] || 0) + amount;
      this.save();
      return { success: true, crateType, reward: { category, amount }, user: this.sanitizeUser(user) };
    }
    const pool = ALL_CHARACTERS.filter(character => !user.ownedCharacters.includes(character.id));
    const character = (pool.length ? pool : ALL_CHARACTERS)[Math.floor(Math.random() * (pool.length ? pool : ALL_CHARACTERS).length)];
    if (user.ownedCharacters.includes(character.id)) {
      const category = getCharacterShardCategory(character);
      user.categoryShards[category] = (user.categoryShards[category] || 0) + 10;
      this.save();
      return { success: true, crateType, reward: { character, duplicate: true, category, amount: 10 }, user: this.sanitizeUser(user) };
    }
    user.ownedCharacters.push(character.id);
    user.characterLevels[character.id] = 1;
    this.save();
    return { success: true, crateType, reward: { character }, user: this.sanitizeUser(user) };
  }

  // ============================================================
  // v4.0 — LEVEL MILESTONE CRATES
  // ============================================================

  public claimLevelCrate(userId: string, level: number): {
    success: boolean;
    crateType?: 'ASTRA' | 'MYSTERY_CARD' | 'LEGENDARY';
    reward?: any;
    isDuplicate?: boolean;
    cardShardsAwarded?: number;
    error?: string;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    const userLevel = getLevelFromXp(user.xp).level;
    if (userLevel < level) {
      return { success: false, error: `You need to be Level ${level} to claim this crate.` };
    }

    if (!user.claimedLevelCrates) user.claimedLevelCrates = [];
    if (user.claimedLevelCrates.includes(level)) {
      return { success: false, error: 'This crate has already been claimed.' };
    }

    let crateType: 'ASTRA' | 'MYSTERY_CARD' | 'LEGENDARY';
    let reward: any = {};
    let isDuplicate = false;
    let cardShardsAwarded = 0;

    if (level % 100 === 0) {
      crateType = 'LEGENDARY';
      // Legendary crate: try to give a MYTHIC or A-grade character, plus big astra
      const char = this.pickRandomCharacterFromGrades(['MYTHIC', 'A']);
      const astraBonus = level * 100;
      user.astra = (user.astra || 0) + astraBonus;
      user.ascensionCoins = user.astra;
      if (char) {
        if ((user.ownedCharacters || []).includes(char.id)) {
          isDuplicate = true;
          cardShardsAwarded = GRADE_SHARD_VALUES[char.grade] || 250;
          user.cardShards = (user.cardShards || 0) + cardShardsAwarded;
        } else {
          user.ownedCharacters = user.ownedCharacters || [];
          user.ownedCharacters.push(char.id);
        }
        reward = { character: char, astra: astraBonus };
      } else {
        reward = { astra: astraBonus };
      }
    } else if (level % 25 === 0) {
      crateType = 'MYSTERY_CARD';
      // Mystery Card crate: give a random character based on level range
      const grades = level >= 150 ? ['A', 'MYTHIC'] : level >= 75 ? ['B', 'A'] : ['C', 'B'];
      const char = this.pickRandomCharacterFromGrades(grades);
      if (char) {
        if ((user.ownedCharacters || []).includes(char.id)) {
          isDuplicate = true;
          cardShardsAwarded = GRADE_SHARD_VALUES[char.grade] || 25;
          user.cardShards = (user.cardShards || 0) + cardShardsAwarded;
        } else {
          user.ownedCharacters = user.ownedCharacters || [];
          user.ownedCharacters.push(char.id);
        }
        reward = { character: char };
      } else {
        const fallbackShards = 50;
        user.cardShards = (user.cardShards || 0) + fallbackShards;
        cardShardsAwarded = fallbackShards;
        reward = { cardShards: fallbackShards };
      }
    } else {
      crateType = 'ASTRA';
      // Astra crate: give astra + card shards + xp scaled by level
      const astraAmount = level * 50 + 200;
      const shardsAmount = Math.floor(level / 2) + 10;
      const xpAmount = level * 20;
      user.astra = (user.astra || 0) + astraAmount;
      user.ascensionCoins = user.astra;
      user.cardShards = (user.cardShards || 0) + shardsAmount;
      user.xp = (user.xp || 0) + xpAmount;
      reward = { astra: astraAmount, cardShards: shardsAmount, xp: xpAmount };
    }

    user.claimedLevelCrates.push(level);
    user.cratesOpened = (user.cratesOpened || 0) + 1;
    user.lastActiveAt = Date.now();

    // Update mission/achievement progress
    this.updateMissionProgressForUser(user, 'open_crate', 1);
    this.updateAchievementProgressForUser(user, 'crate_opener_5', user.cratesOpened);
    this.updateAchievementProgressForUser(user, 'crate_opener_25', user.cratesOpened);

    this.save();
    return { success: true, crateType, reward, isDuplicate, cardShardsAwarded, user: this.sanitizeUser(user) };
  }

  public getAvailableLevelCrates(userId: string): { level: number; type: 'ASTRA' | 'MYSTERY_CARD' | 'LEGENDARY'; canClaim: boolean }[] {
    const user = this.getRawUser(userId);
    if (!user) return [];

    const userLevel = getLevelFromXp(user.xp).level;
    const claimed = new Set(user.claimedLevelCrates || []);
    const crates: { level: number; type: 'ASTRA' | 'MYSTERY_CARD' | 'LEGENDARY'; canClaim: boolean }[] = [];

    // Generate crate milestones up to current level + 10 (to show upcoming ones)
    const maxCheck = Math.min(1000, userLevel + 10);
    for (let lvl = 10; lvl <= maxCheck; lvl++) {
      if (lvl % 100 === 0) {
        crates.push({ level: lvl, type: 'LEGENDARY', canClaim: userLevel >= lvl && !claimed.has(lvl) });
      } else if (lvl % 25 === 0) {
        crates.push({ level: lvl, type: 'MYSTERY_CARD', canClaim: userLevel >= lvl && !claimed.has(lvl) });
      } else if (lvl % 10 === 0) {
        crates.push({ level: lvl, type: 'ASTRA', canClaim: userLevel >= lvl && !claimed.has(lvl) });
      }
    }
    return crates;
  }

  // ============================================================
  // v4.0 — CARD FORGE (CRAFTING)
  // ============================================================

  public craftCard(userId: string, category: string): {
    success: boolean;
    character?: { id: string; name: string; grade: string; alignment: string };
    isDuplicate?: boolean;
    cardShardsAwarded?: number;
    cost?: number;
    error?: string;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    const forgeCat = FORGE_CATEGORIES[category];
    if (!forgeCat) return { success: false, error: 'Invalid forge category.' };

    if ((user.cardShards || 0) < forgeCat.cost) {
      return { success: false, error: `Not enough Card Shards. Need ${forgeCat.cost}, you have ${user.cardShards || 0}.` };
    }

    user.cardShards = (user.cardShards || 0) - forgeCat.cost;

    // Pick random character from allowed grades
    const alignment = category === 'random_hero' ? 'Hero' : category === 'random_villain' ? 'Villain' : undefined;
    const char = this.pickRandomCharacterFromGrades(forgeCat.grades, alignment);
    if (!char) {
      // Refund if no character found
      user.cardShards += forgeCat.cost;
      this.save();
      return { success: false, error: 'No characters available in this category.' };
    }

    let isDuplicate = false;
    let cardShardsAwarded = 0;

    if ((user.ownedCharacters || []).includes(char.id)) {
      isDuplicate = true;
      cardShardsAwarded = Math.floor(GRADE_SHARD_VALUES[char.grade] * 0.6) || 15; // 60% shard refund for dupe
      user.cardShards += cardShardsAwarded;
    } else {
      user.ownedCharacters = user.ownedCharacters || [];
      user.ownedCharacters.push(char.id);
      user.charactersPurchased += 1;
    }

    user.cratesOpened = (user.cratesOpened || 0) + 1;
    user.lastActiveAt = Date.now();

    // Update missions and achievements
    this.updateMissionProgressForUser(user, 'card_forge', 1);
    this.updateAchievementProgressForUser(user, 'forge_10', user.cratesOpened);
    this.updateAchievementProgressForUser(user, 'collector_10', (user.ownedCharacters || []).length);
    this.updateAchievementProgressForUser(user, 'collector_50', (user.ownedCharacters || []).length);
    this.updateAchievementProgressForUser(user, 'collector_100', (user.ownedCharacters || []).length);

    this.save();
    return { success: true, character: char, isDuplicate, cardShardsAwarded, cost: forgeCat.cost, user: this.sanitizeUser(user) };
  }

  public getForgeCategories(): typeof FORGE_CATEGORIES {
    return FORGE_CATEGORIES;
  }

  // ============================================================
  // v4.0 — CHARACTER MASTERY
  // ============================================================

  public awardMasteryXp(userId: string, characterId: string, xp: number): {
    success: boolean;
    oldLevel?: number;
    newLevel?: number;
    leveledUp?: boolean;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false };
    if (!user.characterMastery) user.characterMastery = {};
    if (!(user.ownedCharacters || []).includes(characterId)) return { success: false };

    const current = user.characterMastery[characterId] || { xp: 0, level: 1 };
    const oldLevel = current.level;
    current.xp += Math.min(xp, 5000); // Cap per-session gain to prevent exploit

    // Mastery levels 1-10, each requiring progressively more XP
    const masteryXpTable = [0, 200, 600, 1200, 2000, 3000, 4500, 6500, 9000, 12000];
    let newLevel = 1;
    for (let i = masteryXpTable.length - 1; i >= 0; i--) {
      if (current.xp >= masteryXpTable[i]) { newLevel = i + 1; break; }
    }
    current.level = Math.min(10, Math.max(1, newLevel));
    user.characterMastery[characterId] = current;

    // Track mastery achievements
    const maxMastery = Math.max(...Object.values(user.characterMastery).map(m => m.level));
    this.updateAchievementProgressForUser(user, 'mastery_level_5', maxMastery);
    this.updateAchievementProgressForUser(user, 'mastery_level_10', maxMastery);

    user.lastActiveAt = Date.now();
    this.save();

    return { success: true, oldLevel, newLevel: current.level, leveledUp: current.level > oldLevel, user: this.sanitizeUser(user) };
  }

  // ============================================================
  // v4.0 — DAILY MISSIONS
  // ============================================================

  public getDailyMissions(userId: string): { success: boolean; missions?: DailyMissionState[]; user?: SanitizedUserProfile; error?: string } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    const missions = this.getOrResetDailyMissionsInternal(user);
    this.save();
    return { success: true, missions, user: this.sanitizeUser(user) };
  }

  public claimDailyMission(userId: string, missionId: string): {
    success: boolean;
    rewardType?: string;
    rewardAmount?: number;
    error?: string;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    const todayStr = new Date().toISOString().slice(0, 10);
    const missions = this.getOrResetDailyMissionsInternal(user);
    const mission = missions.find(m => m.missionId === missionId);
    if (!mission) return { success: false, error: 'Mission not found.' };
    if (mission.isClaimed) return { success: false, error: 'Mission reward already claimed.' };
    if (!mission.isCompleted) return { success: false, error: 'Mission not yet completed.' };
    if (mission.expiresAt !== todayStr) return { success: false, error: 'Mission has expired. New missions available.' };

    mission.isClaimed = true;
    if (mission.rewardType === 'astra') {
      user.astra = (user.astra || 0) + mission.rewardAmount;
      user.ascensionCoins = user.astra;
    } else if (mission.rewardType === 'cardShards') {
      user.cardShards = (user.cardShards || 0) + mission.rewardAmount;
    } else if (mission.rewardType === 'xp') {
      user.xp = (user.xp || 0) + mission.rewardAmount;
    }
    user.dailyMissions = missions;
    user.lastActiveAt = Date.now();
    this.save();
    return { success: true, rewardType: mission.rewardType, rewardAmount: mission.rewardAmount, user: this.sanitizeUser(user) };
  }

  public updateMissionProgressExternal(userId: string, eventType: string, amount: number = 1): { success: boolean; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false };
    this.updateMissionProgressForUser(user, eventType, amount);
    user.lastActiveAt = Date.now();
    this.save();
    return { success: true, user: this.sanitizeUser(user) };
  }

  // ============================================================
  // v4.0 — WEEKLY CHALLENGES
  // ============================================================

  public getWeeklyChallenges(userId: string): { success: boolean; missions?: WeeklyMissionState[]; user?: SanitizedUserProfile; error?: string } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    const missions = this.getOrResetWeeklyMissionsInternal(user);
    this.save();
    return { success: true, missions, user: this.sanitizeUser(user) };
  }

  public claimWeeklyChallenge(userId: string, missionId: string): {
    success: boolean;
    rewardType?: string;
    rewardAmount?: number;
    error?: string;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    const missions = this.getOrResetWeeklyMissionsInternal(user);
    const mission = missions.find(m => m.missionId === missionId);
    if (!mission) return { success: false, error: 'Challenge not found.' };
    if (mission.isClaimed) return { success: false, error: 'Challenge reward already claimed.' };
    if (!mission.isCompleted) return { success: false, error: 'Challenge not yet completed.' };

    mission.isClaimed = true;
    if (mission.rewardType === 'astra') {
      user.astra = (user.astra || 0) + mission.rewardAmount;
      user.ascensionCoins = user.astra;
    } else if (mission.rewardType === 'cardShards') {
      user.cardShards = (user.cardShards || 0) + mission.rewardAmount;
    } else if (mission.rewardType === 'xp') {
      user.xp = (user.xp || 0) + mission.rewardAmount;
    }
    user.weeklyMissions = missions;
    user.lastActiveAt = Date.now();
    this.save();
    return { success: true, rewardType: mission.rewardType, rewardAmount: mission.rewardAmount, user: this.sanitizeUser(user) };
  }

  // ============================================================
  // v4.0 — ACHIEVEMENTS
  // ============================================================

  public getAchievements(userId: string): { success: boolean; achievements?: Record<string, AchievementState>; error?: string } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    return { success: true, achievements: user.achievements || {} };
  }

  public claimAchievement(userId: string, achievementId: string): {
    success: boolean;
    rewardType?: string;
    rewardAmount?: number;
    error?: string;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    const def = ACHIEVEMENT_DEFINITIONS[achievementId];
    if (!def) return { success: false, error: 'Achievement not found.' };
    const current = (user.achievements || {})[achievementId] || { progress: 0, isClaimed: false };
    if (current.isClaimed) return { success: false, error: 'Achievement already claimed.' };
    if (current.progress < def.target) return { success: false, error: 'Achievement not yet completed.' };

    current.isClaimed = true;
    if (!user.achievements) user.achievements = {};
    user.achievements[achievementId] = current;

    if (def.rewardType === 'astra') {
      user.astra = (user.astra || 0) + def.rewardAmount;
      user.ascensionCoins = user.astra;
    } else if (def.rewardType === 'cardShards') {
      user.cardShards = (user.cardShards || 0) + def.rewardAmount;
    }

    user.lastActiveAt = Date.now();
    this.save();
    return { success: true, rewardType: def.rewardType, rewardAmount: def.rewardAmount, user: this.sanitizeUser(user) };
  }

  // ============================================================
  // v4.0 — MYSTERY WHEEL
  // ============================================================

  public spinMysteryWheel(userId: string): {
    success: boolean;
    reward?: WheelReward;
    prizeIndex?: number;
    remainingSpins?: number;
    error?: string;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    // Check daily free spin
    const todayStr = new Date().toISOString().slice(0, 10);
    if ((user.wheelSpins || 0) <= 0) {
      if (user.lastWheelSpinDate === todayStr) {
        return { success: false, error: 'No spins available. Come back tomorrow for a free spin!' };
      }
      // Grant daily free spin
      user.wheelSpins = 1;
    }

    // Pick weighted random prize
    const totalWeight = WHEEL_PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let prizeIndex = 0;
    for (let i = 0; i < WHEEL_PRIZES.length; i++) {
      rand -= WHEEL_PRIZES[i].weight;
      if (rand <= 0) { prizeIndex = i; break; }
    }
    const prize = WHEEL_PRIZES[prizeIndex];

    // Award prize
    if (prize.type === 'astra') {
      user.astra = (user.astra || 0) + prize.amount;
      user.ascensionCoins = user.astra;
    } else if (prize.type === 'cardShards') {
      user.cardShards = (user.cardShards || 0) + prize.amount;
    } else if (prize.type === 'xp') {
      user.xp = (user.xp || 0) + prize.amount;
    } else if (prize.type === 'wheelSpin') {
      user.wheelSpins = (user.wheelSpins || 0) + prize.amount - 1; // subtract current
    }

    user.wheelSpins = Math.max(0, (user.wheelSpins || 1) - 1);
    user.lastWheelSpinDate = todayStr;
    user.totalWheelSpins = (user.totalWheelSpins || 0) + 1;
    user.lastActiveAt = Date.now();

    // Update missions & achievements
    this.updateMissionProgressForUser(user, 'spin_wheel', 1);
    this.updateAchievementProgressForUser(user, 'wheel_spin_10', user.totalWheelSpins);

    this.save();
    const reward: WheelReward = { type: prize.type, amount: prize.amount, label: prize.label, color: prize.color };
    return { success: true, reward, prizeIndex, remainingSpins: user.wheelSpins, user: this.sanitizeUser(user) };
  }

  // ============================================================
  // v4.0 — TEAM BUILDER
  // ============================================================

  public saveTeam(userId: string, name: string, characterIds: string[], teamId?: string): {
    success: boolean;
    team?: SavedTeam;
    error?: string;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    if (!name || name.trim().length < 1) return { success: false, error: 'Team name required.' };
    if (!Array.isArray(characterIds) || characterIds.length < 2 || characterIds.length > 8) {
      return { success: false, error: 'Team must have 2-8 characters.' };
    }

    if (!user.savedTeams) user.savedTeams = [];
    if (user.savedTeams.length >= 20 && !teamId) {
      return { success: false, error: 'Max 20 team presets allowed.' };
    }

    // Verify player owns all characters
    const owned = user.ownedCharacters || [];
    const invalid = characterIds.filter(id => !owned.includes(id));
    if (invalid.length > 0) {
      return { success: false, error: 'You do not own all selected characters.' };
    }

    const now = Date.now();
    if (teamId) {
      const existing = user.savedTeams.find(t => t.id === teamId);
      if (existing) {
        existing.name = name.trim();
        existing.characterIds = characterIds;
        existing.updatedAt = now;
        this.save();
        // Achievement
        this.updateAchievementProgressForUser(user, 'team_builder', user.savedTeams.length);
        return { success: true, team: existing, user: this.sanitizeUser(user) };
      }
    }

    const team: SavedTeam = {
      id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      characterIds,
      createdAt: now,
      updatedAt: now,
    };
    user.savedTeams.push(team);
    user.lastActiveAt = now;
    this.updateAchievementProgressForUser(user, 'team_builder', user.savedTeams.length);
    this.save();
    return { success: true, team, user: this.sanitizeUser(user) };
  }

  public deleteTeam(userId: string, teamId: string): { success: boolean; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    if (!user.savedTeams) return { success: false, error: 'No teams found.' };
    const idx = user.savedTeams.findIndex(t => t.id === teamId);
    if (idx === -1) return { success: false, error: 'Team not found.' };
    user.savedTeams.splice(idx, 1);
    this.save();
    return { success: true, user: this.sanitizeUser(user) };
  }

  public getTeams(userId: string): { success: boolean; teams?: SavedTeam[]; error?: string } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };
    return { success: true, teams: user.savedTeams || [] };
  }

  // ============================================================
  // v4.0 — ADMIN: GRANT REWARDS
  // ============================================================

  public adminGrantReward(adminUserId: string, targetUsername: string, rewardType: string, amount: number, characterId?: string): {
    success: boolean;
    error?: string;
  } {
    const admin = this.getRawUser(adminUserId);
    if (!this.isAuthorizedAdmin(admin)) {
      return { success: false, error: 'ACCESS DENIED.' };
    }
    const target = this.getRawUser(targetUsername);
    if (!target) return { success: false, error: `User "${targetUsername}" not found.` };

    const rewardId = `admin-${rewardType}-${targetUsername}-${Date.now()}`;
    if (!target.adminRewardHistory) target.adminRewardHistory = [];

    if (rewardType === 'astra') {
      target.astra = (target.astra || 0) + amount;
      target.ascensionCoins = target.astra;
    } else if (rewardType === 'cardShards') {
      target.cardShards = (target.cardShards || 0) + amount;
    } else if (rewardType === 'xp') {
      target.xp = (target.xp || 0) + amount;
    } else if (rewardType === 'character' && characterId) {
      if (!(target.ownedCharacters || []).includes(characterId)) {
        target.ownedCharacters = target.ownedCharacters || [];
        target.ownedCharacters.push(characterId);
      }
    } else if (rewardType === 'wheelSpins') {
      target.wheelSpins = (target.wheelSpins || 0) + amount;
    } else {
      return { success: false, error: 'Unknown reward type.' };
    }

    target.adminRewardHistory.push(rewardId);
    target.lastActiveAt = Date.now();
    this.logAdminAction(admin.username, `ADMIN GRANTED ${rewardType.toUpperCase()}`, `Granted ${amount} ${rewardType} to ${target.username}${characterId ? ` (${characterId})` : ''}`);
    this.save();
    return { success: true };
  }

  // ============================================================
  // v4.0 — TRACK GAME MODE PLAYS (for achievement tracking)
  // ============================================================

  public trackGameModePlayed(userId: string, mode: string): void {
    const user = this.getRawUser(userId);
    if (!user) return;
    if (!user.gameModesPlayed) user.gameModesPlayed = [];
    if (!user.gameModesPlayed.includes(mode)) {
      user.gameModesPlayed.push(mode);
      this.updateAchievementProgressForUser(user, 'multiversal', user.gameModesPlayed.length);
      this.save();
    }
  }

  // ============================================================
  // v4.0 — EXPORT FORGE CATEGORIES (for frontend)
  // ============================================================

  // ============================================================
  // SOCIAL / FRIENDS SYSTEM (MAX 100 FRIENDS PER PLAYER)
  // ============================================================

  public sendFriendRequest(userId: string, targetUsername: string): { success: boolean; error?: string; targetUser?: SanitizedUserProfile } {
    const sender = this.getRawUser(userId);
    if (!sender) return { success: false, error: 'Sender user not found.' };

    const cleanTarget = String(targetUsername || '').trim().toLowerCase();
    if (!cleanTarget) return { success: false, error: 'Enter a valid username.' };
    if (sender.username.toLowerCase() === cleanTarget) {
      return { success: false, error: 'You cannot send a friend request to yourself.' };
    }

    const target = this.getRawUser(cleanTarget);
    if (!target) return { success: false, error: `Player "${targetUsername}" not found.` };

    if (!sender.friends) sender.friends = [];
    if (!target.friends) target.friends = [];
    if (!sender.friendRequestsOutgoing) sender.friendRequestsOutgoing = [];
    if (!target.friendRequestsIncoming) target.friendRequestsIncoming = [];

    if (sender.friends.length >= 100) return { success: false, error: 'You have reached the maximum limit of 100 friends.' };
    if (target.friends.length >= 100) return { success: false, error: 'This player has reached the maximum limit of 100 friends.' };

    if (sender.friends.includes(target.id)) return { success: false, error: 'You are already friends with this player.' };
    if (sender.friendRequestsOutgoing.includes(target.id)) return { success: false, error: 'Friend request already sent.' };

    // If target had already sent request to sender, auto-accept!
    if ((sender.friendRequestsIncoming || []).includes(target.id)) {
      const autoAccept = this.acceptFriendRequest(sender.id, target.id);
      return { success: autoAccept.success, error: autoAccept.error, targetUser: this.sanitizeUser(target) };
    }

    sender.friendRequestsOutgoing.push(target.id);
    target.friendRequestsIncoming.push(sender.id);
    this.save();
    return { success: true, targetUser: this.sanitizeUser(target) };
  }

  public acceptFriendRequest(userId: string, requesterUserId: string): { success: boolean; error?: string } {
    const user = this.getRawUser(userId);
    const requester = this.getRawUser(requesterUserId);
    if (!user || !requester) return { success: false, error: 'User not found.' };

    if (!user.friends) user.friends = [];
    if (!requester.friends) requester.friends = [];

    if (user.friends.length >= 100) return { success: false, error: 'You have reached the maximum limit of 100 friends.' };
    if (requester.friends.length >= 100) return { success: false, error: 'Requester has reached the maximum limit of 100 friends.' };

    // Remove from incoming/outgoing
    user.friendRequestsIncoming = (user.friendRequestsIncoming || []).filter(id => id !== requester.id);
    requester.friendRequestsOutgoing = (requester.friendRequestsOutgoing || []).filter(id => id !== user.id);

    if (!user.friends.includes(requester.id)) user.friends.push(requester.id);
    if (!requester.friends.includes(user.id)) requester.friends.push(user.id);

    this.save();
    return { success: true };
  }

  public declineFriendRequest(userId: string, requesterUserId: string): { success: boolean; error?: string } {
    const user = this.getRawUser(userId);
    const requester = this.getRawUser(requesterUserId);
    if (!user) return { success: false, error: 'User not found.' };

    user.friendRequestsIncoming = (user.friendRequestsIncoming || []).filter(id => id !== requesterUserId);
    if (requester) {
      requester.friendRequestsOutgoing = (requester.friendRequestsOutgoing || []).filter(id => id !== userId);
    }
    this.save();
    return { success: true };
  }

  public removeFriend(userId: string, targetUserId: string): { success: boolean; error?: string } {
    const user = this.getRawUser(userId);
    const target = this.getRawUser(targetUserId);
    if (!user) return { success: false, error: 'User not found.' };

    user.friends = (user.friends || []).filter(id => id !== targetUserId);
    if (target) {
      target.friends = (target.friends || []).filter(id => id !== userId);
    }
    this.save();
    return { success: true };
  }

  public getFriendsData(userId: string): {
    success: boolean;
    friends?: Array<{
      id: string;
      username: string;
      displayName: string;
      avatar: string;
      customAvatarUrl?: string;
      level: number;
      xp: number;
      rankedTier: string;
      rankedDivision: number;
      rankedRating: number;
      wins: number;
      matchesPlayed: number;
      favoriteCharacterId?: string;
      lastActiveAt: number;
    }>;
    incomingRequests?: Array<{
      id: string;
      username: string;
      displayName: string;
      avatar: string;
      customAvatarUrl?: string;
      level: number;
    }>;
    outgoingRequests?: Array<{
      id: string;
      username: string;
      displayName: string;
      avatar: string;
      customAvatarUrl?: string;
      level: number;
    }>;
    error?: string;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    const friendsList = (user.friends || []).map(friendId => {
      const f = this.getRawUser(friendId);
      if (!f) return null;
      return {
        id: f.id,
        username: f.username,
        displayName: f.displayName || f.username,
        avatar: f.avatar || '🦸‍♂️',
        customAvatarUrl: f.customAvatarUrl,
        level: getLevelFromXp(f.xp || 0).level,
        xp: f.xp || 0,
        rankedTier: f.rankedTier || 'UNRANKED',
        rankedDivision: f.rankedDivision || 0,
        rankedRating: f.rankedRating || 0,
        wins: f.wins || 0,
        matchesPlayed: f.matchesPlayed || 0,
        favoriteCharacterId: f.favoriteCharacterId,
        lastActiveAt: f.lastActiveAt || 0,
      };
    }).filter(Boolean);

    const incoming = (user.friendRequestsIncoming || []).map(reqId => {
      const u = this.getRawUser(reqId);
      if (!u) return null;
      return {
        id: u.id,
        username: u.username,
        displayName: u.displayName || u.username,
        avatar: u.avatar || '🦸‍♂️',
        customAvatarUrl: u.customAvatarUrl,
        level: getLevelFromXp(u.xp || 0).level,
      };
    }).filter(Boolean);

    const outgoing = (user.friendRequestsOutgoing || []).map(reqId => {
      const u = this.getRawUser(reqId);
      if (!u) return null;
      return {
        id: u.id,
        username: u.username,
        displayName: u.displayName || u.username,
        avatar: u.avatar || '🦸‍♂️',
        customAvatarUrl: u.customAvatarUrl,
        level: getLevelFromXp(u.xp || 0).level,
      };
    }).filter(Boolean);

    return {
      success: true,
      friends: friendsList as any[],
      incomingRequests: incoming as any[],
      outgoingRequests: outgoing as any[],
    };
  }

  public getUserPublicProfile(usernameOrId: string): { success: boolean; profile?: SanitizedUserProfile; error?: string } {
    const user = this.getRawUser(usernameOrId);
    if (!user) return { success: false, error: 'Player not found.' };
    return { success: true, profile: this.sanitizeUser(user) };
  }

  // ============================================================
  // COMPETITIVE RANKED REWARD CLAIMING
  // ============================================================

  public claimRankReward(userId: string, rankId: string): {
    success: boolean;
    error?: string;
    reward?: RankedTierReward;
    user?: SanitizedUserProfile;
  } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    const cleanRankId = String(rankId || '').trim().toUpperCase();
    const rankDef = ALL_RANK_DEFINITIONS.find(r => r.id.toUpperCase() === cleanRankId);
    if (!rankDef) return { success: false, error: 'Rank definition not found.' };

    const userRating = user.rankedRating || 0;
    if (userRating < rankDef.requiredRating) {
      return { success: false, error: `Required rating of ${rankDef.requiredRating} MMR not reached.` };
    }

    if (!user.claimedRankRewards) user.claimedRankRewards = [];
    if (user.claimedRankRewards.map(id => id.toUpperCase()).includes(rankDef.id.toUpperCase())) {
      return { success: false, error: 'Rank reward already claimed.' };
    }

    const reward = rankDef.reward;
    if (reward.astra) {
      user.astra = (user.astra || 0) + reward.astra;
      user.ascensionCoins = user.astra;
    }
    if (reward.cardShards) {
      user.cardShards = (user.cardShards || 0) + reward.cardShards;
    }
    if (reward.cratesCount && reward.crateType) {
      if (!user.crateInventory) user.crateInventory = { shard: 0, character: 0 };
      if (reward.crateType === 'CHARACTER_CRATE') {
        user.crateInventory.character += reward.cratesCount;
      } else {
        user.crateInventory.shard += reward.cratesCount;
      }
    }
    if (reward.tokensCount && reward.tokenCategory) {
      if (!user.characterTokens) user.characterTokens = {};
      user.characterTokens[reward.tokenCategory] = (user.characterTokens[reward.tokenCategory] || 0) + reward.tokensCount;
    }

    user.claimedRankRewards.push(rankId);
    this.save();
    return { success: true, reward, user: this.sanitizeUser(user) };
  }

  // ============================================================
  // v4.0 — EXPORT FORGE CATEGORIES (for frontend)
  // ============================================================

  public getForgeInfo(): { categories: typeof FORGE_CATEGORIES; wheelPrizes: WheelReward[]; achievementDefs: typeof ACHIEVEMENT_DEFINITIONS } {
    return {
      categories: FORGE_CATEGORIES,
      wheelPrizes: WHEEL_PRIZES.map(({ weight: _w, ...rest }) => rest),
      achievementDefs: ACHIEVEMENT_DEFINITIONS,
    };
  }
}

export const database = new DatabaseManager();
export { FORGE_CATEGORIES, WHEEL_PRIZES };

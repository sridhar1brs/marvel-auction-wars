import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getLevelFromXp, calculateMatchXp, formatPlaytime, MatchXpParams, XpBreakdown } from '../progression';

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
  rankedTier: string; // UNRANKED, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, VIBRANIUM, COSMIC, CELESTIAL, ASCENDER
  rankedDivision: number; // 5 -> 1 (Celestial has 3 -> 1; Ascender has 0)
  placementMatchesPlayed: number; // 0 to 10
  placementMatchesTotal: number; // 10
  placementWins: number;
  isPlacementsCompleted: boolean;
  highestRank: string;
  highestRating: number;
  
  // Battle Pass & Daily
  battlePassLevel: number; // 1 - 1000
  battlePassXp: number;
  battlePassClaimed: number[]; // Claimed level reward integers
  dailyLoginStreak: number; // 1 to 7 cycle
  lastDailyLoginDate: string; // YYYY-MM-DD
  currentWinStreak: number;
  bestWinStreak: number;
  totalDamageDealt: number;
  bossesDefeated: number;
  dungeonsCompleted: number;
  giftsSent: GiftRecord[];
  giftsReceived: GiftRecord[];
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

const JWT_SECRET = process.env.AUTH_SECRET || 'mcu_auction_wars_super_secret_jwt_key_2026_infinity';
const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'accounts.json');
const CODES_FILE = path.join(DATA_DIR, 'redeem_codes.json');
const LOGS_FILE = path.join(DATA_DIR, 'admin_logs.json');

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
        // Seed default promotional code
        this.redeemCodes.set('ASCEND2026', {
          code: 'ASCEND2026',
          astraReward: 5000,
          maxUses: 1000,
          usedCount: 0,
          expiresAt: '2026-12-31',
          isActive: true,
          createdAt: Date.now(),
          redeemedBy: [],
          creatorUsername: 'System'
        });
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
    const isOwner = ['sridhar', 'admin', 'owner'].includes((u.username || '').toLowerCase());
    const realAstra = typeof u.astra === 'number' ? u.astra : (typeof u.ascensionCoins === 'number' ? u.ascensionCoins : 0);

    return {
      ...u,
      role: isOwner ? 'admin' : (u.role || 'player'),
      isAdmin: isOwner ? true : (u.isAdmin || false),
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
      battlePassLevel: typeof u.battlePassLevel === 'number' ? u.battlePassLevel : 1,
      battlePassXp: typeof u.battlePassXp === 'number' ? u.battlePassXp : 0,
      battlePassClaimed: Array.isArray(u.battlePassClaimed) ? u.battlePassClaimed : [],
      dailyLoginStreak: typeof u.dailyLoginStreak === 'number' ? u.dailyLoginStreak : 0,
      lastDailyLoginDate: u.lastDailyLoginDate || '',
      currentWinStreak: typeof u.currentWinStreak === 'number' ? u.currentWinStreak : 0,
      bestWinStreak: typeof u.bestWinStreak === 'number' ? u.bestWinStreak : 0,
      totalDamageDealt: typeof u.totalDamageDealt === 'number' ? u.totalDamageDealt : 0,
      bossesDefeated: typeof u.bossesDefeated === 'number' ? u.bossesDefeated : 0,
      dungeonsCompleted: typeof u.dungeonsCompleted === 'number' ? u.dungeonsCompleted : 0,
      giftsSent: Array.isArray(u.giftsSent) ? u.giftsSent : [],
      giftsReceived: Array.isArray(u.giftsReceived) ? u.giftsReceived : []
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
      battlePassLevel: u.battlePassLevel || 1,
      battlePassXp: u.battlePassXp || 0,
      battlePassClaimed: u.battlePassClaimed || [],
      dailyLoginStreak: u.dailyLoginStreak || 0,
      lastDailyLoginDate: u.lastDailyLoginDate || '',
      canClaimDailyLogin,
      currentWinStreak: u.currentWinStreak || 0,
      bestWinStreak: u.bestWinStreak || 0,
      totalDamageDealt: u.totalDamageDealt || 0,
      bossesDefeated: u.bossesDefeated || 0,
      dungeonsCompleted: u.dungeonsCompleted || 0,
      giftsSentCount: (u.giftsSent || []).length,
      giftsReceivedCount: (u.giftsReceived || []).length
    };
  }

  // Generate 10-character code
  public generateCodeString(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Non-ambiguous uppercase alphanumeric
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
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

    // Grant Reward
    const reward = codeObj.astraReward || 1000;
    user.astra = (user.astra || 0) + reward;
    user.ascensionCoins = user.astra;
    codeObj.usedCount += 1;
    codeObj.redeemedBy.push(user.id);

    this.save();
    this.saveCodes();

    return {
      success: true,
      astraAwarded: reward,
      message: `🎉 Successfully redeemed! +${reward.toLocaleString()} ASTRA credited to your vault.`,
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
      maxUses: number;
      expiresAt: string;
      isActive?: boolean;
    }
  ): { success: boolean; code?: RedeemCode; error?: string } {
    const admin = this.getRawUser(adminUserId);
    if (!admin || (admin.role !== 'admin' && !admin.isAdmin)) {
      return { success: false, error: 'ACCESS DENIED: Owner-only authorization required.' };
    }

    let codeStr = (payload.code || this.generateCodeString()).trim().toUpperCase();
    if (codeStr.length !== 10) {
      codeStr = this.generateCodeString();
    }

    if (this.redeemCodes.has(codeStr)) {
      return { success: false, error: `Code "${codeStr}" already exists in the database.` };
    }

    const newCode: RedeemCode = {
      code: codeStr,
      astraReward: Math.max(100, Math.min(1000000, Number(payload.astraReward) || 5000)),
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
    if (!admin || (admin.role !== 'admin' && !admin.isAdmin)) {
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
    if (!admin || (admin.role !== 'admin' && !admin.isAdmin)) {
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
    if (!admin || (admin.role !== 'admin' && !admin.isAdmin)) {
      return { success: false, error: 'ACCESS DENIED.' };
    }
    return { success: true, codes: Array.from(this.redeemCodes.values()).sort((a, b) => b.createdAt - a.createdAt) };
  }

  public getAdminStats(adminUserId: string): { success: boolean; stats?: any; actionLogs?: AdminActionLog[]; error?: string } {
    const admin = this.getRawUser(adminUserId);
    if (!admin || (admin.role !== 'admin' && !admin.isAdmin)) {
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
    const isOwner = ['sridhar', 'admin', 'owner'].includes(cleanUsername);

    const newUser: UserAccount = {
      id,
      username: cleanUsername,
      displayName: username.trim(),
      passwordHash,
      salt,
      avatar: avatar || '🦸‍♂️',
      role: isOwner ? 'admin' : 'player',
      isAdmin: isOwner,
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

      // Fresh Account 0-State
      astra: 0,
      ascensionCoins: 0,
      characterShards: {},
      ownedCharacters: [], // Fresh: 0 owned!
      characterLevels: {},
      characterStatsBoosts: {},
      ownedRelics: [], // Fresh: 0 owned!
      ownedSkills: [], // Fresh: 0 owned!
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
      dailyLoginStreak: 0,
      lastDailyLoginDate: '',
      currentWinStreak: 0,
      bestWinStreak: 0,
      totalDamageDealt: 0,
      bossesDefeated: 0,
      dungeonsCompleted: 0,
      giftsSent: [],
      giftsReceived: []
    };

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
      return { success: false, error: 'Daily Astra already claimed today. Return tomorrow!' };
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

    if ((user.astra || 0) < cost) {
      return { success: false, error: `Insufficient Astra. Need ✨ ${cost.toLocaleString()} Astra, you have ✨ ${(user.astra || 0).toLocaleString()}.` };
    }

    user.astra = (user.astra || 0) - cost;
    user.ascensionCoins = user.astra;
    const isOwned = (user.ownedCharacters || []).includes(characterId);

    if (isOwned) {
      const currentShards = user.characterShards[characterId] || 0;
      user.characterShards[characterId] = currentShards + 20;
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

    if (isMythic) {
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
    const requiredShards = Math.min(10, Math.floor(currentLevel / 5) + 1);

    if ((user.astra || 0) < requiredAstra) {
      return { success: false, error: `Need ✨ ${requiredAstra} Astra to upgrade to Level ${currentLevel + 1}.` };
    }

    const ownedShards = user.characterShards[characterId] || 0;
    if (ownedShards < requiredShards) {
      return { success: false, error: `Need ${requiredShards} Character Shards. You have ${ownedShards}.` };
    }

    user.astra = (user.astra || 0) - requiredAstra;
    user.ascensionCoins = user.astra;
    user.characterShards[characterId] = ownedShards - requiredShards;
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

  // Claim Battle Pass Level Reward (Levels 1 - 1000)
  public claimBattlePassReward(
    userId: string,
    level: number,
    rewardType: 'COINS' | 'RELIC' | 'SKILL' | 'SHARDS' | 'CHARACTER' | 'ULTIMATE' = 'COINS',
    rewardAmount: number = 0,
    rewardItemId?: string
  ): { success: boolean; rewardType?: string; rewardAmount?: number; error?: string; user?: SanitizedUserProfile } {
    const user = this.getRawUser(userId);
    if (!user) return { success: false, error: 'User not found.' };

    if (!user.battlePassClaimed) user.battlePassClaimed = [];
    if (user.battlePassClaimed.includes(level)) {
      return { success: false, error: `Battle Pass Level ${level} reward already claimed.` };
    }

    const effectiveLevel = Math.max(user.level || 1, user.battlePassLevel || 1);
    if (effectiveLevel < level) {
      return { success: false, error: `Reach Commander Level ${level} to claim this reward (Current: Level ${effectiveLevel}).` };
    }

    // Determine Reward
    let astraGiven = 0;
    if (rewardType === 'COINS' || rewardType === 'ULTIMATE') {
      astraGiven = rewardAmount || Math.min(100000, level === 1000 ? 100000 : level === 750 ? 50000 : level === 500 ? 25000 : level === 250 ? 10000 : level === 100 ? 5000 : level * 15);
      user.astra = (user.astra || 0) + astraGiven;
      user.ascensionCoins = user.astra;
    } else if (rewardType === 'CHARACTER') {
      if (rewardItemId && !user.ownedCharacters.includes(rewardItemId)) {
        user.ownedCharacters.push(rewardItemId);
      }
      astraGiven = rewardAmount || (level * 50);
      user.astra = (user.astra || 0) + astraGiven;
      user.ascensionCoins = user.astra;
    } else if (rewardType === 'RELIC') {
      if (rewardItemId && !user.ownedRelics.includes(rewardItemId)) {
        user.ownedRelics.push(rewardItemId);
      }
      astraGiven = rewardAmount || (level * 20);
      user.astra = (user.astra || 0) + astraGiven;
      user.ascensionCoins = user.astra;
    } else if (rewardType === 'SKILL') {
      if (rewardItemId && !user.ownedSkills.includes(rewardItemId)) {
        user.ownedSkills.push(rewardItemId);
      }
      astraGiven = rewardAmount || (level * 25);
      user.astra = (user.astra || 0) + astraGiven;
      user.ascensionCoins = user.astra;
    } else if (rewardType === 'SHARDS') {
      astraGiven = rewardAmount || (level * 30);
      user.astra = (user.astra || 0) + astraGiven;
      user.ascensionCoins = user.astra;
    }

    user.battlePassClaimed.push(level);
    this.save();

    return {
      success: true,
      rewardType,
      rewardAmount: astraGiven,
      user: this.sanitizeUser(user)
    };
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
    }
  ): { success: boolean; coinsAwarded: number; astraAwarded: number; xpAwarded: number; newRating: number; newTier: string; user: SanitizedUserProfile } | null {
    const user = this.getRawUser(userId);
    if (!user) return null;

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
        } else if (user.rankedRating >= 3500) {
          user.rankedTier = 'CELESTIAL';
          // Celestial V (3500), IV (3800), III (4100-4499)
          const offset = user.rankedRating - 3500;
          user.rankedDivision = offset >= 600 ? 3 : offset >= 300 ? 4 : 5;
        } else if (user.rankedRating >= 3000) {
          user.rankedTier = 'COSMIC';
          user.rankedDivision = Math.max(1, Math.min(5, 5 - Math.floor((user.rankedRating - 3000) / 100)));
        } else if (user.rankedRating >= 2500) {
          user.rankedTier = 'VIBRANIUM';
          user.rankedDivision = Math.max(1, Math.min(5, 5 - Math.floor((user.rankedRating - 2500) / 100)));
        } else if (user.rankedRating >= 2000) {
          user.rankedTier = 'DIAMOND';
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
    user.lastActiveAt = Date.now();
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
}

export const database = new DatabaseManager();

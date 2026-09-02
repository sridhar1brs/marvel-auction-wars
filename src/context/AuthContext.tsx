import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PlayerProfile, RedeemCode, AdminActionLog } from '../types/game';
import { LevelInfo, getLevelFromXp, formatPlaytime } from '../utils/progression';
import { API_BASE_URL, getApiUrl } from '../config/api';
import { authenticateSocket } from '../socket/socket';

export interface UserProfile extends PlayerProfile {
  displayName: string;
  customAvatarUrl?: string;
  bio?: string;
  favoriteGameMode?: string;
  role: 'admin' | 'player';
  isAdmin: boolean;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  playtimeSeconds: number;
  playtimeFormatted: string;

  // 🌌 Ascension Ecosystem (Astra)
  astra: number;
  ascensionCoins: number;
  characterShards: Record<string, number>;
  ownedCharacters: string[];
  characterLevels: Record<string, number>;
  characterStatsBoosts: Record<string, { power: number; hp: number; defense: number; speed: number }>;
  ownedRelics: string[];
  ownedSkills: string[];
  equippedRelics: Record<string, string[]>;
  equippedSkills: Record<string, string[]>;
  
  // Ranked System
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
  draftShards: Record<string, number>;
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
  claimedLevelRewards?: number[];
  cratesOpened: number;
  characterMastery: Record<string, { xp: number; level: number }>;
  savedTeams: Array<{ id: string; name: string; characterIds: string[]; createdAt: number; updatedAt: number }>;
  dailyMissions: Array<{
    missionId: string; title: string; description: string;
    target: number; progress: number;
    rewardType: 'astra' | 'cardShards' | 'xp'; rewardAmount: number;
    eventType: string; isCompleted: boolean; isClaimed: boolean; expiresAt: string;
  }>;
  weeklyMissions: Array<{
    missionId: string; title: string; description: string;
    target: number; progress: number;
    rewardType: 'astra' | 'cardShards' | 'xp'; rewardAmount: number;
    eventType: string; isCompleted: boolean; isClaimed: boolean; expiresAt: string;
  }>;
  achievements: Record<string, { progress: number; isClaimed: boolean; unlockedAt?: number }>;
  wheelSpins: number;
  lastWheelSpinDate: string;
  totalWheelSpins: number;
  gameModesPlayed: string[];
  starterCharactersGranted?: boolean;
  claimedRankRewards?: string[];
  friends?: string[];
  friendsCount?: number;
}

export interface MatchOutcomeParams {
  isWin: boolean;
  matchType?: 'classic' | 'tournament' | 'dungeon' | 'sandbox' | 'chaos';
  battlesWon?: number;
  charactersPurchased?: number;
  isTournamentChampion?: boolean;
  isMvp?: boolean;
  dungeonWavesCleared?: number;
  durationSeconds?: number;
}

export interface MatchOutcomeResult {
  success: boolean;
  user: UserProfile;
  xpAwarded: { total: number; reasons: { label: string; xp: number }[] };
  coinsAwarded?: number;
  astraAwarded?: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLevelUpOpen: boolean;
  levelUpData: { oldLevel: number; newLevel: number; user: UserProfile } | null;
  closeLevelUpModal: () => void;
  signup: (username: string, password: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  signin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAvatar: (avatar: string, favoriteCharacterId?: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (username?: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  updateCustomAvatar: (customAvatarUrl?: string, bio?: string, favoriteGameMode?: string) => Promise<{ success: boolean; error?: string }>;
  recordMatchResult: (params: MatchOutcomeParams, matchToken?: string) => Promise<MatchOutcomeResult | null>;
  recordDungeonResult: (wavesCleared: number, isVictory: boolean, matchToken?: string) => Promise<MatchOutcomeResult | null>;
  startDungeonExpedition: (characterIds: string[], difficultyMode?: string) => Promise<{ success: boolean; teamData?: any[]; error?: string }>;
  saveDungeonRun: (runState: any) => Promise<{ success: boolean }>;
  getActiveDungeonRun: () => Promise<{ success: boolean; runState?: any }>;
  finalizeDungeonExpedition: (runState: any, isVictory: boolean, matchToken?: string) => Promise<any>;
  refreshProfile: () => Promise<void>;

  // 🌌 Ascension Actions (Astra)
  claimDailyLogin: () => Promise<{ success: boolean; astraAwarded?: number; coinsAwarded?: number; streak?: number; error?: string }>;
  buyCharacter: (characterId: string, cost: number) => Promise<{ success: boolean; isDuplicate?: boolean; shardsAwarded?: number; error?: string }>;
  upgradeCharacter: (characterId: string, isMythic: boolean) => Promise<{ success: boolean; newLevel?: number; error?: string }>;
  buyRelic: (relicId: string, cost: number) => Promise<{ success: boolean; error?: string }>;
  deductAstra: (amount: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
  buySkill: (skillId: string, characterId: string, requiredLevel: number, cost: number) => Promise<{ success: boolean; error?: string }>;
  equipLoadout: (characterId: string, relicIds: string[], skillIds: string[]) => Promise<{ success: boolean; error?: string }>;
  claimBattlePassReward: (level: number, rewardType?: string, rewardAmount?: number, rewardItemId?: string) => Promise<{ success: boolean; rewardAmount?: number; error?: string }>;
  recordAscensionMatch: (params: { isWin: boolean; matchFormat: '1v1' | '2v2' | '3v3' | '4v4' | '5v5' | 'custom'; isRanked?: boolean; isMvp?: boolean; isComeback?: boolean; isFlawless?: boolean; damageDealt?: number; matchToken?: string }) => Promise<any>;
  sendGift: (recipientUsername: string, giftType: 'COINS' | 'CHARACTER' | 'RELIC' | 'SKILL', itemId?: string, itemAmount?: number, message?: string) => Promise<{ success: boolean; error?: string }>;
  redeemCode: (code: string) => Promise<{ success: boolean; astraAwarded?: number; message?: string; error?: string }>;

  // 🔐 Owner Admin Actions
  fetchAdminStats: () => Promise<{ success: boolean; stats?: any; actionLogs?: AdminActionLog[]; error?: string }>;
  fetchAdminCodes: () => Promise<{ success: boolean; codes?: RedeemCode[]; error?: string }>;
  createAdminCode: (payload: { code?: string; astraReward: number; rewardType?: 'ASTRA' | 'CHARACTER' | 'SHARD' | 'CRATE'; rewardAmount?: number; characterId?: string; crateType?: string; maxUses: number; expiresAt: string; isActive?: boolean }) => Promise<{ success: boolean; code?: RedeemCode; error?: string }>;
  toggleAdminCode: (code: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;
  deleteAdminCode: (code: string) => Promise<{ success: boolean; error?: string }>;

  // v4.0 — New System Actions
  claimLevelCrate: (level: number) => Promise<{ success: boolean; crateType?: string; reward?: any; isDuplicate?: boolean; cardShardsAwarded?: number; error?: string }>;
  craftCard: (category: string) => Promise<{ success: boolean; character?: any; isDuplicate?: boolean; cardShardsAwarded?: number; cost?: number; error?: string }>;
  awardMasteryXp: (characterId: string, xp: number) => Promise<{ success: boolean; oldLevel?: number; newLevel?: number; leveledUp?: boolean; error?: string }>;
  getDailyMissions: () => Promise<{ success: boolean; missions?: any[]; error?: string }>;
  claimDailyMission: (missionId: string) => Promise<{ success: boolean; rewardType?: string; rewardAmount?: number; error?: string }>;
  getWeeklyChallenges: () => Promise<{ success: boolean; missions?: any[]; error?: string }>;
  claimWeeklyChallenge: (missionId: string) => Promise<{ success: boolean; rewardType?: string; rewardAmount?: number; error?: string }>;
  getAchievements: () => Promise<{ success: boolean; achievements?: any; definitions?: any; error?: string }>;
  claimAchievement: (achievementId: string) => Promise<{ success: boolean; rewardType?: string; rewardAmount?: number; error?: string }>;
  claimPlayerLevelReward: (level: number) => Promise<{ success: boolean; reward?: any; error?: string }>;
  spinMysteryWheel: () => Promise<{ success: boolean; reward?: any; prizeIndex?: number; remainingSpins?: number; error?: string }>;
  saveTeam: (name: string, characterIds: string[], teamId?: string) => Promise<{ success: boolean; team?: any; error?: string }>;
  deleteTeam: (teamId: string) => Promise<{ success: boolean; error?: string }>;
  getTeams: () => Promise<{ success: boolean; teams?: any[]; error?: string }>;
  adminGrantReward: (targetUsername: string, rewardType: string, amount: number, characterId?: string) => Promise<{ success: boolean; error?: string }>;
  openCrate: (crateType: string) => Promise<{ success: boolean; reward?: any; error?: string }>;
  openAllCrates: (crateType: string) => Promise<{
    success: boolean;
    countOpened?: number;
    crateType?: string;
    rewards?: any[];
    summary?: {
      categoryShards: Record<string, number>;
      newCharacters: any[];
      duplicateCharacters: { character: any; shardsAwarded: number }[];
      totalAstra: number;
    };
    error?: string;
  }>;
  craftCharacterToken: (category: string) => Promise<{ success: boolean; error?: string }>;
  redeemCharacterToken: (category: string, characterId: string) => Promise<{ success: boolean; error?: string }>;
  getOnboardingChoices: () => Promise<{ success: boolean; choices?: any[]; completed?: boolean; error?: string }>;
  chooseOnboardingCharacter: (characterId: string) => Promise<{ success: boolean; error?: string }>;
  trackGameMode?: (gameMode: string) => Promise<void>;
  updateMissionProgress?: (type: string, amount?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'mcu_auth_token';
const API_BASE = API_BASE_URL;

export function normalizeUserProfile(u: any): UserProfile {
  if (!u) return u;
  // The server independently verifies this signed account for every admin API.
  const isOwner = (u.username || '').toLowerCase() === 'darksenseify';
  const realAstra = typeof u.astra === 'number' ? u.astra : (typeof u.ascensionCoins === 'number' ? u.ascensionCoins : 0);

  return {
    ...u,
    displayName: u.displayName || u.username || 'Commander',
    avatar: u.avatar || '🦸‍♂️',
    role: isOwner ? 'admin' : (u.role || 'player'),
    isAdmin: isOwner ? true : (u.isAdmin || u.role === 'admin' || false),
    level: typeof u.level === 'number' ? u.level : 1,
    xp: typeof u.xp === 'number' ? u.xp : 0,
    wins: typeof u.wins === 'number' ? u.wins : 0,
    losses: typeof u.losses === 'number' ? u.losses : 0,
    matchesPlayed: typeof u.matchesPlayed === 'number' ? u.matchesPlayed : 0,
    winRate: typeof u.winRate === 'number' ? u.winRate : 0,
    battlesWon: typeof u.battlesWon === 'number' ? u.battlesWon : 0,
    mvpAwards: typeof u.mvpAwards === 'number' ? u.mvpAwards : 0,
    tournamentWins: typeof u.tournamentWins === 'number' ? u.tournamentWins : 0,
    charactersPurchased: typeof u.charactersPurchased === 'number' ? u.charactersPurchased : 0,
    
    // Fresh Account 0-State
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

    // Ranked
    rankedRating: typeof u.rankedRating === 'number' ? u.rankedRating : 0,
    rankedTier: u.rankedTier || 'UNRANKED',
    rankedDivision: typeof u.rankedDivision === 'number' ? u.rankedDivision : 0,
    placementMatchesPlayed: typeof u.placementMatchesPlayed === 'number' ? u.placementMatchesPlayed : 0,
    placementMatchesTotal: 10,
    isPlacementsCompleted: u.isPlacementsCompleted || false,
    highestRank: u.highestRank || 'UNRANKED',
    highestRating: typeof u.highestRating === 'number' ? u.highestRating : 0,

    battlePassLevel: typeof u.battlePassLevel === 'number' ? u.battlePassLevel : 1,
    battlePassXp: typeof u.battlePassXp === 'number' ? u.battlePassXp : 0,
    battlePassClaimed: Array.isArray(u.battlePassClaimed) ? u.battlePassClaimed : [],
    crateInventory: u.crateInventory || { shard: 0, character: 0 },
    categoryShards: u.categoryShards || {},
    draftShards: u.draftShards || {},
    characterTokens: u.characterTokens || {},
    onboardingCompleted: u.onboardingCompleted !== false,
    onboardingChoices: Array.isArray(u.onboardingChoices) ? u.onboardingChoices : [],
    dailyLoginStreak: typeof u.dailyLoginStreak === 'number' ? u.dailyLoginStreak : 0,
    lastDailyLoginDate: u.lastDailyLoginDate || '',
    canClaimDailyLogin: u.canClaimDailyLogin ?? true,
    currentWinStreak: typeof u.currentWinStreak === 'number' ? u.currentWinStreak : 0,
    bestWinStreak: typeof u.bestWinStreak === 'number' ? u.bestWinStreak : 0,
    totalDamageDealt: typeof u.totalDamageDealt === 'number' ? u.totalDamageDealt : 0,
    bossesDefeated: typeof u.bossesDefeated === 'number' ? u.bossesDefeated : 0,
    dungeonsCompleted: typeof u.dungeonsCompleted === 'number' ? u.dungeonsCompleted : 0,
    giftsSentCount: typeof u.giftsSentCount === 'number' ? u.giftsSentCount : 0,
    giftsReceivedCount: typeof u.giftsReceivedCount === 'number' ? u.giftsReceivedCount : 0,
    progressPercent: typeof u.progressPercent === 'number' ? u.progressPercent : 0,
    currentLevelXp: typeof u.currentLevelXp === 'number' ? u.currentLevelXp : 0,
    xpForNextLevel: typeof u.xpForNextLevel === 'number' ? u.xpForNextLevel : 1000,
    playtimeSeconds: typeof u.playtimeSeconds === 'number' ? u.playtimeSeconds : 0,
    playtimeFormatted: u.playtimeFormatted || '0m',
    // v4.0
    cardShards: typeof u.cardShards === 'number' ? u.cardShards : 0,
    claimedLevelCrates: Array.isArray(u.claimedLevelCrates) ? u.claimedLevelCrates : [],
    claimedLevelRewards: Array.isArray(u.claimedLevelRewards) ? u.claimedLevelRewards : [],
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
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState<boolean>(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number; user: UserProfile } | null>(null);

  const lastActiveTimestamp = useRef<number>(Date.now());

  useEffect(() => {
    const markActive = () => {
      lastActiveTimestamp.current = Date.now();
    };

    window.addEventListener('mousemove', markActive, { passive: true });
    window.addEventListener('keydown', markActive, { passive: true });
    window.addEventListener('touchstart', markActive, { passive: true });
    window.addEventListener('click', markActive, { passive: true });

    return () => {
      window.removeEventListener('mousemove', markActive);
      window.removeEventListener('keydown', markActive);
      window.removeEventListener('touchstart', markActive);
      window.removeEventListener('click', markActive);
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(normalizeUserProfile(data.user));
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error('[Auth] Failed to refresh profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Periodic Playtime Heartbeat (every 60s)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      const isIdle = Date.now() - lastActiveTimestamp.current > 180000; // 3 min idle
      if (isIdle) return;

      try {
        const res = await fetch(`${API_BASE}/api/auth/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ seconds: 60 })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.playtimeSeconds) {
            setUser(prev => {
              if (!prev) return null;
              return {
                ...prev,
                playtimeSeconds: data.playtimeSeconds,
                playtimeFormatted: formatPlaytime(data.playtimeSeconds)
              };
            });
          }
        }
      } catch (err) {
        // Ignore background heartbeat network errors
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [token]);

  // Sign Up
  const signup = async (username: string, password: string, avatar?: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, avatar: avatar || '🦸‍♂️' })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        return { success: false, error: `Server communication failed (Status ${res.status}).` };
      }

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create account.' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      authenticateSocket(data.token);
      setUser(normalizeUserProfile(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error connecting to server.' };
    }
  };

  // Sign In
  const signin = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        return { success: false, error: `Server communication failed (Status ${res.status}).` };
      }

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials.' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      authenticateSocket(data.token);
      setUser(normalizeUserProfile(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error connecting to server.' };
    }
  };

  // Log Out
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  // Update Avatar / Fav Hero
  const updateAvatar = async (avatar: string, favoriteCharacterId?: string) => {
    if (!token) return { success: false, error: 'Not authenticated.' };

    try {
      const res = await fetch(`${API_BASE}/api/auth/update-avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar, favoriteCharacterId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update avatar.' };
      }

      setUser(normalizeUserProfile(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to connect to server.' };
    }
  };

  // Update Profile
  const updateProfile = async (username?: string, avatar?: string) => {
    if (!token) return { success: false, error: 'Not authenticated.' };

    try {
      const res = await fetch(`${API_BASE}/api/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, avatar })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update profile.' };
      }

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      }
      setUser(normalizeUserProfile(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to connect to server.' };
    }
  };

  // Update Custom Avatar & Bio
  const updateCustomAvatar = async (customAvatarUrl?: string, bio?: string, favoriteGameMode?: string) => {
    if (!token) return { success: false, error: 'Not authenticated.' };

    try {
      const res = await fetch(`${API_BASE}/api/ascension/custom-avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ customAvatarUrl, bio, favoriteGameMode })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update custom avatar.' };
      }

      setUser(normalizeUserProfile(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to connect to server.' };
    }
  };

  // Record Classic Match Outcome
  const recordMatchResult = async (
    params: MatchOutcomeParams,
    matchToken?: string
  ): Promise<MatchOutcomeResult | null> => {
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/api/auth/match-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...params,
          matchToken: matchToken || `match-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        })
      });

      if (!res.ok) return null;
      const data: MatchOutcomeResult = await res.json();

      if (data.success && data.user) {
        const normalized = normalizeUserProfile(data.user);
        setUser(normalized);
        if (data.leveledUp) {
          setLevelUpData({ oldLevel: data.oldLevel, newLevel: data.newLevel, user: normalized });
          setIsLevelUpOpen(true);
        }
        return data;
      }
    } catch (err) {
      console.error('[Auth] Failed to record match result:', err);
    }
    return null;
  };

  // Record Dungeon Progress
  const recordDungeonResult = async (
    wavesCleared: number,
    isVictory: boolean,
    matchToken?: string
  ): Promise<MatchOutcomeResult | null> => {
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/api/auth/dungeon-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          wavesCleared,
          isVictory,
          matchToken: matchToken || `dungeon-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        })
      });

      if (!res.ok) return null;
      const data: MatchOutcomeResult = await res.json();

      if (data.success && data.user) {
        const normalized = normalizeUserProfile(data.user);
        setUser(normalized);
        if (data.leveledUp) {
          setLevelUpData({ oldLevel: data.oldLevel, newLevel: data.newLevel, user: normalized });
          setIsLevelUpOpen(true);
        }
        return data;
      }
    } catch (err) {
      console.error('[Auth] Failed to record dungeon result:', err);
    }
    return null;
  };

  // 🗡️ Start Roguelite Dungeon Expedition
  const startDungeonExpedition = async (characterIds: string[], difficultyMode: string = 'EXPEDITION') => {
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/dungeon/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ characterIds, difficultyMode })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(normalizeUserProfile(data.user));
          return data;
        }
      } catch (err) {
        console.warn('[Auth] Server start failed, falling back to local expedition:', err);
      }
    }

    // Local / Offline fallback to ensure the expedition ALWAYS starts
    const localTeamData = characterIds.map(charId => {
      const lvl = user?.characterLevels?.[charId] || 1;
      const boosts = user?.characterStatsBoosts?.[charId] || { power: 0, hp: 0, defense: 0, speed: 0 };
      const eqRelics = user?.equippedRelics?.[charId] || [];
      const eqSkills = user?.equippedSkills?.[charId] || [];
      return {
        characterId: charId,
        ascensionLevel: lvl,
        boosts,
        equippedRelics: eqRelics,
        equippedSkills: eqSkills,
      };
    });

    return {
      success: true,
      teamData: localTeamData,
    };
  };

  // Save Active Dungeon Run
  const saveDungeonRun = async (runState: any) => {
    if (typeof window !== 'undefined' && runState) {
      try {
        localStorage.setItem('marvel_dungeon_active_run', JSON.stringify(runState));
      } catch (e) {
        console.error('[Auth] Failed to cache dungeon run locally:', e);
      }
    }

    if (!token) return { success: true };
    try {
      const res = await fetch(`${API_BASE}/api/dungeon/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ runState })
      });
      return await res.json();
    } catch (err) {
      console.error('[Auth] Failed to save dungeon run to server:', err);
      return { success: true }; // Local save succeeded
    }
  };

  // Get / Resume Active Dungeon Run
  const getActiveDungeonRun = async () => {
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/dungeon/active`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.runState && !data.runState.isGameOver && !data.runState.isComplete) {
            return data;
          }
        }
      } catch (err) {
        console.warn('[Auth] Server active run fetch failed, checking local storage:', err);
      }
    }

    // Local storage fallback
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('marvel_dungeon_active_run');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && !parsed.isGameOver && !parsed.isComplete) {
            return { success: true, runState: parsed };
          }
        }
      } catch (e) {
        console.error('[Auth] Failed to read local cached dungeon run:', e);
      }
    }

    return { success: false };
  };

  // Finalize Roguelite Dungeon Expedition
  const finalizeDungeonExpedition = async (runState: any, isVictory: boolean, matchToken?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('marvel_dungeon_active_run');
    }

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/dungeon/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            runState,
            isVictory,
            matchToken: matchToken || `dungeon-exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const normalized = normalizeUserProfile(data.user);
            setUser(normalized);
            if (data.leveledUp) {
              setLevelUpData({ oldLevel: data.oldLevel, newLevel: data.newLevel, user: normalized });
              setIsLevelUpOpen(true);
            }
            return data;
          }
        }
      } catch (err) {
        console.error('[Auth] Failed to finalize dungeon expedition on server:', err);
      }
    }

    // Local fallback reward calculation if offline
    if (user) {
      const floorReached = Number(runState?.currentFloor || runState?.maxFloorReached || 1);
      const elitesDefeated = Number(runState?.runStats?.elitesDefeated || 0);
      const bossesConquered = Number(runState?.runStats?.bossesConquered || 0);
      const astraAwarded = Math.max(100, Math.min(100000, floorReached * 120 + elitesDefeated * 250 + bossesConquered * 1000 + (isVictory ? 2500 : 0)));
      const shardsAwarded = Math.max(10, Math.floor(floorReached * 5 + elitesDefeated * 15 + bossesConquered * 50));
      const xpTotal = floorReached * 50 + (isVictory ? 500 : 0);

      const updatedUser: UserProfile = {
        ...user,
        astra: (user.astra || 0) + astraAwarded,
        ascensionCoins: (user.astra || 0) + astraAwarded,
        cardShards: (user.cardShards || 0) + shardsAwarded,
        xp: (user.xp || 0) + xpTotal,
        dungeonPeak: Math.max(user.dungeonPeak || 0, floorReached),
        dungeonMaxWave: Math.max(user.dungeonMaxWave || 0, floorReached),
        wins: user.wins + (isVictory ? 1 : 0),
        losses: user.losses + (isVictory ? 0 : 1),
      };

      setUser(updatedUser);
      return {
        success: true,
        user: updatedUser,
        astraAwarded,
        shardsAwarded,
        cratesAwarded: bossesConquered,
        xpAwarded: { total: xpTotal, reasons: [] },
      };
    }

    return null;
  };

  // ==========================================
  // 🌌 ASCENSION SPECIFIC CALLS (ASTRA)
  // ==========================================

  const claimDailyLogin = async () => {
    if (!token) return { success: false, error: 'Please sign in to claim daily rewards.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/claim-login`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const buyCharacter = async (characterId: string, cost: number) => {
    if (!token) return { success: false, error: 'Please sign in to purchase characters.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/buy-character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ characterId, cost })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const upgradeCharacter = async (characterId: string, isMythic: boolean) => {
    if (!token) return { success: false, error: 'Please sign in to upgrade characters.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/upgrade-character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ characterId, isMythic })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const buyRelic = async (relicId: string, cost: number) => {
    const price = Math.max(0, Number(cost) || 1000);
    const currentAstra = typeof user?.astra === 'number' ? user.astra : 0;
    if (currentAstra < price) {
      return { success: false, error: `Insufficient Astra. Required: ✨ ${price.toLocaleString()}, you have ✨ ${currentAstra.toLocaleString()}.` };
    }

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/ascension/buy-relic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ relicId, cost: price })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(normalizeUserProfile(data.user));
          return data;
        } else if (!data.success) {
          return data;
        }
      } catch (err: any) {
        console.warn('[Auth] Server buy-relic request failed, falling back to local update:', err);
      }
    }

    // Local / Offline persistent update
    if (user) {
      const owned = new Set(user.ownedRelics || []);
      if (owned.has(relicId)) {
        return { success: false, error: 'You already own this relic in your vault.' };
      }
      owned.add(relicId);
      const updatedUser: UserProfile = {
        ...user,
        astra: currentAstra - price,
        ascensionCoins: currentAstra - price,
        ownedRelics: Array.from(owned),
      };
      setUser(updatedUser);
      return { success: true, relicId, cost: price };
    }

    return { success: false, error: 'Unable to purchase relic.' };
  };

  const deductAstra = async (amount: number, reason?: string) => {
    const price = Math.max(0, Number(amount) || 0);
    const currentAstra = typeof user?.astra === 'number' ? user.astra : 0;
    if (currentAstra < price) {
      return { success: false, error: `Insufficient Astra. Required: ✨ ${price.toLocaleString()}, you have ✨ ${currentAstra.toLocaleString()}.` };
    }

    if (user) {
      const nextAstra = Math.max(0, currentAstra - price);
      const updatedUser: UserProfile = {
        ...user,
        astra: nextAstra,
        ascensionCoins: nextAstra,
      };
      setUser(updatedUser);

      // Save to server if token available
      if (token) {
        try {
          await fetch(`${API_BASE}/api/ascension/buy-relic`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ relicId: `custom-deduct-${Date.now()}`, cost: price })
          });
        } catch (e) {
          console.warn('[Auth] Astra sync error:', e);
        }
      }
      return { success: true };
    }
    return { success: false, error: 'User not available.' };
  };

  const buySkill = async (skillId: string, characterId: string, requiredLevel: number, cost: number) => {
    if (!token) return { success: false, error: 'Please sign in to buy skills.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/buy-skill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skillId, characterId, requiredLevel, cost })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const equipLoadout = async (characterId: string, relicIds: string[], skillIds: string[]) => {
    if (!token) return { success: false, error: 'Please sign in to equip loadouts.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/equip-loadout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ characterId, relicIds, skillIds })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const claimBattlePassReward = async (
    level: number,
    rewardType?: string,
    rewardAmount?: number,
    rewardItemId?: string
  ) => {
    if (!token) return { success: false, error: 'Please sign in to claim Battle Pass rewards.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/battlepass/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ level, rewardType, rewardAmount, rewardItemId })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const recordAscensionMatch = async (params: {
    isWin: boolean;
    matchFormat: '1v1' | '2v2' | '3v3' | '4v4' | '5v5' | 'custom';
    isRanked?: boolean;
    isMvp?: boolean;
    isComeback?: boolean;
    isFlawless?: boolean;
    damageDealt?: number;
    matchToken?: string;
  }) => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/api/ascension/match-record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err) {
      console.error('[Auth] Failed to record Ascension match:', err);
      return null;
    }
  };

  const sendGift = async (
    recipientUsername: string,
    giftType: 'COINS' | 'CHARACTER' | 'RELIC' | 'SKILL',
    itemId?: string,
    itemAmount?: number,
    message?: string
  ) => {
    if (!token) return { success: false, error: 'Please sign in to send gifts.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/gifting/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipientUsername, giftType, itemId, itemAmount, message })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  // 🎟️ Redeem Code
  const redeemCode = async (code: string) => {
    if (!token) return { success: false, error: 'Please sign in to redeem codes.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/redeem-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(normalizeUserProfile(data.user));
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  // ==========================================
  // 🔐 OWNER ADMIN ACTIONS
  // ==========================================

  const fetchAdminStats = async () => {
    if (!token) return { success: false, error: 'ACCESS DENIED: Not authenticated.' };
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const fetchAdminCodes = async () => {
    if (!token) return { success: false, error: 'ACCESS DENIED: Not authenticated.' };
    try {
      const res = await fetch(`${API_BASE}/api/admin/codes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const createAdminCode = async (payload: {
    code?: string;
    astraReward: number;
    rewardType?: 'ASTRA' | 'CHARACTER' | 'SHARD' | 'CRATE';
    rewardAmount?: number;
    characterId?: string;
    crateType?: string;
    maxUses: number;
    expiresAt: string;
    isActive?: boolean;
  }) => {
    if (!token) return { success: false, error: 'ACCESS DENIED: Not authenticated.' };
    try {
      const res = await fetch(`${API_BASE}/api/admin/codes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const toggleAdminCode = async (code: string, isActive: boolean) => {
    if (!token) return { success: false, error: 'ACCESS DENIED: Not authenticated.' };
    try {
      const res = await fetch(`${API_BASE}/api/admin/codes/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, isActive })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const deleteAdminCode = async (code: string) => {
    if (!token) return { success: false, error: 'ACCESS DENIED: Not authenticated.' };
    try {
      const res = await fetch(`${API_BASE}/api/admin/codes/${encodeURIComponent(code)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error.' };
    }
  };

  const closeLevelUpModal = () => {
    setIsLevelUpOpen(false);
  };

  // ==========================================
  // v4.0 — NEW SYSTEM ACTIONS
  // ==========================================

  const claimLevelCrate = async (level: number) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/progression/claim-crate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ level })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const craftCard = async (category: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/forge/craft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const awardMasteryXp = async (characterId: string, xp: number) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/mastery/award`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ characterId, xp })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const getDailyMissions = async () => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/missions/daily`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const claimDailyMission = async (missionId: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/missions/daily/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ missionId })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const getWeeklyChallenges = async () => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/missions/weekly`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const claimWeeklyChallenge = async (missionId: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/missions/weekly/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ missionId })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const getAchievements = async () => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/achievements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const claimAchievement = async (achievementId: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/achievements/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ achievementId })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const claimPlayerLevelReward = async (level: number) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/player-level/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ level })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: res.status === 404
            ? 'Level rewards are unavailable on the game server. Please restart or redeploy the backend.'
            : `Unable to claim reward (server returned ${res.status}).`,
        };
      }
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const spinMysteryWheel = async () => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/wheel/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const saveTeam = async (name: string, characterIds: string[], teamId?: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/teams/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, characterIds, teamId })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const deleteTeam = async (teamId: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/teams/${encodeURIComponent(teamId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const getTeams = async () => {
    if (!token) return { success: false, error: 'Please sign in.', teams: [] };
    try {
      const res = await fetch(`${API_BASE}/api/teams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.', teams: [] }; }
  };

  const adminGrantReward = async (targetUsername: string, rewardType: string, amount: number, characterId?: string) => {
    if (!token) return { success: false, error: 'ACCESS DENIED.' };
    try {
      const res = await fetch(`${API_BASE}/api/admin/grant-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ targetUsername, rewardType, amount, characterId })
      });
      return await res.json();
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const trackGameMode = async (mode: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/progression/track-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ mode })
      });
    } catch { /* silent fail */ }
  };

  const updateMissionProgress = async (eventType: string, amount: number = 1) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/missions/daily/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ eventType, amount })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
    } catch { /* silent fail */ }
  };

  const openCrate = async (crateType: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/crates/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ crateType })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const openAllCrates = async (crateType: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/crates/open-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ crateType })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const craftCharacterToken = async (category: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/tokens/craft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const redeemCharacterToken = async (category: string, characterId: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/tokens/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category, characterId })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const getOnboardingChoices = async () => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/onboarding/choices`, { headers: { 'Authorization': `Bearer ${token}` } });
      return await res.json();
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  const chooseOnboardingCharacter = async (characterId: string) => {
    if (!token) return { success: false, error: 'Please sign in.' };
    try {
      const res = await fetch(`${API_BASE}/api/onboarding/choose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ characterId })
      });
      const data = await res.json();
      if (data.success && data.user) setUser(normalizeUserProfile(data.user));
      return data;
    } catch (err: any) { return { success: false, error: err?.message || 'Network error.' }; }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isLevelUpOpen,
        levelUpData,
        closeLevelUpModal,
        signup,
        signin,
        logout,
        updateAvatar,
        updateProfile,
        updateCustomAvatar,
        recordMatchResult,
        recordDungeonResult,
        startDungeonExpedition,
        saveDungeonRun,
        getActiveDungeonRun,
        finalizeDungeonExpedition,
        refreshProfile,
        claimDailyLogin,
        buyCharacter,
        upgradeCharacter,
        buyRelic,
        deductAstra,
        buySkill,
        equipLoadout,
        claimBattlePassReward,
        recordAscensionMatch,
        sendGift,
        redeemCode,
        fetchAdminStats,
        fetchAdminCodes,
        createAdminCode,
        toggleAdminCode,
        deleteAdminCode,
        // v4.0
        claimLevelCrate,
        craftCard,
        awardMasteryXp,
        getDailyMissions,
        claimDailyMission,
        getWeeklyChallenges,
        claimWeeklyChallenge,
        getAchievements,
        claimAchievement,
        claimPlayerLevelReward,
        spinMysteryWheel,
        saveTeam,
        deleteTeam,
        getTeams,
        adminGrantReward,
        trackGameMode,
        updateMissionProgress,
        openCrate,
        openAllCrates,
        craftCharacterToken,
        redeemCharacterToken,
        getOnboardingChoices,
        chooseOnboardingCharacter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

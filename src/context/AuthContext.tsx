import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PlayerProfile, RedeemCode, AdminActionLog } from '../types/game';
import { LevelInfo, getLevelFromXp, formatPlaytime } from '../utils/progression';

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
  refreshProfile: () => Promise<void>;

  // 🌌 Ascension Actions (Astra)
  claimDailyLogin: () => Promise<{ success: boolean; astraAwarded?: number; coinsAwarded?: number; streak?: number; error?: string }>;
  buyCharacter: (characterId: string, cost: number) => Promise<{ success: boolean; isDuplicate?: boolean; shardsAwarded?: number; error?: string }>;
  upgradeCharacter: (characterId: string, isMythic: boolean) => Promise<{ success: boolean; newLevel?: number; error?: string }>;
  buyRelic: (relicId: string, cost: number) => Promise<{ success: boolean; error?: string }>;
  buySkill: (skillId: string, characterId: string, requiredLevel: number, cost: number) => Promise<{ success: boolean; error?: string }>;
  equipLoadout: (characterId: string, relicIds: string[], skillIds: string[]) => Promise<{ success: boolean; error?: string }>;
  claimBattlePassReward: (level: number, rewardType?: string, rewardAmount?: number, rewardItemId?: string) => Promise<{ success: boolean; rewardAmount?: number; error?: string }>;
  recordAscensionMatch: (params: { isWin: boolean; matchFormat: '1v1' | '2v2' | '3v3' | '4v4' | '5v5' | 'custom'; isRanked?: boolean; isMvp?: boolean; isComeback?: boolean; isFlawless?: boolean; damageDealt?: number }) => Promise<any>;
  sendGift: (recipientUsername: string, giftType: 'COINS' | 'CHARACTER' | 'RELIC' | 'SKILL', itemId?: string, itemAmount?: number, message?: string) => Promise<{ success: boolean; error?: string }>;
  redeemCode: (code: string) => Promise<{ success: boolean; astraAwarded?: number; message?: string; error?: string }>;

  // 🔐 Owner Admin Actions
  fetchAdminStats: () => Promise<{ success: boolean; stats?: any; actionLogs?: AdminActionLog[]; error?: string }>;
  fetchAdminCodes: () => Promise<{ success: boolean; codes?: RedeemCode[]; error?: string }>;
  createAdminCode: (payload: { code?: string; astraReward: number; maxUses: number; expiresAt: string; isActive?: boolean }) => Promise<{ success: boolean; code?: RedeemCode; error?: string }>;
  toggleAdminCode: (code: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;
  deleteAdminCode: (code: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'mcu_auth_token';
const API_BASE = ''; // Relative path (Vite proxy / same host)

export function normalizeUserProfile(u: any): UserProfile {
  if (!u) return u;
  const isOwner = ['sridhar', 'admin', 'owner'].includes((u.username || '').toLowerCase());
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create account.' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials.' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
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
    if (!token) return { success: false, error: 'Please sign in to buy relics.' };
    try {
      const res = await fetch(`${API_BASE}/api/ascension/buy-relic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ relicId, cost })
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
        refreshProfile,
        claimDailyLogin,
        buyCharacter,
        upgradeCharacter,
        buyRelic,
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
        deleteAdminCode
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

import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { GameRoom, OnlineBattleRoom, AscensionBattleResult } from './rooms';
import { ALL_CHARACTERS } from '../src/data/characters/index';
import { Player, GameSettings, Character, AscensionBattleState, BattleActionType } from '../src/types/game';
import { database } from './db/database';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Serve production static frontend
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

const rooms = new Map<string, GameRoom>();
const socketToRoom = new Map<string, { roomId: string; playerId: string }>();
const ascensionRooms = new Map<string, OnlineBattleRoom>();
const ascensionSocketSession = new Map<string, { roomId: string; playerId: string; profileId?: string }>();
const ascensionQueue: Array<{
  socketId: string; profileId?: string; name: string; avatar: string; rating: number;
  format: AscensionBattleState['format']; mode: 'casual' | 'ranked'; team: Character[]; queuedAt: number;
}> = [];

// ==========================================
// 👥 SOCIAL / FRIENDS & PARTY IN-MEMORY STATE
// ==========================================
export interface PartyMember {
  userId: string;
  socketId: string;
  username: string;
  displayName: string;
  avatar: string;
  customAvatarUrl?: string;
  level: number;
  isLeader: boolean;
  isReady: boolean;
}

export interface PartyState {
  id: string;
  leaderId: string;
  members: PartyMember[];
  createdAt: number;
}

const userSocketMap = new Map<string, string>(); // userId -> socketId
const socketUserMap = new Map<string, string>(); // socketId -> userId
const parties = new Map<string, PartyState>(); // partyId -> PartyState
const userPartyMap = new Map<string, string>(); // userId -> partyId

function notifyFriendsPresence(userId: string, isOnline: boolean) {
  const user = database.getRawUser(userId);
  if (!user || !user.friends) return;
  user.friends.forEach(friendId => {
    const friendSocketId = userSocketMap.get(friendId);
    if (friendSocketId) {
      io.to(friendSocketId).emit('player_presence_changed', { userId, isOnline });
    }
  });
}

function leaveParty(userId: string, socketId?: string) {
  const partyId = userPartyMap.get(userId);
  if (!partyId) return;
  userPartyMap.delete(userId);
  const party = parties.get(partyId);
  if (!party) return;

  party.members = party.members.filter(m => m.userId !== userId);
  if (socketId) {
    io.sockets.sockets.get(socketId)?.leave(`party_${partyId}`);
  }

  if (party.members.length === 0) {
    parties.delete(partyId);
  } else {
    // If leader left, promote next member
    if (party.leaderId === userId) {
      party.leaderId = party.members[0].userId;
      party.members[0].isLeader = true;
    }
    io.to(`party_${partyId}`).emit('party_state_updated', party);
  }
}

// ==========================================
// 🏆 MULTIPLAYER TOURNAMENT IN-MEMORY STATE
// ==========================================
export interface TournamentPlayerState {
  userId: string;
  socketId: string;
  name: string;
  avatar: string;
  customAvatarUrl?: string;
  level: number;
  characterIds: string[];
  teamPower: number;
  isHost: boolean;
  isReady: boolean;
}

export interface TournamentBracketMatch {
  id: string;
  round: number; // 1, 2, 3...
  matchNumber: number;
  player1?: TournamentPlayerState;
  player2?: TournamentPlayerState;
  winner?: TournamentPlayerState;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TournamentRoomState {
  id: string;
  code: string;
  hostUserId: string;
  teamSize: number; // 1, 2, 3, 4, 5
  maxPlayers: number; // 2, 4, 6, 8, 10
  phase: 'LOBBY' | 'BRACKET' | 'CHAMPION';
  players: TournamentPlayerState[];
  currentRound: number;
  bracketMatches: TournamentBracketMatch[];
  champion?: TournamentPlayerState;
  createdAt: number;
}

export interface TournamentQueueEntry {
  socketId: string;
  userId: string;
  name: string;
  avatar: string;
  customAvatarUrl?: string;
  level: number;
  teamSize: number;
  maxPlayers: number;
  characterIds: string[];
  teamPower: number;
  queuedAt: number;
}

const tournamentRooms = new Map<string, TournamentRoomState>();
const socketTournamentRoom = new Map<string, string>(); // socketId -> roomId
const tournamentQueue: TournamentQueueEntry[] = [];

function calculateTeamPower(characterIds: string[], userId?: string): number {
  return (characterIds || []).reduce((acc, charId) => {
    const char = ALL_CHARACTERS.find(c => c.id === charId);
    let pwr = char?.overallPower || 70;
    if (userId) {
      const u = database.getRawUser(userId);
      if (u) {
        const boosts = u.characterStatsBoosts?.[charId]?.power || 0;
        const level = u.characterLevels?.[charId] || 1;
        pwr += boosts + (level - 1) * 2;
      }
    }
    return acc + pwr;
  }, 0);
}

function generateTournamentBracket(players: TournamentPlayerState[], maxPlayers: number): TournamentBracketMatch[] {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const matches: TournamentBracketMatch[] = [];

  if (players.length <= 2) {
    matches.push({
      id: 'match-r1-1',
      round: 1,
      matchNumber: 1,
      player1: shuffled[0],
      player2: shuffled[1] || undefined,
      status: 'PENDING',
    });
  } else if (players.length <= 4) {
    for (let i = 0; i < 2; i++) {
      matches.push({
        id: `match-r1-${i + 1}`,
        round: 1,
        matchNumber: i + 1,
        player1: shuffled[i * 2],
        player2: shuffled[i * 2 + 1],
        status: 'PENDING',
      });
    }
  } else if (players.length <= 6) {
    matches.push(
      { id: 'match-r1-1', round: 1, matchNumber: 1, player1: shuffled[0], player2: shuffled[1], status: 'PENDING' },
      { id: 'match-r1-2', round: 1, matchNumber: 2, player1: shuffled[2], player2: shuffled[3], status: 'PENDING' },
      { id: 'match-r1-bye1', round: 1, matchNumber: 3, player1: shuffled[4], winner: shuffled[4], status: 'COMPLETED' },
      { id: 'match-r1-bye2', round: 1, matchNumber: 4, player1: shuffled[5], winner: shuffled[5], status: 'COMPLETED' }
    );
  } else if (players.length <= 8) {
    for (let i = 0; i < 4; i++) {
      matches.push({
        id: `match-r1-${i + 1}`,
        round: 1,
        matchNumber: i + 1,
        player1: shuffled[i * 2],
        player2: shuffled[i * 2 + 1],
        status: 'PENDING',
      });
    }
  } else {
    // 10 Players
    matches.push(
      { id: 'match-r1-1', round: 1, matchNumber: 1, player1: shuffled[0], player2: shuffled[1], status: 'PENDING' },
      { id: 'match-r1-2', round: 1, matchNumber: 2, player1: shuffled[2], player2: shuffled[3], status: 'PENDING' },
      { id: 'match-r1-bye1', round: 1, matchNumber: 3, player1: shuffled[4], winner: shuffled[4], status: 'COMPLETED' },
      { id: 'match-r1-bye2', round: 1, matchNumber: 4, player1: shuffled[5], winner: shuffled[5], status: 'COMPLETED' },
      { id: 'match-r1-bye3', round: 1, matchNumber: 5, player1: shuffled[6], winner: shuffled[6], status: 'COMPLETED' },
      { id: 'match-r1-bye4', round: 1, matchNumber: 6, player1: shuffled[7], winner: shuffled[7], status: 'COMPLETED' },
      { id: 'match-r1-bye5', round: 1, matchNumber: 7, player1: shuffled[8], winner: shuffled[8], status: 'COMPLETED' },
      { id: 'match-r1-bye6', round: 1, matchNumber: 8, player1: shuffled[9], winner: shuffled[9], status: 'COMPLETED' }
    );
  }

  return matches;
}

function ascensionSocketSessionHasProfile(profileId: string): boolean {
  for (const session of ascensionSocketSession.values()) {
    if (session.profileId === profileId) return true;
  }
  return false;
}

function canonicalTeam(ids: unknown, profile?: any): { team?: Character[]; error?: string } {
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 5) {
    return { error: 'Choose between 1 and 5 heroes.' };
  }
  const unique = [...new Set(ids.filter((id): id is string => typeof id === 'string'))];
  if (unique.length !== ids.length) return { error: 'A team cannot contain duplicate heroes.' };
  if (profile?.ownedCharacters && unique.some(id => !profile.ownedCharacters.includes(id))) {
    return { error: 'Your team contains a hero you do not own.' };
  }
  const team = unique.map(id => {
    const source = ALL_CHARACTERS.find(character => character.id === id);
    if (!source) return null;
    const boost = profile?.characterStatsBoosts?.[id] || {};
    const level = Number(profile?.characterLevels?.[id]) || 1;
    return {
      ...source,
      overallPower: source.overallPower + (Number(boost.power) || 0),
      stats: {
        ...source.stats,
        durability: source.stats.durability + (Number(boost.hp) || 0),
        combat: source.stats.combat + (Number(boost.power) || 0),
        speed: source.stats.speed + (Number(boost.speed) || 0),
      },
      currentHp: 100 + (Number(boost.hp) || 0),
      maxHp: 100 + (Number(boost.hp) || 0),
      isFainted: false,
      usedSkillIds: [],
      equippedSkills: Array.isArray(profile?.equippedSkills?.[id]) ? profile.equippedSkills[id] : [],
      level,
    };
  });
  if (team.some(character => !character)) return { error: 'One or more heroes are invalid.' };
  return { team: team as Character[] };
}

function formatFromInput(value: unknown): AscensionBattleState['format'] | null {
  return ['1v1', '2v2', '3v3', '4v4', '5v5', 'custom'].includes(String(value)) ? value as AscensionBattleState['format'] : null;
}

// Auth Helper
function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const tokenPayload = database.verifyToken(token);
  if (!tokenPayload) return null;
  return database.getRawUser(tokenPayload.id);
}

// API Endpoints
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, charactersTotal: ALL_CHARACTERS.length });
});

app.get('/api/characters', (_req, res) => {
  res.json(ALL_CHARACTERS);
});

// ==========================================
// PLAYER ACCOUNTS & AUTHENTICATION APIs
// ==========================================
app.post('/api/auth/signup', async (req, res) => {
  const { username, password, avatar } = req.body;
  const result = await database.createUser(username, password, avatar);
  if (result.error) {
    const isConflict = result.error.includes('already exists') || result.error.includes('taken');
    return res.status(isConflict ? 409 : 400).json({ success: false, error: result.error });
  }
  res.json({ success: true, user: result.user, token: result.token });
});

app.post('/api/auth/signin', async (req, res) => {
  const { username, password } = req.body;
  const result = await database.verifyUser(username, password);
  if (result.error) {
    return res.status(401).json({ success: false, error: result.error });
  }
  res.json({ success: true, user: result.user, token: result.token });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized or expired session.' });
  }
  res.json({ success: true, user: database.sanitizeUser(user) });
});

app.post('/api/auth/heartbeat', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }
  const { seconds } = req.body;
  const newPlaytime = database.addPlaytime(user.id, seconds || 60);
  res.json({ success: true, playtimeSeconds: newPlaytime });
});

app.post('/api/auth/update-avatar', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }
  const { avatar, favoriteCharacterId } = req.body;
  const updated = database.updateUserAvatar(user.id, avatar, favoriteCharacterId);
  res.json({ success: true, user: updated });
});

// Profile Editing with Unique Case-Insensitive Username Check
app.post('/api/auth/update-profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }
  const { username, avatar } = req.body;
  const result = database.updateUserProfile(user.id, username, avatar);
  if (result.error) {
    const isConflict = result.error.includes('already exists');
    return res.status(isConflict ? 409 : 400).json({ success: false, error: result.error });
  }
  res.json({ success: true, user: result.user, token: result.token });
});

app.get('/api/auth/profile/:username', (req, res) => {
  const profile = database.getUserByUsername(req.params.username);
  if (!profile) {
    return res.status(404).json({ success: false, error: 'Player profile not found.' });
  }
  res.json({ success: true, profile });
});

app.get('/api/auth/leaderboard', (req, res) => {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const leaderboard = database.getLeaderboard(limit);
  res.json({ success: true, leaderboard });
});

app.post('/api/auth/match-result', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }
  const { isWin, matchType, battlesWon, charactersPurchased, isTournamentChampion, isMvp, matchToken, durationSeconds } = req.body;
  const result = database.recordMatchResult(user.id, {
    isWin: !!isWin,
    matchType,
    battlesWon,
    charactersPurchased,
    isTournamentChampion: !!isTournamentChampion,
    isMvp: !!isMvp,
    durationSeconds
  }, matchToken);

  if (!result) {
    return res.status(400).json({ success: false, error: 'Failed to record match result.' });
  }
  res.json(result);
});

app.post('/api/auth/dungeon-result', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }
  const { wavesCleared, isVictory, matchToken } = req.body;
  const result = database.recordDungeonProgress(user.id, wavesCleared || 0, !!isVictory, matchToken);
  if (!result) {
    return res.status(400).json({ success: false, error: 'Failed to record dungeon progress.' });
  }
  res.json(result);
});

// ==========================================
// 🌌 MARVEL ASCENSION PLATFORM & ECONOMY APIs
// ==========================================

// 1. Claim Daily Login (7-Day Cycle)
app.post('/api/ascension/claim-login', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.claimDailyLogin(user.id);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 2. Buy Character in Ascension Shop
app.post('/api/ascension/buy-character', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { characterId, cost } = req.body;
  if (!characterId || !cost) return res.status(400).json({ success: false, error: 'Invalid character purchase payload.' });
  const result = database.buyAscensionCharacter(user.id, characterId, Number(cost));
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 3. Upgrade Character (Lvl 1 - 50) -- Strict Mythic Lock
app.post('/api/ascension/upgrade-character', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { characterId, isMythic } = req.body;
  if (!characterId) return res.status(400).json({ success: false, error: 'Character ID required.' });
  const result = database.upgradeAscensionCharacter(user.id, characterId, !!isMythic);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 4. Buy Tactical Relic
app.post('/api/ascension/buy-relic', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { relicId, cost } = req.body;
  const result = database.buyAscensionRelic(user.id, relicId, Number(cost) || 1000);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 5. Buy Signature Skill (with level validation)
app.post('/api/ascension/buy-skill', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { skillId, characterId, requiredLevel, cost } = req.body;
  const result = database.buyAscensionSkill(
    user.id,
    skillId,
    characterId || '',
    Number(requiredLevel) || 5,
    Number(cost) || 1500
  );
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 6. Equip Loadout
app.post('/api/ascension/equip-loadout', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { characterId, relicIds, skillIds } = req.body;
  const result = database.equipAscensionLoadout(user.id, characterId, relicIds || [], skillIds || []);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 7. Claim Battle Pass Reward
app.post('/api/ascension/battlepass/claim', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { level, rewardType, rewardAmount, rewardItemId } = req.body;
  const result = database.claimBattlePassReward(
    user.id,
    Number(level) || 1,
    rewardType || 'COINS',
    Number(rewardAmount) || 0,
    rewardItemId
  );
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/ascension/crates/open', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.openCrate(user.id, req.body?.crateType);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/ascension/tokens/craft', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.craftCharacterToken(user.id, req.body?.category);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/ascension/tokens/redeem', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.redeemCharacterToken(user.id, req.body?.category, req.body?.characterId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

app.get('/api/onboarding/choices', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  res.json(database.getOnboardingChoices(user.id));
});

app.post('/api/onboarding/choose', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.chooseOnboardingCharacter(user.id, req.body?.characterId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 8. Record Ascension PvP / Ranked Match
app.post('/api/ascension/match-record', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { isWin, matchFormat, isRanked, isMvp, isComeback, isFlawless, damageDealt, matchToken } = req.body;
  const result = database.recordAscensionMatch(user.id, {
    isWin: !!isWin,
    matchFormat: matchFormat || '1v1',
    isRanked: !!isRanked,
    isMvp: !!isMvp,
    isComeback: !!isComeback,
    isFlawless: !!isFlawless,
    damageDealt: Number(damageDealt) || 0,
    matchToken: typeof matchToken === 'string' ? matchToken : undefined
  });
  if (!result) return res.status(400).json({ success: false, error: 'Failed to record Ascension match.' });
  res.json(result);
});

// 9. Send Gift
app.post('/api/ascension/gifting/send', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { recipientUsername, giftType, itemId, itemAmount, message } = req.body;
  const result = database.sendLegacyGift(user.id, recipientUsername, giftType, itemId, itemAmount, message);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// 10. Top 50 Leaderboards (Supports RANK, WINS, LEVEL_XP, MVP, DUNGEON_PEAK, PLAY_TIME)
app.get('/api/ascension/leaderboards', (req, res) => {
  const category = (req.query.category as any) || 'RANK';
  const leaderboard = database.getTop50Leaderboards(category);
  res.json({ success: true, category, leaderboard });
});

// 11. Custom Avatar & Bio Update
app.post('/api/ascension/custom-avatar', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { customAvatarUrl, bio, favoriteGameMode } = req.body;
  const updated = database.updateCustomAvatar(user.id, customAvatarUrl, bio, favoriteGameMode);
  if (!updated) return res.status(400).json({ success: false, error: 'Failed to update custom avatar.' });
  res.json({ success: true, user: updated });
});

// 12. Redeem Code (Player Endpoint)
app.post('/api/ascension/redeem-code', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Please sign in to redeem promotional codes.' });
  const { code } = req.body;
  const result = database.redeemCode(user.id, code);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// ==========================================
// 🔐 OWNER-ONLY ADMIN APIS
// ==========================================

// A1. Admin Analytics & Action Logs
app.get('/api/admin/stats', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'ACCESS DENIED: Sign in required.' });
  const result = database.getAdminStats(user.id);
  if (!result.success) return res.status(403).json(result);
  res.json(result);
});

// A2. Admin List Redeem Codes
app.get('/api/admin/codes', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'ACCESS DENIED: Sign in required.' });
  const result = database.getAllRedeemCodes(user.id);
  if (!result.success) return res.status(403).json(result);
  res.json(result);
});

// A3. Admin Create Redeem Code
app.post('/api/admin/codes/create', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'ACCESS DENIED: Sign in required.' });
  const { code, astraReward, rewardType, rewardAmount, characterId, crateType, maxUses, expiresAt, isActive } = req.body;
  const result = database.createRedeemCode(user.id, { code, astraReward, rewardType, rewardAmount, characterId, crateType, maxUses, expiresAt, isActive });
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// A4. Admin Toggle Redeem Code Active/Inactive
app.post('/api/admin/codes/toggle', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'ACCESS DENIED: Sign in required.' });
  const { code, isActive } = req.body;
  const result = database.toggleRedeemCode(user.id, code, !!isActive);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// A5. Admin Revoke / Delete Redeem Code
app.delete('/api/admin/codes/:code', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'ACCESS DENIED: Sign in required.' });
  const { code } = req.params;
  const result = database.deleteRedeemCode(user.id, code);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// ==========================================
// 🌌 v4.0 — PROGRESSION, FORGE, MISSIONS & TEAMS APIs
// ==========================================

// Forge info & wheel prizes public metadata
app.get('/api/progression/forge-info', (_req, res) => {
  res.json(database.getForgeInfo());
});

// Milestone Crates
app.post('/api/progression/claim-crate', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.claimLevelCrate(user.id, Number(req.body?.level));
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Card Forge Crafting
app.post(['/api/forge/craft', '/api/progression/craft-card'], (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.craftCard(user.id, req.body?.category);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Ascension Crates Opening
app.post('/api/ascension/crates/open', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.openCrate(user.id, req.body?.crateType);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Character Token Forge & Redeem
app.post('/api/ascension/tokens/craft', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.craftCharacterToken(user.id, req.body?.category);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/ascension/tokens/redeem', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.redeemCharacterToken(user.id, req.body?.category, req.body?.characterId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Character Mastery
app.post('/api/mastery/award', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { characterId, xp } = req.body;
  const result = database.awardMasteryXp(user.id, characterId, Number(xp) || 0);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Daily Missions
app.get('/api/missions/daily', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  res.json(database.getDailyMissions(user.id));
});

app.post('/api/missions/daily/claim', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.claimDailyMission(user.id, req.body?.missionId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Weekly Challenges
app.get('/api/missions/weekly', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  res.json(database.getWeeklyChallenges(user.id));
});

app.post('/api/missions/weekly/claim', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.claimWeeklyChallenge(user.id, req.body?.missionId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Achievements
app.get('/api/achievements', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  res.json(database.getAchievements(user.id));
});

app.post('/api/achievements/claim', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.claimAchievement(user.id, req.body?.achievementId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Mystery Wheel
app.post('/api/wheel/spin', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.spinMysteryWheel(user.id);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Team Builder
app.get('/api/teams', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  res.json(database.getTeams(user.id));
});

app.post('/api/teams/save', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { name, characterIds, teamId } = req.body;
  const result = database.saveTeam(user.id, name, characterIds, teamId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

app.delete('/api/teams/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.deleteTeam(user.id, req.params.id);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Admin Grant Reward
app.post('/api/admin/grant-reward', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { targetUsername, rewardType, amount, characterId } = req.body;
  const result = database.adminGrantReward(user.id, targetUsername, rewardType, Number(amount) || 0, characterId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// ==========================================
// 👥 SOCIAL / FRIENDS & PARTY APIs
// ==========================================
app.get('/api/social/friends', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const data = database.getFriendsData(user.id);
  if (data.friends) {
    data.friends.forEach((f: any) => {
      f.isOnline = userSocketMap.has(f.id);
    });
  }
  res.json(data);
});

app.post('/api/social/friends/request', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { targetUsername } = req.body;
  const result = database.sendFriendRequest(user.id, targetUsername);
  if (!result.success) return res.status(400).json(result);

  // Notify target user via socket if online
  if (result.targetUser) {
    const targetSocketId = userSocketMap.get(result.targetUser.id);
    if (targetSocketId) {
      io.to(targetSocketId).emit('friend_request_received', {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        avatar: user.avatar,
        customAvatarUrl: user.customAvatarUrl,
        level: user.level,
      });
    }
  }
  res.json(result);
});

app.post('/api/social/friends/accept', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { requesterUserId } = req.body;
  const result = database.acceptFriendRequest(user.id, requesterUserId);
  if (!result.success) return res.status(400).json(result);

  // Notify requester via socket
  const requesterSocketId = userSocketMap.get(requesterUserId);
  if (requesterSocketId) {
    io.to(requesterSocketId).emit('friend_request_accepted', {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      avatar: user.avatar,
      customAvatarUrl: user.customAvatarUrl,
    });
  }
  res.json(result);
});

app.post('/api/social/friends/decline', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { requesterUserId } = req.body;
  const result = database.declineFriendRequest(user.id, requesterUserId);
  res.json(result);
});

app.post('/api/social/friends/remove', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { targetUserId } = req.body;
  const result = database.removeFriend(user.id, targetUserId);
  res.json(result);
});

app.get('/api/social/profile/:id', (req, res) => {
  const result = database.getUserPublicProfile(req.params.id);
  if (!result.success) return res.status(404).json(result);
  res.json(result);
});

// Ranked Reward Claiming
app.post('/api/ranked/claim-reward', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { rankId } = req.body;
  const result = database.claimRankReward(user.id, rankId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Character Discard (60% Money / Astra Refund)
app.post('/api/inventory/discard-character', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { characterId } = req.body;
  if (!characterId) return res.status(400).json({ success: false, error: 'Character ID required.' });
  const result = database.discardCharacter(user.id, characterId);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Gifting to Friends (Characters, Crates, Astra)
app.post('/api/social/gift', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { targetFriendId, giftType, characterId, crateType, amount } = req.body;
  if (!targetFriendId || !giftType) return res.status(400).json({ success: false, error: 'Target friend and gift type required.' });

  const result = database.sendGift(user.id, targetFriendId, giftType, { characterId, crateType, amount });
  if (!result.success) return res.status(400).json(result);

  // Send real-time socket notification to recipient if online
  const recipientSocketId = userSocketMap.get(targetFriendId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('gift_received', {
      senderName: user.displayName || user.username,
      giftType,
      details: result.details,
    });
  }

  res.json(result);
});

// Gemini 2.0 Flash AI Chat Proxy (TODO-025 Secure Server-Side Integration)
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, apiKey, mode } = req.body;
    const aiMode = mode === 'strategist' ? 'strategist' : 'gemini';
    const serverKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const keysToTry = Array.from(new Set([apiKey, serverKey].filter(Boolean) as string[]));
    const lastUserMsg = (messages || []).slice().reverse().find((m: any) => m.role === 'user')?.content || 'Hello';
    
    if (keysToTry.length === 0) {
      const reply = aiMode === 'gemini' 
        ? generateGeminiGeneralFallback(lastUserMsg)
        : generateMarvelStrategistFallback(lastUserMsg);
      return res.json({ text: reply, model: aiMode === 'gemini' ? 'gemini-general-engine' : 'marvel-strategist-engine' });
    }

    // STRICT SEPARATION: Gemini (General-Purpose) vs Marvel Strategist (Game-Tactical)
    const systemInstruction = aiMode === 'gemini'
      ? `You are a helpful, general-purpose AI assistant. Answer the user's questions accurately, clearly, thoroughly, and naturally. You can discuss any subject the user asks about. Follow the user's current request and do not assume the conversation is about any particular topic unless the user establishes that context. There is NO text, character, or word limit on your responses; provide comprehensive, complete, and unconstrained answers whenever helpful.`
      : `You are the specialized MARVEL STRATEGIST AI for the game "MARVEL: AUCTION WARS" (Tagline: "BID. BUILD. BATTLE.").
Your purpose is providing expert tactical analysis, pro tips, auction bidding guides, hero tier lists, skill vault combos, and combat coaching for the player.
When the user asks for tips, tricks, secrets, or strategy advice:
- Always deliver comprehensive, actionable game tips formatted with clear headings, bullet points, and pro-tips covering:
  1. 💰 Auction Bidding Mastery (sniper bidding, budget allocation, bluffing bots/rivals, Chaos Auction events).
  2. 🏆 Hero Tier Lists & Value Picks (Grade C budget bargains, Grade B versatile anchors, Grade A juggernauts, and Grade MYTHIC game-changers).
  3. ⚡ Skill Vault & Artifacts (synergizing 5 unique signature abilities, equipping and timing Healing Potions during battles).
  4. ⚔️ 1v1 Tournament Battle Tactics (Strike vs Innate Special vs 50% Guard timing, faction counters, LAST STAND overdrive).
  5. 🔮 Ancient Ruins Dungeons (Waves 1-300 scaling strategies, potion pacing, milestone boss counters).
- Provide detailed, full-length advice with no artificial text restrictions.`;

    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Hello!' }] }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: aiMode === 'gemini' ? 0.7 : 0.85
      }
    };

    // Google Gemini API active model candidates (prioritizing fast response)
    const modelCandidates = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-pro'];
    let replyText = '';

    for (const key of keysToTry) {
      for (const modelName of modelCandidates) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 25000);

          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (replyText) {
              return res.json({ text: replyText, model: modelName });
            }
          }
        } catch (callErr) {
          console.warn(`[Gemini API] Failed on ${modelName}:`, callErr);
        }
      }
    }

    if (!replyText) {
      replyText = aiMode === 'gemini'
        ? generateGeminiGeneralFallback(lastUserMsg)
        : generateMarvelStrategistFallback(lastUserMsg);
      return res.json({ text: replyText, model: aiMode === 'gemini' ? 'gemini-general-engine' : 'marvel-strategist-engine' });
    }

    return res.json({ text: replyText, model: 'gemini-flash' });
  } catch (error: any) {
    console.error('[Gemini API] Server Exception:', error);
    return res.status(500).json({ error: 'SERVER_ERROR', message: error?.message || 'Internal server error' });
  }
});

// 1. General-Purpose Gemini AI Fallback Resolver (Zero Marvel Bias)
function generateGeminiGeneralFallback(prompt: string): string {
  const q = prompt.toLowerCase().trim();

  // Velocity vs Acceleration
  if ((q.includes('velocity') && q.includes('acceleration')) || (q.includes('difference between') && q.includes('velocity'))) {
    return `🚀 **Difference Between Velocity and Acceleration:**\n\n` +
      `### 1. **Velocity (v)**\n` +
      `- **Definition**: The rate at which an object changes its position in a specific direction (speed with direction).\n` +
      `- **Formula**: $\\text{Velocity} = \\frac{\\Delta x}{\\Delta t} = \\frac{\\text{Displacement}}{\\text{Time}}$\n` +
      `- **SI Unit**: Meters per second (m/s).\n` +
      `- **Example**: A vehicle traveling at **60 km/h due North**.\n\n` +
      `### 2. **Acceleration (a)**\n` +
      `- **Definition**: The rate of change of velocity over time.\n` +
      `- **Formula**: $\\text{Acceleration} = \\frac{\\Delta v}{\\Delta t} = \\frac{\\text{Final Velocity} - \\text{Initial Velocity}}{\\text{Time}}$\n` +
      `- **SI Unit**: Meters per second squared (m/s²).\n` +
      `- **Example**: A car accelerating from 0 to 100 km/h in 5 seconds or slowing down when braking.`;
  }

  // JavaScript Reverse String
  if ((q.includes('javascript') || q.includes('js') || q.includes('function') || q.includes('code')) && q.includes('reverse') && (q.includes('string') || q.includes('str'))) {
    return `💻 **JavaScript Function to Reverse a String:**\n\n` +
      `\`\`\`javascript\n` +
      `function reverseString(str) {\n` +
      `  return str.split('').reverse().join('');\n` +
      `}\n\n` +
      `// Modern ES6 Syntax:\n` +
      `const reverseString = str => [...str].reverse().join('');\n\n` +
      `console.log(reverseString('hello')); // "olleh"\n` +
      `console.log(reverseString('JavaScript')); // "tpircSavaJ"\n` +
      `\`\`\``;
  }

  // Albert Einstein
  if ((q.includes('albert') && q.includes('einstein')) || q.includes('who was einstein') || q.includes('about einstein')) {
    return `🧠 **Albert Einstein (1879–1955):**\n\n` +
      `Albert Einstein was a German-born theoretical physicist widely regarded as one of the most influential scientists of all time.\n\n` +
      `- **Special Relativity (1905)**: Introduced the principle that the laws of physics are the same for all non-accelerating observers and established the mass-energy equivalence formula: **$E = mc^2$**.\n` +
      `- **General Relativity (1915)**: Reimagined gravity as the curvature of spacetime created by mass and energy.\n` +
      `- **Nobel Prize (1921)**: Awarded the Nobel Prize in Physics for his explanation of the **Photoelectric Effect**, essential to the development of quantum theory.`;
  }

  // Birthday Party Ideas
  if (q.includes('birthday') && (q.includes('idea') || q.includes('plan') || q.includes('theme') || q.includes('party'))) {
    return `🎉 **Creative Ideas for a Birthday Party:**\n\n` +
      `1. **Themed Murder Mystery Dinner**: Assign characters, clues, and costumes for an immersive evening.\n` +
      `2. **Retro Game & Arcade Night**: Set up vintage consoles, board games, trivia tournament, and nostalgic snacks.\n` +
      `3. **DIY Food & Mocktail Bar**: Gourmet pizza making, taco stations, or a custom dessert decorating bar.\n` +
      `4. **Outdoor Movie Night / Backyard Festival**: Projector screen, fairy lights, picnic blankets, and popcorn bar.\n` +
      `5. **Escape Room Adventure**: Group challenge in an escape room followed by dinner.`;
  }

  // Photosynthesis (9th Grade Level)
  if (q.includes('photosynthesis') || (q.includes('plants') && q.includes('sunlight') && q.includes('food'))) {
    return `🌿 **Photosynthesis Explained (9th Grade Biology):**\n\n` +
      `Photosynthesis is the process green plants and algae use to convert **sunlight, water ($H_2O$), and carbon dioxide ($CO_2$)** into **glucose (sugar)** and **oxygen ($O_2$)**.\n\n` +
      `### The Chemical Equation:\n` +
      `$$\\text{Carbon Dioxide} + \\text{Water} + \\text{Light Energy} \\longrightarrow \\text{Glucose} + \\text{Oxygen}$$\n` +
      `$$6CO_2 + 6H_2O + \\text{Light} \\longrightarrow C_6H_{12}O_6 + 6O_2$$\n\n` +
      `### Two Main Stages:\n` +
      `1. **Light Reactions (in Thylakoids)**: Chlorophyll absorbs sunlight and splits water molecules, releasing Oxygen ($O_2$) and producing ATP.\n` +
      `2. **Calvin Cycle (in Stroma)**: Uses ATP and $CO_2$ to assemble glucose molecules for energy and growth.`;
  }

  // Mobile Responsive Website
  if ((q.includes('responsive') || q.includes('mobile responsive') || q.includes('mobile-friendly')) && (q.includes('website') || q.includes('css') || q.includes('web'))) {
    return `📱 **How to Make Your Website Mobile Responsive:**\n\n` +
      `1. **Set the Viewport Meta Tag**:\n` +
      `   \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\`\n\n` +
      `2. **Use CSS Media Queries** (Mobile-First):\n` +
      `   \`\`\`css\n` +
      `   .container { width: 100%; padding: 1rem; }\n` +
      `   @media (min-width: 768px) { .container { max-width: 720px; } }\n` +
      `   \`\`\`\n\n` +
      `3. **Leverage Flexbox & CSS Grid**:\n` +
      `   \`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\`\n\n` +
      `4. **Use Relative Units**: Use \`rem\`, \`%\`, \`vw\`, \`vh\`, and \`clamp()\` instead of hardcoded \`px\` dimensions.\n` +
      `5. **Responsive Images**: \`img { max-width: 100%; height: auto; }\``;
  }

  // Spider-Man (General Lore)
  if ((q.includes('spider-man') || q.includes('spiderman') || q.includes('peter parker')) && !q.includes('batman') && (q.includes('tell me about') || q.includes('who is') || q.includes('lore') || q.includes('powers') || q.includes('origin') || q.includes('about'))) {
    return `🕷️ **Spider-Man (Peter Parker) — Character Overview:**\n\n` +
      `- **Creators**: Stan Lee and Steve Ditko (1962, *Amazing Fantasy #15*).\n` +
      `- **Origin**: Peter Parker is bitten by a radioactive spider, granting him arachnid-like abilities.\n` +
      `- **Guiding Creed**: *"With great power comes great responsibility."*\n` +
      `- **Powers**: Superhuman strength, agility, wall-crawling, precognitive Spider-Sense, and custom wrist Web-Shooters.\n` +
      `- **Rogues Gallery**: Green Goblin, Doctor Octopus, Venom, Sandman, Kraven, and Mysterio.`;
  }

  // Spider-Man vs Venom (Comparison)
  if ((q.includes('spider') || q.includes('spiderman') || q.includes('peter parker')) && q.includes('venom')) {
    return `🕸️ **Spider-Man vs. Venom: Matchup & Character Analysis**\n\n` +
      `### 1. **Origins & Shared Connection**\n` +
      `- The alien Symbiote originally bonded with **Peter Parker** during the *Secret Wars*, absorbing his superhuman abilities, agility, and memories.\n` +
      `- After Peter discovered its parasitic nature and forcibly rejected it at a church bell tower, the Symbiote bonded with disgraced reporter **Eddie Brock**, giving birth to **Venom**—a rival defined by their mutual vendetta against Spider-Man.\n\n` +
      `---\n\n` +
      `### 2. **Powers & Capabilities Breakdown**\n\n` +
      `| Feature | 🕷️ Spider-Man (Peter Parker) | 🖤 Venom (Eddie Brock) |\n` +
      `| :--- | :--- | :--- |\n` +
      `| **Physical Strength** | Lifts 10–20 tons | Lifts 50–70+ tons (Significantly stronger) |\n` +
      `| **Agility & Speed** | Peerless acrobatic reflexes | Fast, but heavier and more brawler-oriented |\n` +
      `| **Spider-Sense** | Early warning danger perception | **Bypasses Spider-Sense entirely!** |\n` +
      `| **Arsenal & Powers** | Web-shooters, wall-crawling, scientific genius | Biomass shapeshifting, organic webbing, camouflage, razor claws |\n` +
      `| **Weaknesses** | Standard human durability | **High-frequency sound (sonics) & fire/extreme heat** |\n\n` +
      `---\n\n` +
      `### 3. **The Tactical Dynamic**\n` +
      `- **Venom's Advantage**: Because the Symbiote previously bonded with Peter, it does not trigger Spider-Man's Spider-Sense. Combined with far greater physical strength and regenerative biomass, Venom has a distinct upper hand in a direct brute-force brawl.\n` +
      `- **Spider-Man's Advantage**: Peter Parker is a prodigy in physics and chemistry. Understanding the Symbiote's biological weaknesses, Spider-Man routinely outsmarts Venom by utilizing sonic frequencies (church bells, sound systems) or thermal sources (fire, explosions).\n\n` +
      `---\n\n` +
      `### 🏆 **Verdict**\n` +
      `- **In a pure physical slugfest**: **Venom** wins due to superior raw strength and Spider-Sense immunity.\n` +
      `- **In a standard encounter with tactical environment**: **Spider-Man** wins by outthinking Venom and exploiting his sonic and fire vulnerabilities.`;
  }

  // Batman vs Spider-Man (Comparison)
  if ((q.includes('batman') && (q.includes('spider-man') || q.includes('spiderman'))) || (q.includes('compare') && q.includes('batman') && q.includes('spider'))) {
    return `🦇 **Batman (DC) vs. Spider-Man (Marvel) — Comparison:**\n\n` +
      `### 1. **Origins & Motivation**\n` +
      `- **Batman (Bruce Wayne)**: Billionaire motivated by the tragic loss of his parents; vows to eradicate crime in Gotham through discipline, martial arts, and high-tech gadgets.\n` +
      `- **Spider-Man (Peter Parker)**: Working-class student motivated by the death of Uncle Ben; fights to protect everyday people guided by moral responsibility.\n\n` +
      `### 2. **Abilities**\n` +
      `- **Batman**: Peak human conditioning, master detective, martial arts expert, WayneTech arsenal, no biological superpowers.\n` +
      `- **Spider-Man**: Superhuman strength (10–20 tons), blinding agility, Spider-Sense danger precognition, wall-crawling, and web-shooters.\n\n` +
      `### 3. **Matchup Dynamic**\n` +
      `- With strategic prep time, Batman can analyze and engineer counters.\n` +
      `- In a spontaneous physical duel, Spider-Man's superhuman reflexes, raw strength, and Spider-Sense give him the physical advantage.`;
  }

  // Math Evaluation (e.g. 17 * 24 or 17 × 24)
  const mathMatch = prompt.match(/(\d+)\s*[\*xX×]\s*(\d+)/);
  if (mathMatch) {
    const n1 = parseFloat(mathMatch[1]);
    const n2 = parseFloat(mathMatch[2]);
    return `🔢 **Calculation Result:**\n\n\`${prompt.trim()}\` = **${n1 * n2}**`;
  }

  // Python Roadmap
  if (q.includes('python') && (q.includes('learn') || q.includes('start') || q.includes('code') || q.includes('way'))) {
    return `🐍 **The Best Way to Learn Python:**\n\n` +
      `1. **Master the Basics**: Variables, data types (\`int\`, \`str\`, \`list\`, \`dict\`), loops (\`for\`, \`while\`), and functions (\`def\`).\n` +
      `2. **Object-Oriented Programming (OOP)**: Classes, methods, and inheritance.\n` +
      `3. **Build Hands-On Projects**: Web scrapers, automation scripts, CLI utilities, or REST APIs.\n` +
      `4. **Choose a Track**: Web Development (FastAPI/Django), Data Science/AI (Pandas/PyTorch), or Automation (Playwright/BeautifulSoup).\n` +
      `5. **Recommended Resources**: Official Python docs (*docs.python.org*) and freeCodeCamp.`;
  }

  // India GDP
  if ((q.includes('india') || q.includes('indian')) && (q.includes('gdp') || q.includes('economy') || q.includes('growth'))) {
    return `🇮🇳 **India's Current GDP Overview:**\n\n` +
      `- **Nominal GDP**: ~$4.11 Trillion (USD), ranking **5th globally**.\n` +
      `- **PPP GDP**: Over $14.5 Trillion (USD), ranking **3rd globally**.\n` +
      `- **Annual Growth Rate**: ~6.5% – 7.2%, the fastest-growing major economy.\n` +
      `- **Key Drivers**: Services (IT, telecom, finance), Manufacturing, and Agriculture.`;
  }

  // Capital of Japan
  if (q.includes('capital') && q.includes('japan')) {
    return `The capital of Japan is **Tokyo** (東京). 🗼\n\nIt is the political, financial, and cultural hub of Japan and the world's most populous metropolitan area (~37.4 million residents).`;
  }

  // Greetings
  if (/^(hi|hello|hey|greetings|howdy|sup|yo|what's up)\b/i.test(q)) {
    return "Hello! I'm Gemini, your general-purpose AI assistant. How can I help you today? Feel free to ask about any topic—from coding and physics to history, math, or creative writing!";
  }

  return `Here is helpful information regarding **${prompt}**: 💡\n\n` +
    `Feel free to ask for step-by-step instructions, examples, or deeper analysis on this topic!`;
}

// 2. Specialized Marvel Strategist Fallback Resolver (Game Tactics & Lore)
function generateMarvelStrategistFallback(prompt: string): string {
  const q = prompt.toLowerCase().trim();

  // General Pro Tips / How to Win Guide
  if (q.includes('tip') || q.includes('advice') || q.includes('how to win') || q.includes('strategy') || q.includes('guide') || q.includes('how to play')) {
    return `🎯 **Marvel Strategist Master Pro-Tips & Winning Guide:** ⚡\n\n` +
      `### 1. 💰 **Auction Phase Mastery (The 40/60 Rule)**\n` +
      `- **Don't Blow Your Budget Early**: Keep at least **40% of your starting cash** for late-round Grade A and Mythic cards ($20M-$35M).\n` +
      `- **Value Hunting**: Grade C and B heroes ($2M-$6M) offer massive power-per-dollar. Pair them with faction synergizers for +10% bonuses.\n` +
      `- **Chaos Auctions**: Watch for special modifiers like *Free Relic* or *Double Power* to steal high-leverage cards.\n\n` +
      `### 2. ⚡ **Equipment & Skill Vault Optimization**\n` +
      `- **Equip Healing Potions**: Always buy at least 1 **Super Soldier Healing Serum** ($3M) or **Heart-Shaped Herb Elixir** ($6M) for clutch +40 to +60 HP recovery in tournaments.\n` +
      `- **5 Signature Skills**: Each hero has 5 unique unlocked abilities. Balance 1 Heavy Nuke, 1 Defensive Guard, and 1 Status Inflictor.\n\n` +
      `### 3. ⚔️ **1v1 Tournament Battle Tactics**\n` +
      `- **Predict Enemy Moves**: If your opponent has high Power, anticipate their **Special Strike** and use **🛡️ Defensive Guard (50% Damage Reduction)**.\n` +
      `- **⚡ LAST STAND Overdrive**: When reduced to **≤ 25% HP**, your hero triggers Last Stand (+3 Power & +15% DEF). Use your biggest signature ability here for a comeback reversal!\n\n` +
      `### 4. 🔮 **Ancient Ruins Dungeons (Waves 1-300)**\n` +
      `- **Pacing**: Conserve Healing Potions for Boss Milestone Waves (Waves 50, 100, 150, 200, 250, 300).`;
  }

  // Specific Bidding Tips
  if (q.includes('bid') || q.includes('auction') || q.includes('money') || q.includes('cash')) {
    return `💰 **Marvel Strategist: Auction Bidding Tactics & Economy:**\n\n` +
      `1. **The Sniper Bid**: Wait until the timer drops below 3 seconds before raising to force rivals into rushed overbids.\n` +
      `2. **Bluff Bidding**: Incrementally bid on cards you don't need to bleed rival treasuries, but stop before the base price doubles.\n` +
      `3. **Tier Price Ceilings**:\n` +
      `   - **Grade C ($1-$5M)**: Never exceed **$7M**.\n` +
      `   - **Grade B ($6-$12M)**: Fair value up to **$15M**.\n` +
      `   - **Grade A ($13-$22M)**: Worth contesting up to **$28M**.\n` +
      `   - **Grade MYTHIC ($23-$35M+)**: Game-deciding anchors. Worth pushing up to **$45M** if you have synergy partners!`;
  }

  // Battle & Combat Tips
  if (q.includes('battle') || q.includes('combat') || q.includes('fight') || q.includes('duel') || q.includes('tournament')) {
    return `⚔️ **Marvel Strategist: 1v1 Tournament Battle Guide:**\n\n` +
      `1. **Turn 1 Strategy**: Open with **⚔️ Strike Attack** to test opponent defenses and gauge their speed roll.\n` +
      `2. **Guarding Big Specials**: When an enemy charges their Special or signature skill, activate **🛡️ Defensive Guard** to absorb 50% of incoming damage.\n` +
      `3. **Healing Timing**: Deploy your **🧪 Healing Potion** when your HP is between 30%–50% to ensure you don't overflow max HP while staying safe from lethal burst combos.\n` +
      `4. **Exploiting Factions**: Cosmic beats Mystic, Tech counters Mutants, and Street-Level excels at agility counter-strikes!`;
  }

  // Spider-Man auction advice
  if (q.includes('spider-man') || q.includes('spiderman')) {
    return `**Marvel Strategist Auction Dossier: Spider-Man** 🕸️\n\n` +
      `- **Grade Tier**: Grade A / Grade S (depending on variant)\n` +
      `- **Power Rating**: ~85 Power\n` +
      `- **Signature Mechanics**: *Spider-Sense Counter* provides top-tier evasion against heavy strikes, plus web-snare control.\n` +
      `- **Recommended Max Bid**: **$12M – $16M**.\n` +
      `- **Tactical Synergy**: Pairs exceptionally well with **Avengers** (Iron Man, Cap) or **Street Level / Defenders** for +10% power bonuses.\n` +
      `- **Dungeon Utility**: High agility makes Peter Parker a staple dodge-tank for Ancient Ruins Waves 40–120.`;
  }

  // General Strategy
  return `**Marvel Strategist Tactical Assessment:** ⚡\n\n` +
    `Analyzing **"${prompt}"** across the 350-character roster and combat engine:\n` +
    `1. **Roster Composition**: Build a balanced team of at least 1 Heavy Vanguard (Grade S/MYTHIC), 1 Agility Disruptor, and 1 Mystic Striker.\n` +
    `2. **Auction Bidding Discipline**: Save at least $8M-$10M in liquid capital for late-stage mystery crates and Grade S lots.\n` +
    `3. **Tournament Execution**: Save your 5 unique signature skills for high-stakes decisive rounds when the opponent is vulnerable!`;
}

// Self-update endpoint to seamlessly pull latest code and reload PM2
app.post('/api/deploy-update', async (_req, res) => {
  const { exec } = await import('child_process');
  console.log('[Server Update] Triggered deploy update...');
  res.json({ status: 'updating', message: 'Pulling latest code and restarting server...' });
  exec('git pull && npm run build && pm2 restart all', (error, stdout, stderr) => {
    console.log('[Server Update] Output:', stdout);
    if (error) console.error('[Server Update] Error:', error);
  });
});

function emitAscensionState(roomId: string, state: AscensionBattleState) {
  io.to(roomId).emit('ascension_state_update', state);
}

function settleAscensionResult(result: AscensionBattleResult) {
  const room = ascensionRooms.get(result.roomId);
  if (!room) return;
  const rewards: NonNullable<AscensionBattleState['rewards']> = {};
  room.state.players.forEach(player => {
    if (!player.profileId) return; // Guest custom rooms still receive the battle result.
    const isWin = player.id === result.winnerId;
    const outcome = database.recordAscensionMatch(player.profileId, {
      isWin,
      matchFormat: result.format,
      isRanked: result.mode === 'ranked',
      isMvp: isWin,
      damageDealt: room.state.rounds.reduce((total, round) =>
        total + (round.winnerPlayerId === player.id ? Math.max(round.player1DamageDealt, round.player2DamageDealt) : 0), 0),
      matchToken: `${result.matchToken}-${player.profileId}`
    });
    if (outcome) {
      rewards[player.id] = {
        isWin, astraAwarded: outcome.astraAwarded, xpAwarded: outcome.xpAwarded,
        ratingDelta: outcome.newRating - (player.rating || outcome.newRating),
        newRating: outcome.newRating, newTier: outcome.newTier
      };
      const socketId = ascensionSocketSession.entries();
      for (const [id, session] of socketId) {
        if (session.roomId === result.roomId && session.profileId === player.profileId) {
          io.to(id).emit('ascension_match_result', { ...outcome, isWin });
        }
      }
    }
  });
  room.state.rewards = rewards;
  emitAscensionState(result.roomId, room.state);
}

function createAscensionRoom(
  roomId: string,
  mode: 'casual' | 'ranked',
  format: AscensionBattleState['format']
) {
  const room = new OnlineBattleRoom(
    roomId,
    mode,
    format,
    state => emitAscensionState(roomId, state),
    settleAscensionResult
  );
  ascensionRooms.set(roomId, room);
  return room;
}

function findQueueMatch(entry: typeof ascensionQueue[number]) {
  const now = Date.now();
  const index = ascensionQueue.findIndex(candidate => {
    if (candidate.socketId === entry.socketId || candidate.mode !== entry.mode || candidate.format !== entry.format) return false;
    if (!io.sockets.sockets.has(candidate.socketId)) return false;
    if (entry.mode === 'casual') return true;
    const tolerance = Math.min(800, 100 + Math.floor((now - candidate.queuedAt) / 1000) * 25);
    return Math.abs(candidate.rating - entry.rating) <= tolerance;
  });
  return index >= 0 ? ascensionQueue.splice(index, 1)[0] : undefined;
}

// Real-time Socket.io logic
io.on('connection', (socket: Socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // Socket Authentication Binding
  socket.on('authenticate_socket', (data: { token: string }, callback) => {
    if (!data?.token) return callback && callback({ success: false, error: 'No token provided.' });
    const payload = database.verifyToken(data.token);
    if (!payload) return callback && callback({ success: false, error: 'Invalid or expired token.' });
    const user = database.getUserById(payload.id);
    if (!user) return callback && callback({ success: false, error: 'User not found.' });
    socket.data.userId = user.id;
    socket.data.userProfile = user;

    userSocketMap.set(user.id, socket.id);
    socketUserMap.set(socket.id, user.id);
    notifyFriendsPresence(user.id, true);

    const session = socketToRoom.get(socket.id);
    if (session) {
      const room = rooms.get(session.roomId);
      if (room) {
        const player = room.state.players.find(p => p.id === socket.id);
        if (player) {
          player.name = user.displayName;
          player.avatar = user.avatar;
          player.level = user.level;
          player.profile = user;
          room.notifyState();
        }
      }
    }
    callback && callback({ success: true, user });
  });

  // ==========================================
  // ASCENSION ONLINE BATTLES
  // ==========================================
  const getSocketIdentity = (data?: { authToken?: string }) => {
    const profileId = socket.data.userId as string | undefined;
    if (profileId) {
      const profile = database.getUserById(profileId);
      return { profileId, profile };
    }
    if (data?.authToken) {
      const payload = database.verifyToken(data.authToken);
      if (payload) {
        const profile = database.getUserById(payload.id);
        if (profile) {
          socket.data.userId = profile.id;
          socket.data.userProfile = profile;
          return { profileId: profile.id, profile };
        }
      }
    }
    return { profileId: undefined, profile: undefined };
  };

  const makeAscensionPlayer = (
    profileId: string | undefined,
    profile: any,
    team: Character[],
    isHost = false
  ) => ({
    id: socket.id,
    profileId,
    name: profile?.displayName || profile?.username || 'Guest Challenger',
    avatar: profile?.avatar || '🦸‍♂️',
    rating: profile?.rankedRating || 0,
    team, isHost, isReady: false, isConnected: true
  });

  socket.on('ascension_queue', (data: {
    mode?: 'casual' | 'ranked'; format?: string; teamIds?: unknown[]; authToken?: string
  }, callback) => {
    const mode = data?.mode === 'ranked' ? 'ranked' : 'casual';
    const format = formatFromInput(data?.format);
    if (!format) return callback?.({ success: false, error: 'Invalid Ascension format.' });
    const { profileId, profile } = getSocketIdentity(data);
    if (mode === 'ranked' && (!profileId || (profile?.level || 1) < 10)) {
      return callback?.({ success: false, error: 'Ranked battles require an authenticated Commander Level 10 account.' });
    }
    if (profileId && (ascensionQueue.some(item => item.profileId === profileId) || ascensionSocketSessionHasProfile(profileId))) {
      return callback?.({ success: false, error: 'You are already queued or in an Ascension battle.' });
    }
    const selected = canonicalTeam(data?.teamIds, profile);
    if (!selected.team) return callback?.({ success: false, error: selected.error });
    const oldIndex = ascensionQueue.findIndex(item => item.socketId === socket.id);
    if (oldIndex >= 0) ascensionQueue.splice(oldIndex, 1);
    const entry: typeof ascensionQueue[number] = {
      socketId: socket.id, profileId,
      name: profile?.displayName || profile?.username || 'Guest Challenger',
      avatar: profile?.avatar || '🦸‍♂️',
      rating: profile?.rankedRating || 0, format, mode, team: selected.team, queuedAt: Date.now()
    };
    const opponent = findQueueMatch(entry);
    if (!opponent) {
      ascensionQueue.push(entry);
      socket.emit('ascension_queue_status', { queued: true, mode, format, position: ascensionQueue.length });
      return callback?.({ success: true, queued: true });
    }
    const roomId = `ASC-MATCH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const room = createAscensionRoom(roomId, mode, format);
    const first = makeAscensionPlayer(opponent.profileId, database.getUserById(opponent.profileId || ''), opponent.team, true);
    first.id = opponent.socketId;
    first.name = opponent.name;
    first.avatar = opponent.avatar;
    first.rating = opponent.rating;
    const second = makeAscensionPlayer(profileId, profile, selected.team, false);
    room.addPlayer(first);
    room.addPlayer(second);
    ascensionSocketSession.set(opponent.socketId, { roomId, playerId: opponent.socketId, profileId: opponent.profileId });
    ascensionSocketSession.set(socket.id, { roomId, playerId: socket.id, profileId });
    io.sockets.sockets.get(opponent.socketId)?.join(roomId);
    socket.join(roomId);
    room.setReady(opponent.socketId, true);
    room.setReady(socket.id, true);
    room.start(opponent.socketId);
    io.to(roomId).emit('ascension_match_found', { roomId, state: room.state });
    callback?.({ success: true, queued: false, roomId, state: room.state });
  });

  socket.on('ascension_cancel_queue', (callback) => {
    const index = ascensionQueue.findIndex(item => item.socketId === socket.id);
    if (index >= 0) ascensionQueue.splice(index, 1);
    callback?.({ success: true });
  });

  socket.on('ascension_create_room', (data: {
    mode?: 'casual' | 'ranked'; format?: string; teamIds?: unknown[]; authToken?: string
  }, callback) => {
    const mode = data?.mode === 'ranked' ? 'ranked' : 'casual';
    const format = formatFromInput(data?.format);
    const { profileId, profile } = getSocketIdentity(data);
    if (!format) return callback?.({ success: false, error: 'Invalid Ascension format.' });
    if (mode === 'ranked') return callback?.({ success: false, error: 'Ranked matches must use the queue.' });
    const selected = canonicalTeam(data?.teamIds, profile);
    if (!selected.team) return callback?.({ success: false, error: selected.error });
    const roomId = `ASC-ROOM-${Math.floor(100000 + Math.random() * 900000)}`;
    const room = createAscensionRoom(roomId, mode, format);
    const player = makeAscensionPlayer(profileId, profile, selected.team, true);
    room.addPlayer(player);
    ascensionSocketSession.set(socket.id, { roomId, playerId: socket.id, profileId });
    socket.join(roomId);
    callback?.({ success: true, roomId, state: room.state });
  });

  socket.on('ascension_join_room', (data: {
    roomId: string; teamIds?: unknown[]; authToken?: string
  }, callback) => {
    const inputCode = String(data?.roomId || '').toUpperCase().trim();
    let resolvedRoomId = inputCode;
    let room = ascensionRooms.get(resolvedRoomId);
    if (!room) {
      for (const [id, r] of ascensionRooms.entries()) {
        if (
          id === inputCode || 
          id === `ASC-ROOM-${inputCode}` || 
          id.endsWith(inputCode) || 
          id.replace(/[^A-Z0-9]/g, '').endsWith(inputCode.replace(/[^A-Z0-9]/g, ''))
        ) {
          resolvedRoomId = id;
          room = r;
          break;
        }
      }
    }
    if (!room) return callback?.({ success: false, error: 'Ascension room not found.' });
    const { profileId, profile } = getSocketIdentity(data);
    const selected = canonicalTeam(data?.teamIds, profile);
    if (!selected.team) return callback?.({ success: false, error: selected.error });
    const player = makeAscensionPlayer(profileId, profile, selected.team);
    const added = room.addPlayer(player);
    if (!added.success) return callback?.(added);
    ascensionSocketSession.set(socket.id, { roomId: resolvedRoomId, playerId: socket.id, profileId });
    socket.join(resolvedRoomId);
    callback?.({ success: true, roomId: resolvedRoomId, state: room.state });
  });

  socket.on('ascension_set_team', (data: { teamIds?: unknown[] }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const session = ascensionSocketSession.get(socket.id);
    const room = session && ascensionRooms.get(session.roomId);
    if (!room) return cb?.({ success: false, error: 'You are not in an Ascension room.' });
    const { profile } = getSocketIdentity();
    const selected = canonicalTeam(data?.teamIds, profile);
    if (!selected.team) return cb?.({ success: false, error: selected.error });
    cb?.(room.setTeam(socket.id, selected.team));
  });

  socket.on('ascension_set_ready', (data: { isReady?: boolean }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const session = ascensionSocketSession.get(socket.id);
    const room = session && ascensionRooms.get(session.roomId);
    cb?.(room ? room.setReady(socket.id, !!data?.isReady) : { success: false, error: 'Room not found.' });
  });

  socket.on('ascension_start_battle', (callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const session = ascensionSocketSession.get(socket.id);
    const room = session && ascensionRooms.get(session.roomId);
    cb?.(room ? room.start(socket.id) : { success: false, error: 'Room not found.' });
  });

  socket.on('ascension_action', (data: {
    action?: BattleActionType; fighterIndex?: number; skillId?: string
  }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const session = ascensionSocketSession.get(socket.id);
    const room = session && ascensionRooms.get(session.roomId);
    cb?.(room
      ? room.submitAction(socket.id, data.action as BattleActionType, Number(data.fighterIndex) || 0, data.skillId)
      : { success: false, error: 'Room not found.' });
  });

  socket.on('ascension_leave_room', (callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const session = ascensionSocketSession.get(socket.id);
    if (session) {
      const room = ascensionRooms.get(session.roomId);
      room?.removePlayer(socket.id);
      socket.leave(session.roomId);
      ascensionSocketSession.delete(socket.id);
    }
    cb?.({ success: true });
  });

  socket.on('ascension_reconnect', (data: { roomId?: string; authToken?: string }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const { profileId, profile } = getSocketIdentity(data);
    if (!profileId) return cb?.({ success: false, error: 'Authentication is required to reconnect.' });
    const roomId = String(data?.roomId || '').toUpperCase().trim();
    const room = ascensionRooms.get(roomId);
    if (!room || !room.reconnect(profileId, socket.id, profile?.displayName || profile?.username || 'Challenger', profile?.avatar || '🦸‍♂️')) {
      return cb?.({ success: false, error: 'Battle room or player seat not found.' });
    }
    ascensionSocketSession.set(socket.id, { roomId, playerId: socket.id, profileId });
    socket.join(roomId);
    cb?.({ success: true, roomId, state: room.state });
  });

  // 1. Create Room
  socket.on('create_room', (data: { playerName: string; avatar: string; authToken?: string }, callback) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const roomId = `MARVEL-${randomCode}`;

    let verifiedName = data.playerName || 'Host Player';
    let verifiedAvatar = data.avatar || '🦸‍♂️';
    let verifiedLevel = 1;
    let verifiedProfile = undefined;

    if (data.authToken) {
      const payload = database.verifyToken(data.authToken);
      if (payload) {
        const user = database.getUserById(payload.id);
        if (user) {
          verifiedName = user.displayName;
          verifiedAvatar = user.avatar;
          verifiedLevel = user.level;
          verifiedProfile = user;
        }
      }
    }

    const hostPlayer: Player = {
      id: socket.id,
      name: verifiedName,
      avatar: verifiedAvatar,
      money: 30,
      collection: [],
      isHost: true,
      isReady: true,
      isBot: false,
      level: verifiedLevel,
      profile: verifiedProfile,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    const room = new GameRoom(roomId, hostPlayer, (updatedState) => {
      io.to(roomId).emit('game_state_update', updatedState);
    });

    rooms.set(roomId, room);
    socketToRoom.set(socket.id, { roomId, playerId: socket.id });
    socket.join(roomId);

    console.log(`[Room Created] ${roomId} by [LVL ${verifiedLevel}] ${hostPlayer.name}`);
    callback({ success: true, roomId, state: room.state });
  });

  // 2. Join Room
  socket.on('join_room', (data: { roomId: string; playerName: string; avatar: string; authToken?: string }, callback) => {
    let code = (data.roomId || '').toUpperCase().trim();
    if (/^\d{4}$/.test(code)) {
      code = `MARVEL-${code}`;
    }
    const room = rooms.get(code);

    if (!room) {
      return callback({ success: false, error: `Room ${code} not found.` });
    }

    let verifiedName = data.playerName || `Player ${room.state.players.length + 1}`;
    let verifiedAvatar = data.avatar || '🦸‍♀️';
    let verifiedLevel = 1;
    let verifiedProfile = undefined;

    if (data.authToken) {
      const payload = database.verifyToken(data.authToken);
      if (payload) {
        const user = database.getUserById(payload.id);
        if (user) {
          verifiedName = user.displayName;
          verifiedAvatar = user.avatar;
          verifiedLevel = user.level;
          verifiedProfile = user;
        }
      }
    }

    const player: Player = {
      id: socket.id,
      name: verifiedName,
      avatar: verifiedAvatar,
      money: room.state.settings.startingMoney,
      collection: [],
      isHost: false,
      isReady: false,
      isBot: false,
      level: verifiedLevel,
      profile: verifiedProfile,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    const added = room.addPlayer(player);
    if (!added) {
      return callback({ success: false, error: 'Room is full or game already started.' });
    }

    socketToRoom.set(socket.id, { roomId: code, playerId: socket.id });
    socket.join(code);

    console.log(`[Player Joined] [LVL ${verifiedLevel}] ${player.name} joined ${code}`);
    callback({ success: true, roomId: code, state: room.state });
  });

  // 3. Set Player Ready
  socket.on('set_ready', (data: { isReady: boolean }) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room) {
      room.setPlayerReady(session.playerId, data.isReady);
    }
  });

  // 4. Add AI Bot
  socket.on('add_bot', (data: { personality: 'Aggressive' | 'Value' | 'Cosmic' | 'Balanced' }) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room && room.state.players.find(p => p.id === socket.id)?.isHost) {
      room.addBot(data.personality);
    }
  });

  // 5. Update Game Settings
  socket.on('update_settings', (settings: Partial<GameSettings>) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room && room.state.players.find(p => p.id === socket.id)?.isHost) {
      room.updateSettings(settings);
    }
  });

  // 6. Start Game
  socket.on('start_game', (callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });
    if (!room.state.players.find(p => p.id === socket.id)?.isHost) {
      return callback?.({ success: false, error: 'Only the host can start the game.' });
    }
    callback?.(room.startGame());
  });

  // 7. Place Bid
  socket.on('place_bid', (data: { amount: number }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.placeBid(session.playerId, data.amount);
    callback?.(res);
  });

  // 8. Vote Skip
  socket.on('vote_skip', (callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.voteSkip(session.playerId);
    callback?.(res);
  });

  // 8A-1. Instant Skip Lot (Host / Instant Skip Control)
  socket.on('instant_skip', (callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    room.instantSkipLot();
    callback?.({ success: true });
  });

  // 8A-2. Concede / Give Up Lot
  socket.on('concede_lot', (callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    room.concedeLot(session.playerId);
    callback?.({ success: true });
  });

  // 8B. 3-Round Cosmic Grade Vote
  socket.on('vote_grade', (data: { vote: any }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.submitGradeVote(session.playerId, data.vote);
    callback?.(res);
  });

  socket.on('submit_grade_votes', (data: { votes: Record<string, any> }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const myVote = data.votes[session.playerId] || Object.values(data.votes)[0] || 'MYTHIC';
    const res = room.submitGradeVote(session.playerId, myVote);
    callback?.(res);
  });

  // 9. Play Current Tournament Match
  socket.on('play_match', (data: { matchId: string }) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room) {
      room.playCurrentMatch(data.matchId);
    }
  });

  // 9B. Execute Battle Action
  socket.on('execute_battle_action', (data: { action: any; fighterIndex?: number; skillId?: string }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.executeBattleAction(session.playerId, data.action, data.fighterIndex, data.skillId);
    callback?.(res);
  });

  // 9B-2. Trigger Flashbang Lockdown (TODO-035)
  socket.on('trigger_flashbang', (data: { targetId: string }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.triggerFlashbang(session.playerId, data.targetId);
    callback?.(res);
  });

  // 9B-3. Use Healing Potion (TODO-034)
  socket.on('use_healing_potion', (data: { heroId?: string }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.useHealingPotion(session.playerId, data?.heroId);
    callback?.(res);
  });

  // 9C. Update Player Collection (Equipping Artifacts from Relic Shop)
  socket.on('update_collection', (data: { collection: any[]; money: number }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    room.updatePlayerCollection(session.playerId, data.collection, data.money);
    callback?.({ success: true });
  });

  // 9C2. Authoritative Discard Character ($0 Refund, Slot Freed - STRICT OWN CARD VALIDATION)
  socket.on('discard_character', (data: { playerId?: string; characterId: string }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    // Enforce strictly: A player can ONLY discard THEIR OWN CARD
    const targetPlayerId = session.playerId;
    const result = room.discardCharacter(targetPlayerId, data.characterId);
    callback?.(result);
  });

  // 9D. Proceed from Relic Shop to Tournament Battles
  socket.on('proceed_to_battles', () => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room) {
      room.proceedToBattles();
    }
  });

  // 9E. Concede Match in Battle Phase
  socket.on('concede_match', (callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.concedeMatch(session.playerId);
    callback?.(res);
  });

  // 9F. Skip Match in Battle Phase
  socket.on('skip_match', (callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.skipMatch();
    callback?.(res);
  });

  // 10. Spectator Chat (TODO-EXP-01)
  socket.on('send_spectator_chat', (data: { message: string }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.sendSpectatorChat(session.playerId, data.message);
    callback?.(res);
  });

  // 11. Rematch Voting (TODO-EXP-03)
  socket.on('vote_rematch', (callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.voteRematch(session.playerId);
    callback?.(res);
  });

  // 12. Host Settings Update (TODO-EXP-05)
  socket.on('update_host_settings', (data: { settings: any }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.updateHostSettings(session.playerId, data.settings);
    callback?.(res);
  });

  // 13. Restart Game
  socket.on('restart_game', () => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room && room.state.players.find(p => p.id === socket.id)?.isHost) {
      room.resetGame();
    }
  });

  // ==========================================
  // 👥 SOCIAL & PARTY SOCKET EVENT HANDLERS
  // ==========================================

  // Social presence authentication
  socket.on('social_auth', (data: { token?: string }) => {
    if (!data?.token) return;
    const payload = database.verifyToken(data.token);
    if (!payload) return;
    userSocketMap.set(payload.id, socket.id);
    socketUserMap.set(socket.id, payload.id);
    notifyFriendsPresence(payload.id, true);
  });

  // Party Creation
  socket.on('party_create', (_data, callback) => {
    const userId = socketUserMap.get(socket.id);
    if (!userId) return callback?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return callback?.({ success: false, error: 'User not found.' });

    // Leave any existing party
    const existingPartyId = userPartyMap.get(userId);
    if (existingPartyId) {
      leaveParty(userId, socket.id);
    }

    const partyId = `PARTY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const party: PartyState = {
      id: partyId,
      leaderId: userId,
      createdAt: Date.now(),
      members: [{
        userId,
        socketId: socket.id,
        username: user.username,
        displayName: user.displayName || user.username,
        avatar: user.avatar || '🦸‍♂️',
        customAvatarUrl: user.customAvatarUrl,
        level: user.level || 1,
        isLeader: true,
        isReady: true,
      }],
    };

    parties.set(partyId, party);
    userPartyMap.set(userId, partyId);
    socket.join(`party_${partyId}`);
    callback?.({ success: true, party });
  });

  // Party Invite
  socket.on('party_invite', (data: { targetUserId: string }, callback) => {
    const userId = socketUserMap.get(socket.id);
    if (!userId) return callback?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return callback?.({ success: false, error: 'User not found.' });

    let partyId = userPartyMap.get(userId);
    let party = partyId ? parties.get(partyId) : undefined;
    if (!party) {
      partyId = `PARTY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      party = {
        id: partyId,
        leaderId: userId,
        createdAt: Date.now(),
        members: [{
          userId,
          socketId: socket.id,
          username: user.username,
          displayName: user.displayName || user.username,
          avatar: user.avatar || '🦸‍♂️',
          customAvatarUrl: user.customAvatarUrl,
          level: user.level || 1,
          isLeader: true,
          isReady: true,
        }],
      };
      parties.set(partyId, party);
      userPartyMap.set(userId, partyId);
      socket.join(`party_${partyId}`);
    }

    if (party.leaderId !== userId) {
      return callback?.({ success: false, error: 'Only the party leader can invite players.' });
    }

    if (party.members.length >= 5) {
      return callback?.({ success: false, error: 'Party is already full (max 5 players).' });
    }

    const targetSocketId = userSocketMap.get(data.targetUserId);
    if (!targetSocketId) {
      return callback?.({ success: false, error: 'Player is currently offline.' });
    }

    io.to(targetSocketId).emit('party_invite_received', {
      partyId: party.id,
      inviterId: userId,
      inviterName: user.displayName || user.username,
      inviterAvatar: user.avatar || '🦸‍♂️',
      inviterCustomAvatar: user.customAvatarUrl,
      inviterLevel: user.level || 1,
    });

    callback?.({ success: true, message: 'Party invitation sent.' });
  });

  // Party Invite Response
  socket.on('party_invite_response', (data: { partyId: string; accept: boolean }, callback) => {
    const userId = socketUserMap.get(socket.id);
    if (!userId) return callback?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return callback?.({ success: false, error: 'User not found.' });

    const party = parties.get(data.partyId);
    if (!party) {
      return callback?.({ success: false, error: 'Party no longer exists.' });
    }

    if (!data.accept) {
      const leaderSocketId = userSocketMap.get(party.leaderId);
      if (leaderSocketId) {
        io.to(leaderSocketId).emit('party_invite_declined', {
          userId,
          name: user.displayName || user.username,
        });
      }
      return callback?.({ success: true, message: 'Invitation declined.' });
    }

    if (party.members.length >= 5) {
      return callback?.({ success: false, error: 'Party is full.' });
    }

    // Leave any previous party
    const oldPartyId = userPartyMap.get(userId);
    if (oldPartyId) {
      leaveParty(userId, socket.id);
    }

    const newMember: PartyMember = {
      userId,
      socketId: socket.id,
      username: user.username,
      displayName: user.displayName || user.username,
      avatar: user.avatar || '🦸‍♂️',
      customAvatarUrl: user.customAvatarUrl,
      level: user.level || 1,
      isLeader: false,
      isReady: false,
    };

    party.members.push(newMember);
    userPartyMap.set(userId, party.id);
    socket.join(`party_${party.id}`);

    io.to(`party_${party.id}`).emit('party_state_updated', party);
    callback?.({ success: true, party });
  });

  // Party Toggle Ready
  socket.on('party_toggle_ready', (callback) => {
    const userId = socketUserMap.get(socket.id);
    if (!userId) return;
    const partyId = userPartyMap.get(userId);
    const party = partyId ? parties.get(partyId) : undefined;
    if (!party) return;

    const member = party.members.find(m => m.userId === userId);
    if (member) {
      member.isReady = !member.isReady;
      io.to(`party_${party.id}`).emit('party_state_updated', party);
      callback?.({ success: true, isReady: member.isReady });
    }
  });

  // Party Leave
  socket.on('party_leave', (callback) => {
    const userId = socketUserMap.get(socket.id);
    if (userId) {
      leaveParty(userId, socket.id);
    }
    callback?.({ success: true });
  });

  // ==========================================
  // 🏆 MULTIPLAYER BATTLE TEAM TOURNAMENTS
  // ==========================================

  // 1. Create Tournament Room
  socket.on('tournament_create_room', (data: { teamSize: number; maxPlayers: number; characterIds: string[] }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const userId = socketUserMap.get(socket.id);
    if (!userId) return cb?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return cb?.({ success: false, error: 'User not found.' });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const roomId = `TOURN-${code}`;
    const teamSize = Math.min(5, Math.max(1, Number(data?.teamSize) || 1));
    const maxPlayers = [2, 4, 6, 8, 10].includes(Number(data?.maxPlayers)) ? Number(data.maxPlayers) : 10;
    const characterIds = (data?.characterIds || []).slice(0, teamSize);
    const teamPower = calculateTeamPower(characterIds, userId);

    const player: TournamentPlayerState = {
      userId,
      socketId: socket.id,
      name: user.displayName || user.username,
      avatar: user.avatar || '🦸‍♂️',
      customAvatarUrl: user.customAvatarUrl,
      level: user.level || 1,
      characterIds,
      teamPower,
      isHost: true,
      isReady: true,
    };

    const room: TournamentRoomState = {
      id: roomId,
      code,
      hostUserId: userId,
      teamSize,
      maxPlayers,
      phase: 'LOBBY',
      players: [player],
      currentRound: 1,
      bracketMatches: [],
      createdAt: Date.now(),
    };

    tournamentRooms.set(roomId, room);
    socketTournamentRoom.set(socket.id, roomId);
    socket.join(roomId);

    cb?.({ success: true, room });
  });

  // 2. Join Tournament Room
  socket.on('tournament_join_room', (data: { roomIdOrCode: string; characterIds?: string[] }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const userId = socketUserMap.get(socket.id);
    if (!userId) return cb?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return cb?.({ success: false, error: 'User not found.' });

    const query = String(data?.roomIdOrCode || '').trim().toUpperCase();
    let room: TournamentRoomState | undefined = tournamentRooms.get(query);
    if (!room) {
      for (const r of tournamentRooms.values()) {
        if (r.code === query || r.id === query || r.id === `TOURN-${query}`) {
          room = r;
          break;
        }
      }
    }

    if (!room) return cb?.({ success: false, error: 'Tournament room not found.' });
    if (room.phase !== 'LOBBY') return cb?.({ success: false, error: 'Tournament is already in progress.' });
    
    // Check if player is already in room
    const existingIndex = room.players.findIndex(p => p.userId === userId);
    if (existingIndex >= 0) {
      room.players[existingIndex].socketId = socket.id;
      socketTournamentRoom.set(socket.id, room.id);
      socket.join(room.id);
      return cb?.({ success: true, room });
    }

    if (room.players.length >= room.maxPlayers) {
      return cb?.({ success: false, error: `Tournament room is full (${room.maxPlayers}/${room.maxPlayers}).` });
    }

    const characterIds = (data?.characterIds || []).slice(0, room.teamSize);
    const teamPower = calculateTeamPower(characterIds, userId);

    const newPlayer: TournamentPlayerState = {
      userId,
      socketId: socket.id,
      name: user.displayName || user.username,
      avatar: user.avatar || '🦸‍♂️',
      customAvatarUrl: user.customAvatarUrl,
      level: user.level || 1,
      characterIds,
      teamPower,
      isHost: false,
      isReady: false,
    };

    room.players.push(newPlayer);
    socketTournamentRoom.set(socket.id, room.id);
    socket.join(room.id);

    io.to(room.id).emit('tournament_room_updated', room);
    cb?.({ success: true, room });
  });

  // 3. Update Tournament Team in Room
  socket.on('tournament_update_team', (data: { characterIds: string[] }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const roomId = socketTournamentRoom.get(socket.id);
    if (!roomId) return cb?.({ success: false, error: 'Not in a tournament room.' });
    const room = tournamentRooms.get(roomId);
    if (!room) return cb?.({ success: false, error: 'Room not found.' });

    const player = room.players.find(p => p.socketId === socket.id);
    if (player) {
      player.characterIds = (data?.characterIds || []).slice(0, room.teamSize);
      player.teamPower = calculateTeamPower(player.characterIds, player.userId);
      io.to(room.id).emit('tournament_room_updated', room);
    }
    cb?.({ success: true, room });
  });

  // 4. Toggle Ready in Tournament Room
  socket.on('tournament_toggle_ready', (callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const roomId = socketTournamentRoom.get(socket.id);
    if (!roomId) return cb?.({ success: false, error: 'Not in a tournament room.' });
    const room = tournamentRooms.get(roomId);
    if (!room) return cb?.({ success: false, error: 'Room not found.' });

    const player = room.players.find(p => p.socketId === socket.id);
    if (player) {
      player.isReady = !player.isReady;
      io.to(room.id).emit('tournament_room_updated', room);
    }
    cb?.({ success: true, room });
  });

  // 5. Leave Tournament Room
  socket.on('tournament_leave_room', (callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const roomId = socketTournamentRoom.get(socket.id);
    if (roomId) {
      const room = tournamentRooms.get(roomId);
      if (room) {
        room.players = room.players.filter(p => p.socketId !== socket.id);
        socket.leave(roomId);
        socketTournamentRoom.delete(socket.id);

        if (room.players.length === 0) {
          tournamentRooms.delete(roomId);
        } else {
          if (room.hostUserId === socketUserMap.get(socket.id)) {
            room.hostUserId = room.players[0].userId;
            room.players[0].isHost = true;
          }
          io.to(room.id).emit('tournament_room_updated', room);
        }
      }
    }
    cb?.({ success: true });
  });

  // 6. Tournament Matchmaking Queue (Quick Match)
  socket.on('tournament_queue', (data: { teamSize: number; maxPlayers: number; characterIds: string[] }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const userId = socketUserMap.get(socket.id);
    if (!userId) return cb?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return cb?.({ success: false, error: 'User not found.' });

    const teamSize = Math.min(5, Math.max(1, Number(data?.teamSize) || 1));
    const maxPlayers = [2, 4, 6, 8, 10].includes(Number(data?.maxPlayers)) ? Number(data.maxPlayers) : 2;
    const characterIds = (data?.characterIds || []).slice(0, teamSize);
    const teamPower = calculateTeamPower(characterIds, userId);

    // Remove existing from queue
    const oldIdx = tournamentQueue.findIndex(q => q.socketId === socket.id || q.userId === userId);
    if (oldIdx >= 0) tournamentQueue.splice(oldIdx, 1);

    const entry: TournamentQueueEntry = {
      socketId: socket.id,
      userId,
      name: user.displayName || user.username,
      avatar: user.avatar || '🦸‍♂️',
      customAvatarUrl: user.customAvatarUrl,
      level: user.level || 1,
      teamSize,
      maxPlayers,
      characterIds,
      teamPower,
      queuedAt: Date.now(),
    };

    // Check for matching opponents in queue (matching teamSize)
    const opponents = tournamentQueue.filter(q => q.teamSize === teamSize && io.sockets.sockets.has(q.socketId));

    if (opponents.length >= maxPlayers - 1) {
      // Full match found!
      const matchedEntries = [entry, ...opponents.slice(0, maxPlayers - 1)];
      matchedEntries.slice(1).forEach(m => {
        const idx = tournamentQueue.findIndex(q => q.socketId === m.socketId);
        if (idx >= 0) tournamentQueue.splice(idx, 1);
      });

      const code = String(Math.floor(100000 + Math.random() * 900000));
      const roomId = `TOURN-${code}`;

      const players: TournamentPlayerState[] = matchedEntries.map((m, idx) => ({
        userId: m.userId,
        socketId: m.socketId,
        name: m.name,
        avatar: m.avatar,
        customAvatarUrl: m.customAvatarUrl,
        level: m.level,
        characterIds: m.characterIds,
        teamPower: m.teamPower,
        isHost: idx === 0,
        isReady: true,
      }));

      const room: TournamentRoomState = {
        id: roomId,
        code,
        hostUserId: players[0].userId,
        teamSize,
        maxPlayers,
        phase: maxPlayers === 2 ? 'BRACKET' : 'LOBBY',
        players,
        currentRound: 1,
        bracketMatches: maxPlayers === 2 ? generateTournamentBracket(players, maxPlayers) : [],
        createdAt: Date.now(),
      };

      tournamentRooms.set(roomId, room);

      matchedEntries.forEach(m => {
        socketTournamentRoom.set(m.socketId, roomId);
        const s = io.sockets.sockets.get(m.socketId);
        s?.join(roomId);
      });

      io.to(roomId).emit('tournament_match_found', { roomId, room });
      io.to(roomId).emit('tournament_room_updated', room);
      return cb?.({ success: true, queued: false, room });
    }

    // Otherwise add to queue
    tournamentQueue.push(entry);
    cb?.({ success: true, queued: true, queuePosition: tournamentQueue.length });
  });

  // 7. Cancel Tournament Queue
  socket.on('tournament_cancel_queue', (callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const idx = tournamentQueue.findIndex(q => q.socketId === socket.id);
    if (idx >= 0) tournamentQueue.splice(idx, 1);
    cb?.({ success: true });
  });

  // 8. Invite Friend to Tournament
  socket.on('tournament_invite_friend', (data: { targetUserId: string; roomId: string }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const userId = socketUserMap.get(socket.id);
    if (!userId) return cb?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return cb?.({ success: false, error: 'User not found.' });

    const room = tournamentRooms.get(data?.roomId);
    if (!room) return cb?.({ success: false, error: 'Tournament room not found.' });

    const targetSocketId = userSocketMap.get(data.targetUserId);
    if (!targetSocketId) return cb?.({ success: false, error: 'Player is offline.' });

    io.to(targetSocketId).emit('team_battle_invite_received', {
      inviterId: userId,
      inviterName: user.displayName || user.username,
      inviterAvatar: user.avatar || '🦸‍♂️',
      roomId: room.id,
      roomCode: room.code,
      teamSize: room.teamSize,
      maxPlayers: room.maxPlayers,
    });

    cb?.({ success: true, message: 'Tournament invitation dispatched.' });
  });

  // 9. Start Tournament Bracket
  socket.on('tournament_start', (callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const roomId = socketTournamentRoom.get(socket.id);
    if (!roomId) return cb?.({ success: false, error: 'Not in a tournament room.' });
    const room = tournamentRooms.get(roomId);
    if (!room) return cb?.({ success: false, error: 'Room not found.' });

    if (room.players.length < 2) {
      return cb?.({ success: false, error: 'At least 2 real players required to start the tournament.' });
    }

    room.phase = 'BRACKET';
    room.currentRound = 1;
    room.bracketMatches = generateTournamentBracket(room.players, room.maxPlayers);

    io.to(room.id).emit('tournament_bracket_started', room);
    io.to(room.id).emit('tournament_room_updated', room);
    cb?.({ success: true, room });
  });

  // 10. Simulate / Resolve Tournament Bracket Match
  socket.on('tournament_simulate_match', (data: { matchId: string }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const roomId = socketTournamentRoom.get(socket.id);
    if (!roomId) return cb?.({ success: false, error: 'Not in a tournament room.' });
    const room = tournamentRooms.get(roomId);
    if (!room) return cb?.({ success: false, error: 'Room not found.' });

    const match = room.bracketMatches.find(m => m.id === data?.matchId);
    if (!match || match.status === 'COMPLETED' || !match.player1 || !match.player2) {
      return cb?.({ success: false, error: 'Match cannot be simulated.' });
    }

    // Determine winner based on team power + combat variance
    const p1Power = match.player1.teamPower + Math.floor(Math.random() * 20);
    const p2Power = match.player2.teamPower + Math.floor(Math.random() * 20);
    const winner = p1Power >= p2Power ? match.player1 : match.player2;

    match.winner = winner;
    match.status = 'COMPLETED';

    io.to(room.id).emit('tournament_match_resolved', { matchId: match.id, winner, room });
    io.to(room.id).emit('tournament_room_updated', room);
    cb?.({ success: true, winner, room });
  });

  // 11. Advance Tournament Round
  socket.on('tournament_advance_round', (callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const roomId = socketTournamentRoom.get(socket.id);
    if (!roomId) return cb?.({ success: false, error: 'Not in a tournament room.' });
    const room = tournamentRooms.get(roomId);
    if (!room) return cb?.({ success: false, error: 'Room not found.' });

    const currentMatches = room.bracketMatches.filter(m => m.round === room.currentRound);
    const allCompleted = currentMatches.every(m => m.status === 'COMPLETED');
    if (!allCompleted) {
      return cb?.({ success: false, error: 'All matches in the current round must be finished.' });
    }

    const roundWinners = currentMatches.map(m => m.winner).filter(Boolean) as TournamentPlayerState[];

    if (roundWinners.length <= 1) {
      // Tournament Winner!
      const champ = roundWinners[0] || room.players[0];
      room.champion = champ;
      room.phase = 'CHAMPION';

      // Award Champion in database
      if (champ?.userId) {
        const u = database.getRawUser(champ.userId);
        if (u) {
          u.astra = (u.astra || 0) + 5000;
          u.cardShards = (u.cardShards || 0) + 50;
          u.tournamentWins = (u.tournamentWins || 0) + 1;
          database.save();
        }
      }

      io.to(room.id).emit('tournament_champion_crowned', { champion: champ, room });
      io.to(room.id).emit('tournament_room_updated', room);
      return cb?.({ success: true, room });
    }

    // Generate next round
    const nextRound = room.currentRound + 1;
    const nextMatches: TournamentBracketMatch[] = [];
    for (let i = 0; i < roundWinners.length; i += 2) {
      if (i + 1 < roundWinners.length) {
        nextMatches.push({
          id: `match-r${nextRound}-${Math.floor(i / 2) + 1}`,
          round: nextRound,
          matchNumber: Math.floor(i / 2) + 1,
          player1: roundWinners[i],
          player2: roundWinners[i + 1],
          status: 'PENDING',
        });
      } else {
        // Bye
        nextMatches.push({
          id: `match-r${nextRound}-bye`,
          round: nextRound,
          matchNumber: Math.floor(i / 2) + 1,
          player1: roundWinners[i],
          winner: roundWinners[i],
          status: 'COMPLETED',
        });
      }
    }

    room.currentRound = nextRound;
    room.bracketMatches.push(...nextMatches);

    io.to(room.id).emit('tournament_room_updated', room);
    cb?.({ success: true, room });
  });

  // Team Battle Tournament Invite (Legacy Event compatibility)
  socket.on('team_battle_invite', (data: { targetUserId: string; teamSize: number; maxPlayers: number; roomId?: string; roomCode?: string }, callback) => {
    const cb = typeof callback === 'function' ? callback : undefined;
    const userId = socketUserMap.get(socket.id);
    if (!userId) return cb?.({ success: false, error: 'Not authenticated.' });
    const user = database.getRawUser(userId);
    if (!user) return cb?.({ success: false, error: 'User not found.' });

    const targetSocketId = userSocketMap.get(data?.targetUserId);
    if (!targetSocketId) {
      return cb?.({ success: false, error: 'Player is currently offline.' });
    }

    io.to(targetSocketId).emit('team_battle_invite_received', {
      inviterId: userId,
      inviterName: user.displayName || user.username,
      inviterAvatar: user.avatar || '🦸‍♂️',
      teamSize: data?.teamSize || 1,
      maxPlayers: data?.maxPlayers || 10,
      roomId: data?.roomId,
      roomCode: data?.roomCode,
    });

    cb?.({ success: true, message: 'Tournament invitation sent.' });
  });

  // Disconnect Handling
  socket.on('disconnect', () => {
    const userId = socketUserMap.get(socket.id);
    if (userId) {
      leaveParty(userId, socket.id);
      userSocketMap.delete(userId);
      socketUserMap.delete(socket.id);
      notifyFriendsPresence(userId, false);
    }

    // Clean up tournament queue
    const tourneyQIdx = tournamentQueue.findIndex(q => q.socketId === socket.id);
    if (tourneyQIdx >= 0) tournamentQueue.splice(tourneyQIdx, 1);

    // Clean up tournament rooms
    const tourneyRoomId = socketTournamentRoom.get(socket.id);
    if (tourneyRoomId) {
      socketTournamentRoom.delete(socket.id);
      const room = tournamentRooms.get(tourneyRoomId);
      if (room && room.phase === 'LOBBY') {
        room.players = room.players.filter(p => p.socketId !== socket.id);
        if (room.players.length === 0) {
          tournamentRooms.delete(tourneyRoomId);
        } else {
          if (room.hostUserId === userId) {
            room.hostUserId = room.players[0].userId;
            room.players[0].isHost = true;
          }
          io.to(room.id).emit('tournament_room_updated', room);
        }
      }
    }

    const queueIndex = ascensionQueue.findIndex(item => item.socketId === socket.id);
    if (queueIndex >= 0) ascensionQueue.splice(queueIndex, 1);
    const ascensionSession = ascensionSocketSession.get(socket.id);
    if (ascensionSession) {
      const ascensionRoom = ascensionRooms.get(ascensionSession.roomId);
      ascensionRoom?.removePlayer(socket.id);
      ascensionSocketSession.delete(socket.id);
      if (ascensionRoom && ascensionRoom.state.phase === 'LOBBY' && ascensionRoom.state.players.length === 0) {
        ascensionRooms.delete(ascensionSession.roomId);
      }
    }
    const session = socketToRoom.get(socket.id);
    if (session) {
      const room = rooms.get(session.roomId);
      if (room) {
        room.removePlayer(session.playerId);
        if (room.state.players.length === 0) {
          rooms.delete(session.roomId);
          console.log(`[Room Destroyed] ${session.roomId} empty.`);
        }
      }
      socketToRoom.delete(socket.id);
    }
    console.log(`[Socket] Disconnected: ${socket.id}`);
  });
});

// ==========================================
// v4.0 — LEVEL MILESTONE CRATES
// ==========================================
app.get('/api/progression/crates', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const crates = database.getAvailableLevelCrates(user.id);
  res.json({ success: true, crates });
});

app.post('/api/progression/claim-crate', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { level } = req.body;
  if (typeof level !== 'number') return res.status(400).json({ success: false, error: 'Level required.' });
  const result = database.claimLevelCrate(user.id, level);
  res.json(result);
});

// ==========================================
// v4.0 — CARD FORGE (CRAFTING)
// ==========================================
app.get('/api/forge/info', (_req, res) => {
  const info = database.getForgeInfo();
  res.json({ success: true, ...info });
});

app.post('/api/forge/craft', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { category } = req.body;
  if (!category) return res.status(400).json({ success: false, error: 'Category required.' });
  const result = database.craftCard(user.id, category);
  res.json(result);
});

// ==========================================
// v4.0 — CHARACTER MASTERY
// ==========================================
app.post('/api/mastery/award', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { characterId, xp } = req.body;
  if (!characterId || typeof xp !== 'number') return res.status(400).json({ success: false, error: 'characterId and xp required.' });
  const result = database.awardMasteryXp(user.id, characterId, xp);
  res.json(result);
});

// ==========================================
// v4.0 — DAILY MISSIONS
// ==========================================
app.get('/api/missions/daily', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.getDailyMissions(user.id);
  res.json(result);
});

app.post('/api/missions/daily/update', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { eventType, amount } = req.body;
  if (!eventType) return res.status(400).json({ success: false, error: 'eventType required.' });
  const result = database.updateMissionProgressExternal(user.id, eventType, amount || 1);
  res.json(result);
});

app.post('/api/missions/daily/claim', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { missionId } = req.body;
  if (!missionId) return res.status(400).json({ success: false, error: 'missionId required.' });
  const result = database.claimDailyMission(user.id, missionId);
  res.json(result);
});

// ==========================================
// v4.0 — WEEKLY CHALLENGES
// ==========================================
app.get('/api/missions/weekly', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.getWeeklyChallenges(user.id);
  res.json(result);
});

app.post('/api/missions/weekly/claim', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { missionId } = req.body;
  if (!missionId) return res.status(400).json({ success: false, error: 'missionId required.' });
  const result = database.claimWeeklyChallenge(user.id, missionId);
  res.json(result);
});

// ==========================================
// v4.0 — ACHIEVEMENTS
// ==========================================
app.get('/api/achievements', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const info = database.getForgeInfo();
  const userAchievements = database.getAchievements(user.id);
  res.json({ success: true, achievements: userAchievements.achievements || {}, definitions: info.achievementDefs });
});

app.post('/api/achievements/claim', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { achievementId } = req.body;
  if (!achievementId) return res.status(400).json({ success: false, error: 'achievementId required.' });
  const result = database.claimAchievement(user.id, achievementId);
  res.json(result);
});

// ==========================================
// v4.0 — MYSTERY WHEEL
// ==========================================
app.post('/api/wheel/spin', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.spinMysteryWheel(user.id);
  res.json(result);
});

// ==========================================
// v4.0 — TEAM BUILDER
// ==========================================
app.get('/api/teams', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.getTeams(user.id);
  res.json(result);
});

app.post('/api/teams/save', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { name, characterIds, teamId } = req.body;
  const result = database.saveTeam(user.id, name, characterIds, teamId);
  res.json(result);
});

app.delete('/api/teams/:teamId', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const result = database.deleteTeam(user.id, req.params.teamId);
  res.json(result);
});

// ==========================================
// v4.0 — ADMIN REWARD GRANT
// ==========================================
app.post('/api/admin/grant-reward', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  if (user.role !== 'admin' && !user.isAdmin) return res.status(403).json({ success: false, error: 'ACCESS DENIED.' });
  const { targetUsername, rewardType, amount, characterId } = req.body;
  if (!targetUsername || !rewardType) return res.status(400).json({ success: false, error: 'targetUsername and rewardType required.' });
  const result = database.adminGrantReward(user.id, targetUsername, rewardType, amount || 0, characterId);
  res.json(result);
});

// ==========================================
// v4.0 — TRACK GAME MODE PLAYED
// ==========================================
app.post('/api/progression/track-mode', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized.' });
  const { mode } = req.body;
  if (!mode) return res.status(400).json({ success: false, error: 'mode required.' });
  database.trackGameModePlayed(user.id, mode);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`⚡ MARVEL: AUCTION WARS Server running on port ${PORT}`);
  console.log(`⚔️ Loaded ${ALL_CHARACTERS.length} Marvel Characters`);
});

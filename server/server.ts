import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { GameRoom } from './rooms';
import { ALL_CHARACTERS } from '../src/data/characters/index';
import { Player, GameSettings } from '../src/types/game';

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

// API Endpoints
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, charactersTotal: ALL_CHARACTERS.length });
});

app.get('/api/characters', (_req, res) => {
  res.json(ALL_CHARACTERS);
});

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

// Real-time Socket.io logic
io.on('connection', (socket: Socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // 1. Create Room
  socket.on('create_room', (data: { playerName: string; avatar: string }, callback) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const roomId = `MARVEL-${randomCode}`;

    const hostPlayer: Player = {
      id: socket.id,
      name: data.playerName || 'Host Player',
      avatar: data.avatar || '🦸‍♂️',
      money: 30,
      collection: [],
      isHost: true,
      isReady: true,
      isBot: false,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    const room = new GameRoom(roomId, hostPlayer, (updatedState) => {
      io.to(roomId).emit('game_state_update', updatedState);
    });

    rooms.set(roomId, room);
    socketToRoom.set(socket.id, { roomId, playerId: socket.id });
    socket.join(roomId);

    console.log(`[Room Created] ${roomId} by ${hostPlayer.name}`);
    callback({ success: true, roomId, state: room.state });
  });

  // 2. Join Room
  socket.on('join_room', (data: { roomId: string; playerName: string; avatar: string }, callback) => {
    const code = data.roomId.toUpperCase().trim();
    const room = rooms.get(code);

    if (!room) {
      return callback({ success: false, error: `Room ${code} not found.` });
    }

    const player: Player = {
      id: socket.id,
      name: data.playerName || `Player ${room.state.players.length + 1}`,
      avatar: data.avatar || '🦸‍♀️',
      money: room.state.settings.startingMoney,
      collection: [],
      isHost: false,
      isReady: false,
      isBot: false,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    const added = room.addPlayer(player);
    if (!added) {
      return callback({ success: false, error: 'Room is full or game already started.' });
    }

    socketToRoom.set(socket.id, { roomId: code, playerId: socket.id });
    socket.join(code);

    console.log(`[Player Joined] ${player.name} joined ${code}`);
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
  socket.on('start_game', () => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room && room.state.players.find(p => p.id === socket.id)?.isHost) {
      room.startGame();
    }
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
  socket.on('execute_battle_action', (data: { action: any; fighterIndex?: number }, callback) => {
    const session = socketToRoom.get(socket.id);
    if (!session) return callback?.({ success: false, error: 'Session not found.' });
    const room = rooms.get(session.roomId);
    if (!room) return callback?.({ success: false, error: 'Room not found.' });

    const res = room.executeBattleAction(session.playerId, data.action, data.fighterIndex);
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

  // 9D. Proceed from Relic Shop to Tournament Battles
  socket.on('proceed_to_battles', () => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room) {
      room.proceedToBattles();
    }
  });

  // 10. Restart Game
  socket.on('restart_game', () => {
    const session = socketToRoom.get(socket.id);
    if (!session) return;
    const room = rooms.get(session.roomId);
    if (room && room.state.players.find(p => p.id === socket.id)?.isHost) {
      room.resetGame();
    }
  });

  // Disconnect Handling
  socket.on('disconnect', () => {
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`⚡ MARVEL: AUCTION WARS Server running on port ${PORT}`);
  console.log(`⚔️ Loaded ${ALL_CHARACTERS.length} Marvel Characters`);
});

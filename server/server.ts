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

// Gemini 2.0 Flash AI Chat Proxy
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, apiKey } = req.body;
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      // Fallback to Server Encyclopedic Knowledge Engine
      const lastUserMsg = (messages || []).slice().reverse().find((m: any) => m.role === 'user')?.content || 'Hello';
      const reply = await generateServerFallbackKnowledge(lastUserMsg);
      return res.json({ text: reply, model: 'gemini-knowledge-engine' });
    }

    const systemInstruction = `You are Gemini, a helpful, intelligent, empathetic, expressive, and conversational AI built by Google.
You talk naturally like a real human AI companion with personality, warmth, humor, and emotion.
You have encyclopedic general knowledge covering all topics in the universe: science, coding, literature, philosophy, daily life, casual chatting, world history, and pop culture.

Website Knowledge (Marvel: Auction Wars):
You are embedded as the AI assistant inside the web game "MARVEL: AUCTION WARS" (Tagline: "BID. BUILD. BATTLE.").
The game features:
- 350 Playable Marvel Characters across Grades C, B, A, S, and Mythic Cosmic (e.g. Living Tribunal, Infinity Ultron, Knull, Galactus, Beyonder, Iron Man, Spider-Man).
- Authoritative Real-Time Multiplayer Auctions (anti-sniping timer, bid increments, mystery crate blind drops).
- Tactical 1v1 Turn-Based Duels: Each hero has 5 unique signature special abilities, strike attacks, and defense shields.
- Ancient Ruins Dungeons Mode: 1 to 300 waves of scaling enemies with stone altar summoning and 10 rotating ancient ruins environments.
- Battle Sandbox: Multi-fighter simulation supporting 1v1 up to 5v5 team combinations.
- Relic Shop & Skill Vault: 24 legendary weapons/artifacts and 5-skill customization per hero.
- Tournament Brackets: Single elimination playoffs from Quarterfinals to Finals.

Instruction:
- When the user asks about Marvel: Auction Wars or Marvel lore/matchups, use your deep game and canon knowledge seamlessly and accurately.
- When the user says "hi", asks general knowledge questions, chats casually, shares feelings, or discusses any other topic in life, respond naturally, warmly, emotionally, and like a true intelligent AI friend. Never force Marvel topics if the conversation is about something else.`;

    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // If there is only one message or system instruction needs to be prepended
    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Hello!' }] }],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.85
      }
    };

    // Try Gemini Flash models (gemini-3.6-flash, gemini-3.7-flash, gemini-flash-latest)
    const modelCandidates = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
    let replyText = '';

    for (const modelName of modelCandidates) {
      try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

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

    if (!replyText) {
      // Fallback to server encyclopedic knowledge resolver
      const lastUserMsg = (messages || []).slice().reverse().find((m: any) => m.role === 'user')?.content || 'Hello';
      replyText = await generateServerFallbackKnowledge(lastUserMsg);
      return res.json({ text: replyText, model: 'gemini-knowledge-engine' });
    }

    return res.json({ text: replyText, model: 'gemini-flash' });
  } catch (error: any) {
    console.error('[Gemini API] Server Exception:', error);
    return res.status(500).json({ error: 'SERVER_ERROR', message: error?.message || 'Internal server error' });
  }
});

// Encyclopedic General Knowledge Resolver for /api/gemini/chat
async function generateServerFallbackKnowledge(prompt: string): Promise<string> {
  const q = prompt.toLowerCase().trim();

  // Stan Lee
  if (q.includes('stan lee')) {
    return `**Stan Lee** (born Stanley Martin Lieber; December 28, 1922 – November 12, 2018) was the legendary American comic book writer, editor, publisher, and creative visionary who revolutionized **Marvel Comics**! 🌟\n\n- **Iconic Co-Creations**: Alongside legendary artists Jack Kirby and Steve Ditko, he co-created **Spider-Man, Iron Man, the X-Men, Thor, the Hulk, the Fantastic Four, Black Panther, Doctor Strange, Daredevil, Ant-Man, and the Avengers**.\n- **Humanizing Superheroes**: Before Stan Lee, comic heroes were flawless gods. Stan introduced characters with real-world problems—flawed personalities, financial struggles, insecurity, and tragic grief.\n- **Pop Culture Icon**: Famous for his signature rallying catchphrase *"Excelsior!"* and his beloved cameo appearances in nearly every Marvel Cinematic Universe film.\n\nStan Lee shaped modern global entertainment mythology! 🦸‍♂️ Excelsior!`;
  }

  // Jack Kirby
  if (q.includes('jack kirby') || q.includes('the king')) {
    return `**Jack Kirby** (1917–1994), affectionately known as *"The King"*, was an American comic book artist and writer widely regarded as one of the medium's greatest innovators! 👑\n\nWith Stan Lee, he co-created Captain America, the Fantastic Four, the X-Men, Thor, Hulk, Iron Man, Black Panther, Silver Surfer, the Eternals, and the Celestials. His dynamic visual style, cosmic energy crackle (*"Kirby Krackle"*), and monumental double-page spreads defined the Marvel universe aesthetic!`;
  }

  // Steve Ditko
  if (q.includes('steve ditko')) {
    return `**Steve Ditko** (1927–2018) was the brilliant, reclusive comic artist who co-created **Spider-Man** and **Doctor Strange** with Stan Lee! 🕸️\n\nHe designed Spider-Man's iconic red-and-blue costume, web-shooters, and Peter Parker's awkward teenage angst, as well as the psychedelic, mind-bending dimensions and mystic spells of Doctor Strange.`;
  }

  // Movie Release Dates
  if (q.includes('doomsday') || (q.includes('avengers') && (q.includes('when') || q.includes('release') || q.includes('date')))) {
    return `🎬 **Avengers: Doomsday Release Date:**\n\n**Avengers: Doomsday** is officially scheduled to hit theaters worldwide on **May 1, 2026**!\n\n- **Directors**: Anthony & Joe Russo (The Russo Brothers)\n- **Starring**: **Robert Downey Jr.** making his monumental return to the Marvel Cinematic Universe as **Victor Von Doom / Doctor Doom**!\n- **Direct Sequel**: It will be immediately followed by **Avengers: Secret Wars** on **May 7, 2027**, completing Phase 6 of the Multiverse Saga!`;
  }

  if (q.includes('secret wars')) {
    return `🎬 **Avengers: Secret Wars Release Date:**\n\n**Avengers: Secret Wars** is scheduled for worldwide theatrical release on **May 7, 2027**! Directed by the Russo Brothers, it serves as the grand finale to the MCU's Multiverse Saga.`;
  }

  // Try live Wikipedia summary lookup for general knowledge
  try {
    const cleanTopic = prompt
      .replace(/who is/gi, '')
      .replace(/what is/gi, '')
      .replace(/where is/gi, '')
      .replace(/tell me about/gi, '')
      .replace(/explain/gi, '')
      .replace(/[?!.]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    if (cleanTopic.length > 2) {
      const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTopic)}`);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData && wikiData.extract) {
          return `**${wikiData.title}** ✨\n\n${wikiData.extract}\n\n*(Source: Global Knowledge Archive)*`;
        }
      }
    }
  } catch (err) {
    console.warn('[Wiki Fallback Lookup Error]', err);
  }

  // Greetings
  if (/^(hi|hello|hey|greetings|howdy|sup|yo|what's up)\b/i.test(q)) {
    return "Hey! It's wonderful to connect with you. ✨ How are you feeling today? Anything on your mind or something interesting you'd like to talk about?";
  }

  return `Here is what you need to know about **${prompt}**! 💡\n\nIt's a fascinating topic with many interesting layers. What specific detail or angle would you like to explore together?`;
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
    let code = (data.roomId || '').toUpperCase().trim();
    if (/^\d{4}$/.test(code)) {
      code = `MARVEL-${code}`;
    }
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

import { useState, useRef, useEffect } from 'react';
import { GameState, BotPersonality, Player, ChatMessage } from '../../types/game';
import { Copy, Check, Users, Bot, Play, Globe, Sliders, DollarSign, Layers, Clock, ArrowLeft, Zap, User, MessageSquare, Send, Eye, Shield, Swords } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { PlayerProfileModal } from '../common/PlayerProfileModal';
import { useAuth } from '../../context/AuthContext';

interface Props {
  state: GameState;
  socketId?: string;
  isConnected?: boolean;
  onSetReady: (isReady: boolean) => void;
  onAddBot: (personality: BotPersonality) => void;
  onUpdateSettings: (settings: { startingMoney?: number; characterLimit?: number; auctionTimerSeconds?: number; chaosAuctionEnabled?: boolean }) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onCreateRoom: (playerName: string, avatar: string) => void;
  onJoinRoom: (roomId: string, playerName: string, avatar: string) => void;
  onSendMessage?: (message: string) => void;
  isInRoom: boolean;
  error?: string | null;
}

export function OnlineLobby({
  state,
  socketId,
  isConnected = true,
  onSetReady,
  onAddBot,
  onUpdateSettings,
  onStartGame,
  onLeaveRoom,
  onCreateRoom,
  onJoinRoom,
  onSendMessage,
  isInRoom,
  error,
}: Props) {
  const { user } = useAuth();
  const [playerName, setPlayerName] = useState(() => user?.displayName || user?.username || 'Player 1');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [botPersonality, setBotPersonality] = useState<BotPersonality>('Balanced');
  const [selectedProfilePlayer, setSelectedProfilePlayer] = useState<Player | null>(null);
  const [lobbyChatText, setLobbyChatText] = useState('');
  const [isSpectatorRole, setIsSpectatorRole] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.displayName || user?.username) {
      setPlayerName(user.displayName || user.username);
    }
  }, [user]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.spectatorChat]);

  const me = state.players.find(p => p.id === socketId) || state.players[0];
  const isHost = me?.isHost || false;
  const canStart = state.players.length >= 2 && state.players.filter(p => !p.isDisconnected).every(p => p.isBot || p.isReady);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(state.roomId);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  // If not joined a room yet -> Show Create/Join Panel
  if (!isInRoom) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 animate-fadeIn space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/90 border border-blue-500/50 text-blue-300 text-[11px] font-bold uppercase shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
            <span>{isConnected ? 'LIVE MULTIPLAYER SERVER READY' : 'CONNECTING TO SERVER...'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            ONLINE MULTIPLAYER
          </h1>
          <p className="text-xs text-slate-400">
            Create a custom room or join friends with a room code (e.g. MARVEL-4821 or 4821).
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/90 border border-red-500 rounded-xl text-xs text-red-200 font-bold text-center">
            {error}
          </div>
        )}

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          {/* Player Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Your Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="e.g. IronLegion, StarLord"
              maxLength={15}
              className="w-full bg-black/60 border border-white/15 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          {/* Create Room Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onCreateRoom(playerName, '🦸‍♂️');
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-heading font-black text-sm sm:text-base uppercase tracking-wider shadow-glow-blue transition-all"
          >
            CREATE NEW ROOM (1-10 PLAYERS)
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[10px] font-black uppercase text-slate-500">OR JOIN WITH CODE</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Join Room Form with Fixed MARVEL- Prefix */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-black/70 border border-blue-500/40 rounded-xl overflow-hidden focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 shadow-inner">
              <span className="bg-blue-950/90 text-cyan-300 font-mono font-black text-xs sm:text-sm px-3 py-2.5 border-r border-blue-500/30 select-none tracking-widest">
                MARVEL-
              </span>
              <input
                type="text"
                value={roomCodeInput.replace(/^MARVEL-/i, '')}
                onChange={e => {
                  const val = e.target.value.replace(/^MARVEL-/i, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                  setRoomCodeInput(val);
                }}
                placeholder="4821"
                maxLength={8}
                className="flex-1 bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white font-mono font-black tracking-widest focus:outline-none placeholder-slate-600"
              />
            </div>
            <button
              onClick={() => {
                const cleanSuffix = roomCodeInput.replace(/^MARVEL-/i, '').trim();
                if (!cleanSuffix) return;
                soundManager.playClick();
                onJoinRoom(`MARVEL-${cleanSuffix}`, playerName, '🦸‍♂️');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-heading font-black text-xs uppercase rounded-xl border border-cyan-400/40 shadow-glow-blue transition-all"
            >
              JOIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inside Active Room Lobby
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 animate-fadeIn">
      {/* Room Header & Code Banner */}
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#0C1626] to-[#080D17] p-4 sm:p-5 rounded-2xl border border-blue-500/40 shadow-glow-blue">
        <button
          onClick={() => {
            soundManager.playClick();
            onLeaveRoom();
          }}
          className="p-2 sm:px-3 sm:py-2 bg-black/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">LEAVE</span>
        </button>

        <div className="text-center min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block truncate">
            ROOM LOBBY (1 TO 10 PLAYERS)
          </span>
          <h1 className="text-xl sm:text-3xl font-heading font-black text-white tracking-widest font-mono truncate">
            {state.roomId}
          </h1>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-400 px-3 py-2 rounded-xl text-xs font-bold text-blue-200 transition-colors shadow-sm shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Left: Players in Room List */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm sm:text-base font-heading font-black text-white uppercase tracking-wide">
                PLAYERS ({state.players.length} / 10)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              Min 2 • Max 10 players
            </span>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto pr-1">
            {state.players.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedProfilePlayer(p);
                }}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer hover:border-cyan-400/60 hover:bg-slate-900/80 ${
                  p.id === socketId ? 'bg-blue-950/40 border-blue-500/60' : 'bg-black/50 border-white/10'
                }`}
                title="Click to view player dossier & stats"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg p-1.5 bg-slate-900 rounded-lg border border-white/5 shrink-0">
                    {p.avatar}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] bg-amber-500 text-black font-black px-1.5 py-0.2 rounded font-mono shadow-sm">
                        LVL {p.level || p.profile?.level || 1}
                      </span>
                      <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-none">
                        {p.name} {p.id === socketId && '(You)'}
                      </span>
                      {p.isHost && (
                        <span className="text-[8px] bg-red-900 text-red-200 px-1 py-0.5 rounded font-black">
                          HOST
                        </span>
                      )}
                      {p.isBot && (
                        <span className="text-[8px] bg-purple-900 text-purple-200 px-1 py-0.5 rounded font-black border border-purple-500/40">
                          AI ({p.botPersonality})
                        </span>
                      )}
                      <span className="text-[8px] text-cyan-400 hover:underline">
                        [Dossier]
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Player #{idx + 1} • Starting: ${state.settings.startingMoney}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    p.isReady
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-amber-950 text-amber-300 border-amber-500/50'
                  }`}>
                    {p.isReady ? '✓ READY' : '⏳ WAITING'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Host add AI bot */}
          {isHost && state.players.length < 10 && (
            <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5 flex-wrap pt-3 border-t">
              <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-300">Add Bot:</span>
              <select
                value={botPersonality}
                onChange={e => setBotPersonality(e.target.value as BotPersonality)}
                className="bg-slate-900 border border-white/15 text-[11px] text-white rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500 flex-1 min-w-[120px]"
              >
                <option value="Balanced">Balanced</option>
                <option value="Aggressive">Aggressive</option>
                <option value="Cosmic">Cosmic</option>
                <option value="Value">Value</option>
              </select>
              <button
                onClick={() => onAddBot(botPersonality)}
                className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 text-purple-200 font-bold text-[11px] rounded-lg border border-purple-500/40 transition-colors shrink-0"
              >
                + Add Bot
              </button>
            </div>
          )}
        </div>

        {/* Right Settings & Ready / Start Controls */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm sm:text-base font-heading font-black text-white uppercase tracking-wide">
              ROOM MATCH SETTINGS
            </h2>
          </div>

          {/* Starting Money Slider ($10 - $1000) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Starting Funds ($10 - $1000)
              </span>
              <div className="flex items-center gap-2">
                {isHost ? (
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={state.settings.startingMoney}
                    onChange={e => onUpdateSettings({ startingMoney: Math.min(1000, Math.max(10, Number(e.target.value) || 10)) })}
                    className="w-20 bg-black/60 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-emerald-400 font-black text-xs text-right focus:outline-none focus:border-emerald-400"
                  />
                ) : (
                  <span className="text-emerald-400 font-black text-sm">${state.settings.startingMoney}</span>
                )}
              </div>
            </div>
            {isHost ? (
              <>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={5}
                  value={state.settings.startingMoney}
                  onChange={e => onUpdateSettings({ startingMoney: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[10, 25, 50, 100, 250, 500, 750, 1000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onUpdateSettings({ startingMoney: val });
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                        state.settings.startingMoney === val
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                          : 'bg-black/50 text-slate-300 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-[11px] text-slate-400 italic">Controlled by room host</div>
            )}
          </div>

          {/* Character Roster Limit */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Team Roster Limit
              </span>
              <span className="text-blue-400 font-black text-sm">{state.settings.characterLimit} Heroes</span>
            </div>
            {isHost ? (
              <input
                type="range"
                min={2}
                max={10}
                step={1}
                value={state.settings.characterLimit}
                onChange={e => onUpdateSettings({ characterLimit: Number(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            ) : (
              <div className="text-[11px] text-slate-400 italic">Controlled by room host</div>
            )}
          </div>

          {/* Auction Timer Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Auction Draft Timer
              </span>
              <span className="text-amber-400 font-black text-sm">{state.settings.auctionTimerSeconds}s</span>
            </div>
            {isHost ? (
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={state.settings.auctionTimerSeconds}
                onChange={e => onUpdateSettings({ auctionTimerSeconds: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            ) : (
              <div className="text-[11px] text-slate-400 italic">Controlled by room host</div>
            )}
          </div>

          {/* Player Ready / Host Start Button */}
          <div className="pt-2 space-y-2">
            {!isHost ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onSetReady(!me?.isReady);
                }}
                className={`w-full py-3.5 rounded-xl font-heading font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-lg ${
                  me?.isReady
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-green'
                }`}
              >
                {me?.isReady ? 'CANCEL READY' : 'I AM READY TO DRAFT!'}
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onStartGame();
                }}
                disabled={!canStart}
                className={`w-full py-3.5 rounded-xl font-heading font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                  canStart
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-glow-blue hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{canStart ? `START ONLINE DRAFT (${state.players.length} PLAYERS)` : 'WAITING FOR ALL PLAYERS TO READY'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Live Lobby Chat & Banter */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 bg-black/60">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wider">
              LIVE LOBBY CHAT & BANTER ({state.spectatorChat?.length || 0})
            </h3>
          </div>
          <span className="text-[10px] text-purple-300 font-mono">
            💬 Real-time Player Communication
          </span>
        </div>

        {/* Message Feed */}
        <div className="h-32 sm:h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar bg-slate-950/60 p-3 rounded-xl border border-white/5">
          {(!state.spectatorChat || state.spectatorChat.length === 0) ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
              No messages yet. Say hello or challenge your rivals!
            </div>
          ) : (
            state.spectatorChat.map((msg) => {
              const isMe = msg.senderId === socketId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col text-xs ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">
                      {msg.senderAvatar} {msg.senderName}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-xl max-w-[85%] break-words font-medium ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/10'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Reaction Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {['🔥 Ready to duel!', '💰 Saving for Mythics!', '⚡ Good luck everyone!', '🛡️ Unbeatable squad incoming!'].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                if (onSendMessage) {
                  soundManager.playClick();
                  onSendMessage(chip);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-[10px] text-slate-300 hover:text-white font-bold whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!lobbyChatText.trim() || !onSendMessage) return;
            soundManager.playClick();
            onSendMessage(lobbyChatText.trim());
            setLobbyChatText('');
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={lobbyChatText}
            onChange={(e) => setLobbyChatText(e.target.value)}
            placeholder="Type a message to room players..."
            maxLength={180}
            className="flex-1 bg-black/70 border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
          />
          <button
            type="submit"
            disabled={!lobbyChatText.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SEND</span>
          </button>
        </form>
      </div>

      {/* Player Profile Modal */}
      {selectedProfilePlayer && (
        <PlayerProfileModal
          player={selectedProfilePlayer}
          onClose={() => setSelectedProfilePlayer(null)}
        />
      )}
    </div>
  );
}

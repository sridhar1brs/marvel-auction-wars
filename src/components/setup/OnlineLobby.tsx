import { useState } from 'react';
import { GameState, BotPersonality } from '../../types/game';
import { Copy, Check, Users, Bot, Play, Globe, Sliders, DollarSign, Layers, Clock, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  state: GameState;
  socketId?: string;
  isConnected?: boolean;
  onSetReady: (isReady: boolean) => void;
  onAddBot: (personality: BotPersonality) => void;
  onUpdateSettings: (settings: { startingMoney?: number; characterLimit?: number; auctionTimerSeconds?: number }) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onCreateRoom: (playerName: string, avatar: string) => void;
  onJoinRoom: (roomId: string, playerName: string, avatar: string) => void;
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
  isInRoom,
  error,
}: Props) {
  const [playerName, setPlayerName] = useState('Player 1');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [botPersonality, setBotPersonality] = useState<BotPersonality>('Balanced');

  const me = state.players.find(p => p.id === socketId) || state.players[0];
  const isHost = me?.isHost || false;

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
            CREATE NEW ROOM
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[10px] font-black uppercase text-slate-500">OR JOIN WITH CODE</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Join Room Form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={roomCodeInput}
              onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="ROOM CODE (e.g. MARVEL-4821 or 4821)"
              maxLength={20}
              className="flex-1 bg-black/60 border border-white/15 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => {
                if (!roomCodeInput.trim()) return;
                soundManager.playClick();
                onJoinRoom(roomCodeInput.trim(), playerName, '🦸‍♂️');
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-heading font-black text-xs uppercase rounded-xl border border-white/15 transition-colors"
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
            ROOM LOBBY (2 TO 10 PLAYERS)
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
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-colors ${
                  p.id === socketId ? 'bg-blue-950/40 border-blue-500/60' : 'bg-black/50 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg p-1.5 bg-slate-900 rounded-lg border border-white/5 shrink-0">
                    {p.avatar}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
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

          {/* Starting Money Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Starting Funds ($10 - $150)
              </span>
              <span className="text-emerald-400 font-black text-sm">${state.settings.startingMoney}</span>
            </div>
            {isHost ? (
              <input
                type="range"
                min={10}
                max={150}
                step={5}
                value={state.settings.startingMoney}
                onChange={e => onUpdateSettings({ startingMoney: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
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
                disabled={state.players.length < 2}
                className={`w-full py-3.5 rounded-xl font-heading font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                  state.players.length >= 2
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-glow-blue hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START ONLINE DRAFT ({state.players.length} PLAYERS)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { GameState, BotPersonality } from '../../types/game';
import { Copy, Check, Users, Bot, Play, Globe, Sliders, DollarSign, Layers, Clock } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  state: GameState;
  socketId?: string;
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
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>REAL-TIME MULTIPLAYER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            ONLINE LOBBY
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create a custom room or join friends with a 6-digit room code.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500 rounded-xl text-xs text-red-200 font-bold text-center">
            {error}
          </div>
        )}

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          {/* Player Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="e.g. IronLegion, StarLord"
              maxLength={15}
              className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          {/* Create Room Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onCreateRoom(playerName, '🦸‍♂️');
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-heading font-black text-base uppercase tracking-wider shadow-glow-blue transition-all"
          >
            CREATE NEW ROOM
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-black uppercase text-slate-500">OR JOIN EXISTING</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Join Room Form */}
          <div className="space-y-2">
            <input
              type="text"
              value={roomCodeInput}
              onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="ENTER ROOM CODE (e.g. MARVEL-4821)"
              className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono font-bold tracking-widest text-center uppercase"
            />
            <button
              onClick={() => {
                soundManager.playClick();
                onJoinRoom(roomCodeInput, playerName, '🦸‍♀️');
              }}
              disabled={!roomCodeInput.trim()}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors"
            >
              JOIN ROOM
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onLeaveRoom();
            }}
            className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  // Inside Active Room Lobby
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Room Header & Code Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-blue-500/30 shadow-glow-blue mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block">
            ROOM LOBBY (UP TO 8 PLAYERS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-widest">
            {state.roomId}
          </h1>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 bg-blue-950/80 hover:bg-blue-900 border border-blue-400 px-4 py-2 rounded-xl text-xs font-bold text-blue-200 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY ROOM CODE'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide">
                  Players in Room ({state.players.length} / 8)
                </h2>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 mb-5 max-h-72 overflow-y-auto pr-1">
              {state.players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    p.id === socketId ? 'bg-blue-950/30 border-blue-500/50' : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-slate-900 rounded-lg border border-white/5">
                      {p.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">
                          {p.name} {p.id === socketId && '(You)'}
                        </span>
                        {p.isHost && (
                          <span className="text-[9px] bg-red-900/80 text-red-200 px-1.5 py-0.5 rounded font-black">
                            HOST
                          </span>
                        )}
                        {p.isBot && (
                          <span className="text-[9px] bg-purple-900/80 text-purple-200 px-1.5 py-0.5 rounded font-black border border-purple-500/40">
                            AI ({p.botPersonality})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Player #{idx + 1} • Starting Balance: ${state.settings.startingMoney}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      p.isReady
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                    }`}>
                      {p.isReady ? '✓ READY' : '⏳ NOT READY'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Host add AI bot */}
            {isHost && state.players.length < 8 && (
              <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-slate-300">Add AI Bot:</span>
                <select
                  value={botPersonality}
                  onChange={e => setBotPersonality(e.target.value as BotPersonality)}
                  className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Cosmic">Cosmic</option>
                  <option value="Value">Value</option>
                </select>
                <button
                  onClick={() => onAddBot(botPersonality)}
                  className="ml-auto px-3 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-lg border border-purple-500/40 transition-colors"
                >
                  + Add Bot
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Settings & Ready / Start Controls */}
        <div className="space-y-4">
          {/* Match Settings (Host Customizable) */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-heading font-black text-white uppercase tracking-wider">
                Room Settings Customization
              </h2>
            </div>

            {isHost ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      Money ($10 - $150)
                    </span>
                    <span className="text-emerald-400 font-black">${state.settings.startingMoney}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={150}
                    step={5}
                    value={state.settings.startingMoney}
                    onChange={e => onUpdateSettings({ startingMoney: Number(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-blue-400" />
                      Roster (2 - 10 Heroes)
                    </span>
                    <span className="text-blue-400 font-black">{state.settings.characterLimit} Heroes</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    step={1}
                    value={state.settings.characterLimit}
                    onChange={e => onUpdateSettings({ characterLimit: Number(e.target.value) })}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Timer (5s - 100s)
                    </span>
                    <span className="text-amber-400 font-black">{state.settings.auctionTimerSeconds}s</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={state.settings.auctionTimerSeconds}
                    onChange={e => onUpdateSettings({ auctionTimerSeconds: Number(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Starting Money:</span>
                  <strong className="text-emerald-400 font-black">${state.settings.startingMoney}</strong>
                </div>
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Roster Limit:</span>
                  <strong className="text-blue-400 font-black">{state.settings.characterLimit} Heroes</strong>
                </div>
                <div className="flex justify-between font-semibold text-slate-300">
                  <span>Auction Timer:</span>
                  <strong className="text-amber-400 font-black">{state.settings.auctionTimerSeconds}s</strong>
                </div>
              </div>
            )}
          </div>

          {/* Player Actions */}
          <div className="space-y-2">
            {!isHost ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onSetReady(!me?.isReady);
                }}
                className={`w-full py-4 rounded-xl font-heading font-black text-base uppercase tracking-wider transition-all shadow-lg ${
                  me?.isReady
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-blue'
                }`}
              >
                {me?.isReady ? 'CANCEL READY' : 'I AM READY'}
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onStartGame();
                }}
                disabled={state.players.length < 2 || !state.players.every(p => p.isReady)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-heading font-black text-base uppercase tracking-wider shadow-glow-red transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START MATCH ({state.players.length} PLAYERS)</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onLeaveRoom();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition-colors"
            >
              ← Leave Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

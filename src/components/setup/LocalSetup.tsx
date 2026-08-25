import { useState } from 'react';
import { Player, GameSettings, BotPersonality } from '../../types/game';
import { Users, Bot, Plus, Trash2, Sliders, Play, DollarSign, Clock, Layers, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  players: Player[];
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onAddPlayer: (name: string, isBot: boolean, personality: BotPersonality) => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: () => void;
  onBack: () => void;
}

export function LocalSetup({
  players,
  settings,
  onUpdateSettings,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
  onBack,
}: Props) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [botPersonality, setBotPersonality] = useState<BotPersonality>('Balanced');

  const handleAddHuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length >= 10) return;
    const name = newPlayerName.trim() || `Player ${players.length + 1}`;
    soundManager.playClick();
    onAddPlayer(name, false, 'Balanced');
    setNewPlayerName('');
  };

  const handleAddBot = () => {
    if (players.length >= 10) return;
    soundManager.playClick();
    onAddPlayer('', true, botPersonality);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 animate-fadeIn">
      {/* Header Bar with Back Button & Title */}
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#14101A] to-[#0A0D14] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="p-2 sm:px-3 sm:py-2 bg-black/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">HOME</span>
        </button>

        <div className="text-center flex-1 min-w-0">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/40 inline-block">
            LOCAL MULTIPLAYER / PASS & PLAY (2 TO 10 PLAYERS)
          </span>
          <h1 className="text-xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider mt-0.5 truncate">
            MATCH SETUP
          </h1>
        </div>

        <div className="w-10 sm:w-16 shrink-0" />
      </div>

      {/* Main Grid: Stacks vertically on Mobile/Phone, 2 columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        
        {/* Left Column: Player Roster (2 to 10 Players) */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              <h2 className="text-sm sm:text-base font-heading font-black text-white uppercase tracking-wide">
                PLAYERS ({players.length} / 10)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              Min 2 • Max 10 players
            </span>
          </div>

          {/* Player List */}
          <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto pr-1">
            {players.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-black/50 border border-white/10 p-2.5 sm:p-3 rounded-xl hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg p-1.5 bg-slate-900 rounded-lg border border-white/5 shrink-0">
                    {p.avatar}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[110px] sm:max-w-none">
                        {p.name}
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
                      Player #{idx + 1} • Starting: ${settings.startingMoney}
                    </span>
                  </div>
                </div>

                {players.length > 2 && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onRemovePlayer(p.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors shrink-0 ml-2"
                    title="Remove Player"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Player Controls */}
          {players.length < 8 && (
            <div className="space-y-2.5 pt-3 border-t border-white/10">
              {/* Add Human Form */}
              <form onSubmit={handleAddHuman} className="flex gap-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  placeholder="Player Name (Tony, Steve...)"
                  maxLength={15}
                  className="flex-1 bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/15 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add Human</span>
                </button>
              </form>

              {/* Add AI Bot Form */}
              <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5 flex-wrap">
                <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-300">Bot:</span>
                <select
                  value={botPersonality}
                  onChange={e => setBotPersonality(e.target.value as BotPersonality)}
                  className="bg-slate-900 border border-white/15 text-[11px] text-white rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500 flex-1 min-w-[120px]"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Cosmic">Cosmic</option>
                  <option value="Value">Value Collector</option>
                </select>
                <button
                  onClick={handleAddBot}
                  className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 text-purple-200 font-bold text-[11px] rounded-lg border border-purple-500/40 transition-colors shrink-0"
                >
                  + Add Bot
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Match Rules & Custom Sliders */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Sliders className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm sm:text-base font-heading font-black text-white uppercase tracking-wide">
              RULES & CUSTOM LIMITS
            </h2>
          </div>

          {/* Game Mode Selector (Mobile Friendly 3 Buttons) */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 block">Game Mode</span>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ gameMode: 'classic' })}
                className={`p-2 rounded-xl border text-center transition-all ${
                  settings.gameMode === 'classic'
                    ? 'bg-red-950/80 border-red-500 text-white shadow-glow-red'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-[11px] font-heading font-black block text-white">👑 CLASSIC</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Standard</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ gameMode: 'blind_bidding' })}
                className={`p-2 rounded-xl border text-center transition-all ${
                  settings.gameMode === 'blind_bidding'
                    ? 'bg-purple-950/80 border-purple-500 text-white shadow-glow-cosmic'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-[11px] font-heading font-black text-purple-300 block">🎲 BLIND</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">100% Mystery</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ gameMode: 'blitz', auctionTimerSeconds: 5 })}
                className={`p-2 rounded-xl border text-center transition-all ${
                  settings.gameMode === 'blitz'
                    ? 'bg-amber-950/80 border-amber-500 text-white shadow-glow-gold'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-[11px] font-heading font-black text-yellow-300 block">⚡ BLITZ</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">5s Speed</span>
              </button>
            </div>
          </div>

          {/* Starting Money Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Starting Funds ($10 - $150)
              </span>
              <span className="text-emerald-400 font-black text-sm">${settings.startingMoney}</span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={settings.startingMoney}
              onChange={e => onUpdateSettings({ startingMoney: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Character Roster Limit Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Team Roster Limit (2 - 10 Heroes)
              </span>
              <span className="text-blue-400 font-black text-sm">{settings.characterLimit} Heroes</span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              step={1}
              value={settings.characterLimit}
              onChange={e => onUpdateSettings({ characterLimit: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Auction Timer Slider (Locked in Blitz mode) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Auction Draft Timer
              </span>
              <span className="text-amber-400 font-black text-sm">
                {settings.gameMode === 'blitz' ? '5s (Locked)' : `${settings.auctionTimerSeconds}s`}
              </span>
            </div>
            {settings.gameMode === 'blitz' ? (
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-300 font-bold">
                ⚡ Blitz Auction is strictly locked to 5-second rapid draft!
              </div>
            ) : (
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={settings.auctionTimerSeconds}
                onChange={e => onUpdateSettings({ auctionTimerSeconds: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            )}
          </div>

          {/* Big Start Match Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onStartGame();
              }}
              disabled={players.length < 2}
              className={`w-full py-3.5 rounded-xl font-heading font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                players.length >= 2
                  ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-glow-red hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START AUCTION DRAFT ({players.length} PLAYERS)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

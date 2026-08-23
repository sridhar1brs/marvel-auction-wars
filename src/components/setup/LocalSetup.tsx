import { useState } from 'react';
import { Player, GameSettings, BotPersonality } from '../../types/game';
import { Users, Bot, Plus, Trash2, Sliders, Play, DollarSign, Clock, Layers } from 'lucide-react';
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
    if (players.length >= 8) return;
    const name = newPlayerName.trim() || `Player ${players.length + 1}`;
    soundManager.playClick();
    onAddPlayer(name, false, 'Balanced');
    setNewPlayerName('');
  };

  const handleAddBot = () => {
    if (players.length >= 8) return;
    soundManager.playClick();
    onAddPlayer('', true, botPersonality);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/40">
          LOCAL MULTIPLAYER / PASS & PLAY
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider mt-2">
          MATCH SETUP
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1">
          Configure player roster (2 to 8 players) and custom match rules. Fill remaining slots with AI Bots!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Player Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide">
                  Players ({players.length} / 8)
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                Minimum 2 players
              </span>
            </div>

            {/* Player List */}
            <div className="space-y-2.5 mb-5 max-h-72 overflow-y-auto pr-1">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-black/40 border border-white/10 p-3 rounded-xl hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-slate-900 rounded-lg border border-white/5">
                      {p.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{p.name}</span>
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
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                      title="Remove Player"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Controls */}
            {players.length < 8 && (
              <div className="space-y-3 pt-3 border-t border-white/10">
                {/* Add Human Form */}
                <form onSubmit={handleAddHuman} className="flex gap-2">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={e => setNewPlayerName(e.target.value)}
                    placeholder="Enter Player Name (e.g. Tony, Steve)"
                    maxLength={15}
                    className="flex-1 bg-black/50 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add Human</span>
                  </button>
                </form>

                {/* Add AI Bot */}
                <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-300">Bot Style:</span>
                  <select
                    value={botPersonality}
                    onChange={e => setBotPersonality(e.target.value as BotPersonality)}
                    className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Balanced">Balanced (Standard)</option>
                    <option value="Aggressive">Aggressive (High Bids)</option>
                    <option value="Cosmic">Cosmic (Hoards for Mythics)</option>
                    <option value="Value">Value Collector (Bargains)</option>
                  </select>
                  <button
                    onClick={handleAddBot}
                    className="ml-auto px-3 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-lg border border-purple-500/40 transition-colors"
                  >
                    + Add Bot
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Settings & Start */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide">
                Rules & Custom Limits
              </h2>
            </div>

            {/* Game Mode Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 block">Game Mode</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ gameMode: 'classic' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    settings.gameMode !== 'blind_bidding'
                      ? 'bg-red-950/70 border-red-500 text-white shadow-glow-red'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs font-heading font-black block">👑 CLASSIC</span>
                  <span className="text-[10px] text-slate-300">Visible Cards & Mystery</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ gameMode: 'blind_bidding' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    settings.gameMode === 'blind_bidding'
                      ? 'bg-purple-950/70 border-purple-500 text-white shadow-glow-cosmic'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs font-heading font-black text-amber-300 block">🎲 BLIND BIDDING</span>
                  <span className="text-[10px] text-purple-200">100% Cosmic Crates</span>
                </button>
              </div>
            </div>

            {/* Starting Money: 10 to 150 */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Starting Money ($10 - $150)
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
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Character Limit: 2 to 10 */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-300 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Roster Limit (2 - 10 Heroes)
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
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Auction Timer: 5 to 100 sec */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Auction Timer (5s - 100s)
                </span>
                <span className="text-amber-400 font-black text-sm">{settings.auctionTimerSeconds}s</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={settings.auctionTimerSeconds}
                onChange={e => onUpdateSettings({ auctionTimerSeconds: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Start / Back Controls */}
          <div className="space-y-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onStartGame();
              }}
              disabled={players.length < 2}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-heading font-black text-lg uppercase tracking-wider shadow-glow-red transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START AUCTIONS</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onBack();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition-colors"
            >
              ← Back to Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

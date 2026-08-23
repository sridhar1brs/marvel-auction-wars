import { GamePhase } from '../../types/game';
import { SoundToggle } from './SoundToggle';
import { BookOpen, HelpCircle, Home, Swords, ShoppingBag } from 'lucide-react';
import { ALL_CHARACTERS } from '../../data/characters/index';

interface Props {
  phase: GamePhase;
  roomId?: string;
  isOnline: boolean;
  onNavigate: (phase: GamePhase) => void;
  onHomeClick: () => void;
}

export function Navbar({ phase, roomId, isOnline, onNavigate, onHomeClick }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-marvel-darker/90 backdrop-blur-md border-b border-marvel-border px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand */}
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="bg-marvel-red text-white font-heading font-black text-xl sm:text-2xl px-2.5 py-0.5 tracking-wider rounded transform group-hover:scale-105 transition-transform shadow-glow-red">
            MARVEL
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-sm sm:text-base text-slate-100 tracking-wider leading-none">
              AUCTION WARS
            </span>
            <span className="text-[9px] font-extrabold tracking-widest text-marvel-red leading-none mt-0.5 uppercase hidden sm:block">
              BID. BUILD. BATTLE.
            </span>
          </div>
        </div>

        {/* Center: Mode Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1 rounded-full text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-300">
            {isOnline ? `ROOM: ${roomId}` : 'LOCAL MODE'}
          </span>
          <span className="text-[10px] text-slate-500">•</span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {ALL_CHARACTERS.length} Characters
          </span>
        </div>

        {/* Right: Actions & Sound Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Relic Shop & Weapons */}
          <button
            onClick={() => onNavigate('EQUIPMENT_SHOP')}
            title="Tactical Artifacts & Weapons Shop"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              phase === 'EQUIPMENT_SHOP'
                ? 'bg-purple-950/80 text-purple-200 border-purple-400 shadow-glow-cosmic'
                : 'bg-marvel-card/80 text-amber-300 border-amber-500/40 hover:text-white hover:border-amber-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Relic Shop</span>
          </button>

          {/* Duel Sandbox */}
          <button
            onClick={() => onNavigate('SANDBOX')}
            title="Battle Sandbox & Duel Simulator"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              phase === 'SANDBOX'
                ? 'bg-red-950/80 text-red-200 border-red-500 shadow-glow-red'
                : 'bg-marvel-card/80 text-slate-300 border-marvel-border hover:text-white hover:border-slate-500'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Sandbox</span>
          </button>

          {/* Character Database */}
          <button
            onClick={() => onNavigate('ENCYCLOPEDIA')}
            title={`Browse ${ALL_CHARACTERS.length} Marvel Characters`}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              phase === 'ENCYCLOPEDIA'
                ? 'bg-red-950/80 text-red-200 border-red-500 shadow-glow-red'
                : 'bg-marvel-card/80 text-slate-300 border-marvel-border hover:text-white hover:border-slate-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-marvel-red" />
            <span className="hidden sm:inline">Characters</span>
            <span className="sm:hidden">300</span>
          </button>

          {/* How to Play */}
          <button
            onClick={() => onNavigate('HOW_TO_PLAY')}
            title="How to Play Tutorial"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              phase === 'HOW_TO_PLAY'
                ? 'bg-blue-950/80 text-blue-200 border-blue-500 shadow-glow-blue'
                : 'bg-marvel-card/80 text-slate-300 border-marvel-border hover:text-white hover:border-slate-500'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Sound Toggle */}
          <SoundToggle />

          {/* Home Button if inside game */}
          {phase !== 'HOME' && (
            <button
              onClick={onHomeClick}
              title="Return to Home Screen"
              className="p-1.5 rounded-lg bg-marvel-card/80 border border-marvel-border text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

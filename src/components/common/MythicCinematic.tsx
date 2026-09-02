import { Character } from '../../types/game';
import { CharacterCard } from './CharacterCard';
import { Sparkles, Zap } from 'lucide-react';

interface Props {
  character: Character;
  onDismiss?: () => void;
}

export function MythicCinematic({ character, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 -xl p-4 overflow-hidden animate-shake">
      {/* Background Cosmic Energy Rings */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/20 filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-pink-600/20 filter blur-2xl animate-cosmic-spin pointer-events-none" />

      {/* Cinematic Banner */}
      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/90 border border-purple-500 shadow-glow-cosmic text-purple-300 font-extrabold text-xs uppercase tracking-widest mb-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-purple-300 animate-spin" />
          <span>COSMIC ALERT: MYTHIC ENTITY DETECTED</span>
          <Sparkles className="w-4 h-4 text-purple-300 animate-spin" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-heading text-cosmic-gradient uppercase tracking-widest drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
          {character.name}
        </h1>

        <p className="text-sm font-semibold text-purple-200/80 mt-1 max-w-lg mx-auto">
          {character.alias || 'An ancient cosmic sovereign enters the Auction House.'}
        </p>
      </div>

      {/* Character Card Centerpiece */}
      <div className="relative z-10 max-w-lg w-full transform transition-all duration-700 hover:scale-105">
        <CharacterCard character={character} size="lg" isSpotlight={true} />
      </div>

      {/* Reveal Action / Countdown */}
      <div className="relative z-10 mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-black/60 px-4 py-2 rounded-full border border-white/10">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>STARTING AUCTION PRICE: <strong className="text-emerald-400 text-sm">${character.startingPrice}</strong></span>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-2 text-xs text-purple-300 hover:text-white underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
          >
            Skip Reveal Animation
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { MARVEL_FUN_FACTS, MarvelFunFact } from '../../data/funFacts';
import { soundManager } from '../../audio/soundManager';
import { 
  BookOpen, Sparkles, ChevronLeft, ChevronRight, Shuffle, 
  X, Copy, Check, Star, Lightbulb, Flame, Award
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ComicFunFactsModal({ isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFact: MarvelFunFact = MARVEL_FUN_FACTS[currentIndex] || MARVEL_FUN_FACTS[0];

  const handleNext = () => {
    soundManager.playClick();
    setCurrentIndex((prev) => (prev + 1) % MARVEL_FUN_FACTS.length);
    setCopied(false);
  };

  const handlePrev = () => {
    soundManager.playClick();
    setCurrentIndex((prev) => (prev - 1 + MARVEL_FUN_FACTS.length) % MARVEL_FUN_FACTS.length);
    setCopied(false);
  };

  const handleRandom = () => {
    soundManager.playClick();
    let nextIdx = Math.floor(Math.random() * MARVEL_FUN_FACTS.length);
    if (nextIdx === currentIndex && MARVEL_FUN_FACTS.length > 1) {
      nextIdx = (nextIdx + 1) % MARVEL_FUN_FACTS.length;
    }
    setCurrentIndex(nextIdx);
    setCopied(false);
  };

  const handleCopy = () => {
    soundManager.playClick();
    const textToCopy = `🦸 Marvel Comic Fact: ${currentFact.title}\n\n${currentFact.fact}\n\n📖 Source: ${currentFact.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0A0D18]/95 border-2 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.4)] rounded-3xl max-w-2xl w-full flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-red-500/30 flex items-center justify-between bg-gradient-to-r from-red-950/70 via-slate-900 to-purple-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-500/20 border border-red-400/50 shadow-inner">
              <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-heading font-black text-white uppercase tracking-wider">
                  COMIC FUN FACTS & EASTER EGGS
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Mind-blowing Marvel comic lore, hidden creator secrets & trivia.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fact Card Stage */}
        <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-transparent to-black/60">
          {/* Category Pill & Counter */}
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-500/40 shadow-sm flex items-center gap-1.5">
              <span>{currentFact.icon}</span>
              <span>{currentFact.category}</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-white/10 text-xs font-mono font-bold">
              FACT #{currentIndex + 1} OF {MARVEL_FUN_FACTS.length}
            </span>
          </div>

          {/* Big Visual Fact Box */}
          <div className="p-6 sm:p-7 rounded-3xl bg-black/60 border-2 border-white/10 shadow-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
            {/* Background Glow Aura */}
            <div 
              className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-all"
              style={{ backgroundColor: currentFact.color }}
            />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">{currentFact.icon}</span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide">
                  {currentFact.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {currentFact.fact}
              </p>

              {/* Comic Source Reference */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-xs">
                <span className="text-amber-400 font-mono flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Canon Source: <strong>{currentFact.source}</strong></span>
                </span>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white transition-colors bg-stone-900/80 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Fact'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls Bar (Previous, Shuffle, Next) */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="flex-1 py-3 px-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-slate-300 hover:text-white border border-white/15 text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md transform hover:scale-[1.02]"
            >
              <ChevronLeft className="w-4 h-4 text-red-400" />
              <span>Previous Fact</span>
            </button>

            <button
              onClick={handleRandom}
              className="p-3 rounded-2xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 transition-all flex items-center justify-center shadow-md transform hover:scale-105"
              title="Shuffle Random Fact"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border border-red-400/50 text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02]"
            >
              <span>Next Fact</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

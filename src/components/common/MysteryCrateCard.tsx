import { Sparkles, HelpCircle, DollarSign, Percent } from 'lucide-react';

interface Props {
  isRevealing?: boolean;
}

export function MysteryCrateCard({ isRevealing = false }: Props) {
  return (
    <div className={`relative w-full max-w-sm sm:max-w-md mx-auto rounded-3xl p-6 sm:p-7 border-2 border-purple-500/80 shadow-glow-cosmic bg-gradient-to-b from-purple-950/95 via-slate-950 to-indigo-950/95 overflow-hidden flex flex-col items-center text-center select-none ${
      isRevealing ? 'animate-shake' : 'animate-float'
    }`}>
      {/* Background Cosmic Vortex */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.25)_0%,_transparent_70%)] animate-pulse" />

      {/* Top Banner */}
      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/90 border border-purple-400 text-purple-200 text-xs font-heading font-black tracking-widest uppercase mb-3 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>100% BLIND MYSTERY AUCTION</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
      </div>

      {/* Center Cosmic Crate Visual */}
      <div className="relative z-10 my-3 flex flex-col items-center justify-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-1 shadow-[0_0_50px_rgba(168,85,247,0.5)] animate-pulse">
          <div className="w-full h-full rounded-[22px] bg-black/85 flex flex-col items-center justify-center relative overflow-hidden border border-purple-400/50">
            <HelpCircle className="w-16 h-16 sm:w-20 sm:h-20 text-purple-300 drop-shadow-[0_0_20px_rgba(216,180,254,0.9)] animate-bounce" />
            <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest mt-1">
              IDENTITY CLASSIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Crate Information & Universal Price */}
      <div className="relative z-10 space-y-2 mt-1 w-full">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 font-heading font-black text-xs">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>UNIFORM STARTING BID: $5</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-wider">
          CLASSIFIED MARVEL DOSSIER
        </h3>
        <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
          Every card has the same starting price. Bid blind for a chance to score a <strong>$30 Mythic Titan for $5</strong> or a <strong>Grade C recruit</strong>!
        </p>

        {/* Guaranteed Grade Probability Odds */}
        <div className="space-y-1 pt-2 border-t border-white/10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1">
            <Percent className="w-3 h-3 text-cyan-400" />
            CRATE RARITY ODDS PROBABILITY
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="px-1.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/60 flex flex-col">
              <span className="text-[9px] font-black text-purple-300">★ MYTHIC</span>
              <strong className="text-xs font-mono font-black text-amber-300">5%</strong>
            </div>
            <div className="px-1.5 py-1 rounded-lg bg-red-950/80 border border-red-500/60 flex flex-col">
              <span className="text-[9px] font-black text-red-300">GRADE A</span>
              <strong className="text-xs font-mono font-black text-white">25%</strong>
            </div>
            <div className="px-1.5 py-1 rounded-lg bg-blue-950/80 border border-blue-500/60 flex flex-col">
              <span className="text-[9px] font-black text-blue-300">GRADE B</span>
              <strong className="text-xs font-mono font-black text-white">45%</strong>
            </div>
            <div className="px-1.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex flex-col">
              <span className="text-[9px] font-black text-emerald-300">GRADE C</span>
              <strong className="text-xs font-mono font-black text-white">25%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

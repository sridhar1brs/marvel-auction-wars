import { Sparkles, HelpCircle, Gift, Zap } from 'lucide-react';

interface Props {
  isRevealing?: boolean;
}

export function MysteryCrateCard({ isRevealing = false }: Props) {
  return (
    <div className={`relative w-full max-w-sm sm:max-w-md mx-auto rounded-3xl p-6 sm:p-8 border-2 border-purple-500/80 shadow-glow-cosmic bg-gradient-to-b from-purple-950/90 via-black to-indigo-950/90 overflow-hidden flex flex-col items-center text-center select-none ${
      isRevealing ? 'animate-shake' : 'animate-float'
    }`}>
      {/* Background Cosmic Vortex */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.3)_0%,_transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 scanlines opacity-30" />

      {/* Top Banner */}
      <div className="relative z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-900/90 border border-purple-400 text-purple-200 text-xs font-heading font-black tracking-widest uppercase mb-4 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>MYSTERY COSMIC CRATE</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
      </div>

      {/* Center Cosmic Crate Visual */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-700 to-pink-600 p-1 shadow-[0_0_50px_rgba(168,85,247,0.6)] animate-pulse">
          <div className="w-full h-full rounded-[22px] bg-black/80 flex flex-col items-center justify-center relative overflow-hidden border border-purple-400/50">
            {/* Glowing Question Mark & Gift icon */}
            <HelpCircle className="w-20 h-20 text-purple-300 drop-shadow-[0_0_20px_rgba(216,180,254,0.9)] animate-bounce" />
            <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest mt-1">
              TIER: CLASSIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Crate Information */}
      <div className="relative z-10 space-y-2 mt-2">
        <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider">
          BLIND COSMIC AUCTION
        </h3>
        <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
          Contains a random hero or villain from any tier — from a <strong>Grade C recruit</strong> to a <strong>$30 Mythic Cosmic Titan</strong>!
        </p>

        {/* Possible Odds Badges */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500 text-[10px] font-black text-purple-300">
            ★ MYTHIC
          </span>
          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500 text-[10px] font-black text-red-300">
            GRADE A
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500 text-[10px] font-black text-blue-300">
            GRADE B
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500 text-[10px] font-black text-emerald-300">
            GRADE C
          </span>
        </div>
      </div>
    </div>
  );
}

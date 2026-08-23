import { Clock, ShieldAlert } from 'lucide-react';

interface Props {
  timeRemaining: number;
  totalTime: number;
  antiSnipingActive?: boolean;
}

export function AuctionTimer({ timeRemaining, totalTime, antiSnipingActive }: Props) {
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  const isUrgent = timeRemaining <= 5;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1.5">
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-spin' : 'text-amber-400'}`} />
        <span className="text-xs font-black uppercase tracking-wider text-slate-300">
          AUCTION TIMER:
        </span>
        <span
          className={`font-heading font-black text-2xl px-2 py-0.5 rounded-lg ${
            isUrgent
              ? 'text-red-400 bg-red-950/80 border border-red-500 shadow-glow-red animate-pulse-fast'
              : 'text-amber-400 bg-black/50 border border-amber-500/40'
          }`}
        >
          {String(timeRemaining).padStart(2, '0')}s
        </span>

        {antiSnipingActive && timeRemaining > 0 && timeRemaining <= 6 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
            <ShieldAlert className="w-3 h-3" />
            <span>ANTI-SNIPING EXTENSION</span>
          </span>
        )}
      </div>

      {/* Glowing Progress Bar */}
      <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isUrgent
              ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-glow-red'
              : 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-glow-gold'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

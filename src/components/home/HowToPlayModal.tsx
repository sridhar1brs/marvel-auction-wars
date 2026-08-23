import { X, DollarSign, Layers, Flame, Swords, Trophy, Users, ShieldAlert } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: Props) {
  const steps = [
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      title: '1. STARTING CAPITAL: $30',
      desc: 'Every player starts with an identical bank balance of $30. Money is your only resource to bid on characters.',
    },
    {
      icon: <Layers className="w-6 h-6 text-blue-400" />,
      title: '2. ROSTER LIMIT: 4 CHARACTERS',
      desc: 'Each player must acquire exactly 4 characters to complete their collection. Once you hit the limit, you automatically exit the auction phase.',
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-400" />,
      title: '3. REAL-TIME AUCTION & ANTI-SNIPING',
      desc: 'Characters are revealed at random. Bids must be higher than current highest bid. Bidding with under 6s remaining extends the countdown to prevent unfair sniping.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-purple-400" />,
      title: '4. SKIP CARD CONSENSUS',
      desc: 'If all active players dislike the revealed card, you can vote to skip it. IMPORTANT: Placing a bid locks you out from voting to skip.',
    },
    {
      icon: <Users className="w-6 h-6 text-rose-400" />,
      title: '5. POWER VS VALUE BALANCE',
      desc: 'Do you hoard cash for 1 colossal Mythic character (e.g. Knull, Galactus) or assemble a deep, versatile 4-hero squad (Spider-Man, Iron Man, Thor)? Every dollar matters.',
    },
    {
      icon: <Swords className="w-6 h-6 text-red-400" />,
      title: '6. TIER-MATCHED BATTLE DUELS',
      desc: 'Once collections are full, players clash in the Battle Arena. Fights pair equal tiers (Grade C vs C, B vs B, A vs A, Mythic vs Mythic) with dynamic special abilities.',
    },
    {
      icon: <Trophy className="w-6 h-6 text-marvel-gold" />,
      title: '7. TOURNAMENT CHAMPIONSHIP',
      desc: 'Fight through Quarterfinals and Semifinals to claim the Marvel Auction Champion trophy and match MVP honors!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative glass-panel-glow max-w-3xl w-full rounded-2xl overflow-hidden my-8 border border-white/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="bg-marvel-red text-white font-heading font-black text-sm px-2 py-0.5 rounded">
              RULEBOOK
            </div>
            <h2 className="text-xl font-heading font-black tracking-wider text-white">
              HOW TO PLAY MARVEL: AUCTION WARS
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="glass-panel p-4 rounded-xl border border-white/5 flex gap-3.5 hover:border-slate-600 transition-colors"
              >
                <div className="p-2.5 bg-black/50 rounded-xl shrink-0 h-fit border border-white/10">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-wide mb-1 font-heading">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Grade Tiers Breakdown */}
          <div className="mt-6 bg-black/40 rounded-xl p-4 border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-3">
              Character Grades & Typical Starting Prices
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <span className="font-black text-emerald-400 block">GRADE C</span>
                <span className="text-[11px] text-slate-300">Hawkeye, Falcon, Widow</span>
                <span className="font-bold text-emerald-300 block mt-1">$2 – $5</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/40">
                <span className="font-black text-blue-400 block">GRADE B</span>
                <span className="text-[11px] text-slate-300">Spider-Man, Cap, Venom</span>
                <span className="font-bold text-blue-300 block mt-1">$4 – $9</span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40">
                <span className="font-black text-red-400 block">GRADE A</span>
                <span className="text-[11px] text-slate-300">Thor, Strange, Thanos</span>
                <span className="font-bold text-red-300 block mt-1">$7 – $15</span>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40 shadow-glow-cosmic">
                <span className="font-black text-purple-300 block">★ MYTHIC</span>
                <span className="text-[11px] text-slate-300">Knull, Galactus, Surfer</span>
                <span className="font-bold text-purple-300 block mt-1">$20 – $30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-marvel-red hover:bg-red-700 text-white font-heading font-black text-sm tracking-wider uppercase transition-all shadow-glow-red"
          >
            I'M READY TO BID
          </button>
        </div>
      </div>
    </div>
  );
}

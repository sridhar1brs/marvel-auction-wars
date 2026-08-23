import { useEffect } from 'react';
import { Player, GameState } from '../../types/game';
import { Trophy, Award, DollarSign, Swords, RotateCcw, Sparkles, Crown } from 'lucide-react';
import { CharacterPortrait } from '../common/CharacterPortrait';
import confetti from 'canvas-confetti';
import { soundManager } from '../../audio/soundManager';

interface Props {
  champion: Player;
  state: GameState;
  onPlayAgain: () => void;
}

export function VictoryScreen({ champion, state, onPlayAgain }: Props) {
  useEffect(() => {
    soundManager.playVictory();

    // Trigger victory fireworks / confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E62429', '#FFD700', '#06B6D4', '#A855F7'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E62429', '#FFD700', '#06B6D4', '#A855F7'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Find MVP character in champion roster
  const mvpChar = [...champion.collection].sort((a, b) => b.overallPower - a.overallPower)[0] || null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-shake">
      {/* Grand Trophy Banner */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500 shadow-glow-gold text-amber-300 font-extrabold text-xs uppercase tracking-widest mb-3 animate-bounce">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>TOURNAMENT COMPLETE</span>
          <Trophy className="w-4 h-4 text-amber-400" />
        </div>

        <h1 className="text-4xl sm:text-7xl font-heading font-black text-gold-gradient tracking-wider uppercase drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]">
          MARVEL AUCTION CHAMPION
        </h1>

        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-3xl">{champion.avatar}</span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wide">
            {champion.name}
          </h2>
          <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Champion Highlight Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Champion Roster Showcase (7 cols) */}
        <div className="md:col-span-7 glass-panel p-6 rounded-2xl border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              CHAMPION'S VICTORIOUS ROSTER ({champion.collection.length} HEROES)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {champion.collection.map(char => (
              <div key={char.id} className="flex flex-col items-center bg-black/40 p-2.5 rounded-xl border border-white/10 text-center">
                <CharacterPortrait character={char} size="sm" showBadge={true} />
                <span className="font-extrabold text-xs text-white mt-2 truncate w-full">
                  {char.name}
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  PWR {char.overallPower}
                </span>
              </div>
            ))}
          </div>

          {/* MVP Card Callout */}
          {mvpChar && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-950/60 to-black/60 border border-purple-500/40 rounded-xl flex items-center gap-3">
              <CharacterPortrait character={mvpChar} size="sm" showBadge={false} />
              <div>
                <span className="text-[10px] font-black uppercase text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>MATCH MVP HERO</span>
                </span>
                <h4 className="font-heading font-black text-sm text-white">
                  {mvpChar.name} ({mvpChar.grade} Tier • Power {mvpChar.overallPower})
                </h4>
              </div>
            </div>
          )}
        </div>

        {/* Right: Final Tournament Statistics (5 cols) */}
        <div className="md:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 block border-b border-white/10 pb-2">
            Final Match Statistics
          </span>

          <div className="space-y-2 text-xs">
            <StatRow
              icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
              label="Total Money Spent"
              value={`$${champion.stats.moneySpent}`}
            />
            <StatRow
              icon={<DollarSign className="w-4 h-4 text-amber-400" />}
              label="Remaining Cash"
              value={`$${champion.money}`}
            />
            <StatRow
              icon={<Swords className="w-4 h-4 text-red-400" />}
              label="Tournament Duels Won"
              value={`${champion.stats.battlesWon}`}
            />
            <StatRow
              icon={<Award className="w-4 h-4 text-purple-400" />}
              label="Highest Winning Bid"
              value={`$${champion.stats.highestBid}`}
            />
          </div>
        </div>
      </div>

      {/* Play Again Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-lg uppercase tracking-wider rounded-2xl shadow-glow-red transition-all transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
      <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-heading font-black text-sm text-white">{value}</span>
    </div>
  );
}

import { useState } from 'react';
import { Player, GradeVoteOption } from '../../types/game';
import { Vote, Sparkles, Shield, Zap, Swords, HelpCircle, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  players: Player[];
  onVoteSubmit: (votes: Record<string, GradeVoteOption>) => void;
  isLocalMode?: boolean;
  controllingPlayerId?: string;
}

export function GradeVotingModal({
  players,
  onVoteSubmit,
  isLocalMode = true,
  controllingPlayerId,
}: Props) {
  const [playerVotes, setPlayerVotes] = useState<Record<string, GradeVoteOption>>({});
  const [activePlayerVoteIndex, setActivePlayerVoteIndex] = useState(0);

  const humanPlayers = players.filter(p => !p.isBot);
  const currentPlayer = humanPlayers[activePlayerVoteIndex] || humanPlayers[0] || players[0];

  const voteOptions: { id: GradeVoteOption; label: string; sub: string; color: string; icon: any; border: string }[] = [
    {
      id: 'MYTHIC',
      label: 'MYTHIC COSMIC',
      sub: 'Living Tribunal, Beyonder, Galactus, Knull, Eternity',
      color: 'from-purple-900/80 to-purple-950/90 text-purple-200',
      icon: Sparkles,
      border: 'border-purple-500 hover:shadow-glow-cosmic',
    },
    {
      id: 'A',
      label: 'GRADE A TITANS',
      sub: 'Thor, Scarlet Witch, Doctor Strange, Magneto, Sentry',
      color: 'from-red-900/80 to-red-950/90 text-red-200',
      icon: Zap,
      border: 'border-red-500 hover:shadow-glow-red',
    },
    {
      id: 'B',
      label: 'GRADE B HEROES',
      sub: 'Spider-Man, Wolverine, Iron Man, Venom, Deadpool',
      color: 'from-blue-900/80 to-blue-950/90 text-blue-200',
      icon: Swords,
      border: 'border-blue-500 hover:shadow-glow-blue',
    },
    {
      id: 'C',
      label: 'GRADE C OPERATIVES',
      sub: 'Hawkeye, Black Widow, Bullseye, Elektra, Kate Bishop',
      color: 'from-emerald-900/80 to-emerald-950/90 text-emerald-200',
      icon: Shield,
      border: 'border-emerald-500 hover:shadow-md',
    },
    {
      id: 'MYSTERY',
      label: '100% MYSTERY CRATES',
      sub: 'High risk, high reward cosmic blind box bidding',
      color: 'from-amber-900/80 to-amber-950/90 text-amber-200',
      icon: HelpCircle,
      border: 'border-amber-500 hover:shadow-glow-gold',
    },
  ];

  const handleSelectOption = (option: GradeVoteOption) => {
    soundManager.playClick();
    const updated = {
      ...playerVotes,
      [currentPlayer.id]: option,
    };
    setPlayerVotes(updated);

    // If more human players need to vote in local mode
    if (isLocalMode && activePlayerVoteIndex < humanPlayers.length - 1) {
      setActivePlayerVoteIndex(prev => prev + 1);
    } else {
      // Complete voting (generate random AI votes for bots)
      players.forEach(p => {
        if (p.isBot && !updated[p.id]) {
          const randOption = voteOptions[Math.floor(Math.random() * voteOptions.length)].id;
          updated[p.id] = randOption;
        }
      });
      soundManager.playAbilityTrigger();
      onVoteSubmit(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="max-w-2xl w-full glass-panel-glow p-6 sm:p-8 rounded-3xl border border-purple-500/50 space-y-6 shadow-glow-cosmic">
        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/90 border border-purple-400 text-purple-300 text-xs font-black uppercase tracking-widest animate-bounce">
            <Vote className="w-4 h-4 text-purple-300" />
            <span>3-ROUND COSMIC TIER VOTE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            Choose Next Auction Tier
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {isLocalMode ? (
              <span>
                <strong className="text-purple-300 font-bold">{currentPlayer.name}</strong>, vote for the character pool you want in the upcoming 3 auction rounds!
              </span>
            ) : (
              'Cast your vote for the character tier pool to prioritize in the upcoming rounds!'
            )}
          </p>

          {/* Voting Progress Indicator for Multi-Player */}
          {isLocalMode && humanPlayers.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {humanPlayers.map((p, idx) => (
                <div
                  key={p.id}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 border transition-all ${
                    idx === activePlayerVoteIndex
                      ? 'bg-purple-600 text-white border-purple-300 ring-2 ring-purple-400/50 scale-105'
                      : playerVotes[p.id]
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                      : 'bg-black/40 text-slate-500 border-white/10'
                  }`}
                >
                  <span>{p.name}</span>
                  {playerVotes[p.id] && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voting Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {voteOptions.map(opt => {
            const Icon = opt.icon;
            const isChosen = playerVotes[currentPlayer.id] === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-2xl border bg-gradient-to-br ${opt.color} text-left transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-start gap-3.5 group relative overflow-hidden ${
                  opt.border
                } ${opt.id === 'MYSTERY' ? 'sm:col-span-2' : ''}`}
              >
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0 group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-sm sm:text-base text-white uppercase tracking-wide">
                      {opt.label}
                    </h3>
                    {isChosen && (
                      <span className="text-[10px] bg-white text-black font-black px-2 py-0.5 rounded-full">
                        VOTED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {opt.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

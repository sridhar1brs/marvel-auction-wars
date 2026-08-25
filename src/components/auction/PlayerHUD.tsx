import { Player, AuctionState, GameSettings } from '../../types/game';
import { DollarSign, Layers, Crown, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { calculatePlayerSynergies } from '../../engine/synergyEngine';

interface Props {
  players: Player[];
  auction: AuctionState;
  settings: GameSettings;
  activeTurnPlayerId?: string;
  onSelectPlayerTurn?: (playerId: string) => void;
  isLocalMode?: boolean;
}

export function PlayerHUD({
  players,
  auction,
  settings,
  activeTurnPlayerId,
  onSelectPlayerTurn,
  isLocalMode,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
      {players.map(player => {
        const isHighestBidder = auction.highestBidderId === player.id;
        const isFull = player.collection.length >= settings.characterLimit;
        const isSelectedTurn = activeTurnPlayerId === player.id;
        const hasVotedSkip = auction.skipVotes.includes(player.id);
        const synergies = calculatePlayerSynergies(player.collection);

        return (
          <div
            key={player.id}
            onClick={() => isLocalMode && onSelectPlayerTurn?.(player.id)}
            className={`glass-panel p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
              isHighestBidder
                ? 'border-emerald-500/80 bg-emerald-950/20 shadow-glow-gold ring-1 ring-emerald-400'
                : isSelectedTurn && isLocalMode
                ? 'border-red-500 bg-red-950/20 ring-1 ring-red-400'
                : 'border-white/10'
            } ${isFull ? 'opacity-75' : ''} ${
              isLocalMode ? 'cursor-pointer hover:border-slate-400' : ''
            }`}
          >
            <div>
              {/* Top Status Header */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base">{player.avatar}</span>
                  <span className="font-heading font-black text-xs sm:text-sm text-white truncate">
                    {player.name}
                  </span>
                </div>

                {isHighestBidder && (
                  <span className="flex items-center gap-0.5 text-[9px] font-black uppercase bg-emerald-900/90 text-emerald-200 px-1.5 py-0.5 rounded-full border border-emerald-400 animate-pulse">
                    <Crown className="w-2.5 h-2.5 fill-current" />
                    <span>HIGH BID</span>
                  </span>
                )}

                {isFull && (
                  <span className="text-[9px] font-black uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                    FULL
                  </span>
                )}
              </div>

              {/* Money Balance & Roster Count */}
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <div className="flex items-center gap-1 text-emerald-400 bg-black/40 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-sm font-black text-white">${player.money}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span className="text-xs font-extrabold text-slate-200">
                    {player.collection.length} / {settings.characterLimit}
                  </span>
                </div>
              </div>

              {/* Active Team Synergy Badges */}
              {synergies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {synergies.map((syn, idx) => (
                    <span
                      key={idx}
                      title={syn.description}
                      className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-purple-950/80 text-purple-200 border border-purple-500/50 px-1.5 py-0.5 rounded shadow-sm"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{syn.faction} (+{syn.bonusPower})</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Owned Roster Mini-Cards */}
              <div className="flex gap-1 overflow-x-auto py-1 min-h-[36px] items-center border-t border-white/5">
                {player.collection.map((char, idx) => (
                  <div key={idx} title={`${char.name} (${char.grade})`}>
                    <CharacterPortrait character={char} size="sm" showBadge={false} className="w-7 h-7 rounded" />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, settings.characterLimit - player.collection.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-7 h-7 rounded border border-dashed border-white/10 bg-black/20 flex items-center justify-center text-[9px] text-slate-600 font-bold"
                  >
                    +
                  </div>
                ))}
              </div>
            </div>

            {/* Skip Vote Status */}
            {hasVotedSkip && (
              <div className="absolute top-1 right-1">
                <span className="text-[8px] font-black uppercase text-purple-300 bg-purple-950/90 px-1.5 py-0.5 rounded border border-purple-500 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-purple-400" />
                  <span>SKIP</span>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

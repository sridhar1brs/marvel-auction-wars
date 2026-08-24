import { Character } from '../../types/game';
import { CharacterPortrait } from './CharacterPortrait';
import { Zap, Shield, Swords, Brain, Flame, DollarSign, Award, Gift, Sparkles } from 'lucide-react';
import { getGradeBadgeClass } from '../../data/characters/index';
import { getScaledStartingPrice } from '../../../server/auctionEngine';

interface Props {
  character: Character;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isSpotlight?: boolean;
  startingMoney?: number;
}

export function CharacterCard({ 
  character, 
  className = '', 
  size = 'md', 
  isSpotlight = false,
  startingMoney = 30,
}: Props) {
  const isMythic = character.grade === 'MYTHIC';
  const isGradeA = character.grade === 'A';
  const displayStartingPrice = getScaledStartingPrice(character.startingPrice, startingMoney);

  const getCardBorder = () => {
    switch (character.grade) {
      case 'MYTHIC':
        return 'border-purple-500/70 shadow-glow-cosmic';
      case 'A':
        return 'border-red-500/60 shadow-glow-red';
      case 'B':
        return 'border-blue-500/50 shadow-glow-blue';
      case 'C':
        return 'border-emerald-500/40';
      default:
        return 'border-slate-700';
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 border flex flex-col ${
        isMythic ? 'cosmic-panel holo-shimmer' : isGradeA ? 'glass-panel holo-shimmer' : 'glass-panel'
      } ${getCardBorder()} ${className} ${
        isSpotlight ? 'scale-[1.02] shadow-2xl ring-1 ring-white/20' : 'hover:scale-[1.01]'
      }`}
    >
      {/* Top Banner with Grade & Price & Bounty */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getGradeBadgeClass(character.grade)}`}>
            {character.grade === 'MYTHIC' ? '★ MYTHIC COSMIC' : `GRADE ${character.grade}`}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {character.alignment}
          </span>
          {character.bounty && (
            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase animate-pulse">
              <Gift className="w-3 h-3 text-amber-400" />
              {character.bounty.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-emerald-300 font-bold text-xs shadow-sm">
          <DollarSign className="w-3 h-3 text-emerald-400" />
          <span>START: ${displayStartingPrice}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* Left: Portrait */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <CharacterPortrait 
            character={character} 
            size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} 
            showBadge={false}
          />
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1 rounded-lg">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">POWER</span>
            <span className="text-sm font-black text-amber-400">{character.overallPower}</span>
          </div>
        </div>

        {/* Right: Info & Stats */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-black font-heading tracking-wide text-white truncate drop-shadow">
                {character.name}
              </h3>
            </div>
            {character.alias && (
              <p className="text-xs font-medium text-slate-400 italic mb-2">
                "{character.alias}"
              </p>
            )}

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
              {character.description}
            </p>

            {/* Powers preview */}
            <div className="bg-black/30 rounded-lg p-2 border border-white/5 mb-3 text-[11px] text-slate-300">
              <span className="font-bold text-slate-400 mr-1 uppercase text-[10px] tracking-wider">Powers:</span>
              <span className="line-clamp-2 text-slate-200">{character.powers}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
            <StatItem icon={<Swords className="w-3 h-3 text-red-400" />} label="STR" value={character.stats.strength} />
            <StatItem icon={<Zap className="w-3 h-3 text-amber-400" />} label="SPD" value={character.stats.speed} />
            <StatItem icon={<Shield className="w-3 h-3 text-blue-400" />} label="DUR" value={character.stats.durability} />
            <StatItem icon={<Brain className="w-3 h-3 text-emerald-400" />} label="INT" value={character.stats.intelligence} />
            <StatItem icon={<Flame className="w-3 h-3 text-purple-400" />} label="ENE" value={character.stats.energy} />
            <StatItem icon={<Award className="w-3 h-3 text-rose-400" />} label="COM" value={character.stats.combat} />
          </div>
        </div>
      </div>

      {/* Special Abilities Section */}
      {character.specialAbilities.length > 0 && (
        <div className="px-4 pb-3 pt-1 border-t border-white/5 bg-black/20">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5 block">
            Special Combat Abilities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {character.specialAbilities.map((ability, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-2 py-1 rounded-lg text-[11px] text-slate-200"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="font-bold text-white">{ability.name}</span>
                <span className="text-[10px] bg-amber-950/80 text-amber-300 font-extrabold px-1.5 rounded">
                  +{ability.bonusPower} PWR
                </span>
                <span className="text-[9px] text-slate-400">({Math.round(ability.triggerRate * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px]">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-extrabold text-slate-100 text-[11px]">{value}</span>
    </div>
  );
}

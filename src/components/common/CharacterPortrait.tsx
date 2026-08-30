import { useState } from 'react';
import { Character, CharacterGrade } from '../../types/game';
import { Zap } from 'lucide-react';
import { generateHeroSVGDataUrl } from '../../data/heroArtwork';
import { CHARACTER_PORTRAITS } from '../../data/characterPortraits';

interface Props {
  character: Character;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showPowerBadge?: boolean;
}

export function CharacterPortrait({ 
  character, 
  className = '', 
  size = 'md', 
  showBadge = true,
  showPowerBadge = true 
}: Props) {
  const [imageStep, setImageStep] = useState<number>(0);

  const getDimensions = () => {
    // If custom width/height is passed in className, avoid conflicting defaults
    if (className.includes('w-') || className.includes('h-')) {
      return '';
    }
    switch (size) {
      case 'sm':
        return 'w-20 h-20 sm:w-24 sm:h-24 rounded-xl';
      case 'md':
        return 'w-28 h-28 sm:w-36 sm:h-36 rounded-xl';
      case 'lg':
        return 'w-36 h-36 sm:w-44 sm:h-44 rounded-2xl';
      case 'xl':
        return 'w-60 h-60 sm:w-72 sm:h-72 rounded-2xl';
      default:
        return 'w-28 h-28 sm:w-36 sm:h-36 rounded-xl';
    }
  };

  const getBorderGlow = (grade: CharacterGrade) => {
    if (className.includes('border-none') || className.includes('no-border')) {
      return '';
    }
    switch (grade) {
      case 'MYTHIC':
        return 'border-2 border-purple-500/80 shadow-glow-cosmic ring-2 ring-purple-400/40';
      case 'A':
        return 'border-2 border-red-500/80 shadow-glow-red ring-1 ring-red-400/30';
      case 'B':
        return 'border-2 border-blue-500/80 shadow-glow-blue';
      case 'C':
        return 'border border-emerald-500/60 shadow-md';
      default:
        return 'border border-slate-700';
    }
  };

  // Direct local character portrait mapped strictly by character ID from Images Marvel
  const localJpgUrl = `/images/characters/${character.id}.jpg`;
  const curatedUrl = CHARACTER_PORTRAITS[character.id];
  const embeddedSvgDataUrl = generateHeroSVGDataUrl(character.name, character.grade, character.color);

  const currentSrc = imageStep === 0 
    ? localJpgUrl
    : imageStep === 1 
    ? (curatedUrl || character.imageUrl || localJpgUrl)
    : embeddedSvgDataUrl;

  return (
    <div className={`relative overflow-hidden shrink-0 group bg-black/90 ${getDimensions()} ${getBorderGlow(character.grade)} ${className}`}>
      {/* Background Accent Glow */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at center, ${character.color || '#E62429'} 0%, transparent 80%)`
        }}
      />

      {/* 100% Reliable Marvel Character Image with Centered Subject Crop */}
      <img
        src={currentSrc}
        alt={character.name}
        referrerPolicy="no-referrer"
        onError={() => setImageStep(prev => prev + 1)}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Subtle bottom shadow vignette for depth */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Grade Overlay Ribbon */}
      {showBadge && (
        <div className="absolute top-1 left-1 z-20">
          <span className={`text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-lg backdrop-blur ${
            character.grade === 'MYTHIC'
              ? 'bg-purple-900/90 text-purple-200 border border-purple-400 animate-pulse-fast'
              : character.grade === 'A'
              ? 'bg-red-900/90 text-red-100 border border-red-500'
              : character.grade === 'B'
              ? 'bg-blue-900/90 text-blue-100 border border-blue-500'
              : 'bg-emerald-900/90 text-emerald-100 border border-emerald-500'
          }`}>
            {character.grade === 'MYTHIC' ? '★ MYTHIC' : character.grade}
          </span>
        </div>
      )}

      {/* Power Badge */}
      {showPowerBadge && (
        <div className="absolute bottom-1 right-1 z-20 flex items-center gap-0.5 bg-black/85 backdrop-blur border border-white/10 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold text-amber-300 shadow">
          <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span>{character.overallPower}</span>
        </div>
      )}
    </div>
  );
}

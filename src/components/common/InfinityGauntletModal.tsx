import React, { useState } from 'react';
import { soundManager } from '../../audio/soundManager';
import { 
  Sparkles, Shield, Zap, X, Flame, Heart, 
  RotateCcw, Eye, Clock, CheckCircle2, Award
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface InfinityStone {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  glowClass: string;
  icon: string;
  container: string;
  perkTitle: string;
  perkDescription: string;
  statBonus: string;
}

export const INFINITY_STONES: InfinityStone[] = [
  {
    id: 'space',
    name: 'Space Stone',
    colorName: 'Cosmic Blue',
    colorHex: '#38BDF8',
    glowClass: 'shadow-[0_0_25px_#38BDF8]',
    icon: '🔵',
    container: 'Tesseract / Cosmic Cube',
    perkTitle: 'Dimensional Portal & Agility',
    perkDescription: 'Bends space-time to instantly evade lethal strikes and teleport across the combat grid.',
    statBonus: '+15% Evasion & +6 Speed Power'
  },
  {
    id: 'mind',
    name: 'Mind Stone',
    colorName: 'Solar Yellow',
    colorHex: '#FACC15',
    glowClass: 'shadow-[0_0_25px_#FACC15]',
    icon: '🟡',
    container: 'Chitauri Scepter / Vision',
    perkTitle: 'Telepathic Strategy & Precognition',
    perkDescription: 'Unlocks higher consciousness, anticipating opponent tactics and calculating counter-blows.',
    statBonus: '+10 Intelligence & Counter Advantage'
  },
  {
    id: 'reality',
    name: 'Reality Stone',
    colorName: 'Crimson Red',
    colorHex: '#EF4444',
    glowClass: 'shadow-[0_0_25px_#EF4444]',
    icon: '🔴',
    container: 'Aether Fluid',
    perkTitle: 'Matter Transmutation & Forcefield',
    perkDescription: 'Rewrites universal physical laws, transmuting incoming opponent attacks into protective shield energy.',
    statBonus: 'Converts 20% Damage to Shields'
  },
  {
    id: 'power',
    name: 'Power Stone',
    colorName: 'Celestial Purple',
    colorHex: '#A855F7',
    glowClass: 'shadow-[0_0_25px_#A855F7]',
    icon: '🟣',
    container: 'Cosmic Orb',
    perkTitle: 'Unstoppable Destruction Surge',
    perkDescription: 'Channels infinite celestial energy to obliterate planetary matter and amplify physical strike output.',
    statBonus: '+12 Absolute Strike Damage'
  },
  {
    id: 'time',
    name: 'Time Stone',
    colorName: 'Emerald Green',
    colorHex: '#10B981',
    glowClass: 'shadow-[0_0_25px_#10B981]',
    icon: '🟢',
    container: 'Eye of Agamotto',
    perkTitle: 'Temporal Rewind & Chrono Loop',
    perkDescription: 'Manipulates universal temporal flow to reverse fatal knockouts and restore fallen champions.',
    statBonus: 'Once-per-Match 35 HP Temporal Revive'
  },
  {
    id: 'soul',
    name: 'Soul Stone',
    colorName: 'Vormir Orange',
    colorHex: '#F97316',
    glowClass: 'shadow-[0_0_25px_#F97316]',
    icon: '🟠',
    container: 'Vormir Altar',
    perkTitle: 'Soul Siphon & Life Resonance',
    perkDescription: 'Commands the spiritual essence of all sentient beings, draining enemy life essence into health.',
    statBonus: '+20 HP Lifesteal on Special Attacks'
  }
];

export function InfinityGauntletModal({ isOpen, onClose }: Props) {
  const [selectedStone, setSelectedStone] = useState<InfinityStone>(INFINITY_STONES[0]);
  const [activeStoneIds, setActiveStoneIds] = useState<string[]>(['space', 'power', 'time']);

  if (!isOpen) return null;

  const toggleStoneSocket = (stoneId: string) => {
    soundManager.playMythicReveal();
    if (activeStoneIds.includes(stoneId)) {
      setActiveStoneIds(prev => prev.filter(id => id !== stoneId));
    } else {
      setActiveStoneIds(prev => [...prev, stoneId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#090C18]/95 border-2 border-purple-500/60 shadow-[0_0_50px_rgba(168,85,247,0.4)] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-purple-500/30 flex items-center justify-between bg-gradient-to-r from-purple-950/70 via-slate-900 to-amber-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-400/50 shadow-inner">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-heading font-black text-white uppercase tracking-wider">
                  INFINITY STONES & COSMIC PERKS
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 font-mono text-[10px] font-bold">
                  {activeStoneIds.length} / 6 SOCKETED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Harness primordial cosmic singularities to empower your roster with game-altering perks.
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

        {/* 2-Column Gauntlet Chamber */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto p-5 sm:p-6 gap-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/60">
          
          {/* Left Column: 6 Stones Selector (5 Cols) */}
          <div className="md:col-span-5 space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              THE 6 INFINITY STONES
            </span>

            {INFINITY_STONES.map((stone) => {
              const isSelected = selectedStone.id === stone.id;
              const isSocketed = activeStoneIds.includes(stone.id);

              return (
                <div
                  key={stone.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedStone(stone);
                  }}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                      : 'bg-black/50 border-white/10 hover:border-purple-500/40 hover:bg-purple-950/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-inner border transition-transform group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${stone.colorHex}22`,
                        borderColor: stone.colorHex 
                      }}
                    >
                      {stone.icon}
                    </div>
                    <div className="min-w-0">
                      <strong className="text-sm font-heading font-black text-white block truncate group-hover:text-purple-300">
                        {stone.name}
                      </strong>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {stone.statBonus}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStoneSocket(stone.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      isSocketed
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_10px_#10B981]'
                        : 'bg-stone-900 text-slate-400 border-white/10 hover:border-purple-400 hover:text-white'
                    }`}
                  >
                    {isSocketed ? 'ACTIVE' : 'EQUIP'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Stone Cosmic Lore & Perk Deep-Dive (7 Cols) */}
          <div className="md:col-span-7 space-y-4">
            {/* Spotlight Stone Card */}
            <div className="p-6 rounded-3xl bg-black/60 border-2 border-white/10 shadow-2xl relative overflow-hidden space-y-4">
              <div 
                className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-25"
                style={{ backgroundColor: selectedStone.colorHex }}
              />

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl border-2"
                    style={{ 
                      backgroundColor: `${selectedStone.colorHex}33`,
                      borderColor: selectedStone.colorHex,
                      boxShadow: `0 0 25px ${selectedStone.colorHex}66`
                    }}
                  >
                    {selectedStone.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-black text-white">
                      {selectedStone.name}
                    </h3>
                    <span className="text-xs font-mono font-bold" style={{ color: selectedStone.colorHex }}>
                      {selectedStone.colorName} • {selectedStone.container}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleStoneSocket(selectedStone.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all border ${
                    activeStoneIds.includes(selectedStone.id)
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_#10B981]'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 hover:from-purple-500 hover:to-pink-500 shadow-md'
                  }`}
                >
                  {activeStoneIds.includes(selectedStone.id) ? '✓ ACTIVE IN GAUNTLET' : '+ SOCKET TO GAUNTLET'}
                </button>
              </div>

              {/* Perk Description */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wide flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  COSMIC PERK: {selectedStone.perkTitle}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedStone.perkDescription}
                </p>
              </div>

              {/* Tactical Stat Bonus Highlight */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">COMBAT STAT BOOST:</span>
                <span className="text-xs font-mono font-black text-amber-400">
                  {selectedStone.statBonus}
                </span>
              </div>
            </div>

            {/* Infinity Gauntlet Synergy Resonance Alert */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-purple-950/80 border border-purple-500/50 shadow-lg space-y-1.5">
              <span className="text-xs font-heading font-black text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <span>INFINITY SNAP OVERCHARGE (6 / 6 STONES):</span>
              </span>
              <p className="text-xs text-slate-300">
                Socketing all 6 Infinity Stones activates the legendary <strong>Cosmic Singularity Synergy</strong>, granting +100% Critical Strike damage and unlocking universal mastery across all battle modes!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

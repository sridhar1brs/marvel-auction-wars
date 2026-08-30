import React, { useState } from 'react';
import { Character } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { getCharacterAscensionRarity } from './AscensionShop';
import { 
  X, Zap, Shield, Flame, ArrowUpCircle, AlertTriangle, 
  Check, Lock, Sparkles, Heart, Activity
} from 'lucide-react';

interface Props {
  character: Character;
  onClose: () => void;
}

export function AscensionUpgradeModal({ character, onClose }: Props) {
  const { user, upgradeCharacter } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isMythic = character.grade === 'MYTHIC' || character.alignment === 'Cosmic';
  const currentLevel = (user?.characterLevels || {})[character.id] || 1;
  const boosts = (user?.characterStatsBoosts || {})[character.id] || { power: 0, hp: 0, defense: 0, speed: 0 };

  const requiredCoins = currentLevel * 150;
  const canAfford = (user?.astra || 0) >= requiredCoins;

  const handleUpgrade = async () => {
    if (isMythic) return;
    if (!canAfford) {
      soundManager.playAttackHit();
      setStatusMessage({ type: 'error', text: 'Insufficient Astra!' });
      return;
    }

    setIsUpgrading(true);
    setStatusMessage(null);

    const result = await upgradeCharacter(character.id, isMythic);
    setIsUpgrading(false);

    if (result.success) {
      soundManager.playVictory();
      setStatusMessage({ type: 'success', text: `Success! ${character.name} upgraded to Level ${result.newLevel}!` });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      soundManager.playAttackHit();
      setStatusMessage({ type: 'error', text: result.error || 'Failed to upgrade character.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-[#0C0E18] border-2 border-cyan-500/50 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden p-5 sm:p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <ArrowUpCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-white uppercase tracking-wider">
                CHARACTER UPGRADE STATION
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Level 1 to Level 50 Progression Matrix
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Showcase Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-cyan-950/40 to-indigo-950/40 border border-white/10 flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-cyan-400/50 shrink-0 bg-black">
            <CharacterPortrait character={character} size="lg" className="w-full h-full object-cover" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-cyan-400 text-black">
                {isMythic ? 'MYTHIC' : `LEVEL ${currentLevel} / 50`}
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {character.overallPower + boosts.power} PWR
              </span>
            </div>
            <h3 className="font-heading font-black text-white text-base truncate">
              {character.name}
            </h3>
            <span className="text-xs text-slate-300 block truncate">
              {character.powers}
            </span>
          </div>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-red-950/80 border-red-500 text-red-300'
          }`}>
            {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 🚫 MYTHIC BLOCK NOTICE */}
        {isMythic ? (
          <div className="p-4 rounded-2xl bg-red-950/40 border-2 border-red-500/60 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-red-900/60 border border-red-400 flex items-center justify-center text-red-300">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">
              MYTHIC COSMIC SUPREMACY
            </h4>
            <p className="text-xs text-red-200 leading-relaxed">
              Mythic characters already possess maximum omnipotence and <strong>CANNOT BE UPGRADED</strong>. They enter combat with absolute peak power.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Stat Gains Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Total Power
                </span>
                <div className="flex items-center justify-between text-xs font-mono font-black text-white">
                  <span>{character.overallPower + boosts.power}</span>
                  <span className="text-emerald-400">+{boosts.power + 2} (Next)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> Max Vitality (HP)
                </span>
                <div className="flex items-center justify-between text-xs font-mono font-black text-white">
                  <span>{100 + boosts.hp} HP</span>
                  <span className="text-emerald-400">+{boosts.hp + 5} HP</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Defense Bonus
                </span>
                <div className="flex items-center justify-between text-xs font-mono font-black text-white">
                  <span>+{boosts.defense} DEF</span>
                  <span className="text-emerald-400">+{boosts.defense + 2} DEF</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Agility & Speed
                </span>
                <div className="flex items-center justify-between text-xs font-mono font-black text-white">
                  <span>+{boosts.speed} SPD</span>
                  <span className="text-emerald-400">+{boosts.speed + 1} SPD</span>
                </div>
              </div>
            </div>

            {/* Upgrade Cost Card */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">UPGRADE COST (LVL {currentLevel + 1})</span>
                <div className="flex items-center gap-3 font-mono font-black mt-0.5">
                  <span className="text-amber-300 flex items-center gap-1">
                    ✨ {requiredCoins.toLocaleString()} Astra ({(user?.astra || 0).toLocaleString()} owned)
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isUpgrading || !canAfford || currentLevel >= 50}
                onClick={handleUpgrade}
                className={`py-2.5 px-4 rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                  canAfford && currentLevel < 50
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black shadow-glow-cyan'
                    : 'bg-stone-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>{isUpgrading ? 'UPGRADING...' : currentLevel >= 50 ? 'MAX LEVEL' : 'UPGRADE NOW'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

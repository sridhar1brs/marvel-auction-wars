import React from 'react';
import { Character } from '../../types/game';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  character: Character;
  currentCount: number;
  characterLimit: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DiscardConfirmModal({
  character,
  currentCount,
  characterLimit,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-[#0F0C08] border-2 border-red-500/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.4)] space-y-5 text-center">
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onCancel();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 shadow-lg animate-pulse">
          <Trash2 className="w-8 h-8" />
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>PERMANENT ROSTER ACTION</span>
          </div>
          <h2 className="text-2xl font-heading font-black text-white uppercase tracking-wider">
            DISCARD CARD?
          </h2>
        </div>

        {/* Hero Preview */}
        <div className="flex items-center gap-3 bg-black/60 p-3 rounded-2xl border border-white/10 text-left">
          <img
            src={`/images/characters/${character.id}.jpg`}
            alt={character.name}
            className="w-14 h-14 rounded-xl object-cover border border-red-500/50 shadow-md shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
              Grade {character.grade} • {character.overallPower} PWR
            </span>
            <h4 className="font-heading font-black text-white text-sm truncate">
              {character.name}
            </h4>
            <span className="text-[10px] text-slate-400 block truncate">
              {character.alignment} • {character.factions?.[0] || 'Marvel Universe'}
            </span>
          </div>
        </div>

        {/* Explicit $0 Refund & Slot freeing details */}
        <div className="p-3.5 bg-red-950/40 rounded-2xl border border-red-500/30 text-xs space-y-1.5 text-left">
          <div className="flex items-center justify-between text-red-300 font-bold">
            <span>Refund Amount:</span>
            <span className="text-red-400 font-black">$0 REFUND</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Roster Slots:</span>
            <span className="font-mono font-bold text-emerald-400">
              {currentCount}/{characterLimit} ➔ {Math.max(0, currentCount - 1)}/{characterLimit} Free
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            You will <strong>NOT</strong> receive a refund for this character. The character slot will become available for new recruits.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onCancel();
            }}
            className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-slate-300 font-heading font-black text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playAttackHit();
              onConfirm();
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>DISCARD</span>
          </button>
        </div>

      </div>
    </div>
  );
}

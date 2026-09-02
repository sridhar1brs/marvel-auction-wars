import React, { useState } from 'react';
import { DungeonEvent, DungeonEventChoice, DungeonRunState } from '../../types/dungeon';
import { soundManager } from '../../audio/soundManager';
import { 
  Sparkles, HelpCircle, AlertCircle, ArrowRight, CheckCircle2, 
  Flame, Heart, Coins, ShieldAlert
} from 'lucide-react';

interface Props {
  runState: DungeonRunState;
  event: DungeonEvent;
  onResolveChoice: (choice: DungeonEventChoice, success: boolean) => void;
}

export function DungeonEventModal({ runState, event, onResolveChoice }: Props) {
  const [selectedChoice, setSelectedChoice] = useState<DungeonEventChoice | null>(null);
  const [outcomeResult, setOutcomeResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSelectChoice = (choice: DungeonEventChoice) => {
    soundManager.playClick();
    setSelectedChoice(choice);

    let success = true;
    let message = 'Choice executed successfully!';

    if (choice.actionType === 'RISK_GAMBLE') {
      const roll = Math.random();
      success = roll < (choice.successRate || 0.5);
      message = success
        ? '🌟 COSMIC FAVOR! The gamble paid off with massive rewards!'
        : '💥 CATASTROPHIC BACKFIRE! The anomaly destabilized and inflicted damage!';
    } else if (choice.actionType === 'LEAVE_SAFELY') {
      message = 'You stepped away cautiously and preserved your squad\'s resources.';
    } else if (choice.actionType === 'HEAL_TEAM') {
      message = `💚 The team bathed in restorative aura and recovered +${choice.rewardPayload?.healPercent || 40}% HP!`;
    } else if (choice.actionType === 'GAIN_ASTRA') {
      message = `💰 Discovered an Astra cache! +${choice.rewardPayload?.astra || 300} Astra added to run!`;
    } else if (choice.actionType === 'GAIN_SHARDS') {
      message = `🧩 Collected +${choice.rewardPayload?.shards || 20} Multiverse Draft Shards!`;
    } else if (choice.actionType === 'UPGRADE_HERO_RUN_STATS') {
      message = '⚡ Squad equipment fortified with bonus combat power for the expedition!';
    }

    setOutcomeResult({ success, message });
  };

  const handleConfirmAndProceed = () => {
    if (!selectedChoice || !outcomeResult) return;
    soundManager.playClick();
    onResolveChoice(selectedChoice, outcomeResult.success);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-gradient-to-b from-[#1C0926] via-[#100318] to-black border-2 border-purple-500/70 shadow-[0_0_60px_rgba(168,85,247,0.4)] p-6 sm:p-8 space-y-6">
        
        {/* Event Header */}
        <div className="space-y-1 text-center sm:text-left">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Multiverse Anomaly
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide">
            {event.title}
          </h2>
          <span className="text-xs text-purple-400 font-mono block">{event.subtitle}</span>
        </div>

        {/* Narrative Description */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed italic">
          &ldquo;{event.description}&rdquo;
        </div>

        {/* Outcome State after picking choice */}
        {outcomeResult ? (
          <div className={`p-6 rounded-2xl border text-center space-y-4 animate-fadeIn ${
            outcomeResult.success ? 'bg-emerald-950/80 border-emerald-500' : 'bg-red-950/80 border-red-500'
          }`}>
            <div className="text-3xl">
              {outcomeResult.success ? '🏆' : '💀'}
            </div>
            <h3 className={`text-lg font-heading font-black uppercase ${
              outcomeResult.success ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {outcomeResult.success ? 'CONSEQUENCE: TRIUMPH' : 'CONSEQUENCE: COMPLICATION'}
            </h3>
            <p className="text-xs text-slate-200 font-mono max-w-lg mx-auto">
              {outcomeResult.message}
            </p>

            <button
              type="button"
              onClick={handleConfirmAndProceed}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>CONTINUE EXPEDITION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Choices Selection */
          <div className="space-y-3">
            <span className="text-xs font-heading font-black text-slate-400 uppercase tracking-wider block">
              Choose an action:
            </span>

            <div className="space-y-2.5">
              {event.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelectChoice(choice)}
                  className="w-full p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-white/10 hover:border-purple-400/60 transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer hover:scale-[1.01]"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-heading font-black text-white group-hover:text-purple-300">
                      {idx + 1}. {choice.label}
                    </h4>
                    <p className="text-xs text-slate-400">{choice.description}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-xs font-mono">
                    {choice.costAstra && (
                      <span className="text-amber-400 font-bold">✨ -{choice.costAstra} Astra</span>
                    )}
                    {choice.costHpPercent && (
                      <span className="text-red-400 font-bold">❤️ -{choice.costHpPercent}% HP</span>
                    )}
                    {choice.successRate && (
                      <span className="text-purple-400 font-bold">🎲 {Math.round(choice.successRate * 100)}% Chance</span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

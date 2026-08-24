import React, { useState, useEffect } from 'react';
import { MessageSquare, Smile, X } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

export interface ReactionItem {
  id: string;
  emoji: string;
  label: string;
  senderName?: string;
  x: number; // percentage across screen (10% to 90%)
}

export const COMIC_REACTIONS = [
  { emoji: '👑', label: 'MINE!' },
  { emoji: '💀', label: 'BROKE' },
  { emoji: '🔥', label: 'ALL-IN' },
  { emoji: '😱', label: 'WHAT?!' },
  { emoji: '💎', label: 'SPENDER' },
  { emoji: '⚡', label: 'READY' },
  { emoji: '💥', label: 'BOOM!' },
  { emoji: '🛡️', label: 'DEFEND' }
];

interface FloatingReactionsProps {
  onSendReaction?: (reaction: { emoji: string; label: string }) => void;
  incomingReaction?: { emoji: string; label: string; senderName?: string } | null;
  playerName?: string;
}

export const FloatingReactions: React.FC<FloatingReactionsProps> = ({
  onSendReaction,
  incomingReaction,
  playerName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeReactions, setActiveReactions] = useState<ReactionItem[]>([]);

  const spawnReaction = (emoji: string, label: string, sender?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = 20 + Math.random() * 60; // 20% to 80% screen width
    playSound('select');

    setActiveReactions(prev => [...prev, { id, emoji, label, senderName: sender, x }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== id));
    }, 2800);
  };

  const handleSend = (reaction: { emoji: string; label: string }) => {
    spawnReaction(reaction.emoji, reaction.label, playerName || 'You');
    if (onSendReaction) {
      onSendReaction(reaction);
    }
  };

  useEffect(() => {
    if (incomingReaction) {
      spawnReaction(incomingReaction.emoji, incomingReaction.label, incomingReaction.senderName);
    }
  }, [incomingReaction]);

  return (
    <>
      {/* Floating Animated Bubbles Floating Upwards */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {activeReactions.map(r => (
          <div
            key={r.id}
            className="absolute bottom-16 animate-floatUp flex flex-col items-center pointer-events-none"
            style={{ left: `${r.x}%` }}
          >
            <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-purple-700 text-white font-black text-sm tracking-wider shadow-2xl border border-white/40 flex items-center gap-1.5 transform hover:scale-110 transition-transform">
              <span className="text-xl">{r.emoji}</span>
              <span>{r.label}</span>
            </div>
            {r.senderName && (
              <span className="text-[10px] text-gray-300 font-bold bg-black/60 px-2 py-0.5 rounded-full mt-0.5">
                {r.senderName}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Floating Toggle Button & Drawer */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {isOpen && (
          <div className="mb-2 p-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md grid grid-cols-4 gap-1.5 animate-fadeIn">
            {COMIC_REACTIONS.map((r, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(r)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-red-600 text-white transition-all transform hover:scale-105 active:scale-95 border border-slate-700 hover:border-red-400 group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">{r.emoji}</span>
                <span className="text-[10px] font-black tracking-tighter mt-0.5 text-gray-300 group-hover:text-white uppercase">
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3.5 py-2.5 rounded-full font-bold text-xs shadow-xl flex items-center gap-1.5 transition-all duration-300 transform active:scale-95 ${
            isOpen 
              ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
              : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:brightness-110 shadow-red-500/25'
          }`}
          title="Send Comic Reactions"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Smile className="w-4 h-4" />}
          <span>{isOpen ? 'Close' : 'Reactions'}</span>
        </button>
      </div>
    </>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Player, ChatMessage } from '../../types/game';
import { MessageSquare, Send, Users, Eye, X, Flame, Sparkles, Shield, Skull, Zap } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  players: Player[];
  messages: ChatMessage[];
  currentUserId?: string;
  isSpectator: boolean;
  onSendMessage: (message: string) => void;
}

export function SpectatorChatDrawer({
  players,
  messages,
  currentUserId,
  isSpectator,
  onSendMessage,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    soundManager.playClick();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickSend = (text: string) => {
    soundManager.playClick();
    onSendMessage(text);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'READY':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-mono font-black">🔵 READY</span>;
      case 'CHOOSING':
        return <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[9px] font-mono font-black animate-pulse">🟡 CHOOSING</span>;
      case 'IN_BATTLE':
        return <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-mono font-black">⚔️ IN BATTLE</span>;
      case 'SPECTATING':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-mono font-black">👁️ SPECTATING</span>;
      case 'BIDDING':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-black">💰 BIDDING</span>;
      case 'ELIMINATED':
        return <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-mono font-bold">❌ ELIMINATED</span>;
      case 'DISCONNECTED':
        return <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[9px] font-mono font-bold">🔴 OFFLINE</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-black">🟢 ONLINE</span>;
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => {
          soundManager.playClick();
          setIsOpen(prev => !prev);
        }}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-2xl bg-black/80 hover:bg-black/95 text-white border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.4)] backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-purple-400 group-hover:animate-bounce" />
          {messages.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          )}
        </div>
        <span className="font-heading font-black text-xs uppercase tracking-wider text-purple-200">
          SPECTATOR CHAT ({messages.length})
        </span>
      </button>

      {/* Slide-out Spectator Drawer Overlay */}
      {isOpen && (
        <div         className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#080B14]/95 border-l border-purple-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
                  SPECTATOR HUB & CHAT
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isSpectator ? '👁️ You are Spectating' : '⚔️ Active Duel Participant'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Live Players Status List */}
          <div className="p-3 border-b border-white/10 bg-black/30 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between text-[11px] font-heading font-black text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" />
                <span>ROSTER STATUS ({players.length})</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {players.map(p => (
                <div 
                  key={p.id} 
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-xs ${
                    p.id === currentUserId 
                      ? 'bg-purple-950/40 border-purple-400/60 shadow-sm' 
                      : 'bg-black/40 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-base">{p.avatar}</span>
                    <span className="font-extrabold text-white truncate max-w-[120px]">
                      {p.name} {p.id === currentUserId && '(You)'}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(p.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 opacity-40" />
                <p className="text-xs font-mono">No messages yet.<br />Cheer for your favorite fighter!</p>
              </div>
            ) : (
              messages.map(m => {
                const isMe = m.senderId === currentUserId;
                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-0.5`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>{m.senderAvatar}</span>
                      <span className="font-bold text-slate-300">{m.senderName}</span>
                      {m.isSpectator && (
                        <span className="text-[9px] text-purple-400 font-mono">[Spectator]</span>
                      )}
                    </div>
                    <div 
                      className={`px-3 py-2 rounded-2xl text-xs max-w-[85%] break-words ${
                        isMe 
                          ? 'bg-purple-600 text-white rounded-tr-none' 
                          : 'bg-slate-900 text-slate-200 border border-white/10 rounded-tl-none'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Quick Reactions Bar */}
          <div className="p-2 border-t border-white/10 bg-black/40 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => handleQuickSend('Bro that ability was crazy 💀')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 whitespace-nowrap border border-white/5 transition-all"
            >
              Crazy ability! 💀
            </button>
            <button 
              onClick={() => handleQuickSend('Insane damage roll! 🔥')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 whitespace-nowrap border border-white/5 transition-all"
            >
              Insane damage! 🔥
            </button>
            <button 
              onClick={() => handleQuickSend('Clutch comeback! ⚡')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 whitespace-nowrap border border-white/5 transition-all"
            >
              Clutch comeback! ⚡
            </button>
            <button 
              onClick={() => handleQuickSend('GG WP! 👑')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 whitespace-nowrap border border-white/5 transition-all"
            >
              GG WP! 👑
            </button>
          </div>

          {/* 4. Text Input Bar */}
          <div className="p-3 border-t border-white/10 bg-black/80 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Send message to room..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-400"
              maxLength={200}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}

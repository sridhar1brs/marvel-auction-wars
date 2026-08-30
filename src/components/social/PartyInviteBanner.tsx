import React from 'react';
import { Crown, Check, X, Shield } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export interface PartyInviteData {
  partyId: string;
  inviterId: string;
  inviterName: string;
  inviterAvatar: string;
  inviterCustomAvatar?: string;
  inviterLevel: number;
}

interface Props {
  invite: PartyInviteData | null;
  onAccept: (partyId: string) => void;
  onDecline: (partyId: string) => void;
}

export function PartyInviteBanner({ invite, onAccept, onDecline }: Props) {
  if (!invite) return null;

  return (
    <div className="fixed top-16 right-4 z-50 max-w-sm w-full bg-[#0D1224]/98 border-2 border-purple-500/70 rounded-3xl p-4 shadow-[0_0_40px_rgba(168,85,247,0.4)] animate-slideDown select-none">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-400 overflow-hidden flex items-center justify-center text-xl bg-black">
            {invite.inviterCustomAvatar ? (
              <img src={invite.inviterCustomAvatar} alt={invite.inviterName} className="w-full h-full object-cover" />
            ) : (
              <span>{invite.inviterAvatar || '🦸‍♂️'}</span>
            )}
          </div>
          <Crown className="w-4 h-4 text-amber-400 absolute -top-1.5 -left-1.5 filter drop-shadow animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider">Party Invitation</span>
            <span className="text-[9px] bg-amber-500 text-black font-black px-1.5 py-0.2 rounded font-mono">
              LVL {invite.inviterLevel}
            </span>
          </div>
          <h4 className="font-heading font-black text-sm text-white truncate mt-0.5">
            {invite.inviterName}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Invited you to join their Squad Party!
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playVictory();
                onAccept(invite.partyId);
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onDecline(invite.partyId);
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-red-950 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-300 font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

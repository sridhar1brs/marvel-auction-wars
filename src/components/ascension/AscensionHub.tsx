import React, { useState } from 'react';
import { AscensionHeader } from './AscensionHeader';
import { AscensionHome } from './AscensionHome';
import { AscensionShop } from './AscensionShop';
import { AscensionInventory } from './AscensionInventory';
import { AscensionBattleArena } from './AscensionBattleArena';
import { AscensionRankedArena } from './AscensionRankedArena';
import { AscensionRelicVault } from './AscensionRelicVault';
import { AscensionSkillVault } from './AscensionSkillVault';
import { AscensionBattlePass } from './AscensionBattlePass';
import { AscensionLeaderboards } from './AscensionLeaderboards';
import { AscensionAdminPanel } from './AscensionAdminPanel';
import { RedeemCodeModal } from './RedeemCodeModal';
import { CharacterDatabase } from '../encyclopedia/CharacterDatabase';
import { PlayerProfileModal } from '../common/PlayerProfileModal';
import { soundManager } from '../../audio/soundManager';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Users, ShoppingBag, Shield, Zap, Swords, 
  Package, Crown, Trophy, Sparkles, KeyRound, ShieldAlert
} from 'lucide-react';

export type AscensionTab = 
  | 'HOME' 
  | 'CHARACTERS' 
  | 'SHOP' 
  | 'RELICS' 
  | 'SKILLS' 
  | 'BATTLE' 
  | 'INVENTORY' 
  | 'BATTLE_PASS' 
  | 'RANKED' 
  | 'LEADERBOARDS'
  | 'ADMIN';

interface Props {
  onBackToHome: () => void;
}

export function AscensionHub({ onBackToHome }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AscensionTab>('HOME');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  const tabs: { id: AscensionTab; label: string; icon: React.ReactNode; color?: string }[] = [
    { id: 'HOME', label: 'Home Hub', icon: <Home className="w-4 h-4" /> },
    { id: 'CHARACTERS', label: 'Characters', icon: <Users className="w-4 h-4" /> },
    { id: 'SHOP', label: 'Astra Shop', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'RELICS', label: 'Relics', icon: <Shield className="w-4 h-4" /> },
    { id: 'SKILLS', label: 'Skills', icon: <Zap className="w-4 h-4" /> },
    { id: 'BATTLE', label: 'Battle Arena', icon: <Swords className="w-4 h-4" /> },
    { id: 'INVENTORY', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'BATTLE_PASS', label: 'Battle Pass', icon: <Crown className="w-4 h-4" /> },
    { id: 'RANKED', label: 'Ranked', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
    { id: 'LEADERBOARDS', label: 'Leaderboards', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
  ];

  if (isAdmin) {
    tabs.push({
      id: 'ADMIN',
      label: 'Admin Panel',
      icon: <ShieldAlert className="w-4 h-4 text-amber-400" />
    });
  }

  const handleTabClick = (tabId: AscensionTab) => {
    soundManager.playClick();
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-[#04060E] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Universal Ascension Top Header (Astra, Rank, Profile, Home, Redeem) */}
      <AscensionHeader
        onBackToHome={onBackToHome}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRedeem={() => setIsRedeemOpen(true)}
      />

      {/* 2. Top Navigation Tabs Bar — Perfectly Centered & Balanced */}
      <nav className="sticky top-[53px] z-30 bg-[#070A16]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2 shadow-md">
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap overflow-x-auto no-scrollbar">
          {tabs.map(t => {
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabClick(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-black shadow-glow-cyan scale-105'
                    : 'bg-black/40 text-slate-300 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}

          {/* Quick Redeem Key Tab */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsRedeemOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-500/40 transition-all flex-shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Redeem Code</span>
          </button>
        </div>
      </nav>

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'HOME' && (
          <AscensionHome onNavigateTab={handleTabClick} />
        )}

        {activeTab === 'CHARACTERS' && (
          <CharacterDatabase />
        )}

        {activeTab === 'SHOP' && (
          <AscensionShop />
        )}

        {activeTab === 'RELICS' && (
          <AscensionRelicVault />
        )}

        {activeTab === 'SKILLS' && (
          <AscensionSkillVault />
        )}

        {activeTab === 'BATTLE' && (
          <AscensionBattleArena />
        )}

        {activeTab === 'RANKED' && (
          <AscensionRankedArena />
        )}

        {activeTab === 'INVENTORY' && (
          <AscensionInventory />
        )}

        {activeTab === 'BATTLE_PASS' && (
          <AscensionBattlePass />
        )}

        {activeTab === 'LEADERBOARDS' && (
          <AscensionLeaderboards />
        )}

        {activeTab === 'ADMIN' && (
          <AscensionAdminPanel />
        )}
      </main>

      {/* 4. Modals */}
      {isProfileOpen && (
        <PlayerProfileModal onClose={() => setIsProfileOpen(false)} />
      )}

      {isRedeemOpen && (
        <RedeemCodeModal
          isOpen={isRedeemOpen}
          onClose={() => setIsRedeemOpen(false)}
        />
      )}

    </div>
  );
}

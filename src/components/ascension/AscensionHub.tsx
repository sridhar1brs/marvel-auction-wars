import React, { useState, useEffect } from 'react';
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
import { CardForge } from './CardForge';
import { DailyMissions } from './DailyMissions';
import { Achievements } from './Achievements';
import { MysteryWheel } from './MysteryWheel';
import { TeamBuilder } from './TeamBuilder';
import { CharacterMastery } from './CharacterMastery';
import { CrateOpening } from './CrateOpening';
import { soundManager } from '../../audio/soundManager';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Users, ShoppingBag, Shield, Zap, Swords,
  Package, Crown, Trophy, Sparkles, KeyRound, ShieldAlert,
  Hammer, Target, Star, RotateCcw, BookOpen
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
  | 'MISSIONS'
  | 'ACHIEVEMENTS'
  | 'CARD_FORGE'
  | 'MYSTERY_WHEEL'
  | 'TEAM_BUILDER'
  | 'MASTERY'
  | 'ADMIN';

interface Props {
  onBackToHome: () => void;
}

export function AscensionHub({ onBackToHome }: Props) {
  const { user, getDailyMissions, getWeeklyChallenges } = useAuth();
  const [activeTab, setActiveTab] = useState<AscensionTab>('HOME');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isCrateOpen, setIsCrateOpen] = useState(false);
  const [availableCrates, setAvailableCrates] = useState<any[]>([]);

  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  // Count unclaimed items for badge indicators
  const unclaimedMissions = (user?.dailyMissions || []).filter(m => m.isCompleted && !m.isClaimed).length
    + (user?.weeklyMissions || []).filter(m => m.isCompleted && !m.isClaimed).length;

  const claimedLevelCrates = user?.claimedLevelCrates || [];
  const userLevel = user?.level || 1;

  // Check for available level crates
  useEffect(() => {
    const CRATE_LEVELS = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100];
    const CRATE_TYPES: Record<number, 'ASTRA' | 'MYSTERY_CARD' | 'LEGENDARY'> = {
      5: 'ASTRA', 10: 'ASTRA', 15: 'MYSTERY_CARD', 20: 'ASTRA',
      25: 'MYSTERY_CARD', 30: 'LEGENDARY', 35: 'ASTRA', 40: 'MYSTERY_CARD',
      50: 'LEGENDARY', 60: 'LEGENDARY', 70: 'LEGENDARY', 80: 'LEGENDARY',
      90: 'LEGENDARY', 100: 'LEGENDARY',
    };
    const crates = CRATE_LEVELS.map(lvl => ({
      level: lvl,
      type: CRATE_TYPES[lvl],
      canClaim: userLevel >= lvl && !claimedLevelCrates.includes(lvl),
    }));
    setAvailableCrates(crates);
  }, [userLevel, claimedLevelCrates]);

  const claimableCratesCount = availableCrates.filter(c => c.canClaim).length;

  // Load missions on mount
  useEffect(() => {
    if (user) {
      getDailyMissions();
      getWeeklyChallenges();
    }
  }, []);

  const MAIN_TABS: { id: AscensionTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'HOME',        label: 'Home Hub',     icon: <Home className="w-4 h-4" /> },
    { id: 'CHARACTERS',  label: 'Characters',   icon: <Users className="w-4 h-4" /> },
    { id: 'SHOP',        label: 'Astra Shop',   icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'RELICS',      label: 'Relics',       icon: <Shield className="w-4 h-4" /> },
    { id: 'SKILLS',      label: 'Skills',       icon: <Zap className="w-4 h-4" /> },
    { id: 'BATTLE',      label: 'Battle',       icon: <Swords className="w-4 h-4" /> },
    { id: 'RANKED',      label: 'Ranked',       icon: <Trophy className="w-4 h-4 text-amber-400" /> },
    { id: 'INVENTORY',   label: 'Inventory',    icon: <Package className="w-4 h-4" /> },
    { id: 'BATTLE_PASS', label: 'Battle Pass',  icon: <Crown className="w-4 h-4" /> },
    { id: 'LEADERBOARDS',label: 'Leaderboards', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
  ];

  const V4_TABS: { id: AscensionTab; label: string; icon: React.ReactNode; badge?: number; isNew?: boolean }[] = [
    { id: 'MISSIONS',     label: 'Missions',     icon: <Target className="w-4 h-4 text-cyan-400" />,   badge: unclaimedMissions || undefined, isNew: true },
    { id: 'ACHIEVEMENTS', label: 'Achievements', icon: <Trophy className="w-4 h-4 text-amber-400" />,  isNew: true },
    { id: 'CARD_FORGE',   label: 'Card Forge',   icon: <Hammer className="w-4 h-4 text-purple-400" />, isNew: true },
    { id: 'MYSTERY_WHEEL',label: 'Wheel',        icon: <RotateCcw className="w-4 h-4 text-orange-400" />, badge: (user?.wheelSpins || 0) > 0 ? user!.wheelSpins : undefined, isNew: true },
    { id: 'TEAM_BUILDER', label: 'Teams',        icon: <Users className="w-4 h-4 text-emerald-400" />, isNew: true },
    { id: 'MASTERY',      label: 'Mastery',      icon: <Star className="w-4 h-4 text-amber-400" />,    isNew: true },
  ];

  const handleTabClick = (tabId: AscensionTab) => {
    soundManager.playClick();
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-[#04060E] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">

      {/* 1. Universal Ascension Top Header */}
      <AscensionHeader
        onBackToHome={onBackToHome}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRedeem={() => setIsRedeemOpen(true)}
      />

      {/* 2. Top Navigation Tabs Bar */}
      <nav className="sticky top-[53px] z-30 bg-[#070A16]/95 backdrop-blur-md border-b border-white/10 shadow-md">
        {/* Main Tabs Row */}
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 pt-2 pb-1 flex items-center gap-1.5 flex-wrap overflow-x-auto no-scrollbar">
          {MAIN_TABS.map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabClick(t.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-black shadow-glow-cyan scale-105'
                    : 'bg-black/40 text-slate-300 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.badge != null && t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Redeem Key Tab */}
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setIsRedeemOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-500/40 transition-all flex-shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Redeem</span>
          </button>

          {/* Crates Button — shows badge when claimable */}
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setIsCrateOpen(true); }}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
              claimableCratesCount > 0
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-500/30'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Crates</span>
            {claimableCratesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {claimableCratesCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleTabClick('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
                activeTab === 'ADMIN'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                  : 'bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          )}
        </div>

        {/* v4.0 NEW Systems Sub-Row */}
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 flex-shrink-0 mr-1">NEW v4.0 →</span>
          {V4_TABS.map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabClick(t.id)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white scale-105 shadow-glow-purple'
                    : 'bg-violet-950/40 text-violet-300 hover:text-white border border-violet-500/20 hover:border-violet-500/50'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.badge != null && t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
                {t.isNew && !isActive && (
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black px-1 py-0.5 rounded-full bg-violet-500 text-white leading-none">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ——— Existing Tabs ——— */}
        {activeTab === 'HOME' && <AscensionHome onNavigateTab={handleTabClick} />}
        {activeTab === 'CHARACTERS' && <CharacterDatabase />}
        {activeTab === 'SHOP' && <AscensionShop />}
        {activeTab === 'RELICS' && <AscensionRelicVault />}
        {activeTab === 'SKILLS' && <AscensionSkillVault />}
        {activeTab === 'BATTLE' && <AscensionBattleArena />}
        {activeTab === 'RANKED' && <AscensionRankedArena />}
        {activeTab === 'INVENTORY' && <AscensionInventory />}
        {activeTab === 'BATTLE_PASS' && <AscensionBattlePass />}
        {activeTab === 'LEADERBOARDS' && <AscensionLeaderboards />}
        {activeTab === 'ADMIN' && <AscensionAdminPanel />}

        {/* ——— v4.0 New Tabs ——— */}
        {activeTab === 'MISSIONS'      && <DailyMissions />}
        {activeTab === 'ACHIEVEMENTS'  && <Achievements />}
        {activeTab === 'CARD_FORGE'    && <CardForge />}
        {activeTab === 'MYSTERY_WHEEL' && <MysteryWheel />}
        {activeTab === 'TEAM_BUILDER'  && <TeamBuilder />}
        {activeTab === 'MASTERY'       && <CharacterMastery />}
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

      {isCrateOpen && (
        <CrateOpening
          crates={availableCrates}
          onClose={() => setIsCrateOpen(false)}
          onClaimed={() => {
            // Refresh crate state (user is updated via AuthContext)
          }}
        />
      )}
    </div>
  );
}

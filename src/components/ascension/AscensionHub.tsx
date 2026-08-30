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
import { NewPlayerChooser } from './NewPlayerChooser';
import { CharacterTokenForge } from './CharacterTokenForge';
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
  | 'TOKEN_FORGE'
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
  const [showNewPlayerChooser, setShowNewPlayerChooser] = useState(false);

  const isAdmin = user?.username?.toLowerCase() === 'darksenseify' && user?.role === 'admin' && user?.isAdmin;

  // Count unclaimed items for badge indicators
  const unclaimedMissions = (user?.dailyMissions || []).filter(m => m.isCompleted && !m.isClaimed).length
    + (user?.weeklyMissions || []).filter(m => m.isCompleted && !m.isClaimed).length;

  const claimedLevelCrates = user?.claimedLevelCrates || [];
  const userLevel = user?.level || 1;

  // Check for available level crates
  useEffect(() => {
    const crates = [
      ...Array.from({ length: user?.crateInventory?.shard || 0 }, (_, index) => ({
        level: 0, type: 'SHARD_CRATE' as const, canClaim: true, inventory: true, id: `shard-${index}`,
      })),
      ...Array.from({ length: user?.crateInventory?.character || 0 }, (_, index) => ({
        level: 0, type: 'CHARACTER_CRATE' as const, canClaim: true, inventory: true, id: `character-${index}`,
      })),
      ...[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map(lvl => ({
        level: lvl,
        type: lvl % 25 === 0 ? 'CHARACTER_CRATE' as const : 'SHARD_CRATE' as const,
        canClaim: userLevel >= lvl && !claimedLevelCrates.includes(lvl),
        inventory: false,
        id: `level-${lvl}`,
      })),
    ];
    setAvailableCrates(crates);
  }, [userLevel, claimedLevelCrates]);

  const claimableCratesCount = availableCrates.filter(c => c.canClaim).length;

  // Load missions on mount
  useEffect(() => {
    if (user) {
      getDailyMissions();
      getWeeklyChallenges();
      setShowNewPlayerChooser(!user.onboardingCompleted && user.ownedCharacters.length === 0);
    }
  }, []);

  const ALL_NAV_TABS: { id: AscensionTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'HOME',         label: 'Home',         icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'CHARACTERS',   label: 'Characters',   icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'SHOP',         label: 'Astra Shop',   icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'RELICS',       label: 'Relics',       icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'SKILLS',       label: 'Skills',       icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'BATTLE',       label: 'Battle',       icon: <Swords className="w-3.5 h-3.5" /> },
    { id: 'RANKED',       label: 'Ranked',       icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'INVENTORY',    label: 'Inventory',    icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'BATTLE_PASS',  label: 'Battle Pass',  icon: <Crown className="w-3.5 h-3.5" /> },
    { id: 'LEADERBOARDS', label: 'Leaderboards', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'MISSIONS',     label: 'Missions',     icon: <Target className="w-3.5 h-3.5" />, badge: unclaimedMissions || undefined },
    { id: 'ACHIEVEMENTS', label: 'Achievements', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'CARD_FORGE',   label: 'Card Forge',   icon: <Hammer className="w-3.5 h-3.5" /> },
    { id: 'MYSTERY_WHEEL',label: 'Wheel',        icon: <RotateCcw className="w-3.5 h-3.5" />, badge: (user?.wheelSpins || 0) > 0 ? user!.wheelSpins : undefined },
    { id: 'TEAM_BUILDER', label: 'Teams',        icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'MASTERY',      label: 'Mastery',      icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'TOKEN_FORGE',  label: 'Token Forge',  icon: <Hammer className="w-3.5 h-3.5" /> },
    ...(isAdmin ? [{ id: 'ADMIN' as AscensionTab, label: 'Admin Panel', icon: <ShieldAlert className="w-3.5 h-3.5" /> }] : [])
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
      />

      {/* 2. Top Navigation Tabs Bar — 18 Buttons Unified */}
      <nav className="sticky top-[53px] z-30 bg-[#070A16]/95 backdrop-blur-md border-b border-white/10 shadow-md">
        <div className="w-full max-w-[1750px] mx-auto px-2 sm:px-4 py-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {ALL_NAV_TABS.map(t => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTabClick(t.id)}
                  className={`relative shrink-0 h-9 flex items-center justify-center gap-1.5 px-3 rounded-xl text-[11px] sm:text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-glow-cyan border border-cyan-400'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/30'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                  {t.badge != null && t.badge > 0 && (
                    <span className="ml-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Action: Redeem Key */}
            <button
              type="button"
              onClick={() => { soundManager.playClick(); setIsRedeemOpen(true); }}
              className="shrink-0 h-9 flex items-center justify-center gap-1.5 px-3 rounded-xl text-[11px] sm:text-xs font-heading font-black uppercase tracking-wider bg-slate-900/70 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span>Redeem</span>
            </button>

            {/* Quick Action: Crates Modal */}
            <button
              type="button"
              onClick={() => { soundManager.playClick(); setIsCrateOpen(true); }}
              className={`relative shrink-0 h-9 flex items-center justify-center gap-1.5 px-3 rounded-xl text-[11px] sm:text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer ${
                claimableCratesCount > 0
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400'
                  : 'bg-slate-900/70 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 hover:border-amber-500'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Crates</span>
              {claimableCratesCount > 0 && (
                <span className="ml-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                  {claimableCratesCount}
                </span>
              )}
            </button>
          </div>
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
        {activeTab === 'TOKEN_FORGE'   && <CharacterTokenForge />}
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
      {showNewPlayerChooser && <NewPlayerChooser onComplete={() => setShowNewPlayerChooser(false)} />}
    </div>
  );
}

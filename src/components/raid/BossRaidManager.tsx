import React, { useState, useMemo } from 'react';
import { Character, Player, BattleActionType, ArtifactItem } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { MARVEL_ARTIFACTS } from '../../data/artifacts';
import { CharacterCard } from '../common/CharacterCard';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { UltimateAnimationOverlay } from '../common/UltimateAnimationOverlay';
import { FloatingReactions } from '../common/FloatingReactions';
import { getFighterTagTeamCombo } from '../../engine/synergyEngine';
import { 
  Users, DollarSign, Swords, Shield, Zap, Sparkles, Heart, Flame, Skull, 
  Trophy, ArrowRight, RotateCcw, Activity, RefreshCw, ShoppingBag, Check, FastForward, Crown, Lock, Plus
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import confetti from 'canvas-confetti';

interface Props {
  onExit: () => void;
}

export type RaidStage = 'SETUP' | 'COOP_DRAFT' | 'RELIC_VAULT' | 'BOSS_ARENA' | 'VICTORY';

export interface RaidBossConfig {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  imageUrl: string;
  introLog: string;
  specialName: string;
  phase2Aura: string;
  description: string;
}

export const RAID_BOSSES: RaidBossConfig[] = [
  {
    id: 'infinity_ultron',
    name: 'Infinity Ultron',
    title: 'Supreme Multiverse Destroyer',
    maxHp: 600,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    introLog: '⚡ RAID COMMENCED! Infinity Ultron wields all 6 Infinity Stones to cleave the multiverse!',
    specialName: '🌌 INFINITY STONES OBLIVION',
    phase2Aura: 'border-cyan-500 shadow-glow-cosmic',
    description: 'Possesses cosmic omnipotence. Cleaves through space-time defense.'
  },
  {
    id: 'galactus',
    name: 'Galactus',
    title: 'Devourer of Worlds',
    maxHp: 500,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c8/Galan_%28Earth-828%29_from_The_Fantastic_Four_First_Steps_promotional_material_001.jpg/revision/latest?cb=20250704182708',
    introLog: '⚡ RAID COMMENCED! Galactus channels the infinite Power Cosmic to consume planets!',
    specialName: '🪐 PLANETARY CONVERGENCE',
    phase2Aura: 'border-purple-500 shadow-glow-cosmic',
    description: 'Siphons life force from entire star systems. Cosmic armor.'
  },
  {
    id: 'thanos',
    name: 'Thanos (Infinity Gauntlet)',
    title: 'The Mad Titan',
    maxHp: 550,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/63/Thanos_%28Earth-616%29_from_Avengers_Infinity_War_Prelude_Vol_1_1_001.jpg/revision/latest?cb=20180124190807',
    introLog: '⚡ RAID COMMENCED! Thanos wields all 6 Infinity Stones on the Golden Gauntlet!',
    specialName: '💥 TITAN METEOR CRUSH',
    phase2Aura: 'border-amber-500 shadow-glow-gold',
    description: 'Unleashes devastating reality-warping blasts and decimation snaps.'
  },
  {
    id: 'knull',
    name: 'Knull',
    title: 'God of the Symbiotes & Void King',
    maxHp: 580,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9f/Knull_%28Earth-616%29_from_King_in_Black_Vol_1_1_001.png/revision/latest?cb=20201202202613',
    introLog: '⚡ RAID COMMENCED! Knull unsheathes the All-Black Necrosword from the primordial abyss!',
    specialName: '🩸 ALL-BLACK NECRO-VOID TSUNAMI',
    phase2Aura: 'border-red-600 shadow-glow-red',
    description: 'Ancient primordial god. Commands infinite symbiote hordes.'
  },
  {
    id: 'kang',
    name: 'Kang the Conqueror',
    title: 'Temporal Overlord of 1,000 Timelines',
    maxHp: 520,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f6/Nathaniel_Richards_%28Kang%29_%28Earth-6311%29_from_Timeless_Vol_1_1_001.jpg/revision/latest?cb=20211230005707',
    introLog: '⚡ RAID COMMENCED! Kang commands futuristic 40th-century antimatter armaments!',
    specialName: '⏳ CHRONO-TIMELINE EXTINCTION',
    phase2Aura: 'border-blue-500 shadow-glow-blue',
    description: 'Controls time dilation, looping opponent moves backward.'
  },
  {
    id: 'apocalypse',
    name: 'Apocalypse (En Sabah Nur)',
    title: 'Immortal Mutant Pharaoh',
    maxHp: 480,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f9/En_Sabah_Nur_%28Earth-616%29_from_X-Men_Vol_5_2_001.jpg/revision/latest?cb=20191114002621',
    introLog: '⚡ RAID COMMENCED! Apocalypse awakens his celestial techno-organic armor!',
    specialName: '⚔️ FOUR HORSEMEN WRATH',
    phase2Aura: 'border-indigo-500 shadow-glow-cosmic',
    description: 'Only the fittest survive. Celestial techno-organic shapeshifting.'
  },
  {
    id: 'dormammu',
    name: 'Dormammu',
    title: 'Lord of the Dark Dimension',
    maxHp: 650,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/87/Dormammu_%28Earth-616%29_from_Defenders_Vol_3_1_001.jpg/revision/latest?cb=20180424180447',
    introLog: '⚡ RAID COMMENCED! Dormammu floods the mortal realm with Dark Dimension Hellfire!',
    specialName: '🔥 FLAMES OF THE FALTINE',
    phase2Aura: 'border-orange-500 shadow-glow-red',
    description: 'Supreme ruler of chaos. Immune to non-mystical attacks.'
  },
  {
    id: 'dark_phoenix',
    name: 'Dark Phoenix',
    title: 'Cosmic Entity of Extinction',
    maxHp: 620,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/07/Jean_Grey_%28Earth-616%29_from_Phoenix_Vol_1_1_001.jpg/revision/latest?cb=20240717203606',
    introLog: '⚡ RAID COMMENCED! The Phoenix Force unleashes raw uninhibited stellar destruction!',
    specialName: '☄️ SUPERNOVA STAR-EATER',
    phase2Aura: 'border-rose-500 shadow-glow-red',
    description: 'Consumes entire galaxies. Revives with raging cosmic fire.'
  },
  {
    id: 'beyonder',
    name: 'The Beyonder',
    title: 'Omnipotent Entity of Battleworld',
    maxHp: 700,
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/1/1a/Beyonder_%28Earth-616%29_from_Defenders_Beyond_Vol_1_2_001.jpg/revision/latest?cb=20220810214644',
    introLog: '⚡ RAID COMMENCED! The Beyonder bends the rules of reality to his whim!',
    specialName: '✨ BATTLEWORLD REALITY WARP',
    phase2Aura: 'border-yellow-400 shadow-glow-gold',
    description: 'The supreme entity of the Beyond Realm. Reality is merely his toy.'
  }
];

export function BossRaidManager({ onExit }: Props) {
  const [stage, setStage] = useState<RaidStage>('SETUP');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'
  ]);
  const playerAvatars = ['🦾', '🛡️', '⚡', '🕷️', '🐺', '🔮'];

  const [selectedBossId, setSelectedBossId] = useState<string>('infinity_ultron');
  const currentBoss = useMemo(() => {
    return RAID_BOSSES.find(b => b.id === selectedBossId) || RAID_BOSSES[0];
  }, [selectedBossId]);

  // Combined Team Funds ($25 per player)
  const [teamMoney, setTeamMoney] = useState<number>(100);

  // Drafted heroes for the team (1 per player)
  const [teamRoster, setTeamRoster] = useState<{ playerIdx: number; character: Character; equippedRelic?: ArtifactItem }[]>([]);

  // Draft Auction State
  const [draftLotIdx, setDraftLotIdx] = useState<number>(0);
  const [draftLotChar, setDraftLotChar] = useState<Character | null>(null);

  // Boss Battle State
  const [bossHp, setBossHp] = useState<number>(600);
  const [bossPhase, setBossPhase] = useState<1 | 2>(1);
  const [activeFighterIdx, setActiveFighterIdx] = useState<number>(0);
  const [selectedAction, setSelectedAction] = useState<BattleActionType>('ATTACK');
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isClashing, setIsClashing] = useState<boolean>(false);
  const [isDefeated, setIsDefeated] = useState<boolean>(false);

  // Ultimate Overlay
  const [ultimateOverlay, setUltimateOverlay] = useState<{
    isOpen: boolean;
    type: 'special' | 'dual_strike' | 'boss_ultimate' | 'relic';
    heroName: string;
    partnerHeroName?: string;
    abilityTitle: string;
    description: string;
    bannerColor?: string;
    damageBonus?: number;
  }>({
    isOpen: false,
    type: 'special',
    heroName: '',
    abilityTitle: '',
    description: ''
  });

  // Pick next random candidate character for the draft
  const getNextDraftLot = () => {
    const randomIdx = Math.floor(Math.random() * ALL_CHARACTERS.length);
    setDraftLotChar(ALL_CHARACTERS[randomIdx]);
  };

  // 1. START COOP DRAFT
  const handleStartCoopDraft = () => {
    soundManager.playClick();
    const startingPool = playerCount * 25; // e.g. 4 players = $100 pooled
    setTeamMoney(startingPool);
    setTeamRoster([]);
    setBossHp(currentBoss.maxHp);
    setBossPhase(1);
    setIsDefeated(false);
    setCombatLog([currentBoss.introLog]);
    getNextDraftLot();
    setStage('COOP_DRAFT');
  };

  // 2. BUY CURRENT CHARACTER FOR SQUAD
  const handleBuyDraftLot = () => {
    if (!draftLotChar) return;
    const cost = Math.max(5, Math.round(draftLotChar.startingPrice * 0.8));
    if (teamMoney < cost) return;

    soundManager.playGavelWon();
    const nextPlayerIdx = teamRoster.length;
    const newSquad = [
      ...teamRoster,
      {
        playerIdx: nextPlayerIdx,
        character: {
          ...draftLotChar,
          currentHp: 100,
          maxHp: 100,
          isFainted: false
        }
      }
    ];

    setTeamMoney(prev => prev - cost);
    setTeamRoster(newSquad);

    // Check if team is full (1 character per player)
    if (newSquad.length >= playerCount) {
      soundManager.playVictory();
      setStage('RELIC_VAULT');
    } else {
      getNextDraftLot();
    }
  };

  // 3. SKIP DRAFT LOT
  const handleSkipDraftLot = () => {
    soundManager.playClick();
    getNextDraftLot();
  };

  // 4. EQUIP RELIC
  const handleEquipRelic = (heroIdx: number, relic: ArtifactItem) => {
    if (teamMoney < relic.cost) return;
    soundManager.playClick();
    setTeamMoney(prev => prev - relic.cost);
    setTeamRoster(prev => prev.map((item, i) => {
      if (i === heroIdx) {
        return {
          ...item,
          equippedRelic: relic,
          character: {
            ...item.character,
            overallPower: item.character.overallPower + (relic.bonusPower || 0)
          }
        };
      }
      return item;
    }));
  };

  // 5. PROCEED TO BOSS FIGHT
  const handleStartBossBattle = () => {
    soundManager.playClick();
    setBossHp(currentBoss.maxHp);
    setBossPhase(1);
    setIsDefeated(false);
    setActiveFighterIdx(0);
    setCombatLog([currentBoss.introLog]);
    setStage('BOSS_ARENA');
  };

  // Combat Execution
  const currentFighter = teamRoster[activeFighterIdx]?.character;
  const currentFighterItem = teamRoster[activeFighterIdx];
  const livingRoster = teamRoster.filter(item => (item.character.currentHp === undefined || item.character.currentHp > 0));
  const isTeamWiped = livingRoster.length === 0;
  const allTeamCharacters = teamRoster.map(item => item.character);
  const currentCombo = currentFighter ? getFighterTagTeamCombo(currentFighter, allTeamCharacters) : null;

  const handleExecuteRaidAttack = () => {
    if (isDefeated || isTeamWiped || isClashing || !currentFighter) return;

    soundManager.playClick();
    setIsClashing(true);
    soundManager.playAttackHit();

    // Player Hero Damage
    const basePwr = currentFighter.overallPower;
    const roll = Math.floor(Math.random() * 20) + 1;
    let bonus = 0;

    if (selectedAction === 'SPECIAL') {
      bonus = 22;
      setUltimateOverlay({
        isOpen: true,
        type: 'special',
        heroName: currentFighter.name,
        abilityTitle: currentFighter.specialAbilities?.[0]?.name || 'SIGNATURE SUPERPOWER',
        description: currentFighter.specialAbilities?.[0]?.description || currentFighter.powers || 'Unleashes full superhero burst!',
        bannerColor: currentFighter.color || '#06B6D4',
        damageBonus: 22
      });
    } else if (selectedAction === 'DUAL_STRIKE' && currentCombo) {
      bonus = 34;
      setUltimateOverlay({
        isOpen: true,
        type: 'dual_strike',
        heroName: currentFighter.name,
        partnerHeroName: currentCombo.hero2Name === currentFighter.name ? currentCombo.hero1Name : currentCombo.hero2Name,
        abilityTitle: currentCombo.comboTitle,
        description: currentCombo.comboDescription,
        bannerColor: currentCombo.bannerColor,
        damageBonus: currentCombo.bonusDualDamage
      });
    } else if (selectedAction === 'ARTIFACT' && currentFighterItem?.equippedRelic) {
      bonus = (currentFighterItem.equippedRelic.bonusPower || 0) * 2 + 10;
    }

    const heroDmg = Math.max(25, Math.round((basePwr + roll + bonus) * 0.70));
    const newBossHp = Math.max(0, bossHp - heroDmg);

    // Boss Retaliation
    let bossDamage = Math.floor(Math.random() * 20) + 22;
    if (selectedAction === 'DEFEND') {
      bossDamage = Math.max(8, Math.round(bossDamage * 0.5));
    }
    if (bossPhase === 2) {
      bossDamage = Math.round(bossDamage * 1.4);
    }

    const heroPrevHp = currentFighter.currentHp ?? 100;
    const heroNewHp = Math.max(0, heroPrevHp - bossDamage);

    setTeamRoster(prev => prev.map((item, i) => {
      if (i === activeFighterIdx) {
        return {
          ...item,
          character: {
            ...item.character,
            currentHp: heroNewHp,
            isFainted: heroNewHp <= 0
          }
        };
      }
      return item;
    }));

    setBossHp(newBossHp);
    const newPhase = newBossHp <= currentBoss.maxHp * 0.5 ? 2 : 1;
    setBossPhase(newPhase);

    const logs = [
      `⚔️ ${playerNames[currentFighterItem.playerIdx]}'s ${currentFighter.name} struck with ${selectedAction} dealing 💥 ${heroDmg} DAMAGE to ${currentBoss.name}!`,
      `⚠️ ${currentBoss.name} counter-attacked with ${currentBoss.specialName} dealing 🩸 ${bossDamage} damage to ${currentFighter.name}! (${heroNewHp}/100 HP)`
    ];

    if (heroNewHp <= 0) {
      logs.push(`💀 ${currentFighter.name} HAS FAINTED!`);
    }

    if (newBossHp <= 0) {
      setIsDefeated(true);
      soundManager.playVictory();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      logs.push(`👑 VICTORY! ${currentBoss.name} HAS BEEN ERADICATED!`);
    }

    setCombatLog(prev => [...logs, ...prev.slice(0, 10)]);

    setTimeout(() => {
      setIsClashing(false);
      // Auto-advance turn to next alive player
      const nextAlive = teamRoster.findIndex((item, idx) => idx > activeFighterIdx && (item.character.currentHp === undefined || item.character.currentHp > 0));
      if (nextAlive !== -1) {
        setActiveFighterIdx(nextAlive);
      } else {
        const firstAlive = teamRoster.findIndex(item => (item.character.currentHp === undefined || item.character.currentHp > 0));
        if (firstAlive !== -1) setActiveFighterIdx(firstAlive);
      }
    }, 500);
  };

  const bossHpPercent = Math.round((bossHp / currentBoss.maxHp) * 100);

  // ==========================================
  // STAGE 1: PLAYER COUNT & SETUP SCREEN
  // ==========================================
  if (stage === 'SETUP') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500 shadow-glow-red text-red-200 text-xs font-black uppercase tracking-widest animate-pulse">
            <Skull className="w-4 h-4 text-red-400" />
            <span>CO-OP TITAN RAID CAMPAIGN</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-black text-white uppercase tracking-wider">
            CHOOSE YOUR STRIKE SQUAD
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Team up with 1 to 6 players! Pool your starting funds into a shared treasury, recruit heroes together, and gear up to defeat a cosmic titan!
          </p>
        </div>

        {/* Player Count Selector (1-6 Players) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>HOW MANY PLAYERS IN RAID? (1 TO 6 PLAYERS):</span>
            </span>
            <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
              ${playerCount * 25} COMBINED TREASURY
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => {
                  soundManager.playClick();
                  setPlayerCount(num);
                }}
                className={`py-4 rounded-2xl font-heading font-black text-xl transition-all border ${
                  playerCount === num
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 border-amber-400 text-white shadow-glow-red scale-105 ring-2 ring-amber-400'
                    : 'bg-black/60 border-white/10 hover:border-red-500/50 text-slate-300'
                }`}
              >
                {num} {num === 1 ? 'PLAYER' : 'PLAYERS'}
              </button>
            ))}
          </div>

          {/* Player Names Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-white/10">
                <span className="text-lg">{playerAvatars[i]}</span>
                <input
                  type="text"
                  value={playerNames[i]}
                  onChange={e => {
                    const newNames = [...playerNames];
                    newNames[i] = e.target.value;
                    setPlayerNames(newNames);
                  }}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none w-full"
                  placeholder={`Player ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Boss Selection (9 Cosmic Threats) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <span className="text-sm font-black uppercase text-slate-200 flex items-center gap-2">
            <Skull className="w-4 h-4 text-red-400" />
            <span>SELECT TARGET COSMIC TITAN (9 BOSSES AVAILABLE):</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RAID_BOSSES.map(boss => (
              <button
                key={boss.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedBossId(boss.id);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  selectedBossId === boss.id
                    ? 'bg-gradient-to-r from-red-950 via-purple-950 to-black border-red-400 ring-2 ring-red-400 shadow-glow-red scale-[1.02]'
                    : 'bg-black/50 border-white/10 hover:border-red-500/40 text-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                  <img src={boss.imageUrl} alt={boss.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-white block truncate">{boss.name}</span>
                  <span className="text-[10px] text-red-400 font-extrabold block">{boss.maxHp} HP • {boss.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={onExit}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black uppercase rounded-2xl border border-white/10 transition-colors"
          >
            Cancel / Return Home
          </button>

          <button
            onClick={handleStartCoopDraft}
            className="px-10 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-heading font-black text-lg uppercase tracking-wider rounded-2xl shadow-glow-red transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <span>COMMENCE CO-OP SQUAD RECRUITMENT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 2: CO-OP TEAM DRAFT AUCTION
  // ==========================================
  if (stage === 'COOP_DRAFT') {
    const cost = draftLotChar ? Math.max(5, Math.round(draftLotChar.startingPrice * 0.8)) : 10;
    const canAfford = teamMoney >= cost;
    const nextPlayerName = playerNames[teamRoster.length] || `Player ${teamRoster.length + 1}`;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
        {/* Top Combined Treasury HUD */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-black/60 border border-white/15 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950 rounded-2xl border border-emerald-500/50 shadow-glow-gold">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">TEAM SHARED TREASURY</span>
              <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">
                ${teamMoney} COMBINED FUNDS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block">SQUAD RECRUITMENT STATUS</span>
              <span className="text-sm font-black text-cyan-300">
                {teamRoster.length} / {playerCount} HEROES RECRUITED
              </span>
            </div>
            <div className="text-xs bg-red-950 px-3 py-1.5 rounded-xl border border-red-500/50 text-red-300 font-bold">
              Target: {currentBoss.name} ({currentBoss.maxHp} HP)
            </div>
          </div>
        </div>

        {/* Current Candidate Card Showcase */}
        {draftLotChar && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 flex justify-center">
              <CharacterCard
                character={draftLotChar}
                size="lg"
                isSpotlight={true}
                startingMoney={100}
              />
            </div>

            <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40">
                  RECRUITING FOR: {nextPlayerName.toUpperCase()}
                </span>
                <h2 className="text-3xl font-heading font-black text-white mt-2">
                  {draftLotChar.name}
                </h2>
                <p className="text-xs text-slate-300 line-clamp-3 mt-1">
                  {draftLotChar.description}
                </p>
              </div>

              <div className="p-4 bg-black/60 rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>RECRUITMENT COST:</span>
                  <span className="font-heading font-black text-emerald-400 text-lg">${cost}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>HERO POWER RATING:</span>
                  <span className="font-heading font-black text-cyan-400">{draftLotChar.overallPower} POWER</span>
                </div>
              </div>

              {/* Buy or Skip Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleBuyDraftLot}
                  disabled={!canAfford}
                  className={`py-4 rounded-2xl font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                    canAfford
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400 shadow-glow-gold'
                      : 'bg-slate-800 text-gray-500 border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>BUY FOR TEAM (${cost})</span>
                </button>

                <button
                  onClick={handleSkipDraftLot}
                  className="py-4 rounded-2xl font-heading font-black text-sm uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-purple-500 flex items-center justify-center gap-2 transition-all"
                >
                  <FastForward className="w-4 h-4 text-purple-400" />
                  <span>SKIP LOT</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Squad Bench Dock */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
          <span className="text-xs font-black uppercase text-slate-300 block">
            RECRUITED STRIKE SQUAD ({teamRoster.length}/{playerCount} HEROES):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {Array.from({ length: playerCount }).map((_, i) => {
              const item = teamRoster[i];
              return (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center ${
                    item
                      ? 'bg-gradient-to-b from-cyan-950/60 to-black border-cyan-500/50 shadow-glow-cosmic'
                      : 'bg-black/30 border-dashed border-white/10'
                  }`}
                >
                  {item ? (
                    <>
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20">
                        <img src={item.character.imageUrl} alt={item.character.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="w-full min-w-0">
                        <span className="text-[10px] font-black text-cyan-300 block truncate">{playerNames[i]}</span>
                        <span className="text-xs font-black text-white block truncate">{item.character.name}</span>
                        <span className="text-[10px] text-amber-400 font-bold block">PWR {item.character.overallPower}</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-24 flex flex-col items-center justify-center text-slate-500">
                      <Plus className="w-6 h-6 mb-1 opacity-40" />
                      <span className="text-[10px] font-bold">{playerNames[i]}</span>
                      <span className="text-[9px]">Awaiting Hero</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 3: RELIC VAULT & EQUIPMENT SHOP
  // ==========================================
  if (stage === 'RELIC_VAULT') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-purple-950/90 via-black/90 to-amber-950/90 border border-purple-500/50 shadow-2xl backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 text-[11px] font-black uppercase tracking-widest border border-amber-500/40">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>CO-OP RELIC VAULT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase mt-1">
              ARM YOUR STRIKE SQUAD
            </h1>
            <p className="text-xs text-slate-300">
              Spend your remaining <strong>${teamMoney}</strong> pooled funds to equip tactical weapons & cosmic artifacts onto your heroes!
            </p>
          </div>

          <button
            onClick={handleStartBossBattle}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-glow-red transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <span>PROCEED TO {currentBoss.name.toUpperCase()} BATTLE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Squad Heroes to Equip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {teamRoster.map((item, i) => (
            <div key={i} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <CharacterPortrait character={item.character} size="sm" showBadge={true} />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black text-cyan-300 uppercase block">{playerNames[item.playerIdx]}</span>
                  <h4 className="text-sm font-black text-white truncate">{item.character.name}</h4>
                  <span className="text-xs font-bold text-amber-400">PWR {item.character.overallPower}</span>
                </div>
              </div>

              {item.equippedRelic ? (
                <div className="p-2.5 bg-amber-950/70 border border-amber-500/50 rounded-xl text-xs space-y-0.5">
                  <span className="font-black text-amber-300 block">🔮 {item.equippedRelic.name}</span>
                  <span className="text-[10px] text-gray-300 block">+{item.equippedRelic.bonusPower} Power Boost Equipped!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Available Relics:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MARVEL_ARTIFACTS.slice(0, 4).map(relic => (
                      <button
                        key={relic.id}
                        disabled={teamMoney < relic.cost}
                        onClick={() => handleEquipRelic(i, relic)}
                        className={`p-2 rounded-xl text-[10px] font-bold border text-left transition-all ${
                          teamMoney >= relic.cost
                            ? 'bg-purple-950/60 hover:bg-purple-900 border-purple-500/40 text-purple-200'
                            : 'bg-black/40 border-white/5 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="font-black block truncate">{relic.name}</span>
                        <span className="text-amber-400">${relic.cost} • +{relic.bonusPower} PWR</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 4: BOSS TITAN BATTLE ARENA
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. TOP TITAN BANNER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-red-950/90 via-purple-950/90 to-black border-2 border-red-500/50 shadow-2xl backdrop-blur-xl">
        <div className="text-center md:text-left space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-900/60 border border-red-500/50 text-[11px] font-black uppercase text-red-200 tracking-widest">
            <Skull className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>CO-OP TITAN RAID ARENA • {playerCount} PLAYERS</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            RAID BOSS: {currentBoss.name}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            {currentBoss.description}
          </p>
        </div>

        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-black/60 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-300"
        >
          Exit Raid to Menu
        </button>
      </div>

      {/* 2. MAIN BATTLEFIELD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Titan Boss Showcase (5 Cols) */}
        <div className={`lg:col-span-5 glass-panel p-6 rounded-3xl border-2 ${currentBoss.phase2Aura} shadow-2xl space-y-4 text-center`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-500/40">
              PHASE {bossPhase} {bossPhase === 2 && '🔥 ENRAGED (+40% DMG)'}
            </span>
            <span className="text-xs font-mono font-black text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              {bossHp} / {currentBoss.maxHp} HP
            </span>
          </div>

          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-3xl overflow-hidden border-4 border-red-500 shadow-2xl bg-black">
            <img 
              src={currentBoss.imageUrl} 
              alt={currentBoss.name} 
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" 
            />
            {bossPhase === 2 && (
              <div className="absolute inset-0 bg-red-600/30 mix-blend-overlay animate-pulse" />
            )}
          </div>

          <div>
            <h2 className="font-heading font-black text-3xl text-white drop-shadow">
              {currentBoss.name}
            </h2>
            <p className="text-xs text-red-300 font-semibold italic">
              {currentBoss.title}
            </p>
          </div>

          {/* Boss Massive Health Bar */}
          <div className="space-y-1.5 bg-black/70 p-3.5 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs font-black text-slate-300">
              <span>BOSS INTEGRITY</span>
              <span className="text-red-400 font-mono">{bossHpPercent}%</span>
            </div>
            <div className="w-full h-5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-red-500/40">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-500 shadow-glow-red"
                style={{ width: `${bossHpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Active Player Strike Station (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border-2 border-cyan-500/60 shadow-glow-cosmic space-y-4">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{playerAvatars[currentFighterItem?.playerIdx ?? 0]}</span>
              <div>
                <span className="text-xs font-black text-cyan-300 uppercase block">Active Turn:</span>
                <h3 className="font-heading font-black text-lg text-white">
                  {playerNames[currentFighterItem?.playerIdx ?? 0]} ({currentFighter?.name})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-bold">Team Life:</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-black border border-emerald-500/40">
                {livingRoster.length}/{teamRoster.length} ALIVE
              </span>
            </div>
          </div>

          {/* Active Fielded Hero Details Card */}
          {currentFighter && (
            <div className="flex items-center gap-4 bg-black/60 p-4 rounded-2xl border border-white/15">
              <CharacterPortrait character={currentFighter} size="md" showBadge={true} />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-heading font-black text-xl text-white truncate">{currentFighter.name}</h4>
                  <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40">
                    ⚡ PWR {currentFighter.overallPower}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                    <span>HERO HEALTH</span>
                  </span>
                  <span className="font-mono text-emerald-400">{currentFighter.currentHp ?? 100} / 100 HP</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, currentFighter.currentHp ?? 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Command Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setSelectedAction('ATTACK')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'ATTACK'
                  ? 'bg-cyan-900/80 border-cyan-400 ring-2 ring-cyan-400 shadow-glow-cosmic scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-cyan-200">
                <Swords className="w-4 h-4 text-cyan-400" />
                <span>⚔️ STRIKE ATTACK</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Heavy kinetic physical assault</span>
            </button>

            <button
              onClick={() => setSelectedAction('SPECIAL')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'SPECIAL'
                  ? 'bg-purple-900/80 border-purple-400 ring-2 ring-purple-400 shadow-glow-cosmic scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-purple-200 truncate">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">⚡ {currentFighter?.specialAbilities?.[0]?.name || 'SUPERPOWER'}</span>
              </div>
              <span className="text-[10px] text-purple-300 block mt-0.5">+22 Raid Bonus Damage</span>
            </button>

            <button
              onClick={() => setSelectedAction('DEFEND')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'DEFEND'
                  ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400 scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-blue-200">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>🛡️ TITAN SHIELD</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cuts boss counter-attack by 50%</span>
            </button>

            <button
              onClick={() => setSelectedAction('ARTIFACT')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'ARTIFACT'
                  ? 'bg-amber-900/80 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>🔮 RELIC SURGE</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Equipped artifact bonus attack</span>
            </button>

            {currentCombo && (
              <button
                onClick={() => setSelectedAction('DUAL_STRIKE')}
                className={`col-span-1 sm:col-span-2 p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'DUAL_STRIKE'
                    ? 'bg-gradient-to-r from-red-950 via-amber-900 to-purple-950 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                    : 'bg-gradient-to-r from-red-950/60 to-purple-950/60 border-amber-500/50 hover:border-amber-400 text-amber-200 animate-pulse'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-black text-xs text-amber-300 truncate">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                    <span className="truncate">🔥 {currentCombo.comboTitle}</span>
                  </div>
                  <span className="text-[10px] bg-red-950 text-red-300 font-extrabold px-2 py-0.5 rounded border border-red-500/40 shrink-0">
                    +{currentCombo.bonusDualDamage} DMG
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Attack Trigger Button */}
          <button
            onClick={handleExecuteRaidAttack}
            disabled={isDefeated || isTeamWiped || isClashing}
            className={`w-full py-4 rounded-2xl font-heading font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 mt-4 ${
              isTeamWiped
                ? 'bg-red-950/60 border-red-950 text-red-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-red-600 via-purple-600 to-rose-600 hover:from-red-500 hover:to-purple-500 text-white shadow-[0_0_35px_rgba(239,68,68,0.7)] border-2 border-amber-400 hover:scale-[1.01] active:scale-98 animate-pulse'
            }`}
          >
            <Swords className="w-5 h-5 animate-spin" />
            <span>
              {isTeamWiped
                ? '💀 ENTIRE SQUAD DEFEATED'
                : `⚡ UNLEASH ${playerNames[currentFighterItem?.playerIdx ?? 0].toUpperCase()}'S STRIKE! ⚡`}
            </span>
          </button>
        </div>
      </div>

      {/* 3. HERO BENCH DOCK */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
        <span className="text-xs font-black uppercase text-slate-300 block">
          YOUR TEAM HEROES (CLICK TO SWITCH ACTIVE ATTACKER):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {teamRoster.map((item, i) => {
            const isFainted = item.character.currentHp !== undefined && item.character.currentHp <= 0;
            const isSelected = activeFighterIdx === i;

            return (
              <button
                key={i}
                disabled={isFainted}
                onClick={() => {
                  soundManager.playClick();
                  setActiveFighterIdx(i);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center gap-2 ${
                  isFainted
                    ? 'bg-red-950/20 border-red-950 opacity-40 grayscale cursor-not-allowed'
                    : isSelected
                    ? 'bg-gradient-to-b from-cyan-950 to-black border-cyan-400 ring-2 ring-cyan-400 shadow-glow-cosmic scale-105'
                    : 'bg-black/60 border-white/10 hover:border-cyan-500/50'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20">
                  <img src={item.character.imageUrl} alt={item.character.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center w-full min-w-0">
                  <span className="text-[10px] font-black text-cyan-300 block truncate">{playerNames[item.playerIdx]}</span>
                  <span className="text-xs font-black text-white block truncate leading-tight">{item.character.name}</span>
                  <span className={`text-[10px] font-black block mt-0.5 ${isFainted ? 'text-red-500' : 'text-emerald-400'}`}>
                    {isFainted ? '💀 FAINTED' : `❤️ ${item.character.currentHp ?? 100} HP`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. COMBAT TELEMETRY LOG */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
        <span className="text-xs font-black uppercase text-slate-400 block border-b border-white/10 pb-1">
          📜 Live Raid Combat Radar Telemetry
        </span>
        <div className="space-y-1 font-mono text-xs max-h-36 overflow-y-auto">
          {combatLog.map((log, i) => (
            <div key={i} className="text-slate-300 py-0.5 border-b border-white/5 last:border-0">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* 5. VICTORY BANNER */}
      {isDefeated && (
        <div className="glass-panel-glow p-8 rounded-3xl border-2 border-emerald-500/70 text-center space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.6)] animate-bounce">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-400 text-xs font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400 animate-spin" />
            <span>TITAN DEFEATED • THE MULTIVERSE IS SAVED!</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white drop-shadow">
            👑 COSMIC RAID VICTORY!
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Your {playerCount}-player united strike squad brought down {currentBoss.name}! The cosmos sings your praises!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setStage('SETUP')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-glow-cosmic"
            >
              Fight Another Titan
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg"
            >
              Return to Main Menu
            </button>
          </div>
        </div>
      )}

      {/* 6. ULTIMATE OVERLAY */}
      <UltimateAnimationOverlay
        isOpen={ultimateOverlay.isOpen}
        type={ultimateOverlay.type}
        heroName={ultimateOverlay.heroName}
        partnerHeroName={ultimateOverlay.partnerHeroName}
        abilityTitle={ultimateOverlay.abilityTitle}
        description={ultimateOverlay.description}
        bannerColor={ultimateOverlay.bannerColor}
        damageBonus={ultimateOverlay.damageBonus}
        onComplete={() => setUltimateOverlay(prev => ({ ...prev, isOpen: false }))}
      />

      <FloatingReactions playerName="Raid Leader" />
    </div>
  );
}

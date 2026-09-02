import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character, BotPersonality, AscensionBattleState, AscensionCustomSettings } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { PlayerProfileModal } from '../common/PlayerProfileModal';
import { getSkillsForCharacter } from '../../data/skills/characterSkills';
import {
  Users, Crown, Swords, Shield, Zap, Flame, Clock, Copy, Check,
  Bot, ArrowLeft, Send, Sparkles, AlertCircle, LogOut, Play,
  Search, Filter, UserX, MessageSquare, ChevronRight, Trophy,
  Sliders, Globe, RefreshCw
} from 'lucide-react';

interface Props {
  onBackToHub?: () => void;
}

export function AscensionCustomLobby({ onBackToHub }: Props) {
  const { user, refreshProfile } = useAuth();
  const socket = useSocket();

  // Local UI & Form States
  const [activeView, setActiveView] = useState<'BROWSE' | 'CREATE' | 'JOIN'>('CREATE');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedProfilePlayer, setSelectedProfilePlayer] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [botPersonality, setBotPersonality] = useState<BotPersonality>('BALANCED');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settings State (for room creation / host modification)
  const [settings, setSettings] = useState<AscensionCustomSettings>({
    maxPlayers: 4,
    teamSize: 3,
    actionTimerSeconds: 20,
    allowBots: true,
    startingEnergy: 100,
    powerBudgetCap: 0,
    allowSynergyBonuses: true,
    format: '3v3'
  });

  // Selected Battle Team (Hero IDs from player's collection)
  const [selectedHeroIds, setSelectedHeroIds] = useState<string[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Resolve user's owned characters
  const ownedCharIds = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);
  const ownedCharacters = useMemo(() => {
    const boosts = (user?.characterStatsBoosts as Record<string, any>) || {};
    const levels = (user?.characterLevels as Record<string, any>) || {};

    return ALL_CHARACTERS.filter(c => ownedCharIds.has(c.id)).map(baseChar => {
      const boost = boosts[baseChar.id] || {};
      const level = Number(levels[baseChar.id]) || 1;
      const powerBonus = Number(boost.power || boost.combat || 0);
      const hpBonus = Number(boost.hp || boost.durability || 0);
      const speedBonus = Number(boost.speed || 0);

      return {
        ...baseChar,
        overallPower: baseChar.overallPower + powerBonus,
        stats: {
          ...baseChar.stats,
          durability: baseChar.stats.durability + hpBonus,
          combat: baseChar.stats.combat + powerBonus,
          speed: baseChar.stats.speed + speedBonus,
        },
        currentHp: 100 + hpBonus,
        maxHp: 100 + hpBonus,
        level
      };
    });
  }, [ownedCharIds, user?.characterStatsBoosts, user?.characterLevels]);

  // Filtered roster for selection
  const filteredOwnedCharacters = useMemo(() => {
    return ownedCharacters.filter(c => {
      const searchTerms = [c.name, c.alias, c.powers, c.alignment, ...(c.factions || [])].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = !searchQuery || searchTerms.includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGradeFilter === 'ALL' || c.grade === selectedGradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [ownedCharacters, searchQuery, selectedGradeFilter]);

  // Default selection if empty
  useEffect(() => {
    if (selectedHeroIds.length === 0 && ownedCharacters.length > 0) {
      const initial = ownedCharacters.slice(0, settings.teamSize).map(c => c.id);
      setSelectedHeroIds(initial);
    }
  }, [ownedCharacters, settings.teamSize]);

  // Sync settings when room state updates
  useEffect(() => {
    if (socket.ascensionState?.settings) {
      setSettings(prev => ({
        ...prev,
        ...socket.ascensionState!.settings
      }));
    }
  }, [socket.ascensionState?.settings]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [socket.ascensionState?.chat]);

  // Handle match results & refresh profile
  useEffect(() => {
    if (socket.ascensionResult) {
      refreshProfile();
    }
  }, [socket.ascensionResult, refreshProfile]);

  const state = socket.ascensionState;
  const currentRoomId = state?.roomId || state?.id || '';
  const inRoom = !!state && currentRoomId.length > 0;
  const me = state?.players?.find(p => p.id === socket.socket?.id);
  const isHost = me?.isHost || false;
  const isReady = me?.isReady || false;

  // Active Team calculation
  const selectedTeamObjects = useMemo(() => {
    return selectedHeroIds
      .map(id => ownedCharacters.find(c => c.id === id))
      .filter((c): c is (typeof ownedCharacters)[0] => !!c);
  }, [selectedHeroIds, ownedCharacters]);

  const teamTotalPower = useMemo(() => {
    return selectedTeamObjects.reduce((acc, c) => acc + (c.overallPower || 0), 0);
  }, [selectedTeamObjects]);

  // Toggle hero selection
  const toggleSelectHero = (heroId: string) => {
    soundManager.playClick();
    let updated: string[];
    if (selectedHeroIds.includes(heroId)) {
      updated = selectedHeroIds.filter(id => id !== heroId);
    } else {
      const maxSlots = state?.settings?.teamSize || settings.teamSize;
      if (selectedHeroIds.length >= maxSlots) {
        // Replace the last selected hero
        updated = [...selectedHeroIds.slice(0, maxSlots - 1), heroId];
      } else {
        updated = [...selectedHeroIds, heroId];
      }
    }
    setSelectedHeroIds(updated);

    if (inRoom) {
      socket.setAscensionTeam(updated);
    }
  };

  // Copy Room Code
  const handleCopyCode = () => {
    const code = state?.roomId || state?.id || currentRoomId;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  // Create Room Action
  const handleCreateRoom = async () => {
    if (selectedHeroIds.length === 0) {
      setLocalError('Please select at least 1 hero from your collection.');
      return;
    }
    setLocalError(null);
    setIsSubmitting(true);
    soundManager.playClick();

    const format = `${settings.teamSize}v${settings.teamSize}` as AscensionBattleState['format'];
    const res = await socket.createAscensionRoom('casual', format, selectedHeroIds, settings);
    setIsSubmitting(false);

    if (!res.success) {
      setLocalError(res.error || 'Failed to create Ascension custom room.');
    }
  };

  // Join Room Action
  const handleJoinRoom = async () => {
    if (!roomCodeInput.trim()) {
      setLocalError('Please enter a room code.');
      return;
    }
    if (selectedHeroIds.length === 0) {
      setLocalError('Please select at least 1 hero from your collection.');
      return;
    }
    setLocalError(null);
    setIsSubmitting(true);
    soundManager.playClick();

    const cleanCode = roomCodeInput.trim().toUpperCase();
    const res = await socket.joinAscensionRoom(cleanCode, selectedHeroIds);
    setIsSubmitting(false);

    if (!res.success) {
      setLocalError(res.error || 'Ascension room not found or is full.');
    }
  };

  // Update Settings Action (Host only)
  const handleUpdateHostSettings = (newSettings: Partial<AscensionCustomSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    if (inRoom && isHost) {
      socket.updateAscensionSettings(newSettings);
    }
  };

  // Send Chat Action
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    await socket.sendAscensionChat(text);
  };

  // Start Battle Action (Host only)
  const handleStartBattle = async () => {
    if (!isHost) return;
    soundManager.playClick();
    const res = await socket.startAscensionBattle();
    if (!res.success) {
      setLocalError(res.error || 'Cannot start match yet.');
    }
  };

  // Ready Toggle Action
  const handleToggleReady = async () => {
    soundManager.playClick();
    await socket.setAscensionReady(!isReady);
  };

  // Add Bot Action (Host only)
  const handleAddBot = async () => {
    if (!isHost) return;
    soundManager.playClick();
    await socket.addAscensionBot(botPersonality);
  };

  // Kick Player Action (Host only)
  const handleKickPlayer = async (playerId: string) => {
    if (!isHost) return;
    soundManager.playClick();
    await socket.kickAscensionPlayer(playerId);
  };

  // Leave Room Action
  const handleLeaveRoom = async () => {
    soundManager.playClick();
    await socket.leaveAscensionRoom();
  };

  // ==========================================
  // VIEW: 1. OUTSIDE ROOM (CREATE / JOIN LOBBY)
  // ==========================================
  if (!inRoom) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in space-y-6">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d142c] via-[#151c3b] to-[#0d142c] border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-[11px] font-bold uppercase">
                <div className={`w-2 h-2 rounded-full ${socket.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
                <span>{socket.isConnected ? 'LIVE MULTIPLAYER SERVER ONLINE' : 'CONNECTING...'}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Custom Multiplayer Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Swords className="w-8 h-8 text-cyan-400" />
              ASCENSION CUSTOM ROOMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Create a custom room with your own rules, battle formats (1v1 to 5v5), turn timers, and invite friends via Room Code. Deploy your personalized character roster from your own collection!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Global Error Banner */}
        {(localError || socket.lastError) && (
          <div className="p-4 bg-red-950/90 border border-red-500 rounded-2xl text-xs sm:text-sm text-red-200 font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{localError || socket.lastError}</span>
          </div>
        )}

        {/* Main Grid: Settings & Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Create or Join Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* View Switcher Tabs */}
            <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveView('CREATE');
                  setLocalError(null);
                }}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeView === 'CREATE'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                Create Room
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveView('JOIN');
                  setLocalError(null);
                }}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeView === 'JOIN'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                Join Room
              </button>
            </div>

            {/* CREATE ROOM FORM */}
            {activeView === 'CREATE' && (
              <div className="p-6 rounded-3xl bg-[#090D1E]/95 border border-white/10 space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-heading font-black text-sm uppercase text-white tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Host Room Configuration
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">CUSTOM LOBBY</span>
                </div>

                {/* Team Size / Format Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-300 font-mono">
                    Battle Team Size (Per Player):
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          handleUpdateHostSettings({ teamSize: size, format: `${size}v${size}` as any });
                        }}
                        className={`py-2.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                          settings.teamSize === size
                            ? 'bg-cyan-500 text-black shadow-glow-cyan scale-105 font-black'
                            : 'bg-black/60 text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {size}v{size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Players */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-300 font-mono">
                    Max Room Capacity:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[2, 3, 4, 6, 8, 10].slice(0, 5).map(count => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          handleUpdateHostSettings({ maxPlayers: count });
                        }}
                        className={`py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                          settings.maxPlayers === count
                            ? 'bg-blue-600 text-white shadow-glow-blue scale-105'
                            : 'bg-black/60 text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {count} Max
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Turn Timer */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-300 font-mono flex items-center justify-between">
                    <span>Turn Timer:</span>
                    <span className="text-cyan-400 font-bold">{settings.actionTimerSeconds}s per turn</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 20, 30].map(seconds => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          handleUpdateHostSettings({ actionTimerSeconds: seconds });
                        }}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          settings.actionTimerSeconds === seconds
                            ? 'bg-amber-500 text-black shadow-glow-amber'
                            : 'bg-black/60 text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Pill */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Selected Team:</span>
                    <span className="text-cyan-400 font-bold">{selectedHeroIds.length} / {settings.teamSize} Heroes</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Team Total Power:</span>
                    <span className="text-amber-400 font-bold">⚡ {teamTotalPower} Power</span>
                  </div>
                </div>

                {/* Create Room Submit Button */}
                <button
                  type="button"
                  disabled={isSubmitting || selectedHeroIds.length === 0}
                  onClick={handleCreateRoom}
                  className={`w-full py-4 rounded-2xl font-heading font-black text-sm sm:text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedHeroIds.length > 0
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-black shadow-glow-cyan'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Crown className="w-5 h-5" />
                  {isSubmitting ? 'CREATING LOBBY...' : 'CREATE CUSTOM ROOM'}
                </button>
              </div>
            )}

            {/* JOIN ROOM FORM */}
            {activeView === 'JOIN' && (
              <div className="p-6 rounded-3xl bg-[#090D1E]/95 border border-white/10 space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-heading font-black text-sm uppercase text-white tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Join Existing Custom Room
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">CODE ENTRY</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-300 font-mono">
                    Enter Room Code:
                  </label>
                  <div className="flex items-center bg-black/70 border border-cyan-500/40 rounded-2xl overflow-hidden focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/50 shadow-inner">
                    <span className="bg-cyan-950/90 text-cyan-300 font-mono font-black text-xs sm:text-sm px-3.5 py-3 border-r border-cyan-500/30 select-none tracking-wider">
                      ASC-ROOM-
                    </span>
                    <input
                      type="text"
                      value={roomCodeInput.replace(/^ASC-ROOM-/i, '')}
                      onChange={e => {
                        const val = e.target.value.replace(/^ASC-ROOM-/i, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                        setRoomCodeInput(val);
                      }}
                      placeholder="482190"
                      maxLength={12}
                      className="flex-1 bg-transparent px-3 py-3 text-sm sm:text-base text-white font-mono font-black tracking-widest focus:outline-none placeholder-slate-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Paste the 6-digit code or full room ID shared by the room host.
                  </p>
                </div>

                {/* Selected Team Summary */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Selected Battle Roster:</span>
                    <span className="text-cyan-400 font-bold">{selectedHeroIds.length} Heroes Selected</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Combined Power:</span>
                    <span className="text-amber-400 font-bold">⚡ {teamTotalPower} Power</span>
                  </div>
                </div>

                {/* Join Submit Button */}
                <button
                  type="button"
                  disabled={isSubmitting || !roomCodeInput.trim() || selectedHeroIds.length === 0}
                  onClick={handleJoinRoom}
                  className={`w-full py-4 rounded-2xl font-heading font-black text-sm sm:text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    roomCodeInput.trim() && selectedHeroIds.length > 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black shadow-glow-blue'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Swords className="w-5 h-5" />
                  {isSubmitting ? 'JOINING ROOM...' : 'JOIN CUSTOM ROOM'}
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Owned Character Collection Selector (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-[#090D1E]/95 border border-white/10 space-y-5 shadow-xl">
              
              {/* Selector Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-black text-base uppercase text-white tracking-wider flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Select Your Battle Roster
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose up to {settings.teamSize} heroes from your personal collection.
                  </p>
                </div>

                {/* Auto Fill / Clear Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      const strongest = [...ownedCharacters]
                        .sort((a, b) => (b.overallPower || 0) - (a.overallPower || 0))
                        .slice(0, settings.teamSize)
                        .map(c => c.id);
                      setSelectedHeroIds(strongest);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 transition-all cursor-pointer"
                  >
                    Auto-Fill Strongest
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedHeroIds([]);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-[11px] font-mono font-bold text-red-300 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Selected Slots Visualizer */}
              <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: settings.teamSize }).map((_, index) => {
                  const heroId = selectedHeroIds[index];
                  const hero = heroId ? ownedCharacters.find(c => c.id === heroId) : null;
                  return (
                    <div
                      key={index}
                      className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all ${
                        hero
                          ? 'bg-gradient-to-b from-cyan-950/60 to-black/80 border-cyan-500/60 shadow-glow-cyan/30'
                          : 'bg-black/40 border-dashed border-white/15'
                      }`}
                    >
                      {hero ? (
                        <>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-cyan-400/50 mb-1">
                            <CharacterPortrait character={hero} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-white truncate max-w-full text-center">
                            {hero.name}
                          </span>
                          <span className="text-[9px] font-mono text-cyan-300 font-bold">
                            ⚡ {hero.overallPower}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSelectHero(hero.id)}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center hover:bg-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-slate-500">
                          <span className="text-xs font-mono font-bold">SLOT {index + 1}</span>
                          <p className="text-[9px]">Select Hero</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search owned heroes by name or universe..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['ALL', 'MYTHIC', 'S', 'A', 'B', 'C'].map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedGradeFilter(grade);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        selectedGradeFilter === grade
                          ? 'bg-cyan-500 text-black font-black'
                          : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Owned Heroes Grid */}
              {filteredOwnedCharacters.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-mono">No owned characters match your search filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredOwnedCharacters.map(hero => {
                    const isSelected = selectedHeroIds.includes(hero.id);
                    return (
                      <div
                        key={hero.id}
                        onClick={() => toggleSelectHero(hero.id)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 shadow-glow-cyan/40 scale-[1.02]'
                            : 'bg-black/60 hover:bg-black/80 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 mb-1.5">
                          <CharacterPortrait character={hero} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold text-white truncate max-w-full">
                          {hero.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                            hero.grade === 'MYTHIC' ? 'bg-purple-900/80 text-purple-300 border border-purple-500/50' :
                            hero.grade === 'A' ? 'bg-amber-900/80 text-amber-300 border border-amber-500/50' :
                            hero.grade === 'B' ? 'bg-blue-900/80 text-blue-300 border border-blue-500/50' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {hero.grade}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-300 font-bold">
                            ⚡{hero.overallPower}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: 2. INSIDE CUSTOM ROOM LOBBY
  // ==========================================
  const players = state.players || [];
  const roomSettings = state.settings || settings;
  const canStart = isHost && players.length >= 2 && players.filter(p => !p.isDisconnected).every(p => p.isBot || p.isReady);
  const displayRoomCode = state.roomId || state.id || currentRoomId;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 animate-fade-in space-y-5 pb-16">
      
      {/* Room Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0d142c] via-[#151c3b] to-[#0d142c] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Room Status & Code */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-black/60 border border-cyan-500/40 px-3.5 py-2 rounded-2xl shadow-inner">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Room Code:</span>
            <span className="font-mono font-black text-base sm:text-lg text-cyan-300 tracking-wider">
              {displayRoomCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="ml-1 p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-all cursor-pointer"
              title="Copy Room Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase">
            Format: {roomSettings.teamSize}v{roomSettings.teamSize}
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold uppercase">
            Players: {players.length} / {roomSettings.maxPlayers}
          </div>
        </div>

        {/* Right: Leave Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-xs font-bold text-red-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Leave Room
          </button>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Column 1: Live Players List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-[#090D1E]/95 border border-white/10 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-heading font-black text-sm uppercase text-white tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Players ({players.length}/{roomSettings.maxPlayers})
              </h3>
              {isHost && (
                <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" /> HOST
                </span>
              )}
            </div>

            {/* Party staging line-up */}
            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-indigo-950/70 to-slate-950/90 px-3 py-4">
              <div className="absolute inset-x-0 bottom-0 h-8 bg-cyan-400/10 blur-xl" />
              <div className="relative flex min-h-[112px] items-end justify-center gap-2 sm:gap-3">
                {players.map((player, index) => (
                  <button
                    key={`stand-${player.id}`}
                    type="button"
                    onClick={() => setSelectedProfilePlayer(player)}
                    className="group flex w-14 flex-col items-center gap-1 transition-transform hover:-translate-y-2"
                    title={`View ${player.name}'s profile`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-slate-900 text-xl shadow-lg ${
                      player.isHost ? 'border-amber-400 shadow-amber-400/30' : 'border-cyan-400/60 shadow-cyan-400/20'
                    }`}>
                      {player.avatar || '🦸‍♂️'}
                    </div>
                    <span className="w-full truncate text-center text-[9px] font-bold text-white">{player.name}</span>
                    <span className="text-[8px] font-mono text-cyan-300">LVL {player.level || 1}</span>
                    <div className="h-1 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-70" />
                  </button>
                ))}
                {players.length === 0 && (
                  <span className="text-xs font-mono text-slate-500">Waiting for party members...</span>
                )}
              </div>
            </div>

            {/* Players Cards */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {players.map(player => {
                const isMe = player.id === socket.socket?.id;
                const playerPower = (player.team || []).reduce((acc, c) => acc + (c.overallPower || 0), 0);

                return (
                  <div
                    key={player.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                      isMe
                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-glow-cyan/20'
                        : 'bg-black/60 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Avatar & Name (Clickable for Profile) */}
                      <button
                        type="button"
                        onClick={() => setSelectedProfilePlayer(player)}
                        className="flex items-center gap-2.5 text-left hover:opacity-80 transition-all cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-lg shrink-0">
                          {player.avatar || '🦸‍♂️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px]">
                              {player.name}
                            </span>
                            {player.isHost && (
                              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                            {player.isBot && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[9px] font-mono font-bold">
                                BOT
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            Rating: {player.rating || 1000} • ⚡{playerPower} Power
                          </span>
                        </div>
                      </button>

                      {/* Ready Badge & Host Kick Control */}
                      <div className="flex items-center gap-2">
                        {player.isReady || player.isBot ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-black uppercase flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> READY
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-300 text-[10px] font-mono font-bold uppercase">
                            CHOOSING...
                          </span>
                        )}

                        {isHost && !isMe && (
                          <button
                            type="button"
                            onClick={() => handleKickPlayer(player.id)}
                            className="p-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer"
                            title="Kick from Room"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Team Mini Previews */}
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5">
                      {(player.team || []).map((hero, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-lg overflow-hidden border border-white/15 bg-black/60"
                          title={`${hero.name} (${hero.overallPower} Power)`}
                        >
                          <CharacterPortrait character={hero} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {Array.from({ length: Math.max(0, roomSettings.teamSize - (player.team?.length || 0)) }).map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          className="w-7 h-7 rounded-lg border border-dashed border-white/10 bg-black/30 flex items-center justify-center text-[9px] text-slate-600 font-mono"
                        >
                          -
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Host: Add AI Bot Section */}
            {isHost && players.length < roomSettings.maxPlayers && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-300 font-bold uppercase flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" /> Add AI Bot:
                  </span>
                  <select
                    value={botPersonality}
                    onChange={e => setBotPersonality(e.target.value as BotPersonality)}
                    className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BALANCED">Balanced Bot</option>
                    <option value="AGGRESSIVE">Aggressive Bot</option>
                    <option value="DEFENSIVE">Defensive Bot</option>
                    <option value="MYSTIC">Mystic Specialist</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddBot}
                  className="w-full py-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-500/40 text-xs font-heading font-black text-indigo-200 uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4" /> Add AI Challenger
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Column 2: Roster Selector & Host Settings (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#090D1E]/95 border border-white/10 space-y-4 shadow-xl">
            
            {/* Active Selection Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h3 className="font-heading font-black text-sm uppercase text-white tracking-wider flex items-center gap-2">
                  <Swords className="w-4 h-4 text-cyan-400" />
                  Your Active Battle Team
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select {roomSettings.teamSize} heroes from your collection to deploy.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                ⚡ {teamTotalPower} Power
              </span>
            </div>

            {/* Selected Slots */}
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: roomSettings.teamSize }).map((_, index) => {
                const heroId = selectedHeroIds[index];
                const hero = heroId ? ownedCharacters.find(c => c.id === heroId) : null;
                return (
                  <div
                    key={index}
                    className={`h-20 rounded-xl border-2 flex flex-col items-center justify-center p-1 relative overflow-hidden transition-all ${
                      hero
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-glow-cyan/20'
                        : 'bg-black/40 border-dashed border-white/15'
                    }`}
                  >
                    {hero ? (
                      <>
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/50 mb-0.5">
                          <CharacterPortrait character={hero} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[9px] font-bold text-white truncate max-w-full text-center">
                          {hero.name}
                        </span>
                        <span className="text-[8px] font-mono text-cyan-300 font-bold">
                          ⚡{hero.overallPower}
                        </span>
                      </>
                    ) : (
                      <div className="text-center text-slate-500">
                        <span className="text-[9px] font-mono font-bold">SLOT {index + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Search Owned Heroes */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Hero Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredOwnedCharacters.map(hero => {
                const isSelected = selectedHeroIds.includes(hero.id);
                return (
                  <div
                    key={hero.id}
                    onClick={() => toggleSelectHero(hero.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-glow-cyan/40 scale-[1.02]'
                        : 'bg-black/60 hover:bg-black/80 border-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[9px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 mb-1">
                      <CharacterPortrait character={hero} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-white truncate max-w-full">
                      {hero.name}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-300 font-bold">
                      ⚡{hero.overallPower}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Host Settings Adjustments (Live Sync) */}
            {isHost && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-mono text-slate-300 font-bold uppercase flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-cyan-400" /> Host Settings:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-mono">Timer:</label>
                    <select
                      value={roomSettings.actionTimerSeconds}
                      onChange={e => handleUpdateHostSettings({ actionTimerSeconds: Number(e.target.value) })}
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value={10}>10s Fast</option>
                      <option value={15}>15s Standard</option>
                      <option value={20}>20s Tactical</option>
                      <option value={30}>30s Relaxed</option>
                      <option value={60}>60s Strategic</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-mono">Format:</label>
                    <select
                      value={roomSettings.teamSize}
                      onChange={e => {
                        const size = Number(e.target.value);
                        handleUpdateHostSettings({ teamSize: size, format: `${size}v${size}` as any });
                      }}
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value={1}>1v1 Duel</option>
                      <option value={2}>2v2 Tag</option>
                      <option value={3}>3v3 Trio</option>
                      <option value={4}>4v4 Squad</option>
                      <option value={5}>5v5 Full War</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Column 3: Live Chat & Match Launch Action (3 Cols) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          
          {/* Chat Panel */}
          <div className="p-4 rounded-3xl bg-[#090D1E]/95 border border-white/10 flex-1 flex flex-col shadow-xl min-h-[380px]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <h3 className="font-heading font-black text-xs uppercase text-white tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Lobby Chat
              </h3>
              <span className="text-[9px] font-mono text-slate-400">REAL-TIME</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs max-h-[300px]">
              {(state.chat || []).length === 0 ? (
                <div className="text-center text-slate-500 py-10 text-[11px] font-mono">
                  No messages yet. Say hello!
                </div>
              ) : (
                (state.chat || []).map(msg => (
                  <div key={msg.id} className="p-2 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-cyan-300">{msg.senderName}</span>
                      <span className="text-slate-500 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-200 break-words">{msg.text}</p>
                  </div>
                ))
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="pt-3 border-t border-white/10 flex items-center gap-1.5 mt-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type message..."
                maxLength={200}
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Action Button: Ready / Start Battle */}
          <div className="space-y-2">
            {!isHost ? (
              <button
                type="button"
                onClick={handleToggleReady}
                className={`w-full py-4 rounded-2xl font-heading font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isReady
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black shadow-glow-emerald'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-glow-amber'
                }`}
              >
                <Check className="w-5 h-5" />
                {isReady ? 'READY FOR BATTLE!' : 'READY UP'}
              </button>
            ) : (
              <button
                type="button"
                disabled={!canStart}
                onClick={handleStartBattle}
                className={`w-full py-4 rounded-2xl font-heading font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  canStart
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black font-black shadow-glow-cyan animate-pulse'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                {canStart ? 'START ASCENSION BATTLE' : 'WAITING FOR PLAYERS...'}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Player Dossier Modal */}
      {selectedProfilePlayer && (
        <PlayerProfileModal
          player={selectedProfilePlayer}
          isOpen={true}
          onClose={() => setSelectedProfilePlayer(null)}
        />
      )}

    </div>
  );
}

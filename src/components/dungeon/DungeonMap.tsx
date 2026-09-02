import React, { useRef, useEffect } from 'react';
import { DungeonRunState, DungeonNode, DungeonZoneTheme } from '../../types/dungeon';
import { soundManager } from '../../audio/soundManager';
import { 
  MapPin, Swords, Skull, Crown, Heart, ShoppingBag, 
  Sparkles, Coins, Package, Flame, Eye, ArrowRight, Shield
} from 'lucide-react';

interface Props {
  runState: DungeonRunState;
  onSelectNode: (node: DungeonNode) => void;
  onOpenRelicsModal?: () => void;
}

const ZONE_THEMES: Record<DungeonZoneTheme, { name: string; bg: string; border: string; desc: string }> = {
  ANCIENT_RUINS: {
    name: 'ACT I: ANCIENT KREE-SKRULL RUINS',
    bg: 'from-[#1a0f07] via-[#0f0703] to-black',
    border: 'border-orange-500/50',
    desc: 'Crumbling subterranean temples rich with ancient alien tech and guardians.',
  },
  KNULL_VOID: {
    name: 'ACT II: KNULL\'S ABYSSAL VOID REALM',
    bg: 'from-[#12051f] via-[#08020e] to-black',
    border: 'border-purple-500/50',
    desc: 'The domain of the Symbiote God. Living darkness and void thralls hunt your squad.',
  },
  DOOM_BASTION: {
    name: 'ACT III: DOOM\'S LATVERIAN BASTION',
    bg: 'from-[#071618] via-[#020b0d] to-black',
    border: 'border-teal-500/50',
    desc: 'Fortified high-tech arcane citadel protected by legions of lethal Doombots.',
  },
  DARK_DIMENSION: {
    name: 'ACT IV: THE DARK DIMENSION',
    bg: 'from-[#1d0615] via-[#0d020a] to-black',
    border: 'border-pink-500/50',
    desc: 'Non-Euclidean realm of fractured timelines, mystical fires, and cosmic madness.',
  },
  COSMIC_CRUCIBLE: {
    name: 'ACT V: THE COSMIC CRUCIBLE',
    bg: 'from-[#1c1204] via-[#0d0901] to-black',
    border: 'border-amber-500/50',
    desc: 'The threshold of cosmic titans. Thanos and the Infinity Gauntlet await.',
  },
  CELESTIAL_MULTIVERSE: {
    name: 'INFINITE ZONE: CELESTIAL MULTIVERSE',
    bg: 'from-[#0a1128] via-[#030714] to-black',
    border: 'border-cyan-500/50',
    desc: 'Limitless cosmic depth. Scaled beyond reality to test true Ascension masters.',
  },
};

export function DungeonMap({ runState, onSelectNode, onOpenRelicsModal }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const theme = ZONE_THEMES[runState.zone] || ZONE_THEMES.ANCIENT_RUINS;

  // Group nodes by floor
  const floorLayers = React.useMemo(() => {
    const map = new Map<number, DungeonNode[]>();
    Object.values(runState.mapNodes || {}).forEach(node => {
      if (!map.has(node.floor)) map.set(node.floor, []);
      map.get(node.floor)!.push(node);
    });

    const sortedFloors = Array.from(map.keys()).sort((a, b) => a - b);
    return sortedFloors.map(floor => ({
      floor,
      nodes: map.get(floor)!,
    }));
  }, [runState.mapNodes]);

  // Auto-scroll to current floor on mount or floor change
  useEffect(() => {
    if (mapContainerRef.current) {
      const currentElement = mapContainerRef.current.querySelector('[data-current-node="true"]');
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [runState.currentFloor, runState.currentNodeId]);

  const getNodeBadge = (node: DungeonNode) => {
    switch (node.type) {
      case 'BOSS':
        return { icon: '👹', label: 'BOSS', bg: 'bg-red-600 border-red-400 text-white animate-pulse' };
      case 'MINI_BOSS':
        return { icon: '👑', label: 'MINI-BOSS', bg: 'bg-amber-600 border-amber-400 text-black font-black' };
      case 'ELITE':
        return { icon: '💀', label: 'ELITE', bg: 'bg-rose-700 border-rose-400 text-white' };
      case 'SHOP':
        return { icon: '🛒', label: 'SHOP', bg: 'bg-cyan-600 border-cyan-400 text-white' };
      case 'HEALING':
        return { icon: '❤️', label: 'SANCTUARY', bg: 'bg-emerald-600 border-emerald-400 text-white' };
      case 'EVENT':
        return { icon: '❓', label: 'EVENT', bg: 'bg-purple-600 border-purple-400 text-white' };
      case 'TREASURE':
        return { icon: '💎', label: 'TREASURE', bg: 'bg-yellow-500 border-yellow-300 text-black font-black' };
      case 'ASTRA_CACHE':
        return { icon: '💰', label: 'ASTRA', bg: 'bg-amber-500 border-amber-300 text-black font-black' };
      case 'SHARD_RIFT':
        return { icon: '🧩', label: 'SHARDS', bg: 'bg-indigo-600 border-indigo-400 text-white' };
      case 'CRATE_VAULT':
        return { icon: '📦', label: 'CRATE', bg: 'bg-fuchsia-600 border-fuchsia-400 text-white' };
      default:
        return { icon: '⚔️', label: 'BATTLE', bg: 'bg-slate-800 border-slate-600 text-slate-200' };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn select-none pb-12">
      
      {/* 1. Header Navigation & Zone Banner */}
      <div className={`p-6 rounded-3xl bg-gradient-to-r ${theme.bg} border-2 ${theme.border} shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Floor {runState.currentFloor} Depth
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {runState.team.filter(h => h.isAlive).length} / {runState.team.length} Heroes Standing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider">
            {theme.name}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">{theme.desc}</p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/70 border border-white/10 flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400">✨ {runState.dungeonAstra.toLocaleString()} Astra</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">🧪 {runState.healingPotionsCount} Potions</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-400">🔮 {runState.activeRelics.length} Relics</span>
          </div>
        </div>
      </div>

      {/* 2. Living Team Roster Strip */}
      <div className="p-4 rounded-3xl bg-black/80 border border-white/10">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1 font-mono uppercase">
          <span>Active Strike Team Status</span>
          <span>Temporary Run Health</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {runState.team.map((hero, idx) => {
            const hpPercent = Math.round((hero.currentHp / hero.maxHp) * 100);
            return (
              <div
                key={hero.characterId}
                className={`p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all ${
                  hero.isAlive
                    ? 'bg-slate-900/90 border-white/10'
                    : 'bg-red-950/40 border-red-500/40 opacity-50 grayscale'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-slate-950">
                    <img
                      src={hero.character.imageUrl || `/images/heroes/${hero.character.id}.jpg`}
                      alt={hero.character.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  {!hero.isAlive && (
                    <span className="absolute inset-0 bg-red-950/80 flex items-center justify-center text-xs font-black text-red-300">
                      FALLEN
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-heading font-black text-white truncate">{hero.character.name}</h5>
                  </div>
                  {/* Mini HP bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mt-1 border border-white/10">
                    <div
                      className={`h-full transition-all ${
                        hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 25 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                    {hero.currentHp} / {hero.maxHp} HP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Branching Map Tree */}
      <div 
        ref={mapContainerRef}
        className="rounded-3xl bg-black/90 border-2 border-white/15 p-6 sm:p-10 max-h-[650px] overflow-y-auto space-y-12 relative shadow-inner"
      >
        <div className="flex flex-col items-center space-y-10 max-w-2xl mx-auto">
          {floorLayers.map(({ floor, nodes }) => {
            const currentFloorNum = runState.currentWave || runState.currentFloor || 1;
            const isCurrentFloor = floor === currentFloorNum;
            const isPastFloor = floor < currentFloorNum;

            return (
              <div key={floor} className="w-full flex flex-col items-center space-y-3 relative">
                
                {/* Floor Marker */}
                <div className="flex items-center gap-2">
                  <div className="h-px w-12 bg-white/10" />
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border ${
                    isCurrentFloor 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-glow-gold' 
                      : isPastFloor 
                      ? 'bg-slate-900 text-slate-500 border-white/5' 
                      : 'bg-black text-slate-400 border-white/10'
                  }`}>
                    FLOOR {floor}
                  </span>
                  <div className="h-px w-12 bg-white/10" />
                </div>

                {/* Nodes on this floor layer */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full">
                  {nodes.map(node => {
                    const badge = getNodeBadge(node);
                    const availableIds = runState.availableNodeIds || [];
                    const completedIds = runState.completedNodeIds || [];
                    const isAvailable = availableIds.includes(node.id) || (currentFloorNum === 1 && floor === 1 && !node.isCompleted);
                    const isCurrent = runState.currentNodeId === node.id;
                    const isCompleted = node.isCompleted || completedIds.includes(node.id);

                    return (
                      <button
                        key={node.id}
                        type="button"
                        data-current-node={isCurrent}
                        disabled={!isAvailable && !isCurrent}
                        onClick={() => {
                          if (isAvailable) {
                            soundManager.playClick();
                            onSelectNode(node);
                          }
                        }}
                        className={`group p-4 sm:p-5 rounded-3xl border-2 transition-all text-center flex flex-col items-center justify-between space-y-2 min-w-[130px] sm:min-w-[160px] relative transform ${
                          isCurrent
                            ? 'bg-gradient-to-b from-amber-500/30 to-red-950 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.6)] scale-110 ring-4 ring-amber-400/40 cursor-default'
                            : isAvailable
                            ? 'bg-slate-900/90 hover:bg-slate-800 border-orange-500/80 hover:border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 cursor-pointer animate-pulse'
                            : isCompleted
                            ? 'bg-slate-950/60 border-white/5 opacity-40 cursor-not-allowed'
                            : 'bg-black/80 border-white/10 opacity-30 cursor-not-allowed'
                        }`}
                      >
                        {/* Status Icon */}
                        <div className="w-12 h-12 rounded-2xl bg-black/80 border border-white/20 flex items-center justify-center text-2xl shadow-lg">
                          {badge.icon}
                        </div>

                        {/* Title & Badge */}
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded-full border text-[8px] font-heading font-black tracking-wider block ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <h4 className="text-xs font-heading font-black text-white truncate max-w-[120px]">
                            {node.title}
                          </h4>
                        </div>

                        {/* Action prompt */}
                        {isAvailable && (
                          <div className="text-[10px] font-mono font-bold text-orange-400 flex items-center gap-1 group-hover:translate-y-0.5 transition-transform">
                            <span>ENTER PATH</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                        {isCompleted && (
                          <span className="text-[9px] font-mono text-emerald-400">CLEARED ✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

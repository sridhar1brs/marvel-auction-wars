import { Character, CharacterGrade } from './game';

export type DungeonDifficultyMode = 'EXPEDITION' | 'INFINITE';

export type DungeonNodeType =
  | 'BATTLE'
  | 'ELITE'
  | 'MINI_BOSS'
  | 'BOSS'
  | 'TREASURE'
  | 'HEALING'
  | 'SHOP'
  | 'EVENT'
  | 'ASTRA_CACHE'
  | 'SHARD_RIFT'
  | 'CRATE_VAULT';

export interface DungeonNode {
  id: string;
  floor: number;
  type: DungeonNodeType;
  title: string;
  description: string;
  icon: string;
  color: string;
  nextIds: string[]; // Connected child node IDs in the next floor layer
  isCompleted: boolean;
  isAvailable: boolean;
  isCurrent: boolean;
  enemyTeam?: Character[];
  bossKey?: string;
  isMultiWave?: boolean;
  totalWaves?: number;
  eliteAffixes?: string[];
  rewardPreview?: string;
}

export type DungeonZoneTheme =
  | 'ANCIENT_RUINS'
  | 'KNULL_VOID'
  | 'DOOM_BASTION'
  | 'DARK_DIMENSION'
  | 'COSMIC_CRUCIBLE'
  | 'CELESTIAL_MULTIVERSE';

export interface DungeonHeroState {
  characterId: string;
  character: Character;
  ascensionLevel: number;
  currentHp: number;
  maxHp: number;
  isAlive: boolean;
  usedSkillIds: string[];
  role: 'TANK' | 'DPS' | 'SUPPORT' | 'HEALER' | 'CONTROL' | 'BURST' | 'BALANCED';
  bonusPower: number;
  bonusDefense: number;
  bonusSpeed: number;
}

export type RelicSynergy = 'OFFENSIVE' | 'DEFENSIVE' | 'SUSTAIN' | 'ABILITY' | 'COSMIC';

export interface DungeonRelic {
  id: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'MYTHIC';
  synergy: RelicSynergy;
  icon: string;
  costAstra: number;
  effectType:
    | 'DAMAGE_PERCENT'
    | 'DAMAGE_REDUCTION_PERCENT'
    | 'CRIT_CHANCE'
    | 'CRIT_DAMAGE'
    | 'HP_REGEN_PER_ROUND'
    | 'POST_BATTLE_HEAL_PERCENT'
    | 'ENERGY_START'
    | 'COOLDOWN_REDUCTION'
    | 'ABILITY_POWER'
    | 'REVIVE_ONCE'
    | 'ASTRA_BONUS_PERCENT'
    | 'THORNS_REFLECT_PERCENT'
    | 'LIFESTEAL_PERCENT'
    | 'FURY_LOW_HP_DAMAGE'
    | 'COSMIC_BURST_CHANCE';
  value: number;
}

export type DungeonModifierId =
  | 'COSMIC_SURGE'
  | 'ENDLESS_DARKNESS'
  | 'OVERCHARGED_ENEMIES'
  | 'BROKEN_TIMELINE'
  | 'BLOOD_MOON'
  | 'VIBRANIUM_ARMOR'
  | 'UNSTABLE_REALITY';

export interface DungeonModifier {
  id: DungeonModifierId;
  name: string;
  description: string;
  icon: string;
  color: string;
  badge: string;
}

export interface DungeonEventChoice {
  id: string;
  label: string;
  description: string;
  riskDescription?: string;
  costAstra?: number;
  costHpPercent?: number;
  successRate?: number; // 0 to 1
  actionType:
    | 'GAIN_RELIC'
    | 'GAIN_ASTRA'
    | 'GAIN_SHARDS'
    | 'HEAL_TEAM'
    | 'UPGRADE_HERO_RUN_STATS'
    | 'RISK_GAMBLE'
    | 'FIGHT_ELITE_FOR_LOOT'
    | 'LEAVE_SAFELY';
  rewardPayload?: {
    astra?: number;
    shards?: number;
    healPercent?: number;
    relicId?: string;
  };
}

export interface DungeonEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  choices: DungeonEventChoice[];
}

export interface DungeonShopItem {
  id: string;
  type: 'RELIC' | 'HEAL_POTION' | 'REVIVE_STIM' | 'STAT_CORE' | 'DRAFT_SHARD_PACK';
  name: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'MYTHIC';
  costAstra: number;
  isPurchased: boolean;
  relic?: DungeonRelic;
  healAmount?: number;
  shardsAmount?: number;
  shardCategory?: string;
  statBoost?: { power?: number; defense?: number; hp?: number };
}

export interface DungeonBossPhase {
  phaseNumber: number;
  phaseName: string;
  triggerHpPercent: number;
  mechanicTitle: string;
  mechanicDescription: string;
  specialAbilityName: string;
  effect: 'SUMMON_THRALLS' | 'DAMAGE_IMMUNITY' | 'INVERT_HEALING' | 'SILENCE_SKILLS' | 'COSMIC_NUKE';
}

export interface DungeonCombatLog {
  round: number;
  wave?: number;
  attackerName: string;
  defenderName: string;
  actionUsed: string;
  damage: number;
  isCrit: boolean;
  isKill?: boolean;
  message: string;
  type?: 'ATTACK' | 'SKILL' | 'DEFEND' | 'HEAL' | 'BOSS_PHASE' | 'ITEM';
}

// Legacy Backward-Compatible Interfaces
export interface DungeonSettings {
  totalWaves: number;
  rerollFrequency: number;
  gradeWaveMilestones: {
    gradeCMax: number;
    gradeBMax: number;
    gradeAMax: number;
    cosmicStart: number;
  };
  startingHealingPotions: number;
  gameplayMode: 'solo' | 'same_device';
  playerCount: number;
  playerNames: string[];
}

export type DungeonPhase = 
  | 'SETUP'
  | 'ALTAR_SUMMON'
  | 'COMBAT_READY'
  | 'COMBAT_FIGHT'
  | 'WAVE_VICTORY'
  | 'DUNGEON_COMPLETE'
  | 'GAME_OVER';

export interface DungeonPlayer {
  id: string;
  name: string;
  avatar: string;
  hero: Character | null;
  hp: number;
  maxHp: number;
  usedSkillIds: string[];
  isAlive: boolean;
  hasRandomized?: boolean;
}

export interface DungeonState {
  settings: DungeonSettings;
  phase: DungeonPhase;
  currentWave: number;
  players: DungeonPlayer[];
  activePlayerIndex: number;
  playerHero: Character | null;
  enemyHero: Character | null;
  enemyIntent?: EnemyIntentInfo;
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  healingPotions: number;
  wavesCleared: number;
  totalDamageDealt: number;
  currentBgIndex: number;
  combatLogs: DungeonCombatLog[];
  usedSkillIds: string[];
}

export type TacticalActionMode = 'STRIKE' | 'SPECIAL_BLAST' | 'DEFEND_COUNTER' | 'EVADE_AMBUSH';

export type EnemyIntentType =
  | 'HEAVY_SLUGGER'
  | 'ENERGY_SURGE'
  | 'IRON_FORTRESS'
  | 'SHADOW_STRIKE'
  | 'COSMIC_ANNIHILATION'
  | 'BOSS_PHASE_SPECIAL';

export interface EnemyIntentInfo {
  type: EnemyIntentType;
  title: string;
  description: string;
  counterRecommendation: string;
  icon: string;
}

export type DungeonEncounterFormat = '1v1' | '1v2' | '1v3' | '2v2' | '2v3' | '3v3' | 'BOSS_TITAN';

export interface DungeonMilestoneReward {
  wave: number;
  astra: number;
  cardShards: number;
  draftShards: number;
  crates: number;
  crateType: 'SHARD_CRATE' | 'CHARACTER_CRATE';
  characterTokenAmount?: number;
  characterTokenCategory?: string;
  relicChoices: DungeonRelic[];
}

export interface DungeonWaveEncounter {
  wave: number;
  title: string;
  subtitle: string;
  encounterFormat: DungeonEncounterFormat;
  enemies: Character[];
  enemyHpScaling: number;
  enemyPowerScaling: number;
  isMilestone: boolean;
  isBoss: boolean;
  bossKey?: string;
  bossPhase?: DungeonBossPhase;
  milestoneReward?: DungeonMilestoneReward;
  modifiers: DungeonModifier[];
  backgroundTheme: DungeonZoneTheme;
}

export interface DungeonRunState {
  id: string;
  userId: string;
  seed: number;
  difficultyMode: DungeonDifficultyMode;
  zone: DungeonZoneTheme;
  currentWave: number;
  maxWaveReached: number;
  currentFloor?: number; // Backward-compatible alias
  maxFloorReached?: number; // Backward-compatible alias
  totalFloorsInAct?: number;
  mapNodes?: Record<string, DungeonNode>;
  currentNodeId?: string | null;
  availableNodeIds?: string[];
  completedNodeIds?: string[];
  team: DungeonHeroState[];
  teamSize: number;
  activeFighterIdx: number;
  dungeonAstra: number;
  activeRelics: DungeonRelic[];
  activeModifiers: DungeonModifier[];
  waveMilestonesClaimed: number[];
  healingPotionsCount: number;
  revivalStimsCount: number;
  recentEnemyIds: string[];
  currentEncounter?: DungeonWaveEncounter | null;
  pendingMilestoneReward?: DungeonMilestoneReward | null;
  runStats: {
    battlesWon: number;
    elitesDefeated: number;
    bossesConquered: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    astraCollected: number;
    relicsAcquired: number;
    shardsGained: number;
    turnsTaken: number;
    heroesLost: number;
  };
  currentBattleState?: {
    enemyTeam: Character[];
    activeEnemyIdx: number;
    enemyHp: number;
    enemyMaxHp: number;
    enemyHps?: number[];
    enemyMaxHps?: number[];
    enemyIntent?: EnemyIntentInfo;
    currentWave: number;
    totalWaves: number;
    round: number;
    bossKey?: string;
    currentBossPhase?: number;
    isBossFight: boolean;
    combatLogs: DungeonCombatLog[];
  } | null;
  activeShopItems?: DungeonShopItem[] | null;
  activeEvent?: DungeonEvent | null;
  pendingRelicChoices?: DungeonRelic[] | null;
  isComplete: boolean;
  isGameOver: boolean;
  createdAt: number;
  updatedAt: number;
}

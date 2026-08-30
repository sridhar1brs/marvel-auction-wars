import { Character, CharacterGrade } from './game';

export interface DungeonSettings {
  totalWaves: number; // 1 - 300
  rerollFrequency: number; // e.g. 1, 2, 3, 5 rounds
  gradeWaveMilestones: {
    gradeCMax: number;
    gradeBMax: number;
    gradeAMax: number;
    cosmicStart: number;
  };
  startingHealingPotions: number;
  gameplayMode: 'solo' | 'same_device';
  playerCount: number; // 1 to 4
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

export interface DungeonCombatLog {
  round: number;
  attackerName: string;
  defenderName: string;
  actionUsed: string;
  damage: number;
  isCrit: boolean;
  message: string;
}

export type TacticalActionMode = 'STRIKE' | 'SPECIAL_BLAST' | 'DEFEND_COUNTER' | 'EVADE_AMBUSH';

export type EnemyIntentType = 
  | 'HEAVY_SLUGGER' 
  | 'ENERGY_SURGE' 
  | 'IRON_FORTRESS' 
  | 'SHADOW_STRIKE' 
  | 'COSMIC_ANNIHILATION';

export interface EnemyIntentInfo {
  type: EnemyIntentType;
  title: string;
  description: string;
  counterRecommendation: string;
  icon: string;
}

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
  playerHero: Character | null; // Compatibility with single-player view
  enemyHero: Character | null;
  enemyIntent?: EnemyIntentInfo;
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  healingPotions: number;
  wavesCleared: number;
  totalDamageDealt: number;
  currentBgIndex: number; // 0 - 9 for 10 ancient ruins images
  combatLogs: DungeonCombatLog[];
  usedSkillIds: string[];
}

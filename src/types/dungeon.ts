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

export interface DungeonState {
  settings: DungeonSettings;
  phase: DungeonPhase;
  currentWave: number;
  playerHero: Character | null;
  enemyHero: Character | null;
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

import { Character, CharacterGrade } from '../types/game';
import { DungeonSettings, DungeonState, DungeonCombatLog } from '../types/dungeon';
import { ALL_CHARACTERS, CHARACTERS_BY_GRADE } from '../data/characters/index';
import { getSkillsForCharacter, CharacterSkill } from '../data/skills/characterSkills';

export const DEFAULT_DUNGEON_SETTINGS: DungeonSettings = {
  totalWaves: 3,
  rerollFrequency: 1, // Every 1 round by default
  gradeWaveMilestones: {
    gradeCMax: 15,
    gradeBMax: 30,
    gradeAMax: 40,
    cosmicStart: 41
  },
  startingHealingPotions: 3
};

// Select appropriate enemy for current wave based on custom wave milestones
export function selectEnemyForWave(wave: number, settings: DungeonSettings): Character {
  let targetGrade: CharacterGrade = 'C';

  if (wave >= settings.gradeWaveMilestones.cosmicStart) {
    targetGrade = 'MYTHIC';
  } else if (wave > settings.gradeWaveMilestones.gradeBMax) {
    targetGrade = 'A';
  } else if (wave > settings.gradeWaveMilestones.gradeCMax) {
    targetGrade = 'B';
  } else {
    targetGrade = 'C';
  }

  // Fallback if specific grade pool is exhausted
  const pool = CHARACTERS_BY_GRADE[targetGrade] && CHARACTERS_BY_GRADE[targetGrade].length > 0
    ? CHARACTERS_BY_GRADE[targetGrade]
    : ALL_CHARACTERS;

  const randIdx = Math.floor(Math.random() * pool.length);
  return pool[randIdx];
}

// Summon/Randomize a player hero matched to the wave tier
export function summonRandomPlayerHero(wave: number, settings: DungeonSettings): Character {
  let eligiblePool: Character[] = [];

  if (wave >= settings.gradeWaveMilestones.cosmicStart) {
    // In cosmic waves, draw from Grade A and Mythic
    eligiblePool = [...CHARACTERS_BY_GRADE.MYTHIC, ...CHARACTERS_BY_GRADE.A];
  } else if (wave > settings.gradeWaveMilestones.gradeBMax) {
    eligiblePool = [...CHARACTERS_BY_GRADE.A, ...CHARACTERS_BY_GRADE.B];
  } else if (wave > settings.gradeWaveMilestones.gradeCMax) {
    eligiblePool = [...CHARACTERS_BY_GRADE.B, ...CHARACTERS_BY_GRADE.C];
  } else {
    eligiblePool = [...CHARACTERS_BY_GRADE.C, ...CHARACTERS_BY_GRADE.B];
  }

  if (eligiblePool.length === 0) eligiblePool = ALL_CHARACTERS;

  const randIdx = Math.floor(Math.random() * eligiblePool.length);
  return eligiblePool[randIdx];
}

// Execute single combat round in Dungeons
export function executeDungeonCombatTurn(
  playerHero: Character,
  playerSkill: CharacterSkill | null,
  enemyHero: Character,
  currentRound: number
): {
  playerDamageDealt: number;
  enemyDamageDealt: number;
  playerHealed: number;
  combatLogs: DungeonCombatLog[];
} {
  const pStats = playerHero.stats;
  const eStats = enemyHero.stats;

  // Base damage formulas
  let playerBasePwr = Math.round((pStats.strength * 0.25 + pStats.energy * 0.25 + pStats.combat * 0.3 + playerHero.overallPower * 0.2) / 3.5);
  let enemyBasePwr = Math.round((eStats.strength * 0.25 + eStats.energy * 0.25 + eStats.combat * 0.3 + enemyHero.overallPower * 0.2) / 3.8);

  let playerHealed = 0;
  let isCrit = false;

  // Apply Skill Modifiers
  if (playerSkill) {
    playerBasePwr += playerSkill.bonusPower * 2;
    if (playerSkill.effectType === 'critical') {
      isCrit = Math.random() < (playerSkill.triggerRate + 0.2);
      if (isCrit) playerBasePwr = Math.round(playerBasePwr * 1.55);
    } else if (playerSkill.effectType === 'lifesteal') {
      playerHealed = Math.round(playerBasePwr * 0.45);
    } else if (playerSkill.effectType === 'shield') {
      enemyBasePwr = Math.max(2, enemyBasePwr - (playerSkill.bonusPower * 2));
    }
  }

  // Small random tactical variance (±15%)
  const pVariance = 0.85 + Math.random() * 0.3;
  const eVariance = 0.85 + Math.random() * 0.3;

  const pDmg = Math.max(5, Math.round(playerBasePwr * pVariance));
  const eDmg = Math.max(4, Math.round(enemyBasePwr * eVariance));

  const logs: DungeonCombatLog[] = [];

  logs.push({
    round: currentRound,
    attackerName: playerHero.name,
    defenderName: enemyHero.name,
    actionUsed: playerSkill ? playerSkill.name : 'Standard Combat Strike',
    damage: pDmg,
    isCrit,
    message: `${playerHero.name} unleashed ${playerSkill ? playerSkill.name : 'a devastating physical assault'}, dealing ${pDmg} damage to ${enemyHero.name}!`
  });

  logs.push({
    round: currentRound,
    attackerName: enemyHero.name,
    defenderName: playerHero.name,
    actionUsed: 'Ancient Guardian Strike',
    damage: eDmg,
    isCrit: false,
    message: `${enemyHero.name} retaliated with ancient guardian fury, striking for ${eDmg} damage!`
  });

  return {
    playerDamageDealt: pDmg,
    enemyDamageDealt: eDmg,
    playerHealed,
    combatLogs: logs
  };
}

import { Character, CharacterGrade } from '../types/game';
import { DungeonSettings, DungeonCombatLog, TacticalActionMode, EnemyIntentInfo, EnemyIntentType } from '../types/dungeon';
import { ALL_CHARACTERS, CHARACTERS_BY_GRADE } from '../data/characters/index';
import { CharacterSkill } from '../data/skills/characterSkills';

export const DEFAULT_DUNGEON_SETTINGS: DungeonSettings = {
  totalWaves: 3,
  rerollFrequency: 1,
  gradeWaveMilestones: {
    gradeCMax: 15,
    gradeBMax: 30,
    gradeAMax: 40,
    cosmicStart: 41
  },
  startingHealingPotions: 3,
  gameplayMode: 'solo',
  playerCount: 1,
  playerNames: ['Player 1']
};

export function generateEnemyIntent(enemyHero: Character, wave: number): EnemyIntentInfo {
  const stats = enemyHero.stats;
  const isBossWave = wave % 5 === 0 || enemyHero.grade === 'MYTHIC';

  const possibleIntents: EnemyIntentType[] = [];

  if (isBossWave && Math.random() < 0.4) {
    return {
      type: 'COSMIC_ANNIHILATION',
      title: 'COSMIC DEVASTATION',
      description: 'Charging catastrophic cosmic wipe. Extreme incoming damage!',
      counterRecommendation: 'USE DEFEND & COUNTER OR EVADE & AMBUSH TO SURVIVE!',
      icon: '🌌'
    };
  }

  if (stats.strength > 85 || (stats.strength >= stats.energy && stats.strength >= stats.combat)) {
    possibleIntents.push('HEAVY_SLUGGER');
  }
  if (stats.durability > 85 || stats.durability > stats.speed) {
    possibleIntents.push('IRON_FORTRESS');
  }
  if (stats.energy > 85 || stats.energy > stats.strength) {
    possibleIntents.push('ENERGY_SURGE');
  }
  if (stats.speed > 80 || stats.combat > 85) {
    possibleIntents.push('SHADOW_STRIKE');
  }

  if (possibleIntents.length === 0) {
    possibleIntents.push('HEAVY_SLUGGER', 'ENERGY_SURGE', 'IRON_FORTRESS', 'SHADOW_STRIKE');
  }

  const chosenType = possibleIntents[Math.floor(Math.random() * possibleIntents.length)];

  switch (chosenType) {
    case 'HEAVY_SLUGGER':
      return {
        type: 'HEAVY_SLUGGER',
        title: 'HEAVY BRUTE SLUGGER',
        description: 'Telegraphing a massive kinetic slam.',
        counterRecommendation: 'DEFEND & COUNTER absorbs 75% damage and reflects heavy blow!',
        icon: '🔨'
      };
    case 'IRON_FORTRESS':
      return {
        type: 'IRON_FORTRESS',
        title: 'IRON FORTRESS GUARD',
        description: 'Hardening defensive shield to mitigate physical strikes.',
        counterRecommendation: 'SPECIAL BLAST pierces and shatters armor (+70% damage)!',
        icon: '🛡️'
      };
    case 'ENERGY_SURGE':
      return {
        type: 'ENERGY_SURGE',
        title: 'ENERGY CORE SURGE',
        description: 'Gathering cosmic energy beam in charge stance.',
        counterRecommendation: 'DIRECT STRIKE interrupts charging or EVADE flank strikes!',
        icon: '⚡'
      };
    case 'SHADOW_STRIKE':
      return {
        type: 'SHADOW_STRIKE',
        title: 'AGILE SHADOW AMBUSH',
        description: 'Maneuvering for an evasion counter-strike.',
        counterRecommendation: 'DEFEND & COUNTER traps high-speed assault!',
        icon: '💨'
      };
    default:
      return {
        type: 'HEAVY_SLUGGER',
        title: 'HEAVY SMASH',
        description: 'Telegraphing direct strike.',
        counterRecommendation: 'DEFEND & COUNTER recommended.',
        icon: '⚔️'
      };
  }
}

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

// Execute strategic tactical combat round in Dungeons
export function executeDungeonCombatTurn(
  playerHero: Character,
  playerSkill: CharacterSkill | null,
  enemyHero: Character,
  currentRound: number,
  actionMode: TacticalActionMode = 'STRIKE',
  enemyIntent: EnemyIntentInfo | null = null
): {
  playerDamageDealt: number;
  enemyDamageDealt: number;
  playerHealed: number;
  combatLogs: DungeonCombatLog[];
} {
  const pStats = playerHero.stats;
  const eStats = enemyHero.stats;

  // Grade Base Multiplier
  const gradeScale: Record<string, number> = { 'C': 1.0, 'B': 1.25, 'A': 1.55, 'MYTHIC': 2.0 };
  const pGradeMult = gradeScale[playerHero.grade] || 1.0;
  const eGradeMult = gradeScale[enemyHero.grade] || 1.0;

  // Raw base calculations
  let playerBasePwr = Math.round(((pStats.strength * 0.25 + pStats.energy * 0.25 + pStats.combat * 0.3) * pGradeMult + playerHero.overallPower * 0.3) / 3.0);
  let enemyBasePwr = Math.round(((eStats.strength * 0.25 + eStats.energy * 0.25 + eStats.combat * 0.3) * eGradeMult + enemyHero.overallPower * 0.3) / 2.9);

  let playerHealed = 0;
  let isCrit = false;
  let tacticalAdvantageMsg = '';
  let pTacticalMult = 1.0;
  let eDamageMult = 1.0;

  // Evaluate Tactical Choice vs Enemy Intent
  const intentType = enemyIntent?.type || 'HEAVY_SLUGGER';

  if (intentType === 'HEAVY_SLUGGER') {
    if (actionMode === 'DEFEND_COUNTER') {
      eDamageMult = 0.25; // 75% damage reduction!
      pTacticalMult = 1.55; // Reflected counter damage!
      tacticalAdvantageMsg = `🛡️ TACTICAL ADVANTAGE! Fortified shield absorbed 75% of the heavy blow and countered with punishing force!`;
    } else if (actionMode === 'EVADE_AMBUSH') {
      if (Math.random() < 0.65) {
        eDamageMult = 0; // Dodged!
        pTacticalMult = 1.45;
        tacticalAdvantageMsg = `💨 ACROBATIC EVASION! Completely dodged the heavy slam and struck the enemy from behind!`;
      } else {
        eDamageMult = 0.7;
        pTacticalMult = 1.2;
        tacticalAdvantageMsg = `💨 Partial evasion mitigated incoming impact!`;
      }
    } else if (actionMode === 'STRIKE') {
      pTacticalMult = 1.1;
      eDamageMult = 1.0;
      tacticalAdvantageMsg = `⚔️ Both duelists traded direct physical blows!`;
    } else if (actionMode === 'SPECIAL_BLAST') {
      pTacticalMult = 1.0;
      eDamageMult = 1.25; // Vulnerable during casting
      tacticalAdvantageMsg = `⚠️ Caught while casting ranged blast without cover!`;
    }
  } else if (intentType === 'IRON_FORTRESS') {
    if (actionMode === 'SPECIAL_BLAST') {
      pTacticalMult = 1.7; // Armor Piercing!
      eDamageMult = 0.6;
      tacticalAdvantageMsg = `⚡ BARRIER BREAKER! Concentrated Special Blast shattered the guardian's fortified stance for +70% bonus!`;
    } else if (actionMode === 'STRIKE') {
      pTacticalMult = 0.55; // Deflected by shield
      eDamageMult = 0.8;
      tacticalAdvantageMsg = `❌ DEFLECTED! Physical strike hit reinforced armor for reduced damage!`;
    } else if (actionMode === 'DEFEND_COUNTER') {
      pTacticalMult = 0.8;
      eDamageMult = 0.3;
      tacticalAdvantageMsg = `🛡️ Both fighters took defensive stances in a tense standoff.`;
    } else if (actionMode === 'EVADE_AMBUSH') {
      pTacticalMult = 1.35;
      eDamageMult = 0.5;
      tacticalAdvantageMsg = `💨 Flanked behind the guardian's shield barrier!`;
    }
  } else if (intentType === 'ENERGY_SURGE') {
    if (actionMode === 'STRIKE') {
      pTacticalMult = 1.6; // Interrupt charge
      eDamageMult = 0.5;
      tacticalAdvantageMsg = `⚔️ STRIKE INTERRUPT! Direct physical assault disrupted the enemy's energy surge charging!`;
    } else if (actionMode === 'EVADE_AMBUSH') {
      pTacticalMult = 1.65;
      eDamageMult = 0.2;
      tacticalAdvantageMsg = `💨 FLANKING DODGE! Slid underneath the energy beam and launched a devastating counter!`;
    } else if (actionMode === 'DEFEND_COUNTER') {
      eDamageMult = 0.6; // Energy bleeds through slightly
      pTacticalMult = 1.1;
      tacticalAdvantageMsg = `🛡️ Shield deflected most of the energy beam.`;
    } else if (actionMode === 'SPECIAL_BLAST') {
      pTacticalMult = 1.3;
      eDamageMult = 1.2;
      tacticalAdvantageMsg = `⚡ Energy beam clash illuminated the ancient ruins!`;
    }
  } else if (intentType === 'SHADOW_STRIKE') {
    if (actionMode === 'DEFEND_COUNTER') {
      pTacticalMult = 1.65;
      eDamageMult = 0.25;
      tacticalAdvantageMsg = `🛡️ AMBUSH COUNTERED! Anticipated the shadow leap and smashed the ambusher out of mid-air!`;
    } else if (actionMode === 'SPECIAL_BLAST') {
      pTacticalMult = 1.45;
      eDamageMult = 0.7;
      tacticalAdvantageMsg = `⚡ Wide-area energy explosion caught the agile foe!`;
    } else if (actionMode === 'STRIKE') {
      pTacticalMult = 0.7;
      eDamageMult = 1.2;
      tacticalAdvantageMsg = `⚠️ Whiffed against the agile target's high-speed maneuver!`;
    } else if (actionMode === 'EVADE_AMBUSH') {
      pTacticalMult = 1.2;
      eDamageMult = 0.6;
      tacticalAdvantageMsg = `💨 High-speed duel of reflexes and acrobatics!`;
    }
  } else if (intentType === 'COSMIC_ANNIHILATION') {
    if (actionMode === 'DEFEND_COUNTER') {
      eDamageMult = 0.3; // Survives cosmic ultimate
      pTacticalMult = 1.4;
      tacticalAdvantageMsg = `🛡️ HEROIC FORTITUDE! Withstood the Cosmic Annihilation wave and held the line!`;
    } else if (actionMode === 'EVADE_AMBUSH') {
      eDamageMult = 0.35;
      pTacticalMult = 1.5;
      tacticalAdvantageMsg = `💨 HYPERSPACE EVASION! Barely escaped ground zero of the cosmic destruction!`;
    } else {
      eDamageMult = 1.5; // Massive penalty for reckless attacking into ultimate
      pTacticalMult = 1.0;
      tacticalAdvantageMsg = `💥 CATASTROPHIC IMPACT! Suffered full unrestrained Cosmic Devastation without guard!`;
    }
  }

  // Apply Skill Modifiers
  if (playerSkill) {
    playerBasePwr += playerSkill.bonusPower * 2.2;
    if (playerSkill.effectType === 'critical') {
      isCrit = Math.random() < (playerSkill.triggerRate + 0.3);
      if (isCrit) playerBasePwr = Math.round(playerBasePwr * 1.5);
    } else if (playerSkill.effectType === 'lifesteal') {
      playerHealed = Math.round(playerBasePwr * 0.4);
    } else if (playerSkill.effectType === 'shield') {
      eDamageMult *= 0.6;
    }
  }

  // Final damage calculation with tactical modifiers
  const pVariance = 0.9 + Math.random() * 0.2;
  const eVariance = 0.9 + Math.random() * 0.2;

  const pDmg = Math.max(8, Math.round(playerBasePwr * pTacticalMult * pVariance));
  const eDmg = Math.max(0, Math.round(enemyBasePwr * eDamageMult * eVariance));

  const logs: DungeonCombatLog[] = [];

  const actionLabels: Record<TacticalActionMode, string> = {
    'STRIKE': 'Direct Strike',
    'SPECIAL_BLAST': 'Special Blast',
    'DEFEND_COUNTER': 'Defend & Counter',
    'EVADE_AMBUSH': 'Evade & Ambush'
  };

  logs.push({
    round: currentRound,
    attackerName: playerHero.name,
    defenderName: enemyHero.name,
    actionUsed: playerSkill ? `${playerSkill.name} (${actionLabels[actionMode]})` : actionLabels[actionMode],
    damage: pDmg,
    isCrit,
    message: `${playerHero.name} executed [${actionLabels[actionMode]}]${playerSkill ? ` + ${playerSkill.name}` : ''}, dealing ${pDmg} DMG! ${tacticalAdvantageMsg}`
  });

  if (eDmg > 0) {
    logs.push({
      round: currentRound,
      attackerName: enemyHero.name,
      defenderName: playerHero.name,
      actionUsed: enemyIntent?.title || 'Guardian Strike',
      damage: eDmg,
      isCrit: false,
      message: `${enemyHero.name} unleashed [${enemyIntent?.title || 'Ancient Strike'}], dealing ${eDmg} DMG!`
    });
  } else {
    logs.push({
      round: currentRound,
      attackerName: enemyHero.name,
      defenderName: playerHero.name,
      actionUsed: enemyIntent?.title || 'Guardian Strike',
      damage: 0,
      isCrit: false,
      message: `${enemyHero.name}'s attack was completely evaded/nullified!`
    });
  }

  return {
    playerDamageDealt: pDmg,
    enemyDamageDealt: eDmg,
    playerHealed,
    combatLogs: logs
  };
}

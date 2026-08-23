import { Character, Player, SpecialAbility, BattleRound, BattleActionType } from '../src/types/game';
import { calculatePlayerSynergies, getSynergyBonusForCharacter } from '../src/engine/synergyEngine';

export interface CombatClashResult {
  roundNumber: number;
  player1Character: Character;
  player2Character: Character;
  player1TotalPower: number;
  player2TotalPower: number;
  player1Roll: number;
  player2Roll: number;
  player1AbilityTriggered?: SpecialAbility;
  player2AbilityTriggered?: SpecialAbility;
  player1SynergyBonus?: number;
  player2SynergyBonus?: number;
  winnerPlayerId: string;
  winnerCharacterName: string;
  log: string[];
}

export function simulateRoundDuel(
  player1: Player,
  char1: Character,
  player2: Player,
  char2: Character,
  roundNumber: number,
  action1: BattleActionType = 'ATTACK',
  action2: BattleActionType = 'ATTACK'
): BattleRound {
  const log: string[] = [];
  log.push(`ROUND ${roundNumber} (${char1.grade} TIER): ${char1.name} [${action1}] VS ${char2.name} [${action2}]`);

  // Base power
  let p1Power = char1.overallPower;
  let p2Power = char2.overallPower;

  // Initialize HP if not set
  const p1MaxHp = char1.maxHp || 100;
  const p2MaxHp = char2.maxHp || 100;
  let p1Hp = char1.currentHp !== undefined ? char1.currentHp : p1MaxHp;
  let p2Hp = char2.currentHp !== undefined ? char2.currentHp : p2MaxHp;

  // 1. Tactical Command Modifiers
  if (action1 === 'DEFEND') {
    p1Power += 6;
    log.push(`🛡️ ${char1.name} enters a defensive stance, fortifying armor! (+6 Defense)`);
  } else if (action1 === 'SPECIAL') {
    p1Power += 4;
    log.push(`⚡ ${char1.name} charges their signature cosmic/mutant ability!`);
  }

  if (action2 === 'DEFEND') {
    p2Power += 6;
    log.push(`🛡️ ${char2.name} enters a defensive stance, fortifying armor! (+6 Defense)`);
  } else if (action2 === 'SPECIAL') {
    p2Power += 4;
    log.push(`⚡ ${char2.name} charges their signature cosmic/mutant ability!`);
  }

  // 2. Stat Advantages Comparison
  if (char1.stats.strength > char2.stats.durability + 10) {
    p1Power += 2.0;
    log.push(`${char1.name}'s brute Strength (${char1.stats.strength}) breaks through ${char2.name}'s Durability! (+2.0 Power)`);
  }
  if (char2.stats.strength > char1.stats.durability + 10) {
    p2Power += 2.0;
    log.push(`${char2.name}'s brute Strength (${char2.stats.strength}) breaks through ${char1.name}'s Durability! (+2.0 Power)`);
  }

  if (char1.stats.speed > char2.stats.combat + 10) {
    p1Power += 1.5;
    log.push(`${char1.name} outmaneuvers ${char2.name} with blinding Speed! (+1.5 Power)`);
  }
  if (char2.stats.speed > char1.stats.combat + 10) {
    p2Power += 1.5;
    log.push(`${char2.name} outmaneuvers ${char1.name} with blinding Speed! (+1.5 Power)`);
  }

  // 3. Team Synergy / Faction Bonuses
  const p1Synergies = calculatePlayerSynergies(player1.collection);
  const p2Synergies = calculatePlayerSynergies(player2.collection);
  const p1SynBonus = getSynergyBonusForCharacter(char1, p1Synergies);
  const p2SynBonus = getSynergyBonusForCharacter(char2, p2Synergies);

  if (p1SynBonus > 0) {
    p1Power += p1SynBonus;
    const matchingSyn = p1Synergies.find(s => s.bonusPower === p1SynBonus);
    log.push(`🛡️ ${player1.name}'s [${matchingSyn?.title || 'Team Synergy'}] activates! (+${p1SynBonus} Power for ${char1.name})`);
  }

  if (p2SynBonus > 0) {
    p2Power += p2SynBonus;
    const matchingSyn = p2Synergies.find(s => s.bonusPower === p2SynBonus);
    log.push(`🛡️ ${player2.name}'s [${matchingSyn?.title || 'Team Synergy'}] activates! (+${p2SynBonus} Power for ${char2.name})`);
  }

  // 4. Tactical Artifact Items (Expanded with all 23 Marvel Relics)
  if (char1.equippedArtifact) {
    const art = char1.equippedArtifact;
    if (art.effectType === 'double_roll') {
      log.push(`💎 ${char1.name} unleashes [${art.name}]! (50% Chance to Double Power)`);
    } else if (art.effectType === 'life_drain') {
      p2Hp = Math.max(0, p2Hp - 25);
      p1Hp = Math.min(p1MaxHp, p1Hp + 15);
      log.push(`📖 [Darkhold Magic] drains 25 HP from ${char2.name} and restores 15 HP to ${char1.name}!`);
    } else if (art.effectType === 'lethal_strike') {
      p1Power += 10;
      log.push(`🗡️ ${char1.name}'s [${art.name}] delivers a lethal armor-piercing strike! (+10 Power)`);
    } else if (art.effectType === 'invulnerable') {
      p1Power += 8;
      log.push(`🔴 [${art.name}] projects an impenetrable force barrier around ${char1.name}! (+8 Defense)`);
    } else if (art.effectType === 'cosmic_supremacy') {
      p1Power += 15;
      log.push(`🌌 [Heart of the Universe] bends reality to ${char1.name}'s will! (+15 Cosmic Power)`);
    } else if (art.effectType === 'speed_slow') {
      p2Power -= 6;
      log.push(`🕸️ [Web-Shooters] entangle ${char2.name}, reducing their roll by -6!`);
    } else if (art.effectType === 'freeze') {
      p2Power -= 7;
      log.push(`❄️ [Casket of Ancient Winters] freezes ${char2.name} in absolute zero frost! (-7 Power)`);
    } else if (art.effectType === 'lightning_strike' && art.bonusPower) {
      p1Power += art.bonusPower;
      log.push(`⚡ ${char1.name} wields [${art.name}]! (+${art.bonusPower} Lightning Damage)`);
    } else if (art.effectType === 'shrink_enemy') {
      p2Power -= 8;
      log.push(`🧪 ${char1.name} deploys [${art.name}]! (Shrinks ${char2.name} by -8 Power)`);
    } else if (art.bonusPower) {
      p1Power += art.bonusPower;
      log.push(`🦾 ${char1.name} activates [${art.name}]! (+${art.bonusPower} Power)`);
    }
  }

  if (char2.equippedArtifact) {
    const art = char2.equippedArtifact;
    if (art.effectType === 'double_roll') {
      log.push(`💎 ${char2.name} unleashes [${art.name}]! (50% Chance to Double Power)`);
    } else if (art.effectType === 'life_drain') {
      p1Hp = Math.max(0, p1Hp - 25);
      p2Hp = Math.min(p2MaxHp, p2Hp + 15);
      log.push(`📖 [Darkhold Magic] drains 25 HP from ${char1.name} and restores 15 HP to ${char2.name}!`);
    } else if (art.effectType === 'lethal_strike') {
      p2Power += 10;
      log.push(`🗡️ ${char2.name}'s [${art.name}] delivers a lethal armor-piercing strike! (+10 Power)`);
    } else if (art.effectType === 'invulnerable') {
      p2Power += 8;
      log.push(`🔴 [${art.name}] projects an impenetrable force barrier around ${char2.name}! (+8 Defense)`);
    } else if (art.effectType === 'cosmic_supremacy') {
      p2Power += 15;
      log.push(`🌌 [Heart of the Universe] bends reality to ${char2.name}'s will! (+15 Cosmic Power)`);
    } else if (art.effectType === 'speed_slow') {
      p1Power -= 6;
      log.push(`🕸️ [Web-Shooters] entangle ${char1.name}, reducing their roll by -6!`);
    } else if (art.effectType === 'freeze') {
      p1Power -= 7;
      log.push(`❄️ [Casket of Ancient Winters] freezes ${char1.name} in absolute zero frost! (-7 Power)`);
    } else if (art.effectType === 'lightning_strike' && art.bonusPower) {
      p2Power += art.bonusPower;
      log.push(`⚡ ${char2.name} wields [${art.name}]! (+${art.bonusPower} Lightning Damage)`);
    } else if (art.effectType === 'shrink_enemy') {
      p1Power -= 8;
      log.push(`🧪 ${char2.name} deploys [${art.name}]! (Shrinks ${char1.name} by -8 Power)`);
    } else if (art.bonusPower) {
      p2Power += art.bonusPower;
      log.push(`🦾 ${char2.name} activates [${art.name}]! (+${art.bonusPower} Power)`);
    }
  }

  // 5. Special Ability Procs (boosted trigger rate if player chose SPECIAL action)
  let p1Ability: SpecialAbility | undefined;
  const p1SpecialBoost = action1 === 'SPECIAL' ? 0.35 : 0;
  for (const ab of char1.specialAbilities) {
    if (Math.random() <= Math.min(1.0, ab.triggerRate + p1SpecialBoost)) {
      p1Ability = ab;
      p1Power += ab.bonusPower;
      log.push(`💥 ${char1.name} triggers [${ab.name}]: ${ab.description} (+${ab.bonusPower} Power)`);
      break;
    }
  }

  let p2Ability: SpecialAbility | undefined;
  const p2SpecialBoost = action2 === 'SPECIAL' ? 0.35 : 0;
  for (const ab of char2.specialAbilities) {
    if (Math.random() <= Math.min(1.0, ab.triggerRate + p2SpecialBoost)) {
      p2Ability = ab;
      p2Power += ab.bonusPower;
      log.push(`💥 ${char2.name} triggers [${ab.name}]: ${ab.description} (+${ab.bonusPower} Power)`);
      break;
    }
  }

  // 6. Random Roll Variance (0 to 6)
  let roll1 = Math.round((Math.random() * 6) * 10) / 10;
  let roll2 = Math.round((Math.random() * 6) * 10) / 10;

  if (char1.equippedArtifact?.effectType === 'double_roll' && Math.random() < 0.5) {
    roll1 *= 2;
    log.push(`✨ [Infinity Gauntlet Snap] doubles ${char1.name}'s roll to +${roll1}!`);
  }
  if (char2.equippedArtifact?.effectType === 'double_roll' && Math.random() < 0.5) {
    roll2 *= 2;
    log.push(`✨ [Infinity Gauntlet Snap] doubles ${char2.name}'s roll to +${roll2}!`);
  }

  const finalP1 = Math.round((p1Power + roll1) * 10) / 10;
  const finalP2 = Math.round((p2Power + roll2) * 10) / 10;

  let winnerId = finalP1 >= finalP2 ? player1.id : player2.id;
  const winningChar = finalP1 >= finalP2 ? char1.name : char2.name;

  // Handle Vibranium Shield Negation
  if (winnerId === player2.id && char1.equippedArtifact?.effectType === 'shield_negate') {
    if (finalP2 - finalP1 <= 6) {
      log.push(`🛡️ [Vibranium Shield] absorbs the lethal blow! ${char1.name} deflects defeat!`);
      winnerId = player1.id;
    }
  } else if (winnerId === player1.id && char2.equippedArtifact?.effectType === 'shield_negate') {
    if (finalP1 - finalP2 <= 6) {
      log.push(`🛡️ [Vibranium Shield] absorbs the lethal blow! ${char2.name} deflects defeat!`);
      winnerId = player2.id;
    }
  }

  // 7. Calculate Health Bar (HP) Depletion & Knockouts
  const powerDiff = Math.abs(finalP1 - finalP2);
  let damageToLoser = Math.max(18, Math.min(42, Math.round(powerDiff * 2.6 + 20)));

  if (winnerId === player1.id) {
    if (action1 === 'SPECIAL') damageToLoser += 8;
    if (action2 === 'DEFEND') damageToLoser = Math.max(10, Math.round(damageToLoser * 0.5));
    p2Hp = Math.max(0, p2Hp - damageToLoser);
    char2.currentHp = p2Hp;
    char2.isFainted = p2Hp <= 0;
    log.push(`🩸 ${char1.name} strikes for ${damageToLoser} damage! ${char2.name} is at ${p2Hp}/${p2MaxHp} HP.`);

    if (p2Hp <= 0) {
      log.push(`💀 KNOCKOUT! ${char2.name} has been defeated!`);
    }
  } else {
    if (action2 === 'SPECIAL') damageToLoser += 8;
    if (action1 === 'DEFEND') damageToLoser = Math.max(10, Math.round(damageToLoser * 0.5));
    p1Hp = Math.max(0, p1Hp - damageToLoser);
    char1.currentHp = p1Hp;
    char1.isFainted = p1Hp <= 0;
    log.push(`🩸 ${char2.name} strikes for ${damageToLoser} damage! ${char1.name} is at ${p1Hp}/${p1MaxHp} HP.`);

    if (p1Hp <= 0) {
      log.push(`💀 KNOCKOUT! ${char1.name} has been defeated!`);
    }
  }

  log.push(`🏆 Round Result: ${winningChar} leads clash (${Math.max(finalP1, finalP2)} vs ${Math.min(finalP1, finalP2)})`);

  return {
    roundNumber,
    tier: char1.grade,
    player1Character: char1,
    player2Character: char2,
    player1Action: action1,
    player2Action: action2,
    player1Roll: roll1,
    player2Roll: roll2,
    player1SynergyBonus: p1SynBonus,
    player2SynergyBonus: p2SynBonus,
    player1ArtifactUsed: char1.equippedArtifact || undefined,
    player2ArtifactUsed: char2.equippedArtifact || undefined,
    player1AbilityTriggered: p1Ability,
    player2AbilityTriggered: p2Ability,
    player1TotalPower: finalP1,
    player2TotalPower: finalP2,
    player1DamageDealt: winnerId === player1.id ? damageToLoser : 0,
    player2DamageDealt: winnerId === player2.id ? damageToLoser : 0,
    player1HpRemaining: p1Hp,
    player2HpRemaining: p2Hp,
    winnerPlayerId: winnerId,
    log,
  };
}

export interface BattleLoreAnalysis {
  winnerReason: string;
  loserStrategyAdvice: string;
  keyTurningPoint: string;
  marvelCanonVerdict: string;
}

export function generateBattleLoreSummary(
  winner: Character,
  loser: Character,
  round: BattleRound
): BattleLoreAnalysis {
  const statStrengths = [];
  if (winner.stats.strength > loser.stats.strength) statStrengths.push('superior physical strength');
  if (winner.stats.energy > loser.stats.energy) statStrengths.push('higher cosmic/energy output');
  if (winner.stats.speed > loser.stats.speed) statStrengths.push('faster combat reflexes');
  if (winner.stats.intelligence > loser.stats.intelligence) statStrengths.push('tactical tactical intellect');
  if (winner.stats.combat > loser.stats.combat) statStrengths.push('master martial arts execution');

  const advantagesText = statStrengths.length > 0 ? statStrengths.join(' and ') : 'unwavering combat focus';

  const winnerReason = `${winner.name} secured victory over ${loser.name} utilizing ${advantagesText}. In the decisive exchange, ${winner.name}'s ${winner.specialAbilities[0]?.name || 'overall combat prowess'} generated an insurmountable ${round.player1TotalPower} vs ${round.player2TotalPower} power differential.`;

  const loserStrategyAdvice = `To counter ${winner.name}, ${loser.name} should have avoided direct close-quarters clashes and focused on exploiting ${winner.name}'s lower ${
    winner.stats.speed < 80 ? 'mobility' : winner.stats.durability < 80 ? 'durability threshold' : 'energy defense'
  }. Equipping defensive artifacts like the Vibranium Shield or Crimson Gem of Cyttorak while utilizing evasive range tactics would dramatically swing the outcome in ${loser.name}'s favor.`;

  const keyTurningPoint = round.player1AbilityTriggered || round.player2AbilityTriggered
    ? `The critical momentum shift occurred when ${(round.player1AbilityTriggered || round.player2AbilityTriggered)?.name} was unleashed, shattering the defensive guard.`
    : `The continuous kinetic pressure and sustained power differential of +${Math.abs(round.player1TotalPower - round.player2TotalPower).toFixed(1)} broke the opponent's guard.`;

  const marvelCanonVerdict = `In Marvel Comics canon, ${winner.name} holds a tier rating of ${winner.grade} with ${winner.overallPower} Power against ${loser.name}'s ${loser.overallPower} Power. A decisive canonical victory!`;

  return {
    winnerReason,
    loserStrategyAdvice,
    keyTurningPoint,
    marvelCanonVerdict,
  };
}

export function getTierMatchedPairings(
  collection1: Character[],
  collection2: Character[]
): { p1Char: Character; p2Char: Character }[] {
  const gradeRank: Record<string, number> = { MYTHIC: 4, A: 3, B: 2, C: 1 };

  const sorted1 = [...collection1].sort((a, b) => gradeRank[b.grade] - gradeRank[a.grade] || b.overallPower - a.overallPower);
  const sorted2 = [...collection2].sort((a, b) => gradeRank[b.grade] - gradeRank[a.grade] || b.overallPower - a.overallPower);

  const pairings: { p1Char: Character; p2Char: Character }[] = [];
  const minLength = Math.min(sorted1.length, sorted2.length);

  for (let i = 0; i < minLength; i++) {
    pairings.push({
      p1Char: sorted1[i],
      p2Char: sorted2[i],
    });
  }

  return pairings;
}

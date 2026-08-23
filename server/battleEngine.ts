import { Character, Player, SpecialAbility, BattleRound } from '../src/types/game';
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
  roundNumber: number
): BattleRound {
  const log: string[] = [];
  log.push(`ROUND ${roundNumber} (${char1.grade} TIER): ${char1.name} VS ${char2.name}`);

  // Base power
  let p1Power = char1.overallPower;
  let p2Power = char2.overallPower;

  // 1. Stat Advantages Comparison
  // Strength vs Durability
  if (char1.stats.strength > char2.stats.durability + 10) {
    p1Power += 1.5;
    log.push(`${char1.name}'s Strength (${char1.stats.strength}) penetrates ${char2.name}'s Durability! (+1.5 Power)`);
  }
  if (char2.stats.strength > char1.stats.durability + 10) {
    p2Power += 1.5;
    log.push(`${char2.name}'s Strength (${char2.stats.strength}) penetrates ${char1.name}'s Durability! (+1.5 Power)`);
  }

  // Speed vs Combat
  if (char1.stats.speed > char2.stats.combat + 10) {
    p1Power += 1.0;
    log.push(`${char1.name} outmaneuvers ${char2.name} with superior Speed! (+1.0 Power)`);
  }
  if (char2.stats.speed > char1.stats.combat + 10) {
    p2Power += 1.0;
    log.push(`${char2.name} outmaneuvers ${char1.name} with superior Speed! (+1.0 Power)`);
  }

  // 2. Team Synergy / Faction Bonuses
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

  // 3. Tactical Artifact Items
  if (char1.equippedArtifact) {
    const art = char1.equippedArtifact;
    if (art.effectType === 'double_roll') {
      log.push(`💎 ${char1.name} unleashes [${art.name}]! (50% Chance to Double Power)`);
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

  // 4. Special Ability Procs
  let p1Ability: SpecialAbility | undefined;
  for (const ab of char1.specialAbilities) {
    if (Math.random() <= ab.triggerRate) {
      p1Ability = ab;
      p1Power += ab.bonusPower;
      log.push(`💥 ${char1.name} triggers [${ab.name}]: ${ab.description} (+${ab.bonusPower} Power)`);
      break;
    }
  }

  let p2Ability: SpecialAbility | undefined;
  for (const ab of char2.specialAbilities) {
    if (Math.random() <= ab.triggerRate) {
      p2Ability = ab;
      p2Power += ab.bonusPower;
      log.push(`💥 ${char2.name} triggers [${ab.name}]: ${ab.description} (+${ab.bonusPower} Power)`);
      break;
    }
  }

  // 5. Random Roll Variance (0 to 5)
  let roll1 = Math.round((Math.random() * 5) * 10) / 10;
  let roll2 = Math.round((Math.random() * 5) * 10) / 10;

  // Handle Infinity Gauntlet Double Roll
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
    if (finalP2 - finalP1 <= 4) {
      log.push(`🛡️ [Vibranium Shield] absorbs the lethal blow! ${char1.name} deflects defeat!`);
      winnerId = player1.id;
    }
  } else if (winnerId === player1.id && char2.equippedArtifact?.effectType === 'shield_negate') {
    if (finalP1 - finalP2 <= 4) {
      log.push(`🛡️ [Vibranium Shield] absorbs the lethal blow! ${char2.name} deflects defeat!`);
      winnerId = player2.id;
    }
  }

  log.push(`🏆 Winner: ${winningChar} (${Math.max(finalP1, finalP2)} vs ${Math.min(finalP1, finalP2)})`);

  return {
    roundNumber,
    tier: char1.grade,
    player1Character: char1,
    player2Character: char2,
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
    winnerPlayerId: winnerId,
    log,
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

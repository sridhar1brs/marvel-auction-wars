import { Character } from '../../types/game';

export interface CharacterSkill {
  id: string;
  name: string;
  description: string;
  cost: number; // $6 - $15 (Non-P2W balance)
  icon: string;
  bonusPower: number;
  triggerRate: number;
  effectType: 'attack' | 'shield' | 'lifesteal' | 'speed_evasion' | 'critical' | 'tactical';
}

// Tailored custom skills for iconic characters
const ICONIC_CHARACTER_SKILLS: Record<string, CharacterSkill[]> = {
  // Iron Man
  'char-b-002': [
    { id: 'sk-im-1', name: 'Unibeam Overcharge', description: 'Discharges 100% chest reactor output for searing direct energy impact.', cost: 8, icon: '⚡', bonusPower: 8, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-im-2', name: 'Nanotech Kinetic Barrier', description: 'Deploys interlocking nanite hexagonal energy shield absorbing incoming blow.', cost: 10, icon: '🛡️', bonusPower: 6, triggerRate: 0.5, effectType: 'shield' },
    { id: 'sk-im-3', name: 'Micro-Missile Salvo', description: 'Fires shoulder-mounted smart micro-projectiles across the enemy flank.', cost: 7, icon: '🚀', bonusPower: 7, triggerRate: 0.55, effectType: 'attack' },
    { id: 'sk-im-4', name: 'Veronica Orbital Supply', description: 'Calibrates tactical targeting sensors and restores armor integrity.', cost: 9, icon: '🛰️', bonusPower: 5, triggerRate: 0.5, effectType: 'tactical' },
    { id: 'sk-im-5', name: 'Arc Reactor Meltdown', description: 'Overclocks repulsor coils for a devastating critical power surge.', cost: 13, icon: '💥', bonusPower: 12, triggerRate: 0.4, effectType: 'critical' }
  ],
  // Captain America
  'char-b-003': [
    { id: 'sk-cap-1', name: 'Shield Ricochet Vortex', description: 'Hurls the proto-vibranium disc bouncing off angular trajectories.', cost: 7, icon: '🛡️', bonusPower: 7, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-cap-2', name: 'Super Soldier Morale', description: 'Rallies fighting spirit to resist fear, demoralization, and debuffs.', cost: 8, icon: '⭐', bonusPower: 6, triggerRate: 0.55, effectType: 'shield' },
    { id: 'sk-cap-3', name: 'Vibranium Guard Stance', description: 'Plants feet behind the shock-absorbent shield, negating heavy blows.', cost: 10, icon: '🔰', bonusPower: 8, triggerRate: 0.5, effectType: 'shield' },
    { id: 'sk-cap-4', name: 'Tactical Command Blitz', description: 'Analyzes enemy weak points and dictates the tempo of combat.', cost: 9, icon: '🎯', bonusPower: 7, triggerRate: 0.5, effectType: 'tactical' },
    { id: 'sk-cap-5', name: 'Freedom\'s Final Charge', description: 'Charges forward with an unstoppable shield bash dealing critical kinetic force.', cost: 12, icon: '🇺🇸', bonusPower: 11, triggerRate: 0.45, effectType: 'critical' }
  ],
  // Wolverine
  'char-b-005': [
    { id: 'sk-wolv-1', name: 'Adamantium Frenzy', description: 'Unleashes a rapid triple-claw evisceration shredding through steel.', cost: 8, icon: '🩸', bonusPower: 8, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-wolv-2', name: 'Cellular Regeneration', description: 'Mutant healing factor rapidly knits damaged tissue, restoring HP.', cost: 11, icon: '💉', bonusPower: 6, triggerRate: 0.65, effectType: 'lifesteal' },
    { id: 'sk-wolv-3', name: 'Berserker Rage', description: 'Animalistic fury grants ferocious strength bonus at low health.', cost: 10, icon: '🐺', bonusPower: 9, triggerRate: 0.5, effectType: 'attack' },
    { id: 'sk-wolv-4', name: 'Predatory Instincts', description: 'Heightened feral senses detect stealth and incoming strikes.', cost: 7, icon: '👃', bonusPower: 6, triggerRate: 0.55, effectType: 'speed_evasion' },
    { id: 'sk-wolv-5', name: 'Weapon X Execution', description: 'Lethal lunging execution strike dealing overwhelming critical damage.', cost: 14, icon: '⚔️', bonusPower: 13, triggerRate: 0.4, effectType: 'critical' }
  ],
  // Spider-Man
  'char-b-001': [
    { id: 'sk-sp-1', name: 'Impact Web Netting', description: 'Pins opponent limbs in tensile webbing, reducing their speed and attack.', cost: 7, icon: '🕸️', bonusPower: 7, triggerRate: 0.6, effectType: 'tactical' },
    { id: 'sk-sp-2', name: 'Spider-Sense Dodge', description: 'Precognitive danger sense triggers fluid acrobatic evasion.', cost: 10, icon: '🕷️', bonusPower: 8, triggerRate: 0.55, effectType: 'speed_evasion' },
    { id: 'sk-sp-3', name: 'Slingshot Web Kick', description: 'Catapults across the battlefield for a high-velocity aerial kick.', cost: 8, icon: '👟', bonusPower: 8, triggerRate: 0.5, effectType: 'attack' },
    { id: 'sk-sp-4', name: 'Acrobatic Taunt', description: 'Disorients opponent focus with relentless wisecracks.', cost: 6, icon: '🎭', bonusPower: 5, triggerRate: 0.6, effectType: 'tactical' },
    { id: 'sk-sp-5', name: 'Maximum Spider Flurry', description: 'Zigzags with dizzying speed delivering devastating web-assisted strikes.', cost: 13, icon: '💥', bonusPower: 12, triggerRate: 0.45, effectType: 'critical' }
  ],
  // Thanos
  'char-m-010': [
    { id: 'sk-than-1', name: 'Titan Armor Fortification', description: 'Dense celestial armor absorbs raw energy and physical impacts.', cost: 10, icon: '🛡️', bonusPower: 9, triggerRate: 0.55, effectType: 'shield' },
    { id: 'sk-than-2', name: 'Cosmic Ray Disintegration', description: 'Fires twin devastating plasma beams from cosmic eyes.', cost: 11, icon: '👁️', bonusPower: 10, triggerRate: 0.5, effectType: 'attack' },
    { id: 'sk-than-3', name: 'Space Stone Singularity', description: 'Opens a gravitational vortex pulling opponent defense into nothingness.', cost: 12, icon: '🌌', bonusPower: 11, triggerRate: 0.5, effectType: 'tactical' },
    { id: 'sk-than-4', name: 'Soul Siphon', description: 'Drains life essence from the enemy, replenishing Titan vitality.', cost: 12, icon: '🟣', bonusPower: 8, triggerRate: 0.6, effectType: 'lifesteal' },
    { id: 'sk-than-5', name: 'Infinity Gauntlet Decimation', description: 'Channels all 6 stones for a catastrophic cosmic annihilation strike.', cost: 15, icon: '💎', bonusPower: 15, triggerRate: 0.4, effectType: 'critical' }
  ],
  // Thor
  'char-a-001': [
    { id: 'sk-thor-1', name: 'God of Thunder Lightning', description: 'Calls down thunderous Asgardian lightning from storm clouds.', cost: 9, icon: '⚡', bonusPower: 9, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-thor-2', name: 'Mjolnir Spinning Shield', description: 'Spins the enchanted uru hammer to create an impenetrable kinetic barrier.', cost: 10, icon: '🔨', bonusPower: 8, triggerRate: 0.5, effectType: 'shield' },
    { id: 'sk-thor-3', name: 'Stormbreaker Cleave', description: 'Channels bifrost storm energy to slice through cosmic shielding.', cost: 11, icon: '🪓', bonusPower: 10, triggerRate: 0.55, effectType: 'attack' },
    { id: 'sk-thor-4', name: 'All-Father Blessing', description: 'Channels Odinforce to revitalize stamina and clear debuffs.', cost: 10, icon: '👑', bonusPower: 7, triggerRate: 0.5, effectType: 'tactical' },
    { id: 'sk-thor-5', name: 'God Blast Unleashed', description: 'Unleashes the full divine essence of Thor in a cataclysmic solar blast.', cost: 14, icon: '💥', bonusPower: 14, triggerRate: 0.4, effectType: 'critical' }
  ],
  // Scarlet Witch
  'char-a-002': [
    { id: 'sk-sw-1', name: 'Chaos Magic Hex Bolt', description: 'Fires reality-distorting chaos bolts that bypass conventional armor.', cost: 9, icon: '🔴', bonusPower: 9, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-sw-2', name: 'Probability Hex Shield', description: 'Alters probability vectors to cause incoming strikes to miss entirely.', cost: 11, icon: '🔮', bonusPower: 8, triggerRate: 0.55, effectType: 'speed_evasion' },
    { id: 'sk-sw-3', name: 'Telekinetic Rupture', description: 'Crushes opponent armor at the subatomic level with telekinesis.', cost: 10, icon: '🖐️', bonusPower: 9, triggerRate: 0.5, effectType: 'attack' },
    { id: 'sk-sw-4', name: 'Life Force Transmutation', description: 'Absorbs vitality from reality warping to heal herself.', cost: 11, icon: '✨', bonusPower: 7, triggerRate: 0.6, effectType: 'lifesteal' },
    { id: 'sk-sw-5', name: 'No More Mutants (Reality Warp)', description: 'Rewrites local universal constants for devastating critical chaos damage.', cost: 15, icon: '🌌', bonusPower: 15, triggerRate: 0.4, effectType: 'critical' }
  ],
  // Deadpool
  'char-b-006': [
    { id: 'sk-dp-1', name: 'Akimbo Katanas', description: 'Dual carbonadium katanas slice opponent armor into confetti.', cost: 7, icon: '⚔️', bonusPower: 7, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-dp-2', name: 'Chimichanga Regeneration', description: 'Absurd regenerative healing factor laughs off lethal damage.', cost: 11, icon: '🌯', bonusPower: 7, triggerRate: 0.65, effectType: 'lifesteal' },
    { id: 'sk-dp-3', name: 'Fourth Wall Glitch', description: 'Walks outside the comic panels to dodge incoming attacks.', cost: 10, icon: '📺', bonusPower: 8, triggerRate: 0.55, effectType: 'speed_evasion' },
    { id: 'sk-dp-4', name: 'Bottomless Bag of Guns', description: 'Pulls out an absurd oversized rocket launcher for bonus firepower.', cost: 9, icon: '💣', bonusPower: 9, triggerRate: 0.5, effectType: 'attack' },
    { id: 'sk-dp-5', name: 'Deadpool Maximum Effort', description: 'Chaotic acrobatic bullet barrage dealing unpredictable critical devastation.', cost: 13, icon: '💥', bonusPower: 12, triggerRate: 0.45, effectType: 'critical' }
  ]
};

// Procedural dynamic skill generator for all 301 characters based on lore, archetype & powers
export function getSkillsForCharacter(char: Character): CharacterSkill[] {
  if (ICONIC_CHARACTER_SKILLS[char.id]) {
    return ICONIC_CHARACTER_SKILLS[char.id];
  }

  const name = char.name;
  const isMythic = char.grade === 'MYTHIC';
  const isA = char.grade === 'A';
  const isB = char.grade === 'B';

  const baseCost = isMythic ? 10 : isA ? 8 : isB ? 7 : 6;
  const pwrTier = isMythic ? 4 : isA ? 3 : isB ? 2 : 1;

  // Extract first ability name or build thematic skill names
  const ab1 = char.specialAbilities?.[0]?.name || `${name} Strike`;
  const ab2 = char.specialAbilities?.[1]?.name || `${name} Defense`;

  return [
    {
      id: `sk-${char.id}-1`,
      name: `${ab1} Mastery`,
      description: `Channels signature offensive prowess for a heightened strike.`,
      cost: baseCost,
      icon: '⚔️',
      bonusPower: 6 + pwrTier,
      triggerRate: 0.6,
      effectType: 'attack'
    },
    {
      id: `sk-${char.id}-2`,
      name: `${name} Kinetic Ward`,
      description: `Erects a protective kinetic aura absorbing incoming damage.`,
      cost: baseCost + 2,
      icon: '🛡️',
      bonusPower: 5 + pwrTier,
      triggerRate: 0.5,
      effectType: 'shield'
    },
    {
      id: `sk-${char.id}-3`,
      name: `${name} Acrobatic Evasion`,
      description: `Performs fluid evasive maneuvers to dodge enemy offensive bursts.`,
      cost: baseCost + 3,
      icon: '⚡',
      bonusPower: 6 + pwrTier,
      triggerRate: 0.55,
      effectType: 'speed_evasion'
    },
    {
      id: `sk-${char.id}-4`,
      name: `${ab2 || `${name} Vitality Surge`}`,
      description: `Recovers combat vitality and siphons opponent stamina.`,
      cost: baseCost + 4,
      icon: '💉',
      bonusPower: 6 + pwrTier,
      triggerRate: 0.5,
      effectType: 'lifesteal'
    },
    {
      id: `sk-${char.id}-5`,
      name: `Prime ${name} Overdrive`,
      description: `Unleashes maximum unlocked potential for a devastating critical blow.`,
      cost: Math.min(15, baseCost + 6),
      icon: '💥',
      bonusPower: 10 + pwrTier,
      triggerRate: 0.4,
      effectType: 'critical'
    }
  ];
}

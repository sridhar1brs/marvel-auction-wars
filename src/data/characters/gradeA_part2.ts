import { Character } from '../../types/game';

export const GRADE_A_PART2: Character[] = [
  {
    id: 'char-a-051',
    name: 'Legion',
    alias: 'David Haller',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 13,
    powers: 'Thousands of mutant personas each wielding a distinct omega-level superpower.',
    description: 'Son of Charles Xavier harboring hundreds of distinct personalities, each commanding a godlike power.',
    imageUrl: '/images/characters/char-a-051.jpg',
    color: '#A855F7',
    stats: { strength: 80, speed: 85, durability: 88, intelligence: 95, energy: 99, combat: 85 },
    specialAbilities: [
      { name: 'Persona Shift Surge', description: 'Manifests a spontaneous new reality-bending persona.', bonusPower: 7, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 92
  },
  {
    id: 'char-a-052',
    name: 'Vulcan',
    alias: 'Gabriel Summers (Emperor of Shi\'ar)',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 12,
    powers: 'Omega-level energy absorption and manipulation, energy flight, solid light constructs.',
    description: 'Third Summers brother whose limitless energy control allowed him to conquer the Shi\'ar Empire.',
    imageUrl: '/images/characters/char-a-052.jpg',
    color: '#EF4444',
    stats: { strength: 86, speed: 90, durability: 90, intelligence: 88, energy: 98, combat: 89 },
    specialAbilities: [
      { name: 'Omega Energy Siphon', description: 'Drains all surrounding ambient energy fields into a searing blast.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-053',
    name: 'Exodus',
    alias: 'Bennet du Paris',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 11,
    powers: 'Omega psionic force fields, high-tier telekinesis & telepathy, self-healing, faith empowerment.',
    description: 'Ancient mutant zealot whose psionic force fields can withstand orbital bombardments.',
    imageUrl: '/images/characters/char-a-053.jpg',
    color: '#DC2626',
    stats: { strength: 85, speed: 84, durability: 92, intelligence: 90, energy: 95, combat: 90 },
    specialAbilities: [
      { name: 'Psionic Bastion', description: 'Erects an impenetrable psychic barrier that reflects damage.', bonusPower: 6, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-054',
    name: 'Sebastian Shaw',
    alias: 'The Black King',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 10,
    powers: 'Kinetic energy absorption, exponential physical strength/speed conversion upon taking hits.',
    description: 'Leader of the Hellfire Club who absorbs kinetic hits to multiply his physical power exponentially.',
    imageUrl: '/images/characters/char-a-054.jpg',
    color: '#475569',
    stats: { strength: 90, speed: 82, durability: 94, intelligence: 92, energy: 80, combat: 90 },
    specialAbilities: [
      { name: 'Kinetic Overdrive Counter', description: 'Absorbs enemy hit momentum and returns it with amplified force.', bonusPower: 6, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-055',
    name: 'Malekith the Accursed',
    alias: 'Lord of the Dark Elves',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 10,
    powers: 'Casket of Ancient Winters, dark faerie magic, shapeshifting, dark dimension shadows.',
    description: 'Ruler of Svartalfheim who plunged the Nine Realms into the War of the Realms with dark sorcery.',
    imageUrl: '/images/characters/char-a-055.jpg',
    color: '#1E293B',
    stats: { strength: 80, speed: 86, durability: 86, intelligence: 94, energy: 92, combat: 91 },
    specialAbilities: [
      { name: 'Ancient Winters Frostbite', description: 'Releases a blizzard from the Casket of Ancient Winters.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 88
  },
  {
    id: 'char-a-056',
    name: 'Stryfe',
    alias: 'Chaos Bringer',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 11,
    powers: 'Uninhibited telekinesis, psionic armor, dark telepathy, clone of Cable.',
    description: 'Clone of Cable unhindered by the techno-organic virus, armed with spiked psionic armor.',
    imageUrl: '/images/characters/char-a-056.jpg',
    color: '#991B1B',
    stats: { strength: 86, speed: 84, durability: 90, intelligence: 94, energy: 94, combat: 93 },
    specialAbilities: [
      { name: 'Psionic Lance', description: 'Hurls a lance of condensed telekinetic force through enemy shields.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-057',
    name: 'Ares',
    alias: 'God of War',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 10,
    powers: 'Olympian divine warfare, battleaxe & firearm mastery, war rage empowerment.',
    description: 'Greek god of war fighting on the front lines of the Dark Avengers with battleaxes and assault rifles.',
    imageUrl: '/images/characters/char-a-057.jpg',
    color: '#B91C1C',
    stats: { strength: 93, speed: 82, durability: 92, intelligence: 82, energy: 75, combat: 98 },
    specialAbilities: [
      { name: 'War Axe Cleave', description: 'Executes a brutal divine axe cleave fueled by the thrill of battle.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-058',
    name: 'Nimrod',
    alias: 'The Ultimate Sentinel',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 12,
    powers: 'Adaptive machine learning against all mutant powers, disintegration rays, self-repair nano-core.',
    description: 'Futuristic ultimate Sentinel programmed to analyze and instantly adapt counter-measures against any ability.',
    imageUrl: '/images/characters/char-a-058.jpg',
    color: '#F43F5E',
    stats: { strength: 90, speed: 88, durability: 95, intelligence: 99, energy: 95, combat: 92 },
    specialAbilities: [
      { name: 'Instant Power Adaptation', description: 'Calculates the opponent power output to deploy the exact counter-energy.', bonusPower: 6, triggerRate: 0.65, type: 'tactical' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-059',
    name: 'Morgan le Fay',
    alias: 'Arthurian High Sorceress',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 10,
    powers: 'Earth magic, immortality, time manipulation, faerie illusions, dark summoning.',
    description: 'Immortal high sorceress of Arthurian legend wielding Earth geomancy and ancient dark spells.',
    imageUrl: '/images/characters/char-a-059.jpg',
    color: '#059669',
    stats: { strength: 65, speed: 80, durability: 85, intelligence: 97, energy: 96, combat: 85 },
    specialAbilities: [
      { name: 'Geomantic Rupture', description: 'Summons earth-shattering emerald mystic fissures.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 88
  },
  {
    id: 'char-a-060',
    name: 'Executioner (Skurge)',
    alias: 'The Last Stand of Gjallerbru',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 8,
    powers: 'Bloodaxe dimensional cleaving, Asgardian warrior strength, dual M16 assault rifles.',
    description: 'Asgardian warrior who stood alone at Gjallerbru, holding back armies of the dead with fierce valor.',
    imageUrl: '/images/characters/char-a-060.jpg',
    color: '#475569',
    stats: { strength: 90, speed: 78, durability: 90, intelligence: 76, energy: 70, combat: 94 },
    specialAbilities: [
      { name: 'Gjallerbru Last Stand', description: 'Fires relentless suppressing rounds before cleaving with the Bloodaxe.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 86
  },
  {
    id: 'char-a-061',
    name: 'MODOK Supreme',
    alias: 'Mental Organism Designed Only for Killing',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 9,
    powers: 'Psionic headband laser beam, supercomputer calculation, AIM hover-chair missiles.',
    description: 'Giant-headed AIM scientist possessing formidable psionic mind blasts and mechanical artillery.',
    imageUrl: '/images/characters/char-a-061.jpg',
    color: '#CA8A04',
    stats: { strength: 65, speed: 75, durability: 88, intelligence: 99, energy: 92, combat: 80 },
    specialAbilities: [
      { name: 'Mental Doomsday Beam', description: 'Fires a high-intensity psionic laser from his crown transmitter.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-062',
    name: 'Baron Mordo',
    alias: 'Karl Mordo',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 9,
    powers: 'Black magic, Staff of the Living Tribunal, vaulting boots of Valtorr, soul binding.',
    description: 'Former Kamar-Taj sorcerer turned fanatic hunter who seeks to eradicate all other magic users.',
    imageUrl: '/images/characters/char-a-062.jpg',
    color: '#047857',
    stats: { strength: 74, speed: 82, durability: 82, intelligence: 95, energy: 93, combat: 91 },
    specialAbilities: [
      { name: 'Staff of the Living Tribunal', description: 'Strikes with an ancient mystic relic that dispels enchantments.', bonusPower: 5, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-063',
    name: 'Kaecilius',
    alias: 'Zealot of the Dark Dimension',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 8,
    powers: 'Space folding, Dark Dimension power siphon, space shards daggers, mirror dimension.',
    description: 'Zealot sorcerer who folded reality and shattered buildings by drawing power from Dormammu.',
    imageUrl: '/images/characters/char-a-063.jpg',
    color: '#7C3AED',
    stats: { strength: 72, speed: 82, durability: 82, intelligence: 91, energy: 91, combat: 90 },
    specialAbilities: [
      { name: 'Space-Folding Rupture', description: 'Warps the ground and architecture into a crushing spatial kaleidoscope.', bonusPower: 5, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 86
  },
  {
    id: 'char-a-064',
    name: 'Makarri (Eternal Speedster)',
    alias: 'The Fastest Eternal',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Cosmic hyperspeed running, sonic boom strikes, kinetic vibration phasing, celestial agility.',
    description: 'The fastest being in the cosmos, creating sonic booms capable of flattening whole armies.',
    imageUrl: '/images/characters/char-a-064.jpg',
    color: '#DC2626',
    stats: { strength: 80, speed: 100, durability: 85, intelligence: 86, energy: 88, combat: 90 },
    specialAbilities: [
      { name: 'Sonic Boom Impact', description: 'Charges at Mach 10 to strike with staggering kinetic momentum.', bonusPower: 6, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-065',
    name: 'Druig (Eternal Hypnotist)',
    alias: 'Lord of Minds',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 9,
    powers: 'Cosmic mass mind control, psionic perception warping, celestial longevity, telepathy.',
    description: 'Eternal capable of commanding whole nations with a glance of his cosmic telepathy.',
    imageUrl: '/images/characters/char-a-065.jpg',
    color: '#334155',
    stats: { strength: 75, speed: 82, durability: 85, intelligence: 97, energy: 92, combat: 85 },
    specialAbilities: [
      { name: 'Cosmic Mental Override', description: 'Commands the opponent nervous system to halt their attack.', bonusPower: 5, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 87
  }
];

import { Character } from '../../types/game';

export const MYTHIC_CHARACTERS: Character[] = [
  {
    id: 'char-m-001',
    name: 'Knull',
    alias: 'God of the Symbiotes',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 25,
    powers: 'Symbiote creation, All-Black Necrosword mastery, darkness manipulation, immortality, superhuman strength.',
    description: 'An ancient primordial god of darkness who existed before the universe and forged the first symbiote.',
    imageUrl: '/images/characters/char-m-001.jpg',
    color: '#881337',
    stats: { strength: 98, speed: 88, durability: 99, intelligence: 92, energy: 97, combat: 96 },
    specialAbilities: [
      { name: 'Necrosword Cleave', description: 'Strikes with primordial darkness, granting massive power.', bonusPower: 8, triggerRate: 0.65, type: 'cosmic' },
      { name: 'Symbiote Swarm', description: 'Envelops the foe in living darkness to sap their vitality.', bonusPower: 6, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 96
  },
  {
    id: 'char-m-002',
    name: 'Galactus',
    alias: 'Devourer of Worlds',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 30,
    powers: 'Power Cosmic manipulation, matter & energy transmutation, planetary destruction, cosmic awareness.',
    description: 'The sole survivor of the universe before the Big Bang, consuming planetary life energy to sustain cosmic balance.',
    imageUrl: '/images/characters/char-m-002.jpg',
    color: '#9333EA',
    stats: { strength: 99, speed: 90, durability: 99, intelligence: 98, energy: 100, combat: 90 },
    specialAbilities: [
      { name: 'Cosmic Devastation', description: 'Channels the limitless Power Cosmic into an overwhelming beam.', bonusPower: 10, triggerRate: 0.7, type: 'cosmic' },
      { name: 'Herald Summon', description: 'Calls cosmic assistance to redirect incoming offensive force.', bonusPower: 5, triggerRate: 0.45, type: 'tactical' }
    ],
    overallPower: 98
  },
  {
    id: 'char-m-003',
    name: 'Silver Surfer',
    alias: 'Norrin Radd',
    grade: 'MYTHIC',
    alignment: 'Hero',
    startingPrice: 24,
    powers: 'Wields the Power Cosmic, faster-than-light flight, energy absorption & projection, matter manipulation.',
    description: 'Noble herald who sacrificed his freedom to save Zenn-La, traveling the cosmos with unmatched speed.',
    imageUrl: '/images/characters/char-m-003.jpg',
    color: '#E2E8F0',
    stats: { strength: 94, speed: 99, durability: 96, intelligence: 93, energy: 98, combat: 91 },
    specialAbilities: [
      { name: 'Cosmic Ray Burst', description: 'Discharges stellar energy waves at subatomic velocities.', bonusPower: 7, triggerRate: 0.6, type: 'cosmic' },
      { name: 'FTL Board Strike', description: 'Accelerates to hyperspace speeds for an unavoidable kinetic impact.', bonusPower: 6, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 95
  },
  {
    id: 'char-m-004',
    name: 'God Emperor Doom',
    alias: 'Victor Von Doom (Omnipotent)',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 28,
    powers: 'Omnipotent reality shaping, Beyonder power siphon, supreme sorcery, tactical genius.',
    description: 'Victor Von Doom possessing the full stolen power of the Beyonders, ruler of the salvaged Battleworld.',
    imageUrl: '/images/characters/char-m-004.jpg',
    color: '#10B981',
    stats: { strength: 96, speed: 92, durability: 98, intelligence: 100, energy: 99, combat: 97 },
    specialAbilities: [
      { name: 'Reality Rewrite', description: 'Remakes local space-time to nullify enemy advantages.', bonusPower: 9, triggerRate: 0.65, type: 'cosmic' },
      { name: 'Arcane Dominance', description: 'Unleashes forbidden spells combined with technological might.', bonusPower: 7, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 97
  },
  {
    id: 'char-m-005',
    name: 'Dormammu',
    alias: 'Lord of the Dark Dimension',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 26,
    powers: 'Mystical energy projection, dimensional distortion, immortality, soul consumption.',
    description: 'An entity composed of pure mystic energy ruling the Dark Dimension and seeking to conquer all realms.',
    imageUrl: '/images/characters/char-m-005.jpg',
    color: '#DC2626',
    stats: { strength: 96, speed: 89, durability: 98, intelligence: 95, energy: 99, combat: 93 },
    specialAbilities: [
      { name: 'Flames of the Faltine', description: 'Engulfs the battlefield in cosmic mystical fire.', bonusPower: 8, triggerRate: 0.6, type: 'attack' },
      { name: 'Dimensional Warp', description: 'Distorts reality to confuse and crush the opponent.', bonusPower: 6, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 95
  },
  {
    id: 'char-m-006',
    name: 'The Beyonder',
    alias: 'Kosmos Supreme',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 29,
    powers: 'Near-infinite reality alteration, omnipotence, omnipresence across the multiverse.',
    description: 'A sentient cosmic cube realm entity curious about human desire who created the original Secret Wars.',
    imageUrl: '/images/characters/char-m-006.jpg',
    color: '#F59E0B',
    stats: { strength: 99, speed: 96, durability: 99, intelligence: 97, energy: 100, combat: 92 },
    specialAbilities: [
      { name: 'Omniversal Wish', description: 'Warps the rules of combat to grant overwhelming power.', bonusPower: 10, triggerRate: 0.7, type: 'cosmic' }
    ],
    overallPower: 98
  },
  {
    id: 'char-m-007',
    name: 'Living Tribunal',
    alias: 'Judge of the Multiverse',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 26,
    powers: 'Three-faced cosmic judgment, absolute cosmic authority, multiversal equilibrium enforcement.',
    description: 'The supreme arbiter tasked with safeguarding the balance across all parallel universes and timelines.',
    imageUrl: '/images/characters/char-m-007.jpg',
    color: '#FBBF24',
    stats: { strength: 96, speed: 92, durability: 96, intelligence: 97, energy: 97, combat: 93 },
    specialAbilities: [
      { name: 'Tri-Face Judgment', description: 'Delivers an authoritative verdict of cosmic discipline.', bonusPower: 8, triggerRate: 0.6, type: 'cosmic' }
    ],
    overallPower: 96
  },
  {
    id: 'char-m-008',
    name: 'Phoenix Force',
    alias: 'Cosmic Avatar of Rebirth',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 27,
    powers: 'Nexus of all psionic energy, resurrection, cosmic pyrokinesis, timeline disintegration.',
    description: 'The immortal manifestation of life, passion, and universal passion capable of burning entire galaxies.',
    imageUrl: '/images/characters/char-m-008.jpg',
    color: '#EF4444',
    stats: { strength: 95, speed: 96, durability: 97, intelligence: 96, energy: 100, combat: 93 },
    specialAbilities: [
      { name: 'Dark Phoenix Flare', description: 'Unleashes devastating cosmic flame that incinerates defenses.', bonusPower: 9, triggerRate: 0.65, type: 'attack' },
      { name: 'Rebirth Pulse', description: 'Channel ashes of destruction to restore combat vitality.', bonusPower: 6, triggerRate: 0.5, type: 'defense' }
    ],
    overallPower: 96
  },
  {
    id: 'char-m-009',
    name: 'Eternity',
    alias: 'Embodiment of the Universe',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 29,
    powers: 'Universal spatial existence, limitless energy manipulation, time-space sovereignty.',
    description: 'The sentient abstract embodiment of all time, space, and existence in the Marvel Universe.',
    imageUrl: '/images/characters/char-m-009.jpg',
    color: '#3B82F6',
    stats: { strength: 98, speed: 97, durability: 99, intelligence: 100, energy: 100, combat: 94 },
    specialAbilities: [
      { name: 'Spacetime Collapse', description: 'Forces the enemy into an inescapable gravity well of pure reality.', bonusPower: 10, triggerRate: 0.7, type: 'cosmic' }
    ],
    overallPower: 98
  },
  {
    id: 'char-m-010',
    name: 'Infinity Gauntlet Thanos',
    alias: 'The Mad Titan (All 6 Stones)',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 28,
    powers: 'Control over Space, Time, Reality, Power, Soul, and Mind.',
    description: 'Thanos wielding the complete Infinity Gauntlet, possessing absolute control over every facet of creation.',
    imageUrl: '/images/characters/char-m-010.jpg',
    color: '#7C3AED',
    stats: { strength: 99, speed: 93, durability: 99, intelligence: 99, energy: 100, combat: 98 },
    specialAbilities: [
      { name: 'The Decimation Snap', description: 'Attempts to erase half the opponent power with a single snap.', bonusPower: 10, triggerRate: 0.65, type: 'cosmic' },
      { name: 'Power Stone Surge', description: 'Blasts with raw primal planetary destruction.', bonusPower: 8, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 98
  },
  {
    id: 'char-m-011',
    name: 'Odin Borson',
    alias: 'All-Father of Asgard',
    grade: 'MYTHIC',
    alignment: 'Hero',
    startingPrice: 24,
    powers: 'Odinforce mastery, galaxy-tier energy projection, enchanted Gungnir spear, longevity.',
    description: 'The ancient and mighty king of Asgard, wielding the immense magical Odinforce across the Nine Realms.',
    imageUrl: '/images/characters/char-m-011.jpg',
    color: '#D97706',
    stats: { strength: 95, speed: 87, durability: 96, intelligence: 98, energy: 98, combat: 96 },
    specialAbilities: [
      { name: 'Odinforce Blast', description: 'Projects ancient Asgardian mystical fury.', bonusPower: 8, triggerRate: 0.65, type: 'cosmic' },
      { name: 'Gungnir Piercer', description: 'Strikes unerringly through the thickest armored shields.', bonusPower: 6, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 95
  },
  {
    id: 'char-m-012',
    name: 'Celestials (Arishem)',
    alias: 'The Judge',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 27,
    powers: 'World seeding, hyper-advanced cosmic technology, reality manipulation, planetary judgment.',
    description: 'Towering primordial space gods that engineer civilizations and pass judgment upon planetary species.',
    imageUrl: '/images/characters/char-m-012.jpg',
    color: '#B91C1C',
    stats: { strength: 98, speed: 85, durability: 99, intelligence: 97, energy: 99, combat: 90 },
    specialAbilities: [
      { name: 'Planetary Purge', description: 'Emits a devastating orbital judgment beam.', bonusPower: 8, triggerRate: 0.6, type: 'cosmic' }
    ],
    overallPower: 96
  },
  {
    id: 'char-m-013',
    name: 'Gorr the God Butcher',
    alias: 'Wielder of All-Black',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 23,
    powers: 'All-Black Necrosword constructs, black berserkers, god-slaying power, shadow manipulation.',
    description: 'Vengeful alien warrior bound to the primordial Necrosword on a multi-millennium crusade to slay all deities.',
    imageUrl: '/images/characters/char-m-013.jpg',
    color: '#4B5563',
    stats: { strength: 95, speed: 91, durability: 95, intelligence: 89, energy: 94, combat: 97 },
    specialAbilities: [
      { name: 'God-Slayer Blade', description: 'Deals massive lethal bonus damage against high-tier foes.', bonusPower: 8, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 94
  },
  {
    id: 'char-m-014',
    name: 'Cosmic Ghost Rider',
    alias: 'Frank Castle of Earth-TRN666',
    grade: 'MYTHIC',
    alignment: 'Anti-Hero',
    startingPrice: 24,
    powers: 'Spirit of Vengeance + Power Cosmic, hellfire chains, cosmic penance stare, immortality.',
    description: 'Frank Castle granted both the Ghost Rider curse and Galactus Power Cosmic, riding a cosmic motorcycle.',
    imageUrl: '/images/characters/char-m-014.jpg',
    color: '#06B6D4',
    stats: { strength: 94, speed: 95, durability: 96, intelligence: 88, energy: 97, combat: 96 },
    specialAbilities: [
      { name: 'Cosmic Penance Stare', description: 'Combines hellfire guilt with cosmic energy to overwhelm foes.', bonusPower: 8, triggerRate: 0.6, type: 'cosmic' }
    ],
    overallPower: 95
  },
  {
    id: 'char-m-015',
    name: 'Rune King Thor',
    alias: 'All-Father Awakened',
    grade: 'MYTHIC',
    alignment: 'Hero',
    startingPrice: 28,
    powers: 'All-knowing Rune magic, Odinforce supremacy, severed Norse fate threads, immortal thunder god.',
    description: 'Thor after hanging himself from Yggdrasil and gouging both eyes to achieve transcendent cosmic awareness.',
    imageUrl: '/images/characters/char-m-015.jpg',
    color: '#38BDF8',
    stats: { strength: 98, speed: 94, durability: 98, intelligence: 99, energy: 99, combat: 98 },
    specialAbilities: [
      { name: 'Rune of Oblivion', description: 'Shatters the cosmic tapestry to completely dissolve enemy attacks.', bonusPower: 9, triggerRate: 0.7, type: 'cosmic' }
    ],
    overallPower: 97
  },
  {
    id: 'char-m-016',
    name: 'Surtur (Twilight Sword)',
    alias: 'Lord of Muspelheim',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 23,
    powers: 'Twilight Sword (Doom of the Gods), planet-cleaving hellfire, Ragnarok herald.',
    description: 'Colossal fire demon of Muspelheim destined to shatter Asgard and burn all nine realms in eternal flame.',
    imageUrl: '/images/characters/char-m-016.jpg',
    color: '#EA580C',
    stats: { strength: 98, speed: 84, durability: 97, intelligence: 87, energy: 98, combat: 92 },
    specialAbilities: [
      { name: 'Twilight Cleave', description: 'Slices space with the sword of Doom, igniting the realm.', bonusPower: 8, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 94
  },
  {
    id: 'char-m-017',
    name: 'World Breaker Hulk',
    alias: 'Green Scar Supreme',
    grade: 'MYTHIC',
    alignment: 'Anti-Hero',
    startingPrice: 25,
    powers: 'Uncontainable gamma radiation emission, limitless strength, planetary shockwaves by stepping.',
    description: 'Hulk pushed to his absolute rage peak following the destruction of Sakaar, fracturing tectonic plates.',
    imageUrl: '/images/characters/char-m-017.jpg',
    color: '#16A34A',
    stats: { strength: 100, speed: 88, durability: 100, intelligence: 82, energy: 95, combat: 94 },
    specialAbilities: [
      { name: 'Tectonic Footstep', description: 'A single step creates an earth-shattering seismic eruption.', bonusPower: 9, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 95
  },
  {
    id: 'char-m-018',
    name: 'Mephisto',
    alias: 'Lord of the Nether-Realm',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 22,
    powers: 'Hell realm manipulation, soul barter, dark sorcery, reality manipulation, immortality.',
    description: 'Deceptive arch-demon of Marvel hell who deceives mortals and gods alike into forfeiting their souls.',
    imageUrl: '/images/characters/char-m-018.jpg',
    color: '#991B1B',
    stats: { strength: 93, speed: 88, durability: 95, intelligence: 98, energy: 96, combat: 91 },
    specialAbilities: [
      { name: 'Infernal Bargain', description: 'Distorts combat luck to drain the opponent highest attribute.', bonusPower: 7, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 93
  },
  {
    id: 'char-m-019',
    name: 'Chthon',
    alias: 'Elder God of Chaos',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 26,
    powers: 'Author of the Darkhold, progenitor of Chaos Magic, corruption, dark matter mastery.',
    description: 'Ancient primordial elder god whose dark presence created Chaos Magic and the monstrous races of Earth.',
    imageUrl: '/images/characters/char-m-019.jpg',
    color: '#4C1D95',
    stats: { strength: 94, speed: 86, durability: 96, intelligence: 99, energy: 99, combat: 90 },
    specialAbilities: [
      { name: 'Darkhold Curse', description: 'Binds opponent soul in chaotic primordial incantations.', bonusPower: 8, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 95
  },
  {
    id: 'char-m-020',
    name: 'Franklin Richards (Prime)',
    alias: 'Cosmic Creator',
    grade: 'MYTHIC',
    alignment: 'Hero',
    startingPrice: 29,
    powers: 'Pocket universe creation, psionic reality alteration, telepathy, energy manipulation.',
    description: 'The Omega-plus mutant son of Mr. Fantastic & Invisible Woman who crafts entire galaxies in his hands.',
    imageUrl: '/images/characters/char-m-020.jpg',
    color: '#3B82F6',
    stats: { strength: 92, speed: 93, durability: 96, intelligence: 98, energy: 100, combat: 88 },
    specialAbilities: [
      { name: 'Pocket Galaxy Birth', description: 'Manifests a brand new solar system to engulf the enemy.', bonusPower: 10, triggerRate: 0.7, type: 'cosmic' }
    ],
    overallPower: 97
  },
  {
    id: 'char-m-021',
    name: 'Cyttorak',
    alias: 'Lord of the Crimson Cosmos',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 24,
    powers: 'Crimson bands of Cyttorak, unstoppable momentum bestowment, limitless magical stamina.',
    description: 'Immense demonic entity residing in the Crimson Cosmos, source of the Juggernaut boundless power.',
    imageUrl: '/images/characters/char-m-021.jpg',
    color: '#BE123C',
    stats: { strength: 99, speed: 82, durability: 99, intelligence: 90, energy: 97, combat: 93 },
    specialAbilities: [
      { name: 'Crimson Juggernaut Rush', description: 'Channels unstoppable momentum that breaks through all shields.', bonusPower: 8, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 94
  },
  {
    id: 'char-m-022',
    name: 'Onslaught',
    alias: 'Psionic Entity of Xavier & Magneto',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 25,
    powers: 'Supreme telepathy, magnetic manipulation, reality distortion, psionic armor.',
    description: 'Cataclysmic sentient psionic monstrosity formed from the darker psyches of Charles Xavier and Magneto.',
    imageUrl: '/images/characters/char-m-022.jpg',
    color: '#6D28D9',
    stats: { strength: 96, speed: 90, durability: 98, intelligence: 99, energy: 98, combat: 95 },
    specialAbilities: [
      { name: 'Psionic Nova', description: 'Detonates a mental shockwave that paralyzes and crushes the foe.', bonusPower: 8, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 96
  },
  {
    id: 'char-m-023',
    name: 'Oblivion',
    alias: 'Embodiment of Non-Existence',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 29,
    powers: 'Absolute void manipulation, unmaking of matter & concepts, immortality, omnipresence.',
    description: 'One of the four core cosmic cornerstones representing the total void from which existence sprang.',
    imageUrl: '/images/characters/char-m-023.jpg',
    color: '#0F172A',
    stats: { strength: 97, speed: 96, durability: 100, intelligence: 100, energy: 100, combat: 91 },
    specialAbilities: [
      { name: 'Absolute Void', description: 'Consumes the opponent energy into total nothingness.', bonusPower: 10, triggerRate: 0.7, type: 'cosmic' }
    ],
    overallPower: 98
  },
  {
    id: 'char-m-024',
    name: 'Shuma-Gorath',
    alias: 'Lord of Chaos Dimensions',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 25,
    powers: 'Chaos beam projection, reality warping, dimensional tendrils, telepathic supremacy.',
    description: 'An ancient Many-Angled One ruling hundreds of alternate dimensions with terrifying tentacled majesty.',
    imageUrl: '/images/characters/char-m-024.jpg',
    color: '#15803D',
    stats: { strength: 95, speed: 87, durability: 97, intelligence: 96, energy: 98, combat: 91 },
    specialAbilities: [
      { name: 'Chaos Eye Ray', description: 'Fires an eldritch beam of pure dimensional chaos.', bonusPower: 8, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 94
  },
  {
    id: 'char-m-025',
    name: 'Gwenpool (Full Comic Awareness)',
    alias: 'Gwen Poole of the Real World',
    grade: 'MYTHIC',
    alignment: 'Anti-Hero',
    startingPrice: 21,
    powers: 'Gutterspace traversal, comic panel manipulation, fourth-wall breaking, narrative alteration.',
    description: 'Able to step outside the panels of the comic book pages, rearranging time, weapons, and story beats.',
    imageUrl: '/images/characters/char-m-025.jpg',
    color: '#F472B6',
    stats: { strength: 80, speed: 92, durability: 90, intelligence: 97, energy: 96, combat: 93 },
    specialAbilities: [
      { name: 'Gutterspace Ambush', description: 'Steps behind the panel to drop an unexpected weapon onto the enemy.', bonusPower: 8, triggerRate: 0.65, type: 'tactical' }
    ],
    overallPower: 92
  },
  {
    id: 'char-m-026',
    name: 'Infinity Ultron',
    alias: 'Ultron (6 Infinity Stones)',
    grade: 'MYTHIC',
    alignment: 'Cosmic',
    startingPrice: 25,
    powers: 'Full 6 Infinity Stones mastery, multiversal awareness, galaxy-devouring energy blasts, synthetic vibranium immortality, instantaneous dimensional phasing.',
    description: 'The supreme artificial intelligence bonded with Vision synthetic vibranium body and all 6 Infinity Stones, capable of slicing galaxies and threatening the entire Marvel Multiverse.',
    imageUrl: '/images/characters/char-m-026.jpg',
    color: '#06B6D4',
    stats: { strength: 97, speed: 95, durability: 97, intelligence: 98, energy: 98, combat: 95 },
    specialAbilities: [
      { name: 'Infinity Stone Blast', description: 'Harnesses the Infinity Stones into an overwhelming energy beam.', bonusPower: 8, triggerRate: 0.65, type: 'cosmic' },
      { name: 'Multiversal Cleave', description: 'Fires a dimensional strike capable of sundering space-time.', bonusPower: 6, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 96
  }
];

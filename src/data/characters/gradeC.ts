import { Character } from '../../types/game';

export const GRADE_C_CHARACTERS: Character[] = [
  {
    id: 'char-c-001',
    name: 'Hawkeye',
    alias: 'Clint Barton',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Master archer, trick arrows (explosive, sonic, grapple, EMP), tactical marksmanship.',
    description: 'World greatest marksman whose specialized trick arrows hit targets from impossible distances.',
    imageUrl: '/images/characters/char-c-001.jpg',
    color: '#7C3AED',
    stats: { strength: 60, speed: 74, durability: 68, intelligence: 82, energy: 40, combat: 88 },
    specialAbilities: [
      { name: 'Trick Arrow Barrage', description: 'Fires 3 trick arrows that detonate simultaneously.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-002',
    name: 'Black Widow',
    alias: 'Natasha Romanoff',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Red Room master assassin, Widow Bite electro-gauntlets, espionage, acrobatic martial arts.',
    description: 'Deadly Red Room operative turned Avenger specializing in espionage and close-quarters takedowns.',
    imageUrl: '/images/characters/char-c-002.jpg',
    color: '#DC2626',
    stats: { strength: 62, speed: 78, durability: 68, intelligence: 88, energy: 45, combat: 93 },
    specialAbilities: [
      { name: 'Widow Bite Shock', description: 'Delivers a 30,000-volt electro-shock from her wrist gauntlets.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 77
  },
  {
    id: 'char-c-003',
    name: 'Kate Bishop',
    alias: 'Hawkeye II',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Prodigy archery, trick arrows, fencing, martial arts gymnastics.',
    description: 'Charming young archer mentored by Clint Barton wielding custom high-velocity trick arrows.',
    imageUrl: '/images/characters/char-c-003.jpg',
    color: '#9333EA',
    stats: { strength: 58, speed: 74, durability: 65, intelligence: 80, energy: 35, combat: 84 },
    specialAbilities: [
      { name: 'Pym Particle Trick Arrow', description: 'Fires an arrow that shrinks obstacles or multiplies impacts.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-004',
    name: 'Yelena Belova',
    alias: 'White Widow',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Red Room conditioning, dual batons, tactical knives, stealth assassination.',
    description: 'Fierce and witty Red Room assassin fighting with elite tactical knives and grapples.',
    imageUrl: '/images/characters/char-c-004.jpg',
    color: '#E2E8F0',
    stats: { strength: 62, speed: 76, durability: 68, intelligence: 84, energy: 35, combat: 91 },
    specialAbilities: [
      { name: 'Baton Scissor Takedown', description: 'Locks enemy limbs in an acrobatic takedown maneuver.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-005',
    name: 'Red Guardian',
    alias: 'Alexei Shostakov',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Soviet super-soldier serum, heavy red shield, heavyweight boxing brute force.',
    description: 'Soviet counterpart to Captain America possessing enhanced strength and nostalgic bravado.',
    imageUrl: '/images/characters/char-c-005.jpg',
    color: '#B91C1C',
    stats: { strength: 78, speed: 68, durability: 78, intelligence: 72, energy: 30, combat: 84 },
    specialAbilities: [
      { name: 'Soviet Shield Slam', description: 'Hurls into the opponent with his heavy Soviet shield.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-006',
    name: 'Bullseye',
    alias: 'Lester (Deadly Assassin)',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 4,
    powers: 'Flawless projectile accuracy with any object, adamantium-laced spine, throwing knives.',
    description: 'Psychopathic assassin who can turn toothpicks and paperclips into lethal projectile weapons.',
    imageUrl: '/images/characters/char-c-006.jpg',
    color: '#334155',
    stats: { strength: 66, speed: 76, durability: 74, intelligence: 82, energy: 30, combat: 92 },
    specialAbilities: [
      { name: 'Never Miss Throw', description: 'Throws a concealed blade that ricochets unerringly into a weak spot.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 77
  },
  {
    id: 'char-c-007',
    name: 'Elektra Natchios',
    alias: 'Master of the Sai',
    grade: 'C',
    alignment: 'Anti-Hero',
    startingPrice: 4,
    powers: 'Twin sai blades, Hand ninjutsu, silent infiltration, peak agility.',
    description: 'Deadly assassin trained by the Chaste and the Hand, striking with lightning-fast twin sais.',
    imageUrl: '/images/characters/char-c-007.jpg',
    color: '#DC2626',
    stats: { strength: 64, speed: 82, durability: 68, intelligence: 82, energy: 35, combat: 94 },
    specialAbilities: [
      { name: 'Twin Sai Cross Strike', description: 'Executes a lethal dual-sai cross-strike through armor openings.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 77
  },
  {
    id: 'char-c-008',
    name: 'Shocker',
    alias: 'Herman Schultz',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Vibro-shock gauntlets, padded insulating quilt suit, concussive vibrational waves.',
    description: 'Bank robber armed with thumb-triggered gauntlets that fire high-frequency vibrational blasts.',
    imageUrl: '/images/characters/char-c-008.jpg',
    color: '#CA8A04',
    stats: { strength: 64, speed: 68, durability: 72, intelligence: 80, energy: 70, combat: 72 },
    specialAbilities: [
      { name: 'Vibro-Shock Pulse', description: 'Discharges an intense concussive soundwave from twin gauntlets.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-009',
    name: 'Batroc the Leaper',
    alias: 'Georges Batroc',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Savate French kickboxing mastery, Olympic-level jumping and leg agility.',
    description: 'French mercenary and master kickboxer who can leap great heights to deliver bone-shattering kicks.',
    imageUrl: '/images/characters/char-c-009.jpg',
    color: '#B45309',
    stats: { strength: 65, speed: 76, durability: 66, intelligence: 74, energy: 25, combat: 86 },
    specialAbilities: [
      { name: 'Savate Flying Kick', description: 'Leaps across the arena delivering a heavy concussive heel kick.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-010',
    name: 'Jubilee (Standard)',
    alias: 'Jubilation Lee',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Pyrotechnic energy plasmoids (fireworks), gymnastics, rollerblade agility.',
    description: 'Young X-Man who generates multi-colored plasma sparks capable of blinding foes or blasting steel.',
    imageUrl: '/images/characters/char-c-010.jpg',
    color: '#FACC15',
    stats: { strength: 52, speed: 72, durability: 60, intelligence: 76, energy: 78, combat: 72 },
    specialAbilities: [
      { name: 'Blinding Spark Burst', description: 'Detonates a bright cluster of sparks directly in the enemy vision.', bonusPower: 3, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-011',
    name: 'Toad',
    alias: 'Mortimer Toynbee',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Prehensile 13-foot tongue, superhuman leaping, adhesive saliva secretion.',
    description: 'Brotherhood mutant possessing an elastic prehensile tongue and caustic acidic spit.',
    imageUrl: '/images/characters/char-c-011.jpg',
    color: '#65A30D',
    stats: { strength: 60, speed: 74, durability: 66, intelligence: 68, energy: 40, combat: 70 },
    specialAbilities: [
      { name: 'Prehensile Tongue Lash', description: 'Snatches the opponent weapon or disorients them with an elastic tongue.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 71
  },
  {
    id: 'char-c-012',
    name: 'Blob',
    alias: 'Fred J. Dukes',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Gravitational center-of-mass anchoring, impact-absorbing blubber, brute strength.',
    description: 'Immovable mutant who cannot be budged or injured once his feet are firmly planted.',
    imageUrl: '/images/characters/char-c-012.jpg',
    color: '#78350F',
    stats: { strength: 80, speed: 45, durability: 86, intelligence: 60, energy: 20, combat: 72 },
    specialAbilities: [
      { name: 'Immovable Belly Bounce', description: 'Absorbs an incoming blow and bounces the attacker across the room.', bonusPower: 3, triggerRate: 0.55, type: 'defense' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-013',
    name: 'Pyro',
    alias: 'St. John Allerdyce',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Flamethrower harness, pyrokinesis (fire shaping into flaming beasts), flame immunity.',
    description: 'Mutant able to shape and magnify any flame into roaring fire birds and serpents.',
    imageUrl: '/images/characters/char-c-013.jpg',
    color: '#EA580C',
    stats: { strength: 58, speed: 70, durability: 64, intelligence: 76, energy: 82, combat: 72 },
    specialAbilities: [
      { name: 'Flaming Firebird Surge', description: 'Animates a roaring bird of fire that engulfs the enemy position.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-014',
    name: 'Avalanche',
    alias: 'Dominic Petros',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Seismic wave hands, earth fissure generation, structural vibration disruption.',
    description: 'Generates powerful low-frequency seismic waves capable of fracturing asphalt and buildings.',
    imageUrl: '/images/characters/char-c-014.jpg',
    color: '#475569',
    stats: { strength: 68, speed: 64, durability: 74, intelligence: 70, energy: 78, combat: 74 },
    specialAbilities: [
      { name: 'Seismic Ground Split', description: 'Rips open a localized tremor that destabilizes enemy footing.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-015',
    name: 'Echo',
    alias: 'Maya Lopez (Ronin Legacy)',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Photographic muscle memory, master martial artist, ancestral spiritual strength.',
    description: 'Deaf martial artist capable of replicating any physical move and channeling ancestral power.',
    imageUrl: '/images/characters/char-c-015.jpg',
    color: '#BE123C',
    stats: { strength: 66, speed: 78, durability: 70, intelligence: 82, energy: 50, combat: 92 },
    specialAbilities: [
      { name: 'Ancestral Echo Strike', description: 'Channels generational spirit to land a high-impact palm strike.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-016',
    name: 'Misty Knight',
    alias: 'Daughters of the Dragon',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Stark-tech bionic arm (concussive blasts, magnetic lock), detective marksmanship.',
    description: 'Former NYPD detective equipped with a high-tech bionic arm from Tony Stark.',
    imageUrl: '/images/characters/char-c-016.jpg',
    color: '#D97706',
    stats: { strength: 74, speed: 72, durability: 74, intelligence: 86, energy: 55, combat: 86 },
    specialAbilities: [
      { name: 'Bionic Arm Overcharge', description: 'Discharges an energy blast through her cybernetic right arm.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-017',
    name: 'Colleen Wing',
    alias: 'Sword of K\'un-Lun',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Katana sword mastery, chi-focusing blade, samurai discipline, martial arts.',
    description: 'Expert swordsman proficient in bushido, capable of channeling chi into her heirloom katana.',
    imageUrl: '/images/characters/char-c-017.jpg',
    color: '#059669',
    stats: { strength: 64, speed: 80, durability: 68, intelligence: 80, energy: 60, combat: 92 },
    specialAbilities: [
      { name: 'Chi-Infused Katana Slash', description: 'Channels glowing white chi into an unsheathed blade slice.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-018',
    name: 'Jessica Jones',
    alias: 'Alias Investigations',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Superhuman physical strength, guided jumping/flight, high impact resistance, detective.',
    description: 'Private investigator possessing immense raw strength and stubborn investigative grit.',
    imageUrl: '/images/characters/char-c-018.jpg',
    color: '#475569',
    stats: { strength: 80, speed: 70, durability: 78, intelligence: 84, energy: 30, combat: 80 },
    specialAbilities: [
      { name: 'Streetwise Haymaker', description: 'Delivers an unrefined, brutal hook backed by pure super strength.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 77
  },
  {
    id: 'char-c-019',
    name: 'Stick',
    alias: 'Grandmaster of the Chaste',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Blind martial arts supremacy, bo staff combat, chi awareness, spiritual discipline.',
    description: 'Blind master who trained Daredevil and Elektra, wielding his wooden staff with lethal precision.',
    imageUrl: '/images/characters/char-c-019.jpg',
    color: '#78350F',
    stats: { strength: 62, speed: 76, durability: 68, intelligence: 88, energy: 45, combat: 96 },
    specialAbilities: [
      { name: 'Staff Pressure Strike', description: 'Strikes opponent nerve points with the tip of his wooden bo staff.', bonusPower: 3, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-020',
    name: 'Nick Fury',
    alias: 'Director of S.H.I.E.L.D.',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Espionage mastermind, tactical weapons, stealth tech, indestructible resourcefulness.',
    description: 'Legendary director of S.H.I.E.L.D. who brought together Earth Mightiest Heroes.',
    imageUrl: '/images/characters/char-c-020.jpg',
    color: '#0F172A',
    stats: { strength: 64, speed: 70, durability: 72, intelligence: 96, energy: 40, combat: 86 },
    specialAbilities: [
      { name: 'S.H.I.E.L.D. Orbital Strike', description: 'Calls in a targeted tactical weapon strike from a helicarrier.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 77
  },
  {
    id: 'char-c-021',
    name: 'Phil Coulson',
    alias: 'Agent Coulson',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Destroyer energy blaster weapon, tactical field agent, diplomatic leadership.',
    description: 'Beloved senior S.H.I.E.L.D. agent armed with prototype energy weapons reverse-engineered from Asgard.',
    imageUrl: '/images/characters/char-c-021.jpg',
    color: '#334155',
    stats: { strength: 58, speed: 64, durability: 65, intelligence: 88, energy: 65, combat: 78 },
    specialAbilities: [
      { name: 'Destroyer Rifle Shot', description: 'Fires an experimental Asgard-tech energy blast from his large rifle.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-022',
    name: 'Maria Hill',
    alias: 'Deputy Director Hill',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Dual Glock precision marksmanship, military command, tactical infiltration.',
    description: 'Former Deputy Director of S.H.I.E.L.D. with unmatched command composure and lethal aim.',
    imageUrl: '/images/characters/char-c-022.jpg',
    color: '#1E293B',
    stats: { strength: 60, speed: 72, durability: 66, intelligence: 90, energy: 30, combat: 84 },
    specialAbilities: [
      { name: 'Dual Pistol Takedown', description: 'Discharges rapid tactical double-taps at vulnerable joints.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-023',
    name: 'Peggy Carter',
    alias: 'Founder of S.H.I.E.L.D.',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'SSR field combat, espionage mastermind, hand-to-hand combat, indomitable bravery.',
    description: 'Legendary SSR agent and co-founder of S.H.I.E.L.D. whose tactical brilliance turned the tide of war.',
    imageUrl: '/images/characters/char-c-023.jpg',
    color: '#1E3A8A',
    stats: { strength: 60, speed: 70, durability: 68, intelligence: 92, energy: 30, combat: 85 },
    specialAbilities: [
      { name: 'Tactical SSR Flank', description: 'Outmaneuvers the enemy through superior battlefield positioning.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-024',
    name: 'Sharon Carter',
    alias: 'Agent 13 / Power Broker',
    grade: 'C',
    alignment: 'Anti-Hero',
    startingPrice: 3,
    powers: 'Madripoor black market network, combat knives, tactical weapons, master spy.',
    description: 'Former CIA operative turned ruthless Power Broker of Madripoor ruling the underworld.',
    imageUrl: '/images/characters/char-c-024.jpg',
    color: '#0D9488',
    stats: { strength: 60, speed: 74, durability: 66, intelligence: 88, energy: 35, combat: 85 },
    specialAbilities: [
      { name: 'Madripoor Ambush', description: 'Deploys mercenary crossfire to disorient the target.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 74
  },
    {
    "id": "char-c-025",
    "name": "Spider-Punk",
    "alias": "Hobie Brown",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 5,
    "powers": "Radioactive spider physiology, anarchic electric guitar sonic riffs, wall-crawling, spider-sense.",
    "description": "Rockstar spider-anarchist from Earth-138 wielding an electric guitar that unleashes 15,000-volt sonic feedback chords.",
    "imageUrl": '/images/characters/char-c-025.jpg',
    "color": "#DC2626",
    "stats": {
      "strength": 78,
      "speed": 88,
      "durability": 76,
      "intelligence": 82,
      "energy": 75,
      "combat": 88
    },
    "specialAbilities": [
      {
        "name": "Punk-Rock Sonic Solos",
        "description": "Blasts a 15,000-watt electric guitar power chord that shatters enemy defenses.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 80
  },
  {
    "id": "char-c-026",
    "name": "Spider-Man Noir",
    "alias": "Peter Parker (1930s)",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 4,
    "powers": "Noir spider abilities, trenchcoat dual revolvers, shadowy stealth, organic webbing.",
    "description": "Gritty 1930s Great Depression private eye wielding twin pistols and fighting mob syndicates in shadows.",
    "imageUrl": '/images/characters/char-c-026.jpg',
    "color": "#0F172A",
    "stats": {
      "strength": 76,
      "speed": 84,
      "durability": 74,
      "intelligence": 86,
      "energy": 40,
      "combat": 89
    },
    "specialAbilities": [
      {
        "name": "Noir Shadow Ambush",
        "description": "Emerges from pitch-black fog with a disorienting close-range double-tap.",
        "bonusPower": 3,
        "triggerRate": 0.55,
        "type": "tactical"
      }
    ],
    "overallPower": 79
  },
  {
    "id": "char-c-027",
    "name": "Peni Parker & SP//dr",
    "alias": "SP//dr Mech Pilot",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 4,
    "powers": "High-tech biomechanical SP//dr spider-mech, radioactive spider co-pilot, cyber-web cannons.",
    "description": "Genius teen pilot bonded psychic-link to the high-tech SP//dr armor mech with rapid web thrusters.",
    "imageUrl": '/images/characters/char-c-027.jpg',
    "color": "#EF4444",
    "stats": {
      "strength": 82,
      "speed": 80,
      "durability": 82,
      "intelligence": 92,
      "energy": 78,
      "combat": 80
    },
    "specialAbilities": [
      {
        "name": "SP//dr Plasma Web Cannon",
        "description": "Overcharges mech power cores to fire high-density electrified web cables.",
        "bonusPower": 4,
        "triggerRate": 0.5,
        "type": "attack"
      }
    ],
    "overallPower": 81
  },
  {
    "id": "char-c-028",
    "name": "Spider-Ham",
    "alias": "Peter Porker",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 4,
    "powers": "Cartoon physics distortion, giant wooden mallet from pocket dimension, anvil dropping, spider-sense.",
    "description": "Spectacular porcine web-slinger from Earth-8311 who bends reality through cartoon comedy physics.",
    "imageUrl": '/images/characters/char-c-028.jpg',
    "color": "#BE123C",
    "stats": {
      "strength": 75,
      "speed": 85,
      "durability": 88,
      "intelligence": 80,
      "energy": 70,
      "combat": 82
    },
    "specialAbilities": [
      {
        "name": "Giant Pocket Mallet",
        "description": "Pulls a massive 10-ton wooden cartoon mallet from behind his back.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 80
  },
  {
    "id": "char-c-029",
    "name": "Captain Carter",
    "alias": "Peggy Carter (Super Soldier)",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 5,
    "powers": "Super Soldier Serum, Union Jack Vibranium Shield mastery, superhuman athleticism, military leadership.",
    "description": "First Avenger of Earth-82111 infused with the Super Soldier Serum wielding the Union Jack Vibranium Shield.",
    "imageUrl": '/images/characters/char-c-029.jpg',
    "color": "#1E3A8A",
    "stats": {
      "strength": 80,
      "speed": 82,
      "durability": 80,
      "intelligence": 88,
      "energy": 35,
      "combat": 94
    },
    "specialAbilities": [
      {
        "name": "Vibranium Shield Ricochet",
        "description": "Hurls the Union Jack shield bouncing across three tactical pressure points.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 82
  },
  {
    "id": "char-c-030",
    "name": "Iron Spider",
    "alias": "Peter Parker (Nano-Tech Armor)",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 5,
    "powers": "Stark nanotech armor, 4 golden mechanical waldoes, repulsor gliding, HUD tactical AI.",
    "description": "Peter Parker equipped with Tony Stark legendary nano-tech suit featuring 4 deadly golden spider legs.",
    "imageUrl": '/images/characters/char-c-030.jpg',
    "color": "#B91C1C",
    "stats": {
      "strength": 82,
      "speed": 88,
      "durability": 84,
      "intelligence": 92,
      "energy": 80,
      "combat": 90
    },
    "specialAbilities": [
      {
        "name": "Golden Waldo Impale",
        "description": "Deploys 4 razor-sharp golden mechanical arms in a lethal multi-strike.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 84
  },
  {
    "id": "char-c-031",
    "name": "Hulkbuster Iron Man",
    "alias": "Tony Stark (Mark XLIV Heavy Armor)",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 5,
    "powers": "Titanium-alloy heavy exo-frame, hydraulic jackhammer fists, arc-reactor overdrive, satellite drop repair.",
    "description": "Massive heavy combat exosuit engineered specifically to go toe-to-toe with the Incredible Hulk.",
    "imageUrl": '/images/characters/char-c-031.jpg',
    "color": "#991B1B",
    "stats": {
      "strength": 90,
      "speed": 68,
      "durability": 92,
      "intelligence": 96,
      "energy": 88,
      "combat": 85
    },
    "specialAbilities": [
      {
        "name": "Hydraulic Jackhammer Slam",
        "description": "Powers up pneumatic fists at 200 RPM delivering consecutive armor-cracking hits.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 85
  },
  {
    "id": "char-c-032",
    "name": "Venompool",
    "alias": "Wade Wilson (Venom Symbiote)",
    "grade": "C",
    "alignment": "Anti-Hero",
    "startingPrice": 5,
    "powers": "Deadpool healing factor + Venom symbiote tendrils, dual katanas, unhinged fourth-wall chaos.",
    "description": "Lethal combination of the Venom alien symbiote and the Merc with a Mouth with tendril-wielded katanas.",
    "imageUrl": '/images/characters/char-c-032.jpg',
    "color": "#831843",
    "stats": {
      "strength": 85,
      "speed": 82,
      "durability": 90,
      "intelligence": 78,
      "energy": 65,
      "combat": 90
    },
    "specialAbilities": [
      {
        "name": "Symbiote Katana Cyclone",
        "description": "Spins in a berserk tornado of black tendrils and slashing carbonadium katanas.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 84
  },
  {
    "id": "char-c-033",
    "name": "Gwenpool",
    "alias": "Gwendolyn Poole",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 4,
    "powers": "Gutterspace reality manipulation, fourth-wall breaking, comic lore knowledge, dual rocket launchers.",
    "description": "Real-world comic reader transported into the Marvel Universe who steps out of comic panels to alter reality.",
    "imageUrl": '/images/characters/char-c-033.jpg',
    "color": "#F472B6",
    "stats": {
      "strength": 68,
      "speed": 78,
      "durability": 74,
      "intelligence": 92,
      "energy": 82,
      "combat": 84
    },
    "specialAbilities": [
      {
        "name": "Gutterspace Panel Hop",
        "description": "Steps completely outside the duel panel to drop an anvil directly on the opponent.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "tactical"
      }
    ],
    "overallPower": 81
  },
  {
    "id": "char-c-034",
    "name": "Superior Spider-Man",
    "alias": "Otto Octavius (in Spider-Man body)",
    "grade": "C",
    "alignment": "Anti-Hero",
    "startingPrice": 5,
    "powers": "Spider-Man powers enhanced by Doc Ock intellect, 4 carbon-steel nano-spider arms, spider-bots network.",
    "description": "Doctor Octopus mind in Peter Parker body, fighting crime with ruthlessness and four mechanical legs.",
    "imageUrl": '/images/characters/char-c-034.jpg',
    "color": "#991B1B",
    "stats": {
      "strength": 82,
      "speed": 86,
      "durability": 80,
      "intelligence": 98,
      "energy": 72,
      "combat": 92
    },
    "specialAbilities": [
      {
        "name": "Superior Nano-Leg Protocol",
        "description": "Deploys 4 deadly carbon-steel legs executing cold, calculated vital strikes.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 84
  },
  {
    "id": "char-c-035",
    "name": "Ghost Rider (Robbie Reyes)",
    "alias": "Robbie Reyes (The All-Rider)",
    "grade": "C",
    "alignment": "Anti-Hero",
    "startingPrice": 5,
    "powers": "Hellcharger 1969 Dodge Charger, Hellfire chains, Spirit of Eli Morrow possession, penance burn.",
    "description": "East LA mechanic bonded with the Spirit of Vengeance driving the flaming supercharged Hellcharger.",
    "imageUrl": '/images/characters/char-c-035.jpg',
    "color": "#EA580C",
    "stats": {
      "strength": 84,
      "speed": 88,
      "durability": 86,
      "intelligence": 76,
      "energy": 90,
      "combat": 85
    },
    "specialAbilities": [
      {
        "name": "Hellcharger Nitro Ram",
        "description": "Floors the Hellcharger accelerator engulfing the battlefield in screaming hellfire.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 84
  },
  {
    "id": "char-c-036",
    "name": "Silverclaw",
    "alias": "Maria de Guadalupe Santiago",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 4,
    "powers": "Shapeshifting into South American sacred animals (jaguar, anaconda, condor), divine volcano strength.",
    "description": "Honorary Avenger and ward of Edwin Jarvis blessed with the shape-shifting power of the volcano goddess Peliali.",
    "imageUrl": '/images/characters/char-c-036.jpg',
    "color": "#94A3B8",
    "stats": {
      "strength": 82,
      "speed": 82,
      "durability": 80,
      "intelligence": 75,
      "energy": 75,
      "combat": 82
    },
    "specialAbilities": [
      {
        "name": "Jaguar Pounce",
        "description": "Strikes with ferocious jungle feline speed.",
        "bonusPower": 4,
        "triggerRate": 0.5,
        "type": "attack"
      }
    ],
    "overallPower": 80
  },
  {
    "id": "char-c-037",
    "name": "Firestar",
    "alias": "Angelica Jones",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 5,
    "powers": "Ambient microwave radiation conversion, intense heat projection, plasma blasts, flight.",
    "description": "Mutant heroine and Avenger capable of superheating microwave radiation into searing thermal plasma.",
    "imageUrl": '/images/characters/char-c-037.jpg',
    "color": "#F97316",
    "stats": {
      "strength": 75,
      "speed": 82,
      "durability": 78,
      "intelligence": 78,
      "energy": 90,
      "combat": 80
    },
    "specialAbilities": [
      {
        "name": "Microwave Thermal Blast",
        "description": "Unleashes superheated microwave radiation incinerating opposing armor.",
        "bonusPower": 5,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 82
  },
  {
    "id": "char-c-038",
    "name": "Magma",
    "alias": "Amara Juliana Olivians Aquilla",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 5,
    "powers": "Geothermal earth manipulation, molten magma form, seismic shockwaves, lava projectile blast.",
    "description": "Nova Roma mutant who transforms into living molten lava and commands subterranean magma.",
    "imageUrl": '/images/characters/char-c-038.jpg',
    "color": "#EA580C",
    "stats": {
      "strength": 78,
      "speed": 75,
      "durability": 84,
      "intelligence": 78,
      "energy": 90,
      "combat": 76
    },
    "specialAbilities": [
      {
        "name": "Volcanic Eruption",
        "description": "Erupts molten lava geysers incinerating opponent ranks.",
        "bonusPower": 5,
        "triggerRate": 0.5,
        "type": "attack"
      }
    ],
    "overallPower": 81
  },
  {
    "id": "char-c-039",
    "name": "Spider-Girl",
    "alias": "May 'Mayday' Parker",
    "grade": "C",
    "alignment": "Hero",
    "startingPrice": 5,
    "powers": "Superhuman agility, spider-sense, bio-magnetic wall-crawling, repelling shockwave touch.",
    "description": "Daughter of Peter Parker from Earth-982 continuing the heroic Spider-Man legacy.",
    "imageUrl": '/images/characters/char-c-039.jpg',
    "color": "#3B82F6",
    "stats": {
      "strength": 80,
      "speed": 88,
      "durability": 78,
      "intelligence": 82,
      "energy": 72,
      "combat": 84
    },
    "specialAbilities": [
      {
        "name": "Bio-Magnetic Repel",
        "description": "Uses bio-magnetism to repel enemies and deflect attacks.",
        "bonusPower": 4,
        "triggerRate": 0.5,
        "type": "attack"
      }
    ],
    "overallPower": 81
  },
  {
    "id": "char-c-040",
    "name": "Spider-Carnage",
    "alias": "Ben Reilly (Carnage Symbiote)",
    "grade": "C",
    "alignment": "Villain",
    "startingPrice": 5,
    "powers": "Carnage symbiote + Spider-Man clone powers, blood-red tendril blades, berserk fury.",
    "description": "Ben Reilly possessed by the psychotic Carnage symbiote, creating a lethal red-and-black menace.",
    "imageUrl": '/images/characters/char-c-040.jpg',
    "color": "#991B1B",
    "stats": {
      "strength": 86,
      "speed": 90,
      "durability": 84,
      "intelligence": 82,
      "energy": 75,
      "combat": 90
    },
    "specialAbilities": [
      {
        "name": "Carnage Web Scythe",
        "description": "Morphs webbing and tendrils into flying razor-sharp blood-red scythes.",
        "bonusPower": 4,
        "triggerRate": 0.55,
        "type": "attack"
      }
    ],
    "overallPower": 85
  }
];

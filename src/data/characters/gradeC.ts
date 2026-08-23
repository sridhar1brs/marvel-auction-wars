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
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/313-hawkeye.jpg',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/72/Black_Widow_Pale_Little_Spider_Vol_1_1_Textless.jpg/revision/latest?cb=20190809082317',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/df/Katherine_Bishop_%28Earth-616%29_from_Hawkeye_Kate_Bishop_Vol_1_1_cover.jpg/revision/latest?cb=20211130210330',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4f/White_Widow_Vol_1_1_Artgerm_Virgin_Variant.jpg/revision/latest?cb=20240808165820',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/82/Alexei_Shostakov_%28Earth-616%29_from_Thunderbolts_Vol_6_1_0001.jpg/revision/latest?cb=20250610131224',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/ff/Bullseye_%28Earth-701306%29_from_Daredevil_%28film%29_0003.jpg/revision/latest?cb=20110616232229',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/cf/Elektra_Natchios_%28Earth-9997%29_from_Paradise_X_Vol_1_10_001.jpg/revision/latest?cb=20090720160536',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/ad/Herman_Schultz_%28Earth-616%29_from_Amazing_Spider-Man_Vol_7_10_001.jpg/revision/latest?cb=20260124143953',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/fa/Georges_Batroc_%28Earth-616%29_from_Unbelievable_Gwenpool_Vol_1_2_001.jpg/revision/latest?cb=20160513012149',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/61/Jubilee_Lee_%28Earth-90126%29_from_Wolverine_%28video_game%29_001.png/revision/latest?cb=20251116225825',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/94/Mortimer_Toynbee_%28Earth-12%29_from_Exiles_Vol_1_14_0001.jpg/revision/latest?cb=20191231012014',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/be/Frederick_Dukes_%28Earth-12%29_from_Exiles_Vol_1_14_0001.jpg/revision/latest?cb=20191231012359',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/63/X-Factor_Vol_5_3_Pyro_Virgin_Variant.jpg/revision/latest?cb=20241021204809',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/49/Avalanche_%28Mesmero%27s_Brotherhood%29_%28Earth-616%29_from_X-Men_Gold_Vol_2_3_001.jpg/revision/latest?cb=20170619012725',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/68/Echo_%28TV_series%29_Poster_001.jpg/revision/latest?cb=20231103171035',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0a/Captain_America_Sam_Wilson_Vol_1_16_Textless.jpg/revision/latest?cb=20160920191244',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/96/Infinity_Watch_Vol_1_5_Colleen_Wing_Virgin_Variant.jpg/revision/latest?cb=20250523093555',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b6/Marvel%27s_Jessica_Jones_poster_002.jpg/revision/latest?cb=20151022034941',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3d/Stick_%28Earth-616%29_from_All-New%2C_All-Different_Point_One_Vol_1_1_001.jpg/revision/latest?cb=20151116053203',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9c/Ultimate_Comics_Ultimates_Vol_1_7_Coipel_Variant_Textless.jpg/revision/latest?cb=20120204072229',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d7/Infinity_Watch_Vol_1_4_Phil_Coulson_Virgin_Variant.jpg/revision/latest?cb=20250428043602',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4b/Maria_Hill_%28Earth-616%29_from_Avengers_World_Vol_1_14_001.png/revision/latest?cb=20150220062849',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/63/Margaret_Carter_%28Earth-616%29_from_Captain_America_Sentinel_of_Liberty_Vol_2_8_001.jpg/revision/latest?cb=20240807122944',
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
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6c/Sharon_Carter_%28Earth-616%29_from_Captain_America_Sentinel_of_Liberty_Vol_2_11_001.jpg/revision/latest?cb=20230415234335',
    color: '#0D9488',
    stats: { strength: 60, speed: 74, durability: 66, intelligence: 88, energy: 35, combat: 85 },
    specialAbilities: [
      { name: 'Madripoor Ambush', description: 'Deploys mercenary crossfire to disorient the target.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-025',
    name: 'Razor Fist',
    alias: 'Mattias',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Machete blade prosthesis on right arm, Ten Rings martial training, swordplay.',
    description: 'Ten Rings assassin with a razor-sharp steel machete blade permanently replacing his forearm.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5a/Douglas_Scott_%28Earth-616%29_from_Deadpool_Assassin_Vol_1_2_001.jpg/revision/latest?cb=20180717230618',
    color: '#DC2626',
    stats: { strength: 72, speed: 76, durability: 72, intelligence: 70, energy: 25, combat: 88 },
    specialAbilities: [
      { name: 'Machete Arm Slash', description: 'Delivers a high-speed horizontal slice with his steel blade arm.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-026',
    name: 'Death Dealer',
    alias: 'Li Ching-Lin',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Dual curved daggers, mask concealment, Ten Rings master assassin gymnastics.',
    description: 'Masked master trainer of the Ten Rings executing acrobatic assassination techniques.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/34/Li_Ching-Lin_%28Earth-616%29_from_Master_of_Kung_Fu_Vol_1_115_cover_001.jpg/revision/latest?cb=20210901180633',
    color: '#0F172A',
    stats: { strength: 66, speed: 82, durability: 68, intelligence: 78, energy: 30, combat: 92 },
    specialAbilities: [
      { name: 'Shadow Dagger Flurry', description: 'Dances through the shadows delivering lightning dagger cuts.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-027',
    name: 'Kraglin Obfonteri',
    alias: 'Ravager First Mate',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Cybernetic Yaka fin, whistling arrow guidance, Ravager starship pilot.',
    description: 'Loyal Ravager inheritor of Yondu cybernetic fin learning the lethal art of the Yaka arrow.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/41/Kraglin_Obfonteri_%28Earth-199999%29_from_Guardians_of_the_Galaxy_Vol._3_%28film%29_Promo_001.jpg/revision/latest?cb=20230425131440',
    color: '#0284C7',
    stats: { strength: 62, speed: 72, durability: 68, intelligence: 78, energy: 65, combat: 78 },
    specialAbilities: [
      { name: 'Rookie Arrow Whistle', description: 'Whistles a chaotic Yaka arrow flight that unexpectedly strikes home.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-028',
    name: 'Melina Vostokoff',
    alias: 'Iron Maiden / Black Widow Chemist',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Red Room scientist, mind-control antidote gas, armored pig farm tech, martial arts.',
    description: 'Seasoned Black Widow chemist who formulated the gas antidote to break mental conditioning.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/92/Melina_Vostokoff_%28Earth-616%29_from_Agents_of_S.H.I.E.L.D._Vol_1_2_001.jpg/revision/latest?cb=20250610172249',
    color: '#047857',
    stats: { strength: 62, speed: 74, durability: 68, intelligence: 92, energy: 40, combat: 86 },
    specialAbilities: [
      { name: 'Chemical Dispersal Smoke', description: 'Throws a chemical flask creating thick disorienting neutralizing mist.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-029',
    name: 'Ursa Major',
    alias: 'Mikhail Ursus',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Giant brown bear mutant transformation, bone-crushing jaws, thick fur armor.',
    description: 'Russian mutant able to transform into a towering 9-foot brown bear with savage claws.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/32/Mikhail_Ursus_%28Earth-987%29_from_What_If...%3F_Vol_1_110_0001.jpg/revision/latest?cb=20181015184025',
    color: '#78350F',
    stats: { strength: 82, speed: 64, durability: 82, intelligence: 62, energy: 20, combat: 78 },
    specialAbilities: [
      { name: 'Bear Maul Swipe', description: 'Rears up and delivers a heavy claw swipe that hurls the target.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-030',
    name: 'Jimmy Woo',
    alias: 'FBI Special Agent',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Close-up sleight of hand card magic, FBI investigative tactics, firearm training.',
    description: 'Dedicated FBI investigator with a knack for close-up card tricks and keen deduction.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/08/Agents_of_Atlas_Vol_3_3_Textless.jpg/revision/latest?cb=20190905090852',
    color: '#2563EB',
    stats: { strength: 56, speed: 64, durability: 62, intelligence: 86, energy: 25, combat: 74 },
    specialAbilities: [
      { name: 'Sleight-of-Hand Distraction', description: 'Flicks a playing card distraction before drawing his FBI service weapon.', bonusPower: 2, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 71
  },
  {
    id: 'char-c-031',
    name: 'Darcy Lewis',
    alias: 'Dr. Darcy Lewis (Astrophysicist)',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Taser defense, broadcast hacker tech, astrophysical sensor analysis, witty resourcefulness.',
    description: 'Sharp astrophysicist who discovered the Hex frequency with a handy taser in self-defense.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/e/eb/Darcy_Lewis_%28Earth-199999%29_from_WandaVision_Season_1_4_001.png/revision/latest?cb=20210129132505',
    color: '#9333EA',
    stats: { strength: 50, speed: 60, durability: 58, intelligence: 92, energy: 30, combat: 65 },
    specialAbilities: [
      { name: 'High-Voltage Taser Zap', description: 'Discharges a 50,000-volt stun taser into close attackers.', bonusPower: 2, triggerRate: 0.5, type: 'defense' }
    ],
    overallPower: 70
  },
  {
    id: 'char-c-032',
    name: 'Trevor Slattery',
    alias: 'The Fake Mandarin',
    grade: 'C',
    alignment: 'Neutral',
    startingPrice: 2,
    powers: 'Morris companion empathy, theatrical Shakespearean acting, baffling unpredictability.',
    description: 'Thespian actor whose complete lack of fear and friendship with Morris confounds enemies.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/2a/Trevor_Slattery_%28Earth-199999%29_from_Wonder_Man_%28TV_series%29_promotional_material_001.jpg/revision/latest/scale-to-width-down/337?cb=20260225034536',
    color: '#D97706',
    stats: { strength: 48, speed: 58, durability: 60, intelligence: 75, energy: 20, combat: 62 },
    specialAbilities: [
      { name: 'Thespian Dramatic Feign', description: 'Plays dead so convincingly that the enemy momentarily halts their attack.', bonusPower: 2, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 68
  },
  {
    id: 'char-c-033',
    name: 'Foggy Nelson',
    alias: 'Franklin P. Nelson (Attorney at Law)',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Legal genius, indomitable loyalty, brass knuckles street defense, courtroom tactics.',
    description: 'Partner of Nelson & Murdock using legal brilliance and unwavering loyalty in Hell Kitchen.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/35/Franklin_Nelson_%28Earth-616%29_from_Daredevil_Vol_5_605_001.jpg/revision/latest?cb=20180712171255',
    color: '#2563EB',
    stats: { strength: 52, speed: 56, durability: 62, intelligence: 90, energy: 20, combat: 66 },
    specialAbilities: [
      { name: 'Legal Injunction Flurry', description: 'Applies overwhelming procedural pressure to throw foes off balance.', bonusPower: 2, triggerRate: 0.45, type: 'tactical' }
    ],
    overallPower: 69
  },
  {
    id: 'char-c-034',
    name: 'Happy Hogan',
    alias: 'Head of Stark Security',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Former Golden Gloves heavyweight boxer, Stark asset requisition, armored limo ramming.',
    description: 'Loyal head of Stark Industries security with heavy boxer hands and rapid drone support.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/97/Avengers_Endgame_poster_018_textless.jpg/revision/latest?cb=20190721084911',
    color: '#334155',
    stats: { strength: 66, speed: 60, durability: 70, intelligence: 80, energy: 30, combat: 78 },
    specialAbilities: [
      { name: 'Golden Gloves Right Cross', description: 'Lands a clean, heavy boxer right cross to the chin.', bonusPower: 2, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-035',
    name: 'Luis',
    alias: 'X-Con Security Lead',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'One-punch knockout hook, rapid storytelling disorientation, van getaway driving.',
    description: 'Scott Lang loyal best friend famous for his lightning one-punch KO and elaborate stories.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/72/Luis_%28Earth-616%29_from_Astonishing_Ant-Man_Vol_1_3_001.jpg/revision/latest?cb=20200207224413',
    color: '#EA580C',
    stats: { strength: 64, speed: 65, durability: 64, intelligence: 78, energy: 20, combat: 76 },
    specialAbilities: [
      { name: 'The One-Punch Knockout', description: 'Catches the enemy by surprise with an unexpected one-hit knockout punch.', bonusPower: 3, triggerRate: 0.45, type: 'attack' }
    ],
    overallPower: 71
  },
  {
    id: 'char-c-036',
    name: 'Justin Hammer',
    alias: 'Hammer Industries CEO',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Hammer drone remote control, Ex-Wife mini-missile, corporate sabotage.',
    description: 'Smug rival arms industrialist deploying military weapon prototypes and automated battle drones.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0d/Justin_Hammer_%28Earth-616%29_from_Venom_Lethal_Protector_Vol_2_5_001.jpg/revision/latest?cb=20230406222346',
    color: '#64748B',
    stats: { strength: 52, speed: 58, durability: 62, intelligence: 88, energy: 65, combat: 66 },
    specialAbilities: [
      { name: 'Hammer Drone Missile Salvo', description: 'Orders an automated drone strike from offsite servers.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-037',
    name: 'Arnim Zola (Screen Form)',
    alias: 'HYDRA Bio-Algorithm',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Digital consciousness in magnetic tape computers, cyber-warfare, algorithmic prediction.',
    description: 'HYDRA scientist whose mind was digitized into thousands of feet of magnetic computer tape.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/1/18/Arnim_Zola_%28Earth-616%29_from_Captain_America_Vol_5_24_0001.jpg/revision/latest?cb=20191129054452',
    color: '#15803D',
    stats: { strength: 40, speed: 50, durability: 70, intelligence: 98, energy: 65, combat: 60 },
    specialAbilities: [
      { name: 'System Cyber-Overload', description: 'Overloads surrounding circuitry causing localized electrical explosions.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 71
  },
  {
    id: 'char-c-038',
    name: 'Jack Duquesne',
    alias: 'The Swordsman',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Master Olympic fencing, rapiers & longswords, acrobatic parrying, theatrical flair.',
    description: 'Aristocratic swordsman proficient in dueling with rapier blades and fencing counters.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/82/Jacques_DuQuesne_%28Earth-616%29_from_Official_Handbook_of_the_Marvel_Universe_Book_of_the_Dead_2004_Vol_1_1_001.jpg/revision/latest?cb=20200429031921',
    color: '#7C3AED',
    stats: { strength: 64, speed: 76, durability: 68, intelligence: 80, energy: 25, combat: 90 },
    specialAbilities: [
      { name: 'Fencing Master Riposte', description: 'Parries incoming physical strike and executes an elegant thrust.', bonusPower: 3, triggerRate: 0.55, type: 'defense' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-039',
    name: 'Taserface',
    alias: 'Ravager Mutineer',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Heavy blaster cannon, cybernetic face taser, brute Ravager intimidation.',
    description: 'Mutinous Ravager equipped with a heavy cyber-blaster and a delightfully ridiculous moniker.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6a/Taserface_%28Earth-199999%29_from_Guardians_of_the_Galaxy_Vol._2_%28film%29_002.png/revision/latest?cb=20190120205936',
    color: '#B91C1C',
    stats: { strength: 74, speed: 62, durability: 72, intelligence: 60, energy: 45, combat: 76 },
    specialAbilities: [
      { name: 'Taserface Heavy Shot', description: 'Fires an overpowered burst from his heavy plasma rifle.', bonusPower: 2, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 71
  },
  {
    id: 'char-c-040',
    name: 'Volstagg the Voluminous',
    alias: 'Warriors Three',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Asgardian warrior strength, heavy battleaxe, immense girth and charging mass.',
    description: 'Jovial and formidable warrior of Asgard charging into battle with his mighty war axe.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6a/Volstagg_%28Earth-616%29_from_Thor_Vol_3_607_001.jpg/revision/latest?cb=20210801222702',
    color: '#D97706',
    stats: { strength: 80, speed: 60, durability: 80, intelligence: 70, energy: 40, combat: 84 },
    specialAbilities: [
      { name: 'Asgardian Axe Cleave', description: 'Swings his double-headed battleaxe with joyful thunderous force.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  }
];

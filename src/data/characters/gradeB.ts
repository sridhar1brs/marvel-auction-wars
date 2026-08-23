import { Character } from '../../types/game';

export const GRADE_B_CHARACTERS: Character[] = [
  {
    id: 'char-b-001',
    name: 'Spider-Man',
    alias: 'Peter Parker',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Superhuman strength, agility, spider-sense, wall-crawling, synthetic web-shooters.',
    description: 'Friendly neighborhood hero gifted with the proportional strength and spider-sense of an arachnid.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/ae/Amazing_Spider-Man_Vol_5_75_Lee_Virgin_Variant.jpg/revision/latest?cb=20220405001421',
    color: '#E62429',
    stats: { strength: 78, speed: 91, durability: 76, intelligence: 92, energy: 65, combat: 84 },
    specialAbilities: [
      { name: 'Spider-Sense Dodge', description: 'Precognitively senses danger to completely evade attacks.', bonusPower: 5, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-002',
    name: 'Iron Man',
    alias: 'Tony Stark (Mark 85)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 8,
    powers: 'Nanotech armor, repulsor beams, unibeam, supersonic flight, Friday AI targeting.',
    description: 'Genius billionaire philanthropist clad in state-of-the-art nanotech armor.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/8b/Invincible_Iron_Man_Vol_2_518_Textless.jpg/revision/latest?cb=20200612014506',
    color: '#DC2626',
    stats: { strength: 85, speed: 88, durability: 88, intelligence: 98, energy: 90, combat: 82 },
    specialAbilities: [
      { name: 'Unibeam Overcharge', description: 'Channels chest reactor core into a blinding thermal blast.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 86
  },
  {
    id: 'char-b-003',
    name: 'Captain America',
    alias: 'Steve Rogers',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Peak human physical perfection, vibranium shield ricochet, tactical leadership, indomitable will.',
    description: 'The First Avenger and symbol of liberty wielding an indestructible vibranium shield.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/44/William_Nasland_%28Earth-616%29_from_Captain_America_Vol_1_215_001.jpg/revision/latest?cb=20201030181501',
    color: '#2563EB',
    stats: { strength: 75, speed: 78, durability: 80, intelligence: 88, energy: 50, combat: 98 },
    specialAbilities: [
      { name: 'Vibranium Shield Ricochet', description: 'Bounces shield off multiple angles to strike vital weakpoints.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-004',
    name: 'Black Panther',
    alias: 'T\'Challa',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Heart-Shaped Herb physical enhancement, kinetic vibranium suit, anti-metal claws, genius intellect.',
    description: 'King of Wakanda protected by a kinetic-absorbing vibranium weave suit and unmatched martial skill.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a2/Black_Panther_Vol_5_1_Textless.jpg/revision/latest?cb=20221204164902',
    color: '#7C3AED',
    stats: { strength: 80, speed: 86, durability: 88, intelligence: 94, energy: 70, combat: 96 },
    specialAbilities: [
      { name: 'Kinetic Pulse Burst', description: 'Releases stored kinetic impact energy in a radial shockwave.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-005',
    name: 'Wolverine',
    alias: 'Logan / Weapon X',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 8,
    powers: 'Adamantium skeleton & retractable claws, hyper-accelerated healing factor, enhanced feral senses.',
    description: 'Feral mutant warrior whose unbreakable adamantium claws and legendary healing make him near-indestructible.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9e/Dark_Wolverine_Vol_1_77_Textless.jpg/revision/latest?cb=20090712125221',
    color: '#EAB308',
    stats: { strength: 80, speed: 82, durability: 94, intelligence: 80, energy: 50, combat: 97 },
    specialAbilities: [
      { name: 'Berserker Rage', description: 'Enters a feral frenzy, delivering relentless adamantium slashes.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-006',
    name: 'Deadpool',
    alias: 'Wade Wilson (Merc with a Mouth)',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 7,
    powers: 'Supreme healing factor, dual katanas, firearm mastery, unpredictable 4th-wall combat style.',
    description: 'Unkillable mercenary whose chaotic combat style and comedic quips confound every opponent.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d8/Deadpool_Vol_9_1_Textless.jpg/revision/latest?cb=20231219070549',
    color: '#DC2626',
    stats: { strength: 75, speed: 84, durability: 95, intelligence: 82, energy: 50, combat: 92 },
    specialAbilities: [
      { name: 'Maximum Effort Flurry', description: 'Unleashes unpredictable dual-sword chaos and firearm volleys.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-007',
    name: 'Venom',
    alias: 'Eddie Brock (Lethal Protector)',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 7,
    powers: 'Klyntar alien symbiote, shapeshifting tendrils, superhuman strength, camouflage.',
    description: 'Eddie Brock bonded with the alien symbiote Venom, gaining massive strength and viscous tendrils.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4a/Venom_Vol_4_11_Textless.jpg/revision/latest?cb=20181122070225',
    color: '#1E293B',
    stats: { strength: 88, speed: 85, durability: 88, intelligence: 76, energy: 60, combat: 86 },
    specialAbilities: [
      { name: 'Symbiote Tendril Lash', description: 'Envelops the foe in razor symbiote web tendrils.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-008',
    name: 'Carnage',
    alias: 'Cletus Kasady',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 8,
    powers: 'Red symbiote blades, blood weapons, insane agility, superhuman strength, regeneration.',
    description: 'Unhinged serial killer bonded with Venom blood symbiote offspring, forming deadly bladed axes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/98/Carnage_Vol_4_1_Mastrazzo_Variant_Textless.jpg/revision/latest?cb=20240202060601',
    color: '#B91C1C',
    stats: { strength: 89, speed: 89, durability: 87, intelligence: 75, energy: 60, combat: 89 },
    specialAbilities: [
      { name: 'Crimson Blood Axes', description: 'Hurls lethal organic symbiote spikes and scythes.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 86
  },
  {
    id: 'char-b-009',
    name: 'Shang-Chi',
    alias: 'Master of Kung Fu / Ten Rings',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Ten Rings mystical energy manipulation, supreme kung fu mastery, chi focus, ring shields.',
    description: 'Master of martial arts wielding the ancient Ten Rings with mystical concussive and defensive power.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/50/Shang-Chi_and_the_Ten_Rings_Vol_1_1_Textless.jpg/revision/latest?cb=20220330141358',
    color: '#EA580C',
    stats: { strength: 82, speed: 90, durability: 84, intelligence: 86, energy: 88, combat: 99 },
    specialAbilities: [
      { name: 'Ten Rings Dragon Blast', description: 'Channels all ten rings into a golden mystical energy dragon.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-010',
    name: 'Winter Soldier',
    alias: 'Bucky Barnes',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Cybernetic vibranium arm, super soldier conditioning, stealth infiltration, sniper mastery.',
    description: 'Elite super-soldier operative equipped with a high-impact vibranium arm and master espionage training.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/57/James_Buchanan_Barnes_%28Earth-10%29_from_Top_10_Vol_1_7_001.png/revision/latest?cb=20260622054444',
    color: '#475569',
    stats: { strength: 80, speed: 80, durability: 82, intelligence: 84, energy: 45, combat: 94 },
    specialAbilities: [
      { name: 'Bionic Impact Punch', description: 'Delivers a shattering punch with his high-torque vibranium arm.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-011',
    name: 'War Machine',
    alias: 'James Rhodes',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Heavy militarized Stark armor, shoulder-mounted minigun, micro-missiles, repulsors.',
    description: 'Decorated Air Force Colonel piloting a heavily armored Stark suit packed with lethal heavy artillery.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f5/James_Rhodes_%28Earth-55%29_from_Civil_War_II_Choosing_Sides_Vol_1_2_001.png/revision/latest?cb=20170715171155',
    color: '#334155',
    stats: { strength: 84, speed: 80, durability: 89, intelligence: 85, energy: 86, combat: 88 },
    specialAbilities: [
      { name: 'Full Ordnance Salvo', description: 'Fires every missile pod and machine gun turret simultaneously.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-012',
    name: 'Ant-Man',
    alias: 'Scott Lang',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Pym Particle size alteration (subatomic to Giant-Man), insect communication, helmet tech.',
    description: 'Master thief turned hero able to shrink between molecules or grow to towering Giant-Man proportions.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/66/Henry_Pym_%28Earth-616%29_from_Avengers_Origins_Ant-Man_%26_the_Wasp_Vol_1_1_001.jpg/revision/latest?cb=20140819221923',
    color: '#DC2626',
    stats: { strength: 82, speed: 82, durability: 83, intelligence: 86, energy: 70, combat: 80 },
    specialAbilities: [
      { name: 'Giant-Man Stomp', description: 'Grows to 65 feet tall delivering a massive crushing stomp.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-013',
    name: 'Cyclops',
    alias: 'Scott Summers',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Concussive optic ruby blasts from punch dimension, tactical field genius, martial arts.',
    description: 'Legendary leader of the X-Men firing devastating ruby-quartz concussive energy beams from his eyes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5d/Polyphemus_%28Ideaverse%29_from_Marvel_Classics_Comics_Series_Featuring_The_Odyssey_Vol_1_1_0001.jpg/revision/latest?cb=20170122151220',
    color: '#0284C7',
    stats: { strength: 70, speed: 78, durability: 78, intelligence: 92, energy: 90, combat: 92 },
    specialAbilities: [
      { name: 'Optic Blast Full Visor', description: 'Opens ruby visor to unleash an unobstructed concussive beam.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-014',
    name: 'Colossus',
    alias: 'Piotr Rasputin',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Organic steel transformation, superhuman strength, extreme kinetic invulnerability.',
    description: 'Gentle Russian giant who transforms his entire bodily structure into living, impenetrable steel.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a5/Piotr_Rasputin_%28Earth-8096%29_from_Wolverine_and_the_X-Men_%28animated_series%29_Season_1_1_001.jpg/revision/latest?cb=20200909044152',
    color: '#94A3B8',
    stats: { strength: 91, speed: 72, durability: 94, intelligence: 78, energy: 50, combat: 85 },
    specialAbilities: [
      { name: 'Organic Steel Body', description: 'Shrugs off heavy physical concussions with steel armor.', bonusPower: 4, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-015',
    name: 'Gambit',
    alias: 'Remy LeBeau',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Kinetic energy charging of inanimate objects, explosive playing cards, bo staff mastery, agility.',
    description: 'Cajun mutant thief capable of charging ordinary playing cards and objects with volatile kinetic explosions.',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/274-gambit.jpg',
    color: '#EC4899',
    stats: { strength: 70, speed: 86, durability: 74, intelligence: 82, energy: 86, combat: 90 },
    specialAbilities: [
      { name: 'Royal Flush Blast', description: 'Throws a charged deck of glowing kinetic cards that detonate together.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-016',
    name: 'Rogue',
    alias: 'Anna Marie LeBeau',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Absorption of powers/memories/life force by skin contact, Ms. Marvel superhuman strength & flight.',
    description: 'Southern powerhouse mutant who can temporarily absorb the powers and vitality of anyone she touches.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0b/Rogue_%28Anna_Marie%29_%28Earth-27%29_from_Exiles_Vol_1_83_0001.jpg/revision/latest?cb=20191209061419',
    color: '#16A34A',
    stats: { strength: 86, speed: 84, durability: 88, intelligence: 80, energy: 82, combat: 86 },
    specialAbilities: [
      { name: 'Power Siphon Touch', description: 'Drains enemy power through skin contact to boost her own damage.', bonusPower: 5, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-017',
    name: 'Nightcrawler',
    alias: 'Kurt Wagner',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'BAMF short-range teleportation, prehensile tail, acrobatic fencing, wall scaling.',
    description: 'Swashbuckling mutant who teleports through brimstone portals with unmatched acrobatic agility.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f5/Nightcrawler_%28Female%29_%28Mojoverse%29_from_X-Men_Annual_Vol_1_12_0001.jpg/revision/latest?cb=20191211015251',
    color: '#3B82F6',
    stats: { strength: 68, speed: 94, durability: 72, intelligence: 82, energy: 75, combat: 91 },
    specialAbilities: [
      { name: 'Multi-BAMF Flurry', description: 'Rapidly teleports behind opponent delivering disorienting sword strikes.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-018',
    name: 'Moon Knight',
    alias: 'Marc Spector (Fist of Khonshu)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Crescent darts, truncheon, mystical resurrection by Khonshu, pain tolerance, lunar armor.',
    description: 'High priest and fist of Egyptian moon god Khonshu, delivering ruthless nighttime justice.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/33/Moon_Knight_%28TV_series%29_poster_018.jpg/revision/latest?cb=20220505182302',
    color: '#F8FAFC',
    stats: { strength: 78, speed: 82, durability: 84, intelligence: 85, energy: 65, combat: 93 },
    specialAbilities: [
      { name: 'Lunar Crescent Strike', description: 'Hurls silver crescent blades that ricochet into weak spots.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-019',
    name: 'She-Hulk',
    alias: 'Jennifer Walters',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Gamma strength, rapid healing, retains full intellect & charm in Hulk form, superhuman jump.',
    description: 'Brilliant defense attorney possessing immense gamma strength while maintaining full self-control.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/30/Planet_She-Hulk_Vol_1_1_Kuder_Second_Printing_Variant.jpg/revision/latest?cb=20250825143012',
    color: '#22C55E',
    stats: { strength: 89, speed: 80, durability: 90, intelligence: 92, energy: 65, combat: 85 },
    specialAbilities: [
      { name: 'Gamma Cross Punch', description: 'Delivers a heavy gamma-infused hook with legal precision.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-020',
    name: 'Luke Cage',
    alias: 'Power Man / Hero for Hire',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Unbreakable titanium skin, superhuman dense muscle strength, street fighting prowess.',
    description: 'Harlem Hero for Hire with dense unbreakable skin that bends bullets and blunts heavy blades.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/45/Marvel%27s_Luke_Cage_poster_009.jpg/revision/latest?cb=20180507141722',
    color: '#F59E0B',
    stats: { strength: 87, speed: 72, durability: 94, intelligence: 78, energy: 40, combat: 85 },
    specialAbilities: [
      { name: 'Unbreakable Skin Block', description: 'Absorbs physical impacts with dense bulletproof skin.', bonusPower: 4, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-021',
    name: 'Iron Fist',
    alias: 'Danny Rand (Immortal Iron Fist)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Chi energy focusing, glowing fist strike, K\'un-Lun martial arts mastery, healing chi.',
    description: 'Champion of K\'un-Lun who defeated Shou-Lao the Undying to focus his spiritual chi into an iron fist.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/01/Pei_%28Earth-616%29_from_Contagion_Vol_1_3_cover.jpg/revision/latest?cb=20200315165819',
    color: '#16A34A',
    stats: { strength: 76, speed: 88, durability: 78, intelligence: 82, energy: 86, combat: 98 },
    specialAbilities: [
      { name: 'Dragon Chi Strike', description: 'Pours all focused chi into a glowing concussive punch.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-022',
    name: 'Gamora',
    alias: 'Deadliest Woman in the Galaxy',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Godslayer blade mastery, superhuman physical stats, master assassin conditioning.',
    description: 'Adopted daughter of Thanos trained from childhood to become the galaxy deadliest swordmaster.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4d/Guardians_of_the_Galaxy_Vol_8_7_Smith_Variant_Textless.jpg/revision/latest?cb=20241104105005',
    color: '#10B981',
    stats: { strength: 82, speed: 88, durability: 83, intelligence: 85, energy: 60, combat: 97 },
    specialAbilities: [
      { name: 'Godslayer Blade Slash', description: 'Executes a flawless strike targeting opponent arterial armor joints.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-023',
    name: 'Drax the Destroyer',
    alias: 'Arthur Douglas',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Dual daggers mastery, superhuman resilience, brute strength, warrior tenacity.',
    description: 'Vengeful warrior created to destroy Thanos, wielding heavy twin daggers in furious close-quarters combat.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b8/Arthur_Douglas_%28Clone%29_%28Earth-616%29_from_Guardians_of_the_Galaxy_Vol_7_15_cover_001.jpg/revision/latest?cb=20210729022738',
    color: '#0D9488',
    stats: { strength: 87, speed: 76, durability: 89, intelligence: 70, energy: 45, combat: 90 },
    specialAbilities: [
      { name: 'Dual Dagger Cleave', description: 'Hurls into the enemy with dual blades in a furious slash.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-024',
    name: 'Star-Lord',
    alias: 'Peter Quill (Leader of Guardians)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Dual Element Guns, jet boots, celestial heritage resilience, tactical improvisation.',
    description: 'Leader of the Guardians of the Galaxy armed with element blasters and clever tactical gadgets.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/39/Star-Lord_Vol_2_1_Fried_Pie_Exclusive_Variant_Textless.jpg/revision/latest?cb=20161118214641',
    color: '#B45309',
    stats: { strength: 72, speed: 82, durability: 78, intelligence: 87, energy: 75, combat: 86 },
    specialAbilities: [
      { name: 'Element Gun Dual Blast', description: 'Fires alternating plasma and ice blasts from dual blasters.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-025',
    name: 'Groot',
    alias: 'Flora Colossus of Planet X',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Wood elasticity & branch extension, regeneration from splinters, colossal strength, spore light.',
    description: 'Gentle sentient tree creature capable of extending dense hardwood branches to protect his allies.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/60/Groot_%28Earth-616%29_from_Infinity_Countdown_Vol_1_1_001.jpg/revision/latest?cb=20180308012708',
    color: '#78350F',
    stats: { strength: 88, speed: 68, durability: 90, intelligence: 72, energy: 70, combat: 82 },
    specialAbilities: [
      { name: 'Branch Cage Slam', description: 'Grows rooted oak branches to entangle and crush the foe.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-026',
    name: 'Nebula',
    alias: 'Luphomoid Cybernetic Assassin',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Cybernetic electro-batons, body regeneration hardware, tactical combat computer.',
    description: 'Heavily upgraded cybernetic warrior whose synthetic parts self-repair in the midst of battle.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/45/Nebula_Vol_1_1_Textless.jpg/revision/latest?cb=20210729032454',
    color: '#0284C7',
    stats: { strength: 80, speed: 84, durability: 86, intelligence: 85, energy: 65, combat: 91 },
    specialAbilities: [
      { name: 'Electro-Shock Overload', description: 'Channels high-voltage shockwaves through twin batons.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-027',
    name: 'Green Goblin',
    alias: 'Norman Osborn',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 7,
    powers: 'Goblin Glider, pumpkin bombs, razor bats, Goblin Formula superhuman stats, ruthless genius.',
    description: 'Spider-Man archenemy flying on a rocket glider equipped with explosive pumpkin bombs.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/48/Amazing_Spider-Man_Vol_5_76_Marvel_Masterpieces_Variant_Textless.jpg/revision/latest?cb=20220405011735',
    color: '#15803D',
    stats: { strength: 82, speed: 86, durability: 82, intelligence: 95, energy: 70, combat: 86 },
    specialAbilities: [
      { name: 'Pumpkin Bomb Cluster', description: 'Drops explosive incendiary pumpkin bombs with glider speed.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-028',
    name: 'Doctor Octopus',
    alias: 'Otto Octavius',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 7,
    powers: 'Four telepathically controlled titanium-steel tentacles, nuclear physics genius, multi-strike.',
    description: 'Brilliant nuclear scientist wielding four powerful mechanical arms capable of crushing concrete.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/61/Otto_Octavius_%28Earth-96283%29_from_Spider-Man_2_%28film%29_Poster_001.png/revision/latest?cb=20190701141526',
    color: '#047857',
    stats: { strength: 84, speed: 82, durability: 85, intelligence: 98, energy: 65, combat: 85 },
    specialAbilities: [
      { name: 'Quad-Tentacle Flurry', description: 'Attacks simultaneously from 4 angles with titanium arms.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-029',
    name: 'Killmonger',
    alias: 'Erik Stevens / N\'Jadaka',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Golden Jaguar vibranium suit, Navy SEAL tactical mastery, vibranium daggers, peak stats.',
    description: 'Wakandan exile and black ops specialist possessing elite combat lethality and vibranium armor.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f0/Wakanda_Vol_1_3_Textless.jpg/revision/latest?cb=20221025164728',
    color: '#CA8A04',
    stats: { strength: 80, speed: 85, durability: 86, intelligence: 88, energy: 60, combat: 96 },
    specialAbilities: [
      { name: 'Jaguar Claws Rush', description: 'Launches a ferocious close-range assault with golden claws.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-030',
    name: 'Valkyrie (Brunnhilde)',
    alias: 'Leader of the Valkyrior',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Dragonfang enchanted sword, Asgardian physiology, Aragorn winged steed, warrior spirit.',
    description: 'Legendary Asgardian warrior and sworn defender of New Asgard wielding the blade Dragonfang.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/bc/Brunnhilde_%28Earth-616%29_from_Asgardians_of_the_Galaxy_Vol_1_8_cover_001.jpg/revision/latest?cb=20200201034107',
    color: '#0284C7',
    stats: { strength: 86, speed: 82, durability: 88, intelligence: 82, energy: 70, combat: 93 },
    specialAbilities: [
      { name: 'Dragonfang Slash', description: 'Cleaves through enemy defenses with an enchanted Asgardian blade.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-031',
    name: 'Heimdall',
    alias: 'Guardian of the Bifrost',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Omniscient sight across nine realms, Hofund broadsword, Bifrost energy summoning.',
    description: 'All-seeing guardian of Asgard capable of perceiving every soul across the cosmos.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/68/Heimdall_%28Earth-616%29_from_Mighty_Thor_Vol_2_2_001.jpg/revision/latest?cb=20180929211420',
    color: '#D97706',
    stats: { strength: 86, speed: 80, durability: 88, intelligence: 92, energy: 80, combat: 92 },
    specialAbilities: [
      { name: 'Bifrost Energy Beam', description: 'Calls down a beam of rainbow bridge energy upon the target.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-b-032',
    name: 'Wong',
    alias: 'Sorcerer Supreme (Current)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Eldritch whip mastery, portal teleportation, Kamar-Taj martial arts, relic wards.',
    description: 'Wise Sorcerer Supreme of Earth proficient in mystic portal combat and ancient library relics.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b8/Strange_Academy_Vol_1_15_Character_Spotlight_Variant_Textless.jpg/revision/latest?cb=20221006161810',
    color: '#B45309',
    stats: { strength: 68, speed: 78, durability: 80, intelligence: 94, energy: 88, combat: 89 },
    specialAbilities: [
      { name: 'Eldritch Portal Trap', description: 'Opens a sling ring portal to redirect enemy projectiles.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-033',
    name: 'Quicksilver',
    alias: 'Pietro Maximoff',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Supersonic running speed, kinetic cyclone creation, hyper-accelerated reflexes.',
    description: 'Mutant speedster able to move faster than sound, dismantling foes before they can react.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/02/Pietro_Maximoff_%28Earth-12%29_from_Exiles_Vol_1_14_001.jpg/revision/latest?cb=20191231012537',
    color: '#38BDF8',
    stats: { strength: 70, speed: 98, durability: 74, intelligence: 80, energy: 60, combat: 84 },
    specialAbilities: [
      { name: 'Supersonic Cyclone Punch', description: 'Runs in rapid circles creating a vortex before striking at Mach speed.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-034',
    name: 'Taskmaster',
    alias: 'Tony Masters',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Photographic reflexes, sword, shield, archery, instant imitation of all combat styles.',
    description: 'Mercenary who instantly memorizes and replicates any fighting technique he observes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/28/Anthony_Masters_%28Earth-138%29_from_Spider-Punk_Vol_1_1.jpg/revision/latest?cb=20220519181041',
    color: '#475569',
    stats: { strength: 75, speed: 84, durability: 78, intelligence: 89, energy: 45, combat: 98 },
    specialAbilities: [
      { name: 'Photographic Counter', description: 'Replicates the opponent fighting style to counter their next move.', bonusPower: 5, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-035',
    name: 'Psylocke',
    alias: 'Betsy Braddock / Kwannon',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Psionic psychic blade creation, telepathy, ninja martial arts mastery, telekinesis.',
    description: 'Deadly mutant ninja manifesting focused psychic daggers that slice nervous systems.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/08/Elizabeth_Braddock_%28Earth-616%29_from_Hunt_for_Wolverine_Mystery_in_Madripoor_Vol_1_4_Spoiler_Variant_cover_001.jpg/revision/latest?cb=20180823221219',
    color: '#9333EA',
    stats: { strength: 72, speed: 88, durability: 78, intelligence: 86, energy: 87, combat: 95 },
    specialAbilities: [
      { name: 'Psionic Knife Strike', description: 'Thrusts a concentrated beam of psychic energy into the neural core.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-036',
    name: 'Mysterio',
    alias: 'Quentin Beck',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Holographic illusion technology, hallucinogenic mist, combat drones, stagecraft trickery.',
    description: 'Master of illusion weaponizing cinematic holograms and drones to disorient reality.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5c/Quentin_Beck_%28Earth-6160%29_from_Ultimate_Spider-Man_Vol_3_-16.png/revision/latest?cb=20250430131721',
    color: '#059669',
    stats: { strength: 65, speed: 76, durability: 78, intelligence: 94, energy: 80, combat: 78 },
    specialAbilities: [
      { name: 'Hallucinatory Drone Ambush', description: 'Cloaks the arena in illusions while stealth drones fire lasers.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-037',
    name: 'Sandman',
    alias: 'Flint Marko',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 5,
    powers: 'Sand molecular transmutation, density shifting, giant sand mallets, physical immunity.',
    description: 'Capable of transforming his entire body into shifting grains of sand and massive blunt weapons.',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/572-sandman.jpg',
    color: '#D97706',
    stats: { strength: 86, speed: 74, durability: 92, intelligence: 70, energy: 65, combat: 80 },
    specialAbilities: [
      { name: 'Sand Hammer Crush', description: 'Forms arms into colossal sandstone hammers that crush armor.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-038',
    name: 'Electro',
    alias: 'Max Dillon',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Electrical discharge, lightning riding, electromagnetic flight, power grid siphon.',
    description: 'Living electrical dynamo firing millions of volts of lightning bolts at extreme speed.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/33/Francine_Frye_%28Earth-616%29_from_Amazing_Spider-Man_Vol_4_17_003.jpg/revision/latest?cb=20160909041223',
    color: '#EAB308',
    stats: { strength: 74, speed: 90, durability: 78, intelligence: 80, energy: 93, combat: 78 },
    specialAbilities: [
      { name: 'High-Voltage Discharge', description: 'Releases a blinding lightning storm that fries enemy defenses.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-039',
    name: 'X-23',
    alias: 'Laura Kinney (Wolverine)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Adamantium foot and hand claws, accelerated healing factor, assassin training, feral senses.',
    description: 'Genetic clone of Wolverine with adamantium hand and foot claws and lethal precision.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7f/Laura_Kinney_%28Earth-51156%29_from_Marvel_Future_Fight_003.png/revision/latest?cb=20200324132633',
    color: '#F43F5E',
    stats: { strength: 78, speed: 89, durability: 88, intelligence: 82, energy: 45, combat: 96 },
    specialAbilities: [
      { name: 'Foot Blade Leap', description: 'Performs an acrobatic flip utilizing dual foot blades for critical hit.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-040',
    name: 'Kraven the Hunter',
    alias: 'Sergei Kravinoff',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Jungle herbal elixir enhancements, animal tracking, spear & knife combat, trap mastery.',
    description: 'World-renowned big game hunter enhanced by jungle elixirs to pursue the ultimate prey.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/83/Amazing_Spider-Man_Vol_5_19_ComicXposure_Exclusive_Virgin_Variant.jpg/revision/latest?cb=20210222060432',
    color: '#B45309',
    stats: { strength: 80, speed: 82, durability: 82, intelligence: 85, energy: 40, combat: 94 },
    specialAbilities: [
      { name: 'Predator Ambush', description: 'Strikes from camouflage with poisoned hunting spears.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-041',
    name: 'Archangel',
    alias: 'Warren Worthington III (Death Horseman)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Razor-sharp metallic techno-organic wings, neurotoxin feather flechettes, high-speed flight.',
    description: 'Warren Worthington transformed by Apocalypse with metallic wings firing poisonous razor feathers.',
    imageUrl: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/40-archangel.jpg',
    color: '#6366F1',
    stats: { strength: 76, speed: 92, durability: 84, intelligence: 80, energy: 75, combat: 89 },
    specialAbilities: [
      { name: 'Metallic Feather Volley', description: 'Launches a storm of razor-sharp poisoned metal feathers.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-042',
    name: 'Bishop',
    alias: 'Lucas Bishop (Chronal Enforcer)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Energy absorption & redirection, futuristic heavy plasma rifles, mutant tracking.',
    description: 'Time-traveling mutant enforcer who absorbs radiant energy and returns it twice as strong.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/8d/Lucas_Bishop_%28Earth-1191%29_from_Timeslide_Vol_1_1_002.jpg/revision/latest?cb=20241228152902',
    color: '#DC2626',
    stats: { strength: 80, speed: 78, durability: 84, intelligence: 86, energy: 88, combat: 90 },
    specialAbilities: [
      { name: 'Energy Siphon Rebound', description: 'Absorbs enemy blast energy to unleash a supercharged return shot.', bonusPower: 5, triggerRate: 0.55, type: 'defense' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-043',
    name: 'Korg',
    alias: 'Kronan Gladiator',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Dense Kronan silicon rock body, gladiator club combat, superhuman endurance.',
    description: 'Friendly Kronan rock gladiator boasting dense silicon stony armor and a heavy club.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/e/ea/World_War_Hulk_Aftersmash_Warbound_Vol_1_2_Textless.jpg/revision/latest?cb=20210622060437',
    color: '#78350F',
    stats: { strength: 86, speed: 68, durability: 90, intelligence: 72, energy: 40, combat: 84 },
    specialAbilities: [
      { name: 'Kronan Rock Smash', description: 'Delivers a heavy rocky overhead strike.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-044',
    name: 'Lizard',
    alias: 'Dr. Curt Connors',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Reptilian regenerative factor, razor claws & fangs, whip tail, biochemical intellect.',
    description: 'Curt Connors transformed into a fierce reptilian apex predator with swift regeneration.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4d/Lizard_%28Isotope_Genome_Accelerator_Duplicate%29_%28Earth-616%29_from_Amazing_Spider-Man_Vol_5_70_001.jpg/revision/latest?cb=20210802014643',
    color: '#15803D',
    stats: { strength: 84, speed: 82, durability: 86, intelligence: 88, energy: 40, combat: 84 },
    specialAbilities: [
      { name: 'Reptilian Tail Whip', description: 'Swings muscular reptilian tail to bowl over opponents.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-045',
    name: 'Rhino',
    alias: 'Aleksei Sytsevich',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 4,
    powers: 'Polymer rhino suit, extreme kinetic charging power, thick armored hide.',
    description: 'Russian powerhouse bonded to a near-impenetrable rhino skin suit designed to bulldoze obstacles.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/1/18/Aleksei_Sytsevich_%28Earth-616%29_from_Miles_Morales_Spider-Man_Vol_1_1_001.jpg/revision/latest?cb=20191010044711',
    color: '#64748B',
    stats: { strength: 90, speed: 74, durability: 92, intelligence: 62, energy: 35, combat: 78 },
    specialAbilities: [
      { name: 'Rhino Horn Charge', description: 'Charges full speed with armored horn to pierce defensive barriers.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-046',
    name: 'Beast',
    alias: 'Dr. Hank McCoy',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Blue fur mutation, acrobatic prehensile feet, bio-engineering genius, superhuman strength.',
    description: 'Founding X-Man combining acrobatic physical agility with a polymath scientific intellect.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/1/1b/Krahllak_%28Earth-616%29_from_Daredevil_Vol_5_26_001.jpg/revision/latest?cb=20170910213355',
    color: '#2563EB',
    stats: { strength: 82, speed: 84, durability: 82, intelligence: 96, energy: 45, combat: 86 },
    specialAbilities: [
      { name: 'Acrobatic Pin', description: 'Leaps from walls to pin down the opponent with surgical leverage.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-047',
    name: 'Havok',
    alias: 'Alex Summers',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Ambient cosmic radiation absorption, plasma discharge concentric rings, immune to optic blasts.',
    description: 'Brother of Cyclops firing superheated concentric rings of destructive plasma.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/23/X-Factor_Vol_5_1_Havok_Virgin_Variant.jpg/revision/latest?cb=20250104120652',
    color: '#38BDF8',
    stats: { strength: 72, speed: 78, durability: 80, intelligence: 84, energy: 92, combat: 84 },
    specialAbilities: [
      { name: 'Concentric Plasma Blast', description: 'Releases a concentric ring of searing cosmic plasma.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-048',
    name: 'Polaris',
    alias: 'Lorna Dane (Mistress of Magnetism)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Magnetic field manipulation, metal distortion, flight, electromagnetic pulse.',
    description: 'Daughter of Magneto commanding emerald electromagnetic force fields and metal waves.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/38/Polaris_%28Earth-59222%29_from_Uncanny_X-Men_Vol_1_462_page_13.jpg/revision/latest?cb=20191127015729',
    color: '#10B981',
    stats: { strength: 70, speed: 80, durability: 80, intelligence: 88, energy: 92, combat: 84 },
    specialAbilities: [
      { name: 'Emerald Magnetic Storm', description: 'Crushes metal objects in a green whirlpool of magnetic energy.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-049',
    name: 'Sunspot',
    alias: 'Roberto da Costa',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Solar energy conversion into black-solar plasma form, superhuman strength, thermokinesis.',
    description: 'Mutant who transforms into a radiant solar silhouette possessing colossal kinetic heat.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/2f/X-Men_Red_Vol_2_9_Arrako_Variant_Textless.jpg/revision/latest?cb=20221103072610',
    color: '#F59E0B',
    stats: { strength: 84, speed: 82, durability: 82, intelligence: 88, energy: 88, combat: 82 },
    specialAbilities: [
      { name: 'Solar Flare Punch', description: 'Detonates solar thermokinetic energy at point-blank range.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-050',
    name: 'Lady Sif',
    alias: 'Goddess of War',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Asgardian divine warrior physiology, teleportation sword, master swordsmanship.',
    description: 'Fierce Asgardian shield-maiden wielding an enchanted blade capable of cleaving dimensions.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/8c/Sif_%28Earth-6160%29_from_Ultimate_Universe_Vol_1_1_002.jpg/revision/latest?cb=20250105040729',
    color: '#B91C1C',
    stats: { strength: 84, speed: 82, durability: 86, intelligence: 82, energy: 65, combat: 94 },
    specialAbilities: [
      { name: 'Dimension Sword Slash', description: 'Teleports into striking position for a lethal sword arc.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  }
];

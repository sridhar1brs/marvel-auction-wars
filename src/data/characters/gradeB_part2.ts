import { Character } from '../../types/game';

export const GRADE_B_PART2: Character[] = [
  {
    id: 'char-b-051',
    name: 'Warpath',
    alias: 'James Proudstar',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Vibranium bowie knives, mutant superhuman strength, hyper-agility, tracking senses.',
    description: 'Apache mutant warrior wielding dual vibranium knives with towering physical strength.',
    imageUrl: '/images/characters/char-b-051.jpg',
    color: '#0284C7',
    stats: { strength: 87, speed: 82, durability: 86, intelligence: 78, energy: 40, combat: 93 },
    specialAbilities: [
      { name: 'Dual Vibranium Slash', description: 'Lunges forward with twin vibranium knives in a cross-slash.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-052',
    name: 'Forge',
    alias: 'The Maker of Weapons',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Intuitive technological engineering, cybernetic leg/arm weapons, Cheyenne mystic shamanism.',
    description: 'Mutant with an innate ability to invent and build any mechanical device imaginable.',
    imageUrl: '/images/characters/char-b-052.jpg',
    color: '#CA8A04',
    stats: { strength: 72, speed: 76, durability: 78, intelligence: 98, energy: 82, combat: 85 },
    specialAbilities: [
      { name: 'Neutralizer Cannon', description: 'Fires an improvised disruptor beam that scrambles enemy power.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-053',
    name: 'Banshee',
    alias: 'Sean Cassidy',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Sonic scream projection, acoustic flight, concussive sound blasts, sonar tracking.',
    description: 'Irish X-Man generating piercing acoustic sonic scream waves capable of pulverizing rock.',
    imageUrl: '/images/characters/char-b-053.jpg',
    color: '#16A34A',
    stats: { strength: 70, speed: 82, durability: 76, intelligence: 82, energy: 88, combat: 85 },
    specialAbilities: [
      { name: 'Sonic Scream Wave', description: 'Emits a deafening high-decibel shockwave that disorients the foe.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-054',
    name: 'Sunfire',
    alias: 'Shiro Yoshida',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Atomic solar radiation, superheated plasma blasts, thermal flight, radiant heat shield.',
    description: 'Fierce Japanese mutant emitting blazing white-hot solar plasma beams from his hands.',
    imageUrl: '/images/characters/char-b-054.jpg',
    color: '#EA580C',
    stats: { strength: 74, speed: 85, durability: 78, intelligence: 82, energy: 93, combat: 86 },
    specialAbilities: [
      { name: 'Atomic Plasma Torrent', description: 'Surges forward wrapped in blinding superheated nuclear plasma.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-055',
    name: 'Shadowcat & Lockheed',
    alias: 'Kitty Pryde',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Molecular phasing (intangibility), tech-scrambling disruption, Lockheed alien dragon fire.',
    description: 'Phases effortlessly through all matter and disrupts electrical systems alongside Lockheed.',
    imageUrl: '/images/characters/char-b-055.jpg',
    color: '#9333EA',
    stats: { strength: 65, speed: 86, durability: 80, intelligence: 92, energy: 75, combat: 90 },
    specialAbilities: [
      { name: 'Phase-Through Counter', description: 'Phases through the incoming blow, letting Lockheed breathe dragonfire.', bonusPower: 4, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-056',
    name: 'Domino',
    alias: 'Neena Thurman',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Probability manipulation (good luck aura), master marksmanship, mercenary reflexes.',
    description: 'Mutant whose subconscious telekinesis alters probability in her favor during intense firefights.',
    imageUrl: '/images/characters/char-b-056.jpg',
    color: '#0F172A',
    stats: { strength: 70, speed: 86, durability: 78, intelligence: 85, energy: 80, combat: 92 },
    specialAbilities: [
      { name: 'Miraculous Luck Ricochet', description: 'A stray bullet ricochets off three surfaces to strike the foe.', bonusPower: 5, triggerRate: 0.65, type: 'tactical' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-057',
    name: 'Multiple Man',
    alias: 'Jamie Madrox',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Instant kinetic duplication upon impact, shared knowledge upon dup re-absorption, detective skills.',
    description: 'Creates hundreds of independent physical duplicates whenever he absorbs physical kinetic force.',
    imageUrl: '/images/characters/char-b-057.jpg',
    color: '#059669',
    stats: { strength: 74, speed: 76, durability: 82, intelligence: 88, energy: 70, combat: 85 },
    specialAbilities: [
      { name: 'Dup Mob Swarm', description: 'Spawns a platoon of identical copies to overwhelm the single target.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-058',
    name: 'Strong Guy',
    alias: 'Guido Carosella',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Kinetic energy rechanneling into immense upper-body muscle mass, superhuman brawler.',
    description: 'Mutant bodyguard who absorbs kinetic shocks and turns them into towering upper-body bulk.',
    imageUrl: '/images/characters/char-b-058.jpg',
    color: '#F59E0B',
    stats: { strength: 89, speed: 68, durability: 88, intelligence: 72, energy: 40, combat: 82 },
    specialAbilities: [
      { name: 'Kinetic Haymaker', description: 'Releases stored kinetic energy into an earth-shaking hook punch.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-059',
    name: 'Northstar',
    alias: 'Jean-Paul Beaubier',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Sub-light flight speed, photokinetic flashes, kinetic impact acceleration.',
    description: 'Canadian mutant speedster of Alpha Flight flying at near-light speeds with blinding light bursts.',
    imageUrl: '/images/characters/char-b-059.jpg',
    color: '#38BDF8',
    stats: { strength: 72, speed: 96, durability: 75, intelligence: 82, energy: 82, combat: 84 },
    specialAbilities: [
      { name: 'Flashspeed Blitz', description: 'Strikes at supersonic velocity with a blinding white-light flash.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-060',
    name: 'Ghost',
    alias: 'Ava Starr',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 5,
    powers: 'Quantum molecular instability phasing, stealth invisibility suit, hand-to-hand assassin.',
    description: 'Subject of quantum entanglement who shifts through solid matter to strike unseen.',
    imageUrl: '/images/characters/char-b-060.jpg',
    color: '#64748B',
    stats: { strength: 70, speed: 88, durability: 78, intelligence: 85, energy: 78, combat: 88 },
    specialAbilities: [
      { name: 'Quantum Ambush Strike', description: 'Phases inside enemy defenses before solidifying a direct strike.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-061',
    name: 'Yellowjacket',
    alias: 'Darren Cross (Pym Battlesuit)',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Pym shrinkage battlesuit, quad laser stingers, titanium armor, flight propulsion.',
    description: 'Armed with a militarized shrinking suit featuring four lethal plasma stingers on the back.',
    imageUrl: '/images/characters/char-b-061.jpg',
    color: '#EAB308',
    stats: { strength: 76, speed: 86, durability: 82, intelligence: 90, energy: 85, combat: 80 },
    specialAbilities: [
      { name: 'Quad-Stinger Plasma Barrage', description: 'Fires high-intensity laser blasts from 4 articulated backpack stingers.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-062',
    name: 'Whiplash',
    alias: 'Ivan Vanko (Mark II Armor)',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Electrified plasma energy whips, arc reactor battlesuit, engineering intellect.',
    description: 'Vengeful engineer wielding twin plasma whips capable of slicing through steel superstructures.',
    imageUrl: '/images/characters/char-b-062.jpg',
    color: '#EA580C',
    stats: { strength: 82, speed: 78, durability: 85, intelligence: 92, energy: 86, combat: 84 },
    specialAbilities: [
      { name: 'Twin Plasma Whip Lash', description: 'Entangles and electrocutes target armor with twin plasma whips.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-063',
    name: 'Red Skull',
    alias: 'Johann Schmidt (Cosmic Relic Wielder)',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Super soldier serum enhancements, HYDRA energy blasters, ruthless strategic mastermind.',
    description: 'Leader of HYDRA and archenemy of Captain America with enhanced strength and strategic cruelty.',
    imageUrl: '/images/characters/char-b-063.jpg',
    color: '#DC2626',
    stats: { strength: 78, speed: 78, durability: 80, intelligence: 94, energy: 70, combat: 92 },
    specialAbilities: [
      { name: 'HYDRA Mastermind Ambush', description: 'Executes a coordinated offensive strike exploiting tactical flaws.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-064',
    name: 'Baron Helmut Zemo',
    alias: 'Master Tactician of Sokovia',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Psychological warfare, fencing mastery, tactical espionage, firearm proficiency.',
    description: 'Brilliant Sokovian tactician who dismantled the Avengers from within using pure intellect.',
    imageUrl: '/images/characters/char-b-064.jpg',
    color: '#6D28D9',
    stats: { strength: 70, speed: 78, durability: 74, intelligence: 98, energy: 40, combat: 91 },
    specialAbilities: [
      { name: 'Calculated Fracture', description: 'Triggers a psychological flaw that penalizes opponent battle power.', bonusPower: 4, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-065',
    name: 'Crossbones',
    alias: 'Brock Rumlow',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 4,
    powers: 'Hydraulic pneumatic gauntlets, heavy combat armor, mercenary brutality.',
    description: 'Mercenary juggernaut armed with pneumatic gauntlets designed to trade blows with super soldiers.',
    imageUrl: '/images/characters/char-b-065.jpg',
    color: '#334155',
    stats: { strength: 82, speed: 76, durability: 84, intelligence: 76, energy: 35, combat: 90 },
    specialAbilities: [
      { name: 'Pneumatic Power Piston', description: 'Discharges high-pressure pneumatic punch that concusses the foe.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-066',
    name: 'M\'Baku',
    alias: 'Lord of the Jabari',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Gorrila god blessing strength, Jabari wood war-club, towering physical brawn.',
    description: 'Chieftain of the Jabari tribe wielding heavy sacred wood battle clubs with massive physical prowess.',
    imageUrl: '/images/characters/char-b-066.jpg',
    color: '#78350F',
    stats: { strength: 84, speed: 76, durability: 86, intelligence: 82, energy: 40, combat: 91 },
    specialAbilities: [
      { name: 'Jabari War Cry Smash', description: 'Rallies with a ferocious war chant before a crushing club strike.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-067',
    name: 'Okoye',
    alias: 'General of the Dora Milaje',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Vibranium spear mastery, Dora Milaje tactical command, peerless martial defense.',
    description: 'General of Wakanda royal guard wielding an electrifying vibranium spear with fatal accuracy.',
    imageUrl: '/images/characters/char-b-067.jpg',
    color: '#DC2626',
    stats: { strength: 72, speed: 86, durability: 80, intelligence: 88, energy: 50, combat: 97 },
    specialAbilities: [
      { name: 'Vibranium Spear Sweep', description: 'Executes a spinning spear sweep that knocks opponents off balance.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-068',
    name: 'Yondu Udonta',
    alias: 'Centaurian Ravager Captain',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Yaka sound-controlled flying arrow, Ravager combat instincts, whistling frequency control.',
    description: 'Ravager captain who guides a deadly, supersonic Yaka arrow through enemy lines by whistling.',
    imageUrl: '/images/characters/char-b-068.jpg',
    color: '#0284C7',
    stats: { strength: 68, speed: 84, durability: 76, intelligence: 84, energy: 88, combat: 92 },
    specialAbilities: [
      { name: 'Yaka Arrow Whistle Loop', description: 'Whistles to send his glowing red arrow threading through enemy armor.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-069',
    name: 'Mantis (Martial Empath)',
    alias: 'Celestial Madonna',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Empathic mind soothing/sleep inducement, martial arts pressure points, antenna empathy.',
    description: 'Empath capable of pacifying celestial beings and striking nerve clusters with delicate precision.',
    imageUrl: '/images/characters/char-b-069.jpg',
    color: '#15803D',
    stats: { strength: 65, speed: 82, durability: 74, intelligence: 85, energy: 82, combat: 89 },
    specialAbilities: [
      { name: 'Sleep Touch Command', description: 'Touches the opponent forehead, forcing an instantaneous state of slumber.', bonusPower: 4, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 80
  },
  {
    id: 'char-b-070',
    name: 'Cosmo the Spacedog',
    alias: 'Knowhere Security Chief',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Omega telekinesis & telepathy, Soviet spacesuit, telekinetic shields and projectile control.',
    description: 'Soviet space dog with staggering psychic and telekinetic powers ruling Knowhere security.',
    imageUrl: '/images/characters/char-b-070.jpg',
    color: '#F59E0B',
    stats: { strength: 60, speed: 80, durability: 78, intelligence: 92, energy: 90, combat: 80 },
    specialAbilities: [
      { name: 'Telekinetic Canine Bark', description: 'Blasts an invisible telekinetic shockwave that hurls heavy foes back.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-071',
    name: 'Howard the Duck',
    alias: 'Master of Quack-Fu (Mech Rig)',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 4,
    powers: 'Quack-Fu martial arts, heavy BF-Duck blaster cannon, dimensional luck, mini power-armor.',
    description: 'Dimension-stranded waterfowl piloting an armored exo-suit equipped with heavy plasma ordnance.',
    imageUrl: '/images/characters/char-b-071.jpg',
    color: '#D97706',
    stats: { strength: 70, speed: 76, durability: 80, intelligence: 90, energy: 80, combat: 82 },
    specialAbilities: [
      { name: 'BF-Blaster Overload', description: 'Fires an oversized cartoonish plasma cannon with surprising kick.', bonusPower: 4, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 80
  },
  {
    id: 'char-b-072',
    name: 'Scorpion',
    alias: 'Mac Gargan',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Cybernetic acid-spraying mechanical tail, cyber-armor exoskeleton, superhuman physical stats.',
    description: 'Armored villain armed with a prehensile steel scorpion tail that sprays lethal acid jets.',
    imageUrl: '/images/characters/char-b-072.jpg',
    color: '#16A34A',
    stats: { strength: 82, speed: 82, durability: 85, intelligence: 74, energy: 60, combat: 84 },
    specialAbilities: [
      { name: 'Acid Tail Stinger', description: 'Stabs forward with mechanical stinger, spraying corrosive acid.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-073',
    name: 'Vulture',
    alias: 'Adrian Toomes (Chitauri Flight Rig)',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 4,
    powers: 'Turbofan flight wingsuit, Chitauri plasma weapons, aerial dive-bombing speed.',
    description: 'Equipped with a winged mechanical flight harness and salvaged alien energy weaponry.',
    imageUrl: '/images/characters/char-b-073.jpg',
    color: '#047857',
    stats: { strength: 74, speed: 88, durability: 78, intelligence: 88, energy: 75, combat: 80 },
    specialAbilities: [
      { name: 'Talon Dive Bomb', description: 'Dives from high altitude with mechanical talons and plasma cannons.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-074',
    name: 'Hobgoblin',
    alias: 'Roderick Kingsley',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Upgraded Goblin formula, spark-spark bat blades, incendiary bombs, glider combat.',
    description: 'Cunning fashion magnate who improved Norman Osborn formula for greater physical potency.',
    imageUrl: '/images/characters/char-b-074.jpg',
    color: '#EA580C',
    stats: { strength: 82, speed: 84, durability: 82, intelligence: 92, energy: 70, combat: 85 },
    specialAbilities: [
      { name: 'Incendiary Goblin Blitz', description: 'Rains incendiary goblin bombs from his armored glider.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-075',
    name: 'Kingpin',
    alias: 'Wilson Fisk (Prime Heavyweight)',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Pure muscle mass physical power, bone-crushing bear hug, kevlar 3-piece suit, diamond cane.',
    description: 'Underworld kingpin possessing hundreds of pounds of solid muscle and ruthless brutality.',
    imageUrl: '/images/characters/char-b-075.jpg',
    color: '#334155',
    stats: { strength: 84, speed: 70, durability: 86, intelligence: 96, energy: 30, combat: 90 },
    specialAbilities: [
      { name: 'Bone-Crushing Bearhug', description: 'Traps the opponent in an inescapable vice grip of pure muscle.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-076',
    name: 'The Punisher (Tactical Armor)',
    alias: 'Frank Castle',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 5,
    powers: 'Advanced tactical exoskeleton, high-caliber arsenal, pain tolerance, military combat veteran.',
    description: 'One-man army waged in a permanent war on crime with uncompromising marksmanship and grit.',
    imageUrl: '/images/characters/char-b-076.jpg',
    color: '#0F172A',
    stats: { strength: 76, speed: 78, durability: 84, intelligence: 88, energy: 45, combat: 96 },
    specialAbilities: [
      { name: 'Armor-Piercing Burst', description: 'Unloads a coordinated spray of heavy armor-piercing ammunition.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-077',
    name: 'Daredevil (Shadowland Master)',
    alias: 'Matt Murdock',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: '360 radar sense, Hand ninja mastery, dual billy clubs, hyper-honed human senses.',
    description: 'The Man Without Fear using 360-degree radar vision and master martial arts in the dark.',
    imageUrl: '/images/characters/char-b-077.jpg',
    color: '#DC2626',
    stats: { strength: 74, speed: 88, durability: 78, intelligence: 90, energy: 45, combat: 98 },
    specialAbilities: [
      { name: 'Radar Sense Counter', description: 'Detects the enemy attack micro-seconds before impact to strike first.', bonusPower: 5, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-078',
    name: 'Iron Patriot',
    alias: 'Norman Osborn (Patriot Armor)',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Stark technology suit, repulsor blasts, smart missiles, Osborn ruthless leadership.',
    description: 'Norman Osborn commanding the Dark Avengers from within a red-white-and-blue Stark suit.',
    imageUrl: '/images/characters/char-b-078.jpg',
    color: '#1E3A8A',
    stats: { strength: 84, speed: 86, durability: 86, intelligence: 94, energy: 88, combat: 85 },
    specialAbilities: [
      { name: 'Star-Spangled Repulsor', description: 'Discharges high-voltage chest star repulsor beam.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-079',
    name: 'Ironheart',
    alias: 'Riri Williams (Mark 2 Armor)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Custom high-tech power suit, AI co-pilot, micro-repulsors, magnetic thrusters.',
    description: 'Teenage engineering prodigy who reverse-engineered Stark technology to build her own suit.',
    imageUrl: '/images/characters/char-b-079.jpg',
    color: '#F43F5E',
    stats: { strength: 80, speed: 88, durability: 84, intelligence: 97, energy: 86, combat: 80 },
    specialAbilities: [
      { name: 'Micro-Repulsor Swarm', description: 'Fires multi-directional micro-laser blasts while dodging in air.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-080',
    name: 'Falcon (Captain America Suit)',
    alias: 'Sam Wilson',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Vibranium wings, Captain America shield, Redwing recon drone, aerial dogfighting mastery.',
    description: 'Sam Wilson wielding the Captain America mantle with agile vibranium flight wings.',
    imageUrl: '/images/characters/char-b-080.jpg',
    color: '#0284C7',
    stats: { strength: 76, speed: 92, durability: 82, intelligence: 86, energy: 60, combat: 93 },
    specialAbilities: [
      { name: 'Vibranium Wing Dive Shield', description: 'Wraps in vibranium wings before launching a shield strike.', bonusPower: 4, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 83
  },
  {
    id: 'char-b-081',
    name: 'Patriot',
    alias: 'Elijah Bradley',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Super Soldier bloodline strength, throwing star darts, triangular shield, Young Avenger leader.',
    description: 'Grandson of Isaiah Bradley who inherited enhanced super soldier strength and tactical heart.',
    imageUrl: '/images/characters/char-b-081.jpg',
    color: '#2563EB',
    stats: { strength: 78, speed: 80, durability: 80, intelligence: 82, energy: 40, combat: 89 },
    specialAbilities: [
      { name: 'Patriot Shield Charge', description: 'Charges forward with triangular star shield in a concussive tackle.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-b-082',
    name: 'Wiccan',
    alias: 'Billy Kaplan',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Chaos spell incantations, reality warp potential, telekinesis, force field domes.',
    description: 'Reincarnated son of Scarlet Witch possessing immense natural talent for spellcasting.',
    imageUrl: '/images/characters/char-b-082.jpg',
    color: '#3B82F6',
    stats: { strength: 65, speed: 78, durability: 78, intelligence: 90, energy: 94, combat: 80 },
    specialAbilities: [
      { name: 'Incantation Warp', description: 'Chants a protective spell that redirects incoming energy.', bonusPower: 5, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-083',
    name: 'Speed',
    alias: 'Tommy Shepherd',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Hyper-acceleration running, molecular hyper-vibration explosions, rapid perception.',
    description: 'Reincarnated twin brother of Wiccan able to run at Mach speeds and vibrate matter to explode.',
    imageUrl: '/images/characters/char-b-083.jpg',
    color: '#10B981',
    stats: { strength: 70, speed: 96, durability: 74, intelligence: 80, energy: 70, combat: 82 },
    specialAbilities: [
      { name: 'Hyper-Vibration Tap', description: 'Vibrates enemy armor at extreme frequencies causing it to buckle.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-b-084',
    name: 'Hulkling',
    alias: 'Emperor Dorrek VIII',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Kree-Skrull shapeshifting, superhuman strength, Excelsior cosmic sword, healing factor.',
    description: 'Alliance Emperor of the unified Kree-Skrull Empire wielding the legendary sword Excelsior.',
    imageUrl: '/images/characters/char-b-084.jpg',
    color: '#22C55E',
    stats: { strength: 86, speed: 80, durability: 88, intelligence: 82, energy: 75, combat: 88 },
    specialAbilities: [
      { name: 'Excelsior Cosmic Slash', description: 'Cleaves with the ancient sword of the Kree-Skrull Alliance.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-b-085',
    name: 'America Chavez',
    alias: 'Miss America',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Star-shaped multiverse portal creation, superhuman strength, flight, dimension kick.',
    description: 'Utopian Parallel hero who punches star-shaped portals directly through the multiverse.',
    imageUrl: '/images/characters/char-b-085.jpg',
    color: '#2563EB',
    stats: { strength: 85, speed: 86, durability: 86, intelligence: 80, energy: 88, combat: 86 },
    specialAbilities: [
      { name: 'Star Portal Kick', description: 'Kicks open a dimensional star portal that crashes onto the opponent.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  }
];

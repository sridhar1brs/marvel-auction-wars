// Auto-generated 350 Character Signature Move & Animation Database
import { Character } from '../types/game';

export type CombatEffectType =
  | 'web'
  | 'laser'
  | 'lightning'
  | 'claw'
  | 'shield'
  | 'magic'
  | 'cosmic'
  | 'fire'
  | 'symbiote'
  | 'gamma_smash'
  | 'sonic'
  | 'arrow'
  | 'telekinetic'
  | 'gun_kata'
  | 'ice'
  | 'chi_martial'
  | 'pym_particle'
  | 'shadow_portal'
  | 'water_ocean'
  | 'blade_dance'
  | 'melee'
  | 'none';

export interface CharacterSignatureMove {
  characterId: string;
  characterName: string;
  moveName: string;
  effectType: CombatEffectType;
  comicBurstWord: string;
  color: string;
  icon: string;
  description: string;
}

// Helper function to derive move dynamically for any character in runtime
export function getSignatureMoveForCharacter(character?: Character | null): CharacterSignatureMove {
  if (!character) {
    return {
      characterId: 'unknown',
      characterName: 'Hero',
      moveName: 'Kinetic Strike',
      effectType: 'melee',
      comicBurstWord: 'SMASH!',
      color: '#F59E0B',
      icon: '💥',
      description: 'Standard combat strike.'
    };
  }

  const name = (character.name || '').toLowerCase();
  const alias = (character.alias || '').toLowerCase();
  const powers = (character.powers || '').toLowerCase();
  const desc = (character.description || '').toLowerCase();
  const all = `${name} ${alias} ${powers} ${desc}`;

  // 1. Web Heroes (Spider-Man family)
  if (all.includes('spider') || all.includes('web') || all.includes('arachnid') || all.includes('silk') || (all.includes('venom') && name.includes('spider'))) {
    if (name.includes('miles')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Venom-Blast Slingshot Burst',
        effectType: 'web',
        comicBurstWord: 'THWIP-ZAP!',
        color: '#EAB308',
        icon: '🕷️',
        description: 'Blasts bio-electric venom shockwaves while slingshotting through high-tension web strands.'
      };
    }
    if (name.includes('gwen') || name.includes('ghost-spider')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Acrobatic Freestyle Web-Snare',
        effectType: 'web',
        comicBurstWord: 'THWIP!',
        color: '#EC4899',
        icon: '🕸️',
        description: 'Flips through the air weaving tensile webbing nets to disorient and pin the target.'
      };
    }
    if (name.includes('punk')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Anarchy Guitar Amp Sonic Web',
        effectType: 'web',
        comicBurstWord: 'SHRED!',
        color: '#EF4444',
        icon: '🎸',
        description: 'Strikes an overdriven power chord that blasts sonic web-shards into the opponent.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Maximum Spider Web-Barrage',
      effectType: 'web',
      comicBurstWord: 'THWIP!',
      color: '#38BDF8',
      icon: '🕸️',
      description: 'Zips across the battleground at hyper-speed wrapping the enemy in high-tensile impact webbing.'
    };
  }

  // 2. Symbiotes
  if (all.includes('symbiote') || all.includes('venom') || all.includes('carnage') || all.includes('knull') || all.includes('toxin') || all.includes('scream') || all.includes('all-black')) {
    if (name.includes('carnage')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Chaos Tendril Evisceration',
        effectType: 'symbiote',
        comicBurstWord: 'SLAUGHTER!',
        color: '#DC2626',
        icon: '🩸',
        description: 'Transforms symbiote limbs into serrated crimson axe-blades and impaling tendrils.'
      };
    }
    if (name.includes('knull')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'All-Black Necrosword Decapitation',
        effectType: 'symbiote',
        comicBurstWord: 'VOID-SLASH!',
        color: '#7F1D1D',
        icon: '🗡️',
        description: 'Summons primordial abyss shadow blades to decapitate cosmic vitality.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Symbiote Maw & Tendril Spike',
      effectType: 'symbiote',
      comicBurstWord: 'WE ARE VENOM!',
      color: '#1E293B',
      icon: '🖤',
      description: 'Erupts pitch-black tendril spikes while lunging with colossal ravenous fangs.'
    };
  }

  // 3. Lightning / Thunder (Thor, Storm, Electro)
  if (all.includes('lightning') || all.includes('thunder') || all.includes('storm') || all.includes('electro') || all.includes('mjolnir') || all.includes('bifrost')) {
    if (name.includes('storm')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Omega Tempest Lightning Storm',
        effectType: 'lightning',
        comicBurstWord: 'KRA-BOOM!',
        color: '#38BDF8',
        icon: '⚡',
        description: 'Summons an atmospheric hurricane with supercharged cascading lightning bolts.'
      };
    }
    if (name.includes('electro')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'High-Voltage Giga-Volt Surge',
        effectType: 'lightning',
        comicBurstWord: 'BZZZZT!',
        color: '#FACC15',
        icon: '⚡',
        description: 'Discharges 100,000,000 volts of pure unconstrained electrical energy.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Asgardian God-Blast Lightning',
      effectType: 'lightning',
      comicBurstWord: 'THUNDER-STRIKE!',
      color: '#0284C7',
      icon: '🔨',
      description: 'Hurls the enchanted uru hammer coated in crackling cosmic bifrost thunderbolts.'
    };
  }

  // 4. Repulsor / Energy Beams / Lasers (Iron Man, Cyclops, Vision, War Machine)
  if (all.includes('laser') || all.includes('repulsor') || all.includes('unibeam') || all.includes('optic') || all.includes('cyclops') || all.includes('vision') || all.includes('iron man')) {
    if (name.includes('cyclops')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Full-Visor Optic Annihilation',
        effectType: 'laser',
        comicBurstWord: 'OPTIC BLAST!',
        color: '#DC2626',
        icon: '🔴',
        description: 'Removes the ruby-quartz visor to release an uncontrollable concussive red laser beam.'
      };
    }
    if (name.includes('vision')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Solar Gem Density Beam',
        effectType: 'laser',
        comicBurstWord: 'SOLAR RAY!',
        color: '#F59E0B',
        icon: '💎',
        description: 'Channels concentrated solar radiation from the Mind Stone forehead gem.'
      };
    }
    if (name.includes('war machine')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Full Metal Heavy Ordnance Barrage',
        effectType: 'laser',
        comicBurstWord: 'LOCK & LOAD!',
        color: '#64748B',
        icon: '🚀',
        description: 'Fires shoulder miniguns, bunker-buster rockets, and dual palm repulsors simultaneously.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Chest Reactor Unibeam Overdrive',
      effectType: 'laser',
      comicBurstWord: 'UNIBEAM!',
      color: '#EF4444',
      icon: '⚡',
      description: 'Directs 100% arc reactor energy into an impenetrable searing thermal laser pillar.'
    };
  }

  // 5. Adamantium Claws / Blades (Wolverine, Black Panther, Blade, X-23)
  if (all.includes('claw') || all.includes('adamantium') || all.includes('wolverine') || all.includes('blade') || all.includes('panther') || all.includes('sabretooth') || all.includes('x-23')) {
    if (name.includes('panther') || name.includes('shuri')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Vibranium Kinetic Claw Rend',
        effectType: 'claw',
        comicBurstWord: 'WAKANDA FOREVER!',
        color: '#A855F7',
        icon: '🐾',
        description: 'Slices through armored plating with anti-metal vibranium claws while expelling stored kinetic shockwaves.'
      };
    }
    if (name.includes('blade')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Daywalker Silver Sword Evisceration',
        effectType: 'claw',
        comicBurstWord: 'SHINK!',
        color: '#93C5FD',
        icon: '🗡️',
        description: 'Executes blinding sword kata with silver-edged blades cutting through supernatural armor.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Berserker Adamantium Slits',
      effectType: 'claw',
      comicBurstWord: 'SNIKT!',
      color: '#38BDF8',
      icon: '🩸',
      description: 'Lunges into a feral mutant frenzy, shredding target defenses with indestructible adamantium claws.'
    };
  }

  // 6. Shield Ricochet / Vibranium (Cap, Carter, US Agent, Patriot)
  if (all.includes('shield') || all.includes('captain america') || all.includes('carter') || all.includes('us agent')) {
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Vibranium Shield Ricochet Storm',
      effectType: 'shield',
      comicBurstWord: 'CLANG!',
      color: '#0284C7',
      icon: '🛡️',
      description: 'Hurls the proto-vibranium disc across complex geometric angles, bouncing off targets with kinetic force.'
    };
  }

  // 7. Gamma Seismic Smash (Hulk, She-Hulk, Red Hulk, Abomination, Skaar)
  if (all.includes('gamma') || all.includes('hulk') || all.includes('abomination') || all.includes('skaar') || all.includes('smash')) {
    if (name.includes('red hulk')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Tactical Hellfire Gamma Eruption',
        effectType: 'gamma_smash',
        comicBurstWord: 'INFERNO SMASH!',
        color: '#DC2626',
        icon: '🌋',
        description: 'Heats gamma blood to incandescent magma levels, exploding the surrounding terrain in fiery fury.'
      };
    }
    if (name.includes('she-hulk')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Sensational Seismic Dropkick',
        effectType: 'gamma_smash',
        comicBurstWord: 'OBJECTION!',
        color: '#10B981',
        icon: '⚖️',
        description: 'Delivers a colossal gamma-powered aerial dropkick shattering bedrock.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'World-Breaker Gamma Earth-Shatter',
      effectType: 'gamma_smash',
      comicBurstWord: 'HULK SMASH!',
      color: '#22C55E',
      icon: '💥',
      description: 'Slams twin fists into the earth with infinite rage, triggering catastrophic seismic fault-line ruptures.'
    };
  }

  // 8. Eldritch Magic & Sorcery (Doctor Strange, Scarlet Witch, Loki, Clea, Magik)
  if (all.includes('magic') || all.includes('sorcery') || all.includes('mystic') || all.includes('strange') || all.includes('scarlet') || all.includes('wanda') || all.includes('loki') || all.includes('magik') || all.includes('voodoo') || all.includes('nico')) {
    if (name.includes('wanda') || name.includes('scarlet')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Chaos Magic Reality Hex',
        effectType: 'magic',
        comicBurstWord: 'CHAOS HEX!',
        color: '#EC4899',
        icon: '🔮',
        description: 'Channels primordial Chaos Magic to rewrite local reality and disintegrate enemy defenses.'
      };
    }
    if (name.includes('loki')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'God of Mischief Illusion Dagger',
        effectType: 'magic',
        comicBurstWord: 'MISCHIEF!',
        color: '#10B981',
        icon: '🐍',
        description: 'Splits into dozen illusion decoys before striking from behind with cursed Asgardian daggers.'
      };
    }
    if (name.includes('magik')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Soulsword Limbo Stepping Discs',
        effectType: 'magic',
        comicBurstWord: 'LIMBO!',
        color: '#A855F7',
        icon: '👑',
        description: 'Opens dark teleportation discs while cleaving spiritual life essence with the magical Soulsword.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Seven Rings of Raggadorr & Eldritch Blast',
      effectType: 'magic',
      comicBurstWord: 'BY THE VISHANTI!',
      color: '#D946EF',
      icon: '✨',
      description: 'Conjures glowing Tao mandalas and mystical Sanskrit runes to cast an overwhelming Eldritch beam.'
    };
  }

  // 9. Fire / Thermal / Hellfire (Human Torch, Ghost Rider, Sunspot, Phoenix, Firestar)
  if (all.includes('fire') || all.includes('flame') || all.includes('torch') || all.includes('ghost rider') || all.includes('phoenix') || all.includes('sunspot') || all.includes('hellfire') || all.includes('pyro')) {
    if (name.includes('ghost rider')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Penance Stare Hellfire Chain',
        effectType: 'fire',
        comicBurstWord: 'BURN IN SINS!',
        color: '#F97316',
        icon: '💀',
        description: 'Wraps the target in burning Hellfire chains and burns their soul with the Penance Stare.'
      };
    }
    if (name.includes('phoenix')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Dark Phoenix Cosmic Supernova',
        effectType: 'fire',
        comicBurstWord: 'REBIRTH!',
        color: '#F59E0B',
        icon: '🔥',
        description: 'Spreads immortal cosmic fire wings, engulfing the star system in life-and-death cosmic flames.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Supernova Flame Blast',
      effectType: 'fire',
      comicBurstWord: 'FLAME ON!',
      color: '#EA580C',
      icon: '🔥',
      description: 'Superheats internal plasma energy to the temperature of the sun, launching a massive fireball.'
    };
  }

  // 10. Cosmic / Reality Warping (Thanos, Galactus, Tribunal, Surfer, Adam Warlock, Captain Marvel, Nova)
  if (character.grade === 'MYTHIC' || all.includes('cosmic') || all.includes('thanos') || all.includes('galactus') || all.includes('surfer') || all.includes('eternity') || all.includes('warlock') || all.includes('nova') || all.includes('marvel')) {
    if (name.includes('thanos')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Infinity Gauntlet Reality Snap',
        effectType: 'cosmic',
        comicBurstWord: 'SNAP!',
        color: '#8B5CF6',
        icon: '💎',
        description: 'Channels all 6 Infinity Stones to bend time, space, reality, and power into atomic dust.'
      };
    }
    if (name.includes('galactus')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Cosmic Devourer Matter Erasure',
        effectType: 'cosmic',
        comicBurstWord: 'OBLIVION!',
        color: '#9333EA',
        icon: '🪐',
        description: 'Consumes planetary life essence and converts target matter into raw cosmic radiation.'
      };
    }
    if (name.includes('surfer')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Power Cosmic Sub-Atomic Beam',
        effectType: 'cosmic',
        comicBurstWord: 'POWER COSMIC!',
        color: '#06B6D4',
        icon: '🏄‍♂️',
        description: 'Rides cosmic solar winds while directing the pure fundamental energy of the universe.'
      };
    }
    if (name.includes('captain marvel')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Binary Form Photon Cannon',
        effectType: 'cosmic',
        comicBurstWord: 'HIGHER FURTHER FASTER!',
        color: '#F59E0B',
        icon: '⭐',
        description: 'Enters Radiant Binary state and fires stellar photon blasts directly from the core.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Multiversal Cosmic Judgement',
      effectType: 'cosmic',
      comicBurstWord: 'JUDGEMENT!',
      color: '#A855F7',
      icon: '🌌',
      description: 'Manifests celestial equilibrium energy to rewrite the opponent out of the timeline.'
    };
  }

  // 11. Sonic Shriek (Black Bolt, Banshee, Siryn, Songbird, Klaw)
  if (all.includes('sonic') || all.includes('black bolt') || all.includes('banshee') || all.includes('voice') || all.includes('shriek') || all.includes('klaw')) {
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Quasi-Sonic Inhuman Whisper',
      effectType: 'sonic',
      comicBurstWord: 'SHATTER!',
      color: '#06B6D4',
      icon: '🔊',
      description: 'Utters a subtle vocal whisper that triggers hyper-resonant sonic seismic shockwaves leveling mountains.'
    };
  }

  // 12. Archery (Hawkeye, Kate Bishop, Bullseye, Yondu)
  if (all.includes('bow') || all.includes('arrow') || all.includes('hawkeye') || all.includes('bullseye') || all.includes('yondu') || all.includes('yaka')) {
    if (name.includes('yondu')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Whistle Yaka Arrow Piercing Trajectory',
        effectType: 'arrow',
        comicBurstWord: 'WHISTLE!',
        color: '#EF4444',
        icon: '🏹',
        description: 'Whistles a melodic tune guiding a self-steering red Yaka arrow through enemy defenses.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Trick Arrow Cluster Detonation',
      effectType: 'arrow',
      comicBurstWord: 'BULLSEYE!',
      color: '#8B5CF6',
      icon: '🎯',
      description: 'Lofts a high-speed quiver of sonic, explosive, and EMP trick arrowheads right on target.'
    };
  }

  // 13. Psionic / Telekinesis (Jean Grey, Emma Frost, Psylocke, Cable, Professor X)
  if (all.includes('telepath') || all.includes('telekinetic') || all.includes('psionic') || all.includes('mind') || all.includes('psylocke') || all.includes('emma frost') || all.includes('xavier') || all.includes('cable')) {
    if (name.includes('psylocke')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Psionic Katana Mind-Slash',
        effectType: 'telekinetic',
        comicBurstWord: 'PSI-BLADE!',
        color: '#EC4899',
        icon: '🗡️',
        description: 'Focuses telepathic totality into a psychic energy blade cutting neural pathways.'
      };
    }
    if (name.includes('emma')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Organic Diamond Psychic Shatter',
        effectType: 'telekinetic',
        comicBurstWord: 'DIAMOND CRUSH!',
        color: '#E0F2FE',
        icon: '💎',
        description: 'Hardens into invulnerable organic diamond while releasing telepathic migraines.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Telekinetic Gravity Crush',
      effectType: 'telekinetic',
      comicBurstWord: 'PSI-CRUSH!',
      color: '#C084FC',
      icon: '🧠',
      description: 'Lifts massive environmental debris and compresses kinetic gravity around the target.'
    };
  }

  // 14. Gun Kata & Ballistics (Punisher, Winter Soldier, Nick Fury, Domino, Crossbones, Deadpool)
  if (all.includes('gun') || all.includes('bullet') || all.includes('punisher') || all.includes('winter soldier') || all.includes('deadpool') || all.includes('fury') || all.includes('firearm') || all.includes('sniper')) {
    if (name.includes('deadpool')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Fourth-Wall Chimichanga Gun-Kata',
        effectType: 'gun_kata',
        comicBurstWord: 'BANG BANG BANG!',
        color: '#DC2626',
        icon: '🌮',
        description: 'Pirouettes through the air dual-wielding desert eagles and katanas with chaotic humor.'
      };
    }
    if (name.includes('winter soldier')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Cybernetic Bionic Arm Sniper Shot',
        effectType: 'gun_kata',
        comicBurstWord: 'HEADSHOT!',
        color: '#64748B',
        icon: '🦾',
        description: 'Punches through concrete with Soviet bionic arm and fires a high-caliber armor-piercing round.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Heavy Ordnance Gun-Kata Blitz',
      effectType: 'gun_kata',
      comicBurstWord: 'BLAM-BLAM!',
      color: '#334155',
      icon: '🔫',
      description: 'Unloads rapid-fire tactical assault rifle volleys and grenade clusters with lethal discipline.'
    };
  }

  // 15. Ice / Cryo (Iceman, Blizzard, Frost Giant, Luna Snow)
  if (all.includes('ice') || all.includes('cryo') || all.includes('frost') || all.includes('freeze') || all.includes('cold') || all.includes('blizzard')) {
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Absolute Zero Crystalline Avalanche',
      effectType: 'ice',
      comicBurstWord: 'FREEZE!',
      color: '#38BDF8',
      icon: '❄️',
      description: 'Lowers local ambient temperature to Absolute Zero, encasing the enemy in razor ice spires.'
    };
  }

  // 16. Chi & Martial Arts (Shang-Chi, Iron Fist, Daredevil, Elektra, Moon Knight)
  if (all.includes('martial') || all.includes('kung fu') || all.includes('chi') || all.includes('shang-chi') || all.includes('iron fist') || all.includes('daredevil') || all.includes('elektra') || all.includes('fist')) {
    if (name.includes('shang-chi')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Ten Rings Dragon Chi Combo',
        effectType: 'chi_martial',
        comicBurstWord: 'DRAGON STRIKE!',
        color: '#F59E0B',
        icon: '🐉',
        description: 'Commands the mystical Ten Rings to execute a devastating hypersonic martial arts sequence.'
      };
    }
    if (name.includes('iron fist')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Shou-Lao Iron Fist Dragon Punch',
        effectType: 'chi_martial',
        comicBurstWord: 'IRON FIST!',
        color: '#EAB308',
        icon: '👊',
        description: 'Focuses dragon chi into a molten golden fist strike that shatters stone like glass.'
      };
    }
    if (name.includes('daredevil')) {
      return {
        characterId: character.id,
        characterName: character.name,
        moveName: 'Radar-Sense Billy Club Ricochet',
        effectType: 'chi_martial',
        comicBurstWord: 'WHACK!',
        color: '#DC2626',
        icon: '🦯',
        description: 'Utilizes 360-degree radar sense to ricochet steel cable billy clubs into pressure points.'
      };
    }
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Master Kung-Fu Pressure Strike',
      effectType: 'chi_martial',
      comicBurstWord: 'HI-YAH!',
      color: '#F59E0B',
      icon: '🥋',
      description: 'Delivers a rapid series of precision palm strikes and spinning kicks disrupting opponent chi.'
    };
  }

  // 17. Pym Particles (Ant-Man, Wasp, Giant-Man, Yellowjacket)
  if (all.includes('pym') || all.includes('ant-man') || all.includes('wasp') || all.includes('giant') || all.includes('shrink')) {
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Subatomic Shrink & Colossal Giant Slam',
      effectType: 'pym_particle',
      comicBurstWord: 'GROWTH SPURT!',
      color: '#EF4444',
      icon: '🐜',
      description: 'Shrinks to ant size to dodge strikes before expanding instantly into a 60-foot colossal titan.'
    };
  }

  // 18. Shadow / Teleportation (Nightcrawler, Cloak, Spot, Blink)
  if (all.includes('teleport') || all.includes('shadow') || all.includes('portal') || all.includes('nightcrawler') || all.includes('cloak') || all.includes('darkforce') || all.includes('spot')) {
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Brimstone Bamf Shadow Ambush',
      effectType: 'shadow_portal',
      comicBurstWord: 'BAMF!',
      color: '#7C3AED',
      icon: '💨',
      description: 'Teleports through the Brimstone dimension in a cloud of sulfur, striking from 4 angles in a split second.'
    };
  }

  // 19. Water & Ocean (Namor, Attuma, Namora, Triton, Hydro-Man)
  if (all.includes('water') || all.includes('ocean') || all.includes('sea') || all.includes('atlantis') || all.includes('namor') || all.includes('trident') || all.includes('hydro')) {
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Neptune\'s Trident Tidal Surge',
      effectType: 'water_ocean',
      comicBurstWord: 'IMPERIUS REX!',
      color: '#0284C7',
      icon: '🔱',
      description: 'Summons high-pressure oceanic whirlpools while thrusting Neptune\'s divine golden trident.'
    };
  }

  // 20. Blade / Katana / Sword Masters (Gamora, Valkyrie, Sif, Taskmaster, Black Knight, Swordsman)
  if (all.includes('sword') || all.includes('blade') || all.includes('valkyrie') || all.includes('gamora') || all.includes('katana') || all.includes('black knight')) {
    return {
      characterId: character.id,
      characterName: character.name,
      moveName: 'Deadliest Blade Dance Cleave',
      effectType: 'blade_dance',
      comicBurstWord: 'SLASH!',
      color: '#94A3B8',
      icon: '⚔️',
      description: 'Performs an acrobatic sword dance striking vulnerable vital points with razor precision.'
    };
  }

  // 21. Default Melee Brawler
  return {
    characterId: character.id,
    characterName: character.name,
    moveName: `${character.name}'s Kinetic Power Blitz`,
    effectType: 'melee',
    comicBurstWord: 'KAPOW!',
    color: '#F59E0B',
    icon: '💥',
    description: 'Steps into close quarters unleashing a thunderous combination of raw power strikes.'
  };
}

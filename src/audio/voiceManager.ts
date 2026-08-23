// Marvel Hero Quotes and Procedural Voice & SFX Synthesizer
import { Character } from '../types/game';
import { soundManager } from './soundManager';

export interface MarvelQuote {
  quote: string;
  sfx: 'repulsor' | 'thunder' | 'web' | 'smash' | 'snikt' | 'shield' | 'snap' | 'portal' | 'roar' | 'sword' | 'cosmic' | 'generic';
  pitch: number;
  rate: number;
}

const ICONIC_QUOTES: Record<string, MarvelQuote> = {
  'Iron Man': { quote: 'I am Iron Man.', sfx: 'repulsor', pitch: 1.0, rate: 0.95 },
  'Thor Odinson': { quote: 'For Asgard! Bring me Thanos!', sfx: 'thunder', pitch: 0.85, rate: 0.9 },
  'Spider-Man': { quote: 'With great power comes great responsibility!', sfx: 'web', pitch: 1.15, rate: 1.05 },
  'Miles Morales': { quote: 'Nah, Imma do my own thing!', sfx: 'web', pitch: 1.1, rate: 1.05 },
  'Hulk': { quote: 'HULK SMASH ALL PUNY OPPONENTS!', sfx: 'smash', pitch: 0.6, rate: 0.8 },
  'Wolverine': { quote: "I'm the best there is at what I do.", sfx: 'snikt', pitch: 0.8, rate: 0.9 },
  'Captain America': { quote: 'I can do this all day.', sfx: 'shield', pitch: 0.95, rate: 0.95 },
  'Thanos': { quote: 'I am... inevitable.', sfx: 'snap', pitch: 0.7, rate: 0.85 },
  'Deadpool': { quote: 'Maximum effort! Cue the music!', sfx: 'generic', pitch: 1.2, rate: 1.1 },
  'Doctor Strange': { quote: "Dormammu, I've come to bargain!", sfx: 'portal', pitch: 0.9, rate: 0.95 },
  'Black Panther': { quote: 'Wakanda Forever!', sfx: 'shield', pitch: 0.88, rate: 0.95 },
  'Venom': { quote: 'WE... ARE... VENOM!', sfx: 'roar', pitch: 0.65, rate: 0.85 },
  'Blade': { quote: 'Some vampires are always trying to ice skate uphill.', sfx: 'sword', pitch: 0.8, rate: 0.9 },
  'Knull': { quote: 'I am the Void. I am the Lord of the Abyss.', sfx: 'roar', pitch: 0.55, rate: 0.8 },
  'Galactus': { quote: 'My hunger consumes entire galaxies.', sfx: 'cosmic', pitch: 0.6, rate: 0.8 },
  'Ghost-Spider': { quote: 'Time to drop the beat on this fight!', sfx: 'web', pitch: 1.2, rate: 1.05 },
  'Scarlet Witch': { quote: 'You took everything from me.', sfx: 'portal', pitch: 0.95, rate: 0.9 },
  'Magneto': { quote: 'You are a god among insects. Never forget it.', sfx: 'cosmic', pitch: 0.8, rate: 0.9 },
  'Loki': { quote: 'I am burdened with glorious purpose.', sfx: 'portal', pitch: 1.05, rate: 0.95 },
  'Star-Lord': { quote: 'Dance off, bro! Me and you!', sfx: 'generic', pitch: 1.1, rate: 1.05 },
  'Groot': { quote: 'I am Groot!', sfx: 'smash', pitch: 0.7, rate: 0.85 },
  'Rocket Raccoon': { quote: "Ain't no thing like me, except me!", sfx: 'generic', pitch: 1.25, rate: 1.15 },
  'Captain Marvel': { quote: 'Higher, further, faster, baby!', sfx: 'cosmic', pitch: 1.05, rate: 1.0 },
};

class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private isVoiceEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public getQuoteForCharacter(character: Character): MarvelQuote {
    // Check direct match
    for (const [key, val] of Object.entries(ICONIC_QUOTES)) {
      if (character.name.toLowerCase().includes(key.toLowerCase())) {
        return val;
      }
    }

    // Default heroic quotes based on Grade & Alignment
    if (character.grade === 'MYTHIC') {
      return {
        quote: `Tremble before the cosmic power of ${character.name}!`,
        sfx: 'cosmic',
        pitch: 0.65,
        rate: 0.85,
      };
    }

    if (character.alignment === 'Villain') {
      return {
        quote: `None shall stand against ${character.name}!`,
        sfx: 'roar',
        pitch: 0.75,
        rate: 0.9,
      };
    }

    return {
      quote: `${character.name} is ready for battle!`,
      sfx: 'generic',
      pitch: 1.0,
      rate: 1.0,
    };
  }

  public playCharacterVoiceline(_character: Character) {
    // Character quotes sound disabled as requested by user
    return;
  }

  public playMarvelSFX(sfx: MarvelQuote['sfx']) {
    switch (sfx) {
      case 'thunder':
        soundManager.playMythicReveal();
        break;
      case 'web':
        soundManager.playSkip();
        break;
      case 'smash':
      case 'snikt':
      case 'sword':
        soundManager.playAttackHit();
        break;
      case 'repulsor':
      case 'portal':
      case 'cosmic':
      case 'snap':
        soundManager.playAbilityTrigger();
        break;
      default:
        soundManager.playBidPlaced();
        break;
    }
  }
}

export const voiceManager = new VoiceManager();

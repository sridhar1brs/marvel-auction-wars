import { soundManager } from './soundManager';

export type SoundEffectType = 
  | 'select' 
  | 'clash' 
  | 'powerUp' 
  | 'victory' 
  | 'attack' 
  | 'buzz'
  | 'bid'
  | 'gavel';

export function playSound(type: SoundEffectType) {
  try {
    switch (type) {
      case 'select':
      case 'bid':
      case 'buzz':
        soundManager.playClick();
        break;
      case 'clash':
      case 'attack':
        soundManager.playAttackHit();
        break;
      case 'powerUp':
        soundManager.playAbilityTrigger();
        break;
      case 'victory':
        soundManager.playVictory();
        break;
      case 'gavel':
        soundManager.playGavelWon();
        break;
      default:
        soundManager.playClick();
        break;
    }
  } catch {
    // Graceful fallback if audio context is blocked
  }
}

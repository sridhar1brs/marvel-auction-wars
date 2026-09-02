import React, { useState } from 'react';
import { Character } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { CombatFXOverlay, CombatEffectType, ComicBurst } from '../battle/fx/CombatFXOverlay';
import { Fighter2DSprite } from '../battle/fx/Fighter2DSprite';
import { BattlePresentation3D } from '../battle/BattlePresentation3D';
import { getSignatureMoveForCharacter } from '../../data/characterMoves';
import { findPossibleTagTeamFusions, mergeUltimateCharacter, TagTeamCombo } from '../../engine/synergyEngine';
import { soundManager } from '../../audio/soundManager';
import { 
  Swords, RotateCcw, Zap, Search, Trophy, Sparkles, Volume2, Shield, 
  Users, Plus, Trash2, ArrowLeft, Play, Award, Flame, Star, BookOpen,
  FastForward, CheckCircle2, History
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export type SeriesMode = 'BO1' | 'BO3' | 'BO5' | 'BO7' | 'BO10';

export const SERIES_CONFIG: Record<SeriesMode, { label: string; shortLabel: string; winsNeeded: number; totalMax: number; desc: string }> = {
  BO1: { label: 'BEST OF 1', shortLabel: 'BO1', winsNeeded: 1, totalMax: 1, desc: 'Single Sudden Death Clash (First to 1 win)' },
  BO3: { label: 'BEST OF 3', shortLabel: 'BO3', winsNeeded: 2, totalMax: 3, desc: 'Standard Match Series (First to 2 wins)' },
  BO5: { label: 'BEST OF 5', shortLabel: 'BO5', winsNeeded: 3, totalMax: 5, desc: 'Championship Series (First to 3 wins)' },
  BO7: { label: 'BEST OF 7', shortLabel: 'BO7', winsNeeded: 4, totalMax: 7, desc: 'Grand Finals Epic (First to 4 wins)' },
  BO10: { label: 'BEST OF 10', shortLabel: 'BO10', winsNeeded: 6, totalMax: 10, desc: 'Endurance Marathon (First to 6 wins)' },
};

export interface MatchRecord {
  matchNumber: number;
  winner: 'A' | 'B';
  mvpHero: string;
  defeatedHero: string;
  summary: string;
  whatWinnerDid: string;
  whatLoserShouldHaveDone: string;
}

function detectHeroCombatEffect(hero?: Character): CombatEffectType {
  if (!hero) return 'melee';
  const name = (hero.name || '').toLowerCase();
  const powers = (hero.powers || '').toLowerCase();
  const desc = (hero.description || '').toLowerCase();
  const all = `${name} ${powers} ${desc}`;

  if (all.includes('claw') || all.includes('wolverine') || all.includes('blade') || all.includes('panther')) return 'claw';
  if (all.includes('laser') || all.includes('repulsor') || all.includes('iron man') || all.includes('cyclops') || all.includes('vision')) return 'laser';
  if (all.includes('lightning') || all.includes('thunder') || all.includes('thor') || all.includes('storm') || all.includes('electro')) return 'lightning';
  if (all.includes('magic') || all.includes('sorcery') || all.includes('strange') || all.includes('wanda') || all.includes('scarlet')) return 'magic';
  if (all.includes('cosmic') || all.includes('thanos') || all.includes('tribunal') || all.includes('galactus') || all.includes('surfer') || all.includes('phoenix')) return 'cosmic';
  if (all.includes('fire') || all.includes('flame') || all.includes('torch') || all.includes('ghost rider')) return 'fire';
  if (all.includes('symbiote') || all.includes('venom') || all.includes('carnage') || all.includes('knull')) return 'symbiote';
  if (all.includes('shield') || all.includes('captain america')) return 'shield';
  return 'melee';
}

function generateTacticalDuelAnalysis(
  winnerTeam: 'A' | 'B',
  mvp: Character,
  defeatedHero: Character
): { whatWinnerDid: string; whatLoserShouldHaveDone: string } {
  const mvpName = mvp.name;
  const mvpPowers = (mvp.powers || '').toLowerCase();
  const mvpDesc = (mvp.description || '').toLowerCase();
  const mvpAll = `${mvpName} ${mvpPowers} ${mvpDesc}`.toLowerCase();

  const defName = defeatedHero.name;
  const defPowers = (defeatedHero.powers || '').toLowerCase();
  const defDesc = (defeatedHero.description || '').toLowerCase();
  const defAll = `${defName} ${defPowers} ${defDesc}`.toLowerCase();

  let whatWinnerDid = '';
  let whatLoserShouldHaveDone = '';

  // 1. Cosmic / Mythic Tier Domination
  if (mvp.grade === 'MYTHIC' && defeatedHero.grade !== 'MYTHIC') {
    whatWinnerDid = `${mvpName} tapped into supreme Cosmic reality warping, overpowering ${defName}'s mortal parameters with raw multiversal energy surges and omnipotent domain control.`;
    whatLoserShouldHaveDone = `${defName} should have avoided direct energy trades, deploying mystic concealment or sonic disruptor relics to deplete cosmic focus before engaging.`;
  }
  // 2. Agility / Evasion (Spider-Sense, Speedsters)
  else if (mvpAll.includes('spider') || mvpAll.includes('speed') || mvpAll.includes('agility') || mvpAll.includes('quicksilver') || mvpAll.includes('evasion')) {
    whatWinnerDid = `${mvpName} leveraged hyper-kinetic sensory reflexes (Spider-Sense & agility), dodging ${defName}'s heavy swings to land precision counter-blows on vulnerable pressure points.`;
    whatLoserShouldHaveDone = `${defName} should have established wide area-of-effect suppression zones and deployed kinetic snare traps rather than committing to slow, high-recoil power swings.`;
  }
  // 3. Vibranium / Heavy Kinetic Armor (Cap, Black Panther, Colossus, Juggernaut)
  else if (mvpAll.includes('vibranium') || mvpAll.includes('shield') || mvpAll.includes('armor') || mvpAll.includes('colossus') || mvpAll.includes('juggernaut')) {
    whatWinnerDid = `${mvpName} fortified defensive stance with kinetic shock absorption armor, parrying ${defName}'s offensive barrage and redirecting stored energy into a crushing counter-shockwave.`;
    whatLoserShouldHaveDone = `${defName} should have utilized armor-piercing energy beams, psychological hexes, or phase-shifting strikes to bypass physical kinetic armor plating entirely.`;
  }
  // 4. Fire / Thermal Elemental Advantage (Human Torch, Ghost Rider, Phoenix)
  else if (mvpAll.includes('fire') || mvpAll.includes('flame') || mvpAll.includes('torch') || mvpAll.includes('hellfire') || mvpAll.includes('phoenix')) {
    whatWinnerDid = `${mvpName} unleashed relentless high-temperature thermal waves, superheating the battleground and inflicting catastrophic cellular burns on ${defName}.`;
    whatLoserShouldHaveDone = `${defName} should have activated cryogenic cooling countermeasures, maintained high-altitude aerial distance, and deployed vacuum dampeners to starve ignition sources.`;
  }
  // 5. Eldritch Magic & Sorcery (Doctor Strange, Scarlet Witch, Clea, Loki)
  else if (mvpAll.includes('magic') || mvpAll.includes('mystic') || mvpAll.includes('sorcery') || mvpAll.includes('strange') || mvpAll.includes('scarlet')) {
    whatWinnerDid = `${mvpName} warped dimensional physics with Eldritch runes, bypassing ${defName}'s physical and electronic defenses to strike spiritual astral vulnerabilities.`;
    whatLoserShouldHaveDone = `${defName} should have deployed anti-magic quantum dampeners, null-magic artifacts, and interrupted spell casting cadences with high-velocity physical strikes.`;
  }
  // 6. Healing Factor & Attrition (Wolverine, Deadpool, Hulk)
  else if (mvpAll.includes('healing') || mvpAll.includes('wolverine') || mvpAll.includes('deadpool') || mvpAll.includes('hulk') || mvpAll.includes('regen')) {
    whatWinnerDid = `${mvpName} absorbed lethal impact through hyper-accelerated cellular regeneration, winning a brutal war of attrition as ${defName}'s stamina and focus decayed.`;
    whatLoserShouldHaveDone = `${defName} should have prioritized high-burst one-shot kinetic finishers or cryogenic immobilization instead of light trades that allowed ${mvpName}'s healing factor to reset.`;
  }
  // 7. Tech & Tactical Precision (Iron Man, Mister Fantastic, Doctor Doom)
  else if (mvpAll.includes('tech') || mvpAll.includes('iron man') || mvpAll.includes('repulsor') || mvpAll.includes('doom') || mvpAll.includes('stark')) {
    whatWinnerDid = `${mvpName} calculated attack angles with real-time combat AI telemetry, punishing ${defName}'s blind spots with a targeted repulsor volley.`;
    whatLoserShouldHaveDone = `${defName} should have deployed EMP disruption grenades, magnetic interference fields, or close-range grapple locks to disable digital targeting systems.`;
  }
  // 8. General High-Power Strike Mastery
  else {
    whatWinnerDid = `${mvpName} controlled the engagement tempo, capitalizing on ${defName}'s overcommitted recovery frames with a devastating multi-strike combo to secure the K.O.`;
    whatLoserShouldHaveDone = `${defName} should have managed attack spacing more conservatively, utilizing defensive guard stances to bait out ${mvpName}'s power moves before counter-attacking.`;
  }

  return { whatWinnerDid, whatLoserShouldHaveDone };
}

export function BattleSandbox({ onBack }: Props) {
  const [teamASize, setTeamASize] = useState<number>(1);
  const [teamBSize, setTeamBSize] = useState<number>(1);

  const [teamA, setTeamA] = useState<Character[]>([
    ALL_CHARACTERS.find(c => c.name === 'Spider-Man') || ALL_CHARACTERS[0]
  ]);
  const [teamB, setTeamB] = useState<Character[]>([
    ALL_CHARACTERS.find(c => c.name === 'Iron Man') || ALL_CHARACTERS[1]
  ]);

  // Active Slot Picker
  const [activeSlotSelection, setActiveSlotSelection] = useState<{ team: 'A' | 'B'; index: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  // Series Mode & Series Scores (Best of 1, 3, 5, 7, 10)
  const [seriesMode, setSeriesMode] = useState<SeriesMode>('BO3');
  const [seriesWinsA, setSeriesWinsA] = useState(0);
  const [seriesWinsB, setSeriesWinsB] = useState(0);
  const [currentMatchNumber, setCurrentMatchNumber] = useState(1);
  const [seriesWinner, setSeriesWinner] = useState<'A' | 'B' | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<MatchRecord | null>(null);
  const [selectedHistoryMatch, setSelectedHistoryMatch] = useState<MatchRecord | null>(null);

  const [isFighting, setIsFighting] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [lastMatchWinner, setLastMatchWinner] = useState<'A' | 'B' | null>(null);

  // 2D Live Combat FX States
  const [activeFighterA, setActiveFighterA] = useState<Character | null>(null);
  const [activeFighterB, setActiveFighterB] = useState<Character | null>(null);
  const [activeEffectType, setActiveEffectType] = useState<CombatEffectType>('none');
  const [activeComicBurst, setActiveComicBurst] = useState<ComicBurst | null>(null);
  const [activeSignatureMoveName, setActiveSignatureMoveName] = useState<string>('');
  const [p1DamageTaken, setP1DamageTaken] = useState<number | null>(null);
  const [p2DamageTaken, setP2DamageTaken] = useState<number | null>(null);
  const [isClashing, setIsClashing] = useState(false);
  const [isSuperCutIn, setIsSuperCutIn] = useState(false);
  const [p1Attacking, setP1Attacking] = useState(false);
  const [p2Attacking, setP2Attacking] = useState(false);
  const [p1TakingHit, setP1TakingHit] = useState(false);
  const [p2TakingHit, setP2TakingHit] = useState(false);

  const activeConfig = SERIES_CONFIG[seriesMode];

  // Check for Tag-Team Fusions available in each team
  const teamAFusions = findPossibleTagTeamFusions(teamA);
  const teamBFusions = findPossibleTagTeamFusions(teamB);

  // Switch Series Mode & Reset Series
  const handleSelectSeriesMode = (mode: SeriesMode) => {
    soundManager.playClick();
    setSeriesMode(mode);
    setSeriesWinsA(0);
    setSeriesWinsB(0);
    setCurrentMatchNumber(1);
    setSeriesWinner(null);
    setMatchHistory([]);
    setLatestAnalysis(null);
    setSelectedHistoryMatch(null);
    setLastMatchWinner(null);
    setSimulationLogs([]);
  };

  // Reset Series
  const handleResetSeries = () => {
    soundManager.playClick();
    setSeriesWinsA(0);
    setSeriesWinsB(0);
    setCurrentMatchNumber(1);
    setSeriesWinner(null);
    setMatchHistory([]);
    setLatestAnalysis(null);
    setSelectedHistoryMatch(null);
    setLastMatchWinner(null);
    setSimulationLogs([]);
  };

  // Execute Merge Ultimate Character
  const handleMergeUltimate = (team: 'A' | 'B', fusion: { hero1: Character; hero2: Character; combo: TagTeamCombo }) => {
    soundManager.playMythicReveal();
    const fusedChar = mergeUltimateCharacter(fusion.hero1, fusion.hero2, fusion.combo);

    if (team === 'A') {
      const remaining = teamA.filter(c => c.id !== fusion.hero1.id && c.id !== fusion.hero2.id);
      const updated = [fusedChar, ...remaining];
      setTeamA(updated);
      setTeamASize(updated.length);
    } else {
      const remaining = teamB.filter(c => c.id !== fusion.hero1.id && c.id !== fusion.hero2.id);
      const updated = [fusedChar, ...remaining];
      setTeamB(updated);
      setTeamBSize(updated.length);
    }
  };

  // Update Team A Size (1 to 5)
  const handleSetTeamASize = (size: number) => {
    setTeamASize(size);
    if (size > teamA.length) {
      const added = Array.from({ length: size - teamA.length }, (_, i) => {
        const pool = ALL_CHARACTERS.filter(c => !teamA.some(t => t.id === c.id));
        return pool[i % pool.length] || ALL_CHARACTERS[0];
      });
      setTeamA([...teamA, ...added]);
    } else {
      setTeamA(teamA.slice(0, size));
    }
  };

  // Update Team B Size (1 to 5)
  const handleSetTeamBSize = (size: number) => {
    setTeamBSize(size);
    if (size > teamB.length) {
      const added = Array.from({ length: size - teamB.length }, (_, i) => {
        const pool = ALL_CHARACTERS.filter(c => !teamB.some(t => t.id === c.id));
        return pool[i % pool.length] || ALL_CHARACTERS[1];
      });
      setTeamB([...teamB, ...added]);
    } else {
      setTeamB(teamB.slice(0, size));
    }
  };

  // Select a character for a slot
  const handleSelectCharacter = (char: Character) => {
    if (!activeSlotSelection) return;
    soundManager.playClick();

    if (activeSlotSelection.team === 'A') {
      const updated = [...teamA];
      updated[activeSlotSelection.index] = char;
      setTeamA(updated);
    } else {
      const updated = [...teamB];
      updated[activeSlotSelection.index] = char;
      setTeamB(updated);
    }
    setActiveSlotSelection(null);
  };

  // Simulate a single match with Comic Canon & Tactical Logic
  const runMatchSimulation = async (matchIdx: number): Promise<{
    matchWin: 'A' | 'B';
    mvpChar: Character;
    defeatedChar: Character;
    analysis: { whatWinnerDid: string; whatLoserShouldHaveDone: string };
  }> => {
    const teamAFighters = teamA.map(c => ({ ...c, currentHp: 100, isFainted: false }));
    const teamBFighters = teamB.map(c => ({ ...c, currentHp: 100, isFainted: false }));

    let idxA = 0;
    let idxB = 0;
    let roundNum = 1;
    const logs: string[] = [];

    logs.push(`🏆 MATCH ${matchIdx} OF ${activeConfig.label}: Evaluating comic canon matchups & tactical counters...`);
    setSimulationLogs([...logs]);
    await new Promise(r => setTimeout(r, 450));

    while (idxA < teamAFighters.length && idxB < teamBFighters.length && roundNum <= 30) {
      const fA = teamAFighters[idxA];
      const fB = teamBFighters[idxB];

      setActiveFighterA({ ...fA });
      setActiveFighterB({ ...fB });
      
      const moveA = getSignatureMoveForCharacter(fA);
      setActiveEffectType(moveA.effectType);
      setActiveSignatureMoveName(`${fA.name}: ${moveA.moveName}`);

      // Comic Canon Matchup Evaluation
      let dmgToB = Math.round(20 + Math.random() * 18);
      let dmgToA = Math.round(18 + Math.random() * 16);
      let loreAdvantage = '';

      const nameA = fA.name.toLowerCase();
      const nameB = fB.name.toLowerCase();
      const powersA = (fA.powers || '').toLowerCase();
      const powersB = (fB.powers || '').toLowerCase();

      // 1. Cosmic / Omnipotent Absolute Advantage
      if (fA.grade === 'MYTHIC' && fB.grade !== 'MYTHIC') {
        dmgToB += 24;
        dmgToA = Math.max(4, dmgToA - 14);
        loreAdvantage = `🌌 Comic Canon: ${fA.name}'s cosmic reality warping overwhelms ${fB.name}'s mortal tier!`;
      } else if (fB.grade === 'MYTHIC' && fA.grade !== 'MYTHIC') {
        dmgToA += 24;
        dmgToB = Math.max(4, dmgToB - 14);
        loreAdvantage = `🌌 Comic Canon: ${fB.name}'s cosmic tier bends reality against ${fA.name}!`;
      }
      // 2. Spider-Sense Agility Counter
      else if (nameA.includes('spider') && (fB.stats.strength > 90 && fB.stats.speed < 85)) {
        dmgToB += 14;
        dmgToA = Math.max(5, dmgToA - 10);
        loreAdvantage = `🕷️ Fan Lore: Spider-Sense allows ${fA.name} to evade ${fB.name}'s heavy brute blows!`;
      }
      // 3. Vibranium Kinetic Redirection
      else if ((nameA.includes('captain america') || nameA.includes('black panther')) && !powersB.includes('magic')) {
        dmgToB += 12;
        dmgToA = Math.max(6, dmgToA - 8);
        loreAdvantage = `🛡️ Comic Lore: Vibranium armor absorbs & redirects kinetic impact into a shockwave!`;
      }
      // 4. Symbiote weakness to Fire / Sonics
      else if (powersB.includes('symbiote') && (powersA.includes('fire') || powersA.includes('sonic') || nameA.includes('torch'))) {
        dmgToB += 26;
        loreAdvantage = `🔥 Elemental Counter: ${fA.name}'s thermal/sonic flames exploit Symbiote cellular weakness!`;
      }
      // 5. Magic vs Technology
      else if (powersA.includes('magic') && powersB.includes('tech')) {
        dmgToB += 16;
        loreAdvantage = `✨ Mystic Supremacy: ${fA.name}'s Eldritch sorcery bypasses ${fB.name}'s electronic sensors!`;
      }
      // 6. Healing Factor Resiliency
      else if (powersA.includes('healing') || nameA.includes('wolverine') || nameA.includes('deadpool')) {
        dmgToA = Math.max(6, dmgToA - 10);
        loreAdvantage = `🩸 Cellular Regen: ${fA.name}'s healing factor regenerates damage mid-clash!`;
      }

      setIsClashing(true);
      setP1Attacking(true);
      setActiveComicBurst({
        id: String(Date.now()),
        word: moveA.comicBurstWord,
        x: 52,
        y: 40,
        color: moveA.color,
        subText: `${fA.name}: ${moveA.moveName}`
      });

      if (fA.grade === 'MYTHIC') {
        setIsSuperCutIn(true);
        setTimeout(() => setIsSuperCutIn(false), 750);
      }

      logs.push(`⚔️ Clash ${roundNum}: ${fA.name} unleashes [${moveA.moveName}] vs ${fB.name}`);
      setSimulationLogs([...logs]);
      await new Promise(r => setTimeout(r, 450));

      setP1Attacking(false);
      setP2TakingHit(true);
      setP2DamageTaken(dmgToB);
      soundManager.playAttackHit();
      await new Promise(r => setTimeout(r, 320));
      setP2TakingHit(false);
      setP2DamageTaken(null);

      // Team B Counter-Attack if alive
      if ((fB.currentHp ?? 100) > 0) {
        const moveB = getSignatureMoveForCharacter(fB);
        setActiveEffectType(moveB.effectType);
        setActiveSignatureMoveName(`${fB.name}: ${moveB.moveName}`);
        setP2Attacking(true);
        setActiveComicBurst({
          id: String(Date.now() + 1),
          word: moveB.comicBurstWord,
          x: 48,
          y: 42,
          color: moveB.color,
          subText: `${fB.name}: ${moveB.moveName}`
        });
        logs.push(`🛡️ Counter-Strike: ${fB.name} retaliates with [${moveB.moveName}]!`);
        setSimulationLogs([...logs]);
        await new Promise(r => setTimeout(r, 450));
        setP2Attacking(false);
        setP1TakingHit(true);
        setP1DamageTaken(dmgToA);
        soundManager.playAttackHit();
        await new Promise(r => setTimeout(r, 320));
        setP1TakingHit(false);
        setP1DamageTaken(null);
      }

      if (loreAdvantage) {
        logs.push(loreAdvantage);
      }

      fA.currentHp = Math.max(0, (fA.currentHp ?? 100) - dmgToA);
      fB.currentHp = Math.max(0, (fB.currentHp ?? 100) - dmgToB);
      setActiveFighterA({ ...fA });
      setActiveFighterB({ ...fB });

      logs.push(`💥 ${fA.name} deals ${dmgToB} DMG (${fA.currentHp} HP) | ${fB.name} deals ${dmgToA} DMG (${fB.currentHp} HP)`);

      await new Promise(r => setTimeout(r, 300));
      setIsClashing(false);
      setActiveEffectType('none');
      setActiveComicBurst(null);

      if ((fA.currentHp ?? 0) <= 0) {
        fA.isFainted = true;
        logs.push(`💀 ${fA.name} [Team A] is ELIMINATED!`);
        idxA++;
      }
      if ((fB.currentHp ?? 0) <= 0) {
        fB.isFainted = true;
        logs.push(`💀 ${fB.name} [Team B] is ELIMINATED!`);
        idxB++;
      }

      setSimulationLogs([...logs]);
      roundNum++;
    }

    const matchWin = idxA < teamAFighters.length ? 'A' : 'B';
    const winningTeam = matchWin === 'A' ? teamAFighters : teamBFighters;
    const losingTeam = matchWin === 'A' ? teamBFighters : teamAFighters;

    const mvpChar = winningTeam.find(c => !c.isFainted) || winningTeam[0] || (matchWin === 'A' ? teamA[0] : teamB[0]);
    const defeatedChar = losingTeam.find(c => c.isFainted) || losingTeam[0] || (matchWin === 'A' ? teamB[0] : teamA[0]);

    const analysis = generateTacticalDuelAnalysis(matchWin, mvpChar, defeatedChar);

    logs.push(`\n🎉 MATCH ${matchIdx} WINNER: TEAM ${matchWin} (MVP: ${mvpChar.name})!`);
    logs.push(`🏆 VICTORY TACTIC: ${analysis.whatWinnerDid}`);
    logs.push(`🛡️ DEFEAT COACHING: ${analysis.whatLoserShouldHaveDone}`);
    setSimulationLogs([...logs]);

    return { matchWin, mvpChar, defeatedChar, analysis };
  };

  // Play Next Single Match in Series
  const handleSimulateNextMatch = async () => {
    if (isFighting || seriesWinner) return;
    soundManager.playClick();
    setIsFighting(true);

    const matchIdx = currentMatchNumber;
    const { matchWin, mvpChar, defeatedChar, analysis } = await runMatchSimulation(matchIdx);
    setLastMatchWinner(matchWin);

    const newWinsA = matchWin === 'A' ? seriesWinsA + 1 : seriesWinsA;
    const newWinsB = matchWin === 'B' ? seriesWinsB + 1 : seriesWinsB;

    setSeriesWinsA(newWinsA);
    setSeriesWinsB(newWinsB);

    const newHistory: MatchRecord = {
      matchNumber: matchIdx,
      winner: matchWin,
      mvpHero: mvpChar.name,
      defeatedHero: defeatedChar.name,
      summary: `Team ${matchWin} conquered Match ${matchIdx} in ${activeConfig.label}`,
      whatWinnerDid: analysis.whatWinnerDid,
      whatLoserShouldHaveDone: analysis.whatLoserShouldHaveDone
    };
    setMatchHistory(prev => [...prev, newHistory]);
    setLatestAnalysis(newHistory);
    setSelectedHistoryMatch(newHistory);

    // Check if Series is Won
    if (newWinsA >= activeConfig.winsNeeded) {
      setSeriesWinner('A');
      soundManager.playVictory();
    } else if (newWinsB >= activeConfig.winsNeeded) {
      setSeriesWinner('B');
      soundManager.playVictory();
    } else {
      setCurrentMatchNumber(prev => prev + 1);
    }

    setIsFighting(false);
  };

  // Auto Simulate Entire Remaining Series
  const handleAutoSimulateFullSeries = async () => {
    if (isFighting || seriesWinner) return;
    soundManager.playClick();
    setIsFighting(true);

    let curWinsA = seriesWinsA;
    let curWinsB = seriesWinsB;
    let matchIdx = currentMatchNumber;
    const addedHistory = [...matchHistory];

    while (curWinsA < activeConfig.winsNeeded && curWinsB < activeConfig.winsNeeded) {
      const { matchWin, mvpChar, defeatedChar, analysis } = await runMatchSimulation(matchIdx);
      if (matchWin === 'A') curWinsA++;
      else curWinsB++;

      const newRecord: MatchRecord = {
        matchNumber: matchIdx,
        winner: matchWin,
        mvpHero: mvpChar.name,
        defeatedHero: defeatedChar.name,
        summary: `Team ${matchWin} won Match ${matchIdx}`,
        whatWinnerDid: analysis.whatWinnerDid,
        whatLoserShouldHaveDone: analysis.whatLoserShouldHaveDone
      };
      addedHistory.push(newRecord);
      setLatestAnalysis(newRecord);
      setSelectedHistoryMatch(newRecord);

      setSeriesWinsA(curWinsA);
      setSeriesWinsB(curWinsB);
      setMatchHistory([...addedHistory]);
      setLastMatchWinner(matchWin);
      matchIdx++;
    }

    setCurrentMatchNumber(matchIdx);
    const finalSeriesWinner = curWinsA >= activeConfig.winsNeeded ? 'A' : 'B';
    setSeriesWinner(finalSeriesWinner);
    soundManager.playVictory();
    setIsFighting(false);
  };

  const filteredList = ALL_CHARACTERS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.powers.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'ALL' || c.grade === gradeFilter;
    return matchSearch && matchGrade;
  }).sort((a, b) => b.overallPower - a.overallPower);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* 1. Header Bar with Duel Simulator Identity */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121622]/90 border border-white/10 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-black uppercase mb-1">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>COMIC LORE MATCHUPS • 1v1 TO 5v5 & SERIES</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wide">
            TACTICAL DUEL SIMULATOR
          </h1>
          <p className="text-xs text-slate-400">
            Simulate custom Marvel comic canon duels, synergies, and competitive Best-Of series formats!
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Simulator</span>
        </button>
      </div>

      {/* 2. Series Mode Selector (Best of 1, 3, 5, 7, 10) */}
      <div className="glass-panel p-4 rounded-3xl border-2 border-purple-500/50 bg-[#100B1A]/95 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400 animate-bounce" />
            <span className="font-heading font-black text-xs sm:text-sm text-white uppercase tracking-wider">
              MATCH SERIES FORMAT:
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-300">
            {activeConfig.desc}
          </span>
        </div>

        {/* 5 Series Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['BO1', 'BO3', 'BO5', 'BO7', 'BO10'] as SeriesMode[]).map((mode) => {
            const config = SERIES_CONFIG[mode];
            const isSelected = seriesMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleSelectSeriesMode(mode)}
                className={`py-2.5 px-3 rounded-2xl text-xs font-heading font-black tracking-wider uppercase transition-all border flex flex-col items-center justify-center gap-0.5 shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.5)] scale-[1.03]'
                    : 'bg-black/50 text-slate-300 border-white/10 hover:border-purple-500/50 hover:bg-purple-950/30 hover:text-white'
                }`}
              >
                <span>{config.label}</span>
                <span className="text-[9px] font-mono font-normal opacity-80">
                  First to {config.winsNeeded}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Series Live Scoreboard & Progression Tracker */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/30 via-purple-950/40 to-blue-950/30 space-y-3">
        <div className="flex items-center justify-between">
          {/* Team A Score */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/90 border border-red-400 flex items-center justify-center shadow-lg font-heading font-black text-xl text-white">
              {seriesWinsA}
            </div>
            <div>
              <span className="text-xs font-black text-red-400 uppercase tracking-wide block">
                TEAM A (RED)
              </span>
              {/* Win Progress Dots */}
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: activeConfig.winsNeeded }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full border transition-all ${
                      i < seriesWinsA 
                        ? 'bg-red-500 border-red-300 shadow-[0_0_8px_#EF4444]' 
                        : 'bg-black/50 border-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center Series Status Pill */}
          <div className="text-center px-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              {seriesWinner ? 'SERIES CONCLUDED' : `MATCH ${currentMatchNumber} OF ${activeConfig.shortLabel}`}
            </span>
            <div className="text-sm sm:text-base font-heading font-black text-amber-300 uppercase tracking-wider">
              {seriesWinner 
                ? (seriesWinner === 'A' ? '🏆 TEAM A WINS SERIES!' : '🏆 TEAM B WINS SERIES!')
                : `TARGET: ${activeConfig.winsNeeded} WINS`}
            </div>
          </div>

          {/* Team B Score */}
          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-xs font-black text-blue-400 uppercase tracking-wide block">
                TEAM B (BLUE)
              </span>
              {/* Win Progress Dots */}
              <div className="flex items-center justify-end gap-1 mt-1">
                {Array.from({ length: activeConfig.winsNeeded }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full border transition-all ${
                      i < seriesWinsB 
                        ? 'bg-blue-500 border-blue-300 shadow-[0_0_8px_#3B82F6]' 
                        : 'bg-black/50 border-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-600/90 border border-blue-400 flex items-center justify-center shadow-lg font-heading font-black text-xl text-white">
              {seriesWinsB}
            </div>
          </div>
        </div>

        {/* Series Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          {!seriesWinner ? (
            <>
              <button
                onClick={handleSimulateNextMatch}
                disabled={isFighting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isFighting ? 'CLASHING...' : `SIMULATE MATCH ${currentMatchNumber}`}</span>
              </button>

              <button
                onClick={handleAutoSimulateFullSeries}
                disabled={isFighting}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transform hover:scale-105 transition-all disabled:opacity-50"
              >
                <FastForward className="w-4 h-4" />
                <span>AUTO-SIMULATE FULL SERIES</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleResetSeries}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>START NEW {activeConfig.label} REMATCH</span>
            </button>
          )}

          <button
            onClick={handleResetSeries}
            disabled={isFighting}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-slate-400 hover:text-white font-bold text-xs border border-white/10 transition-colors flex items-center gap-1"
            title="Reset Series Scores"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 4. Team Size Selector Chassis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team A Size Control */}
        <div className="glass-panel p-4 rounded-2xl border border-red-500/40 bg-red-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-red-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              TEAM A SIZE (RED CORNER)
            </span>
            <span className="text-xs font-black text-white">{teamASize} FIGHTERS</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSetTeamASize(size)}
                className={`flex-1 py-2 rounded-xl text-xs font-heading font-black transition-all border ${
                  teamASize === size
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105'
                    : 'bg-black/40 text-slate-400 border-white/10 hover:border-red-500/40'
                }`}
              >
                {size} {size === 1 ? 'Hero' : 'Heroes'}
              </button>
            ))}
          </div>
        </div>

        {/* Team B Size Control */}
        <div className="glass-panel p-4 rounded-2xl border border-blue-500/40 bg-blue-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              TEAM B SIZE (BLUE CORNER)
            </span>
            <span className="text-xs font-black text-white">{teamBSize} FIGHTERS</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSetTeamBSize(size)}
                className={`flex-1 py-2 rounded-xl text-xs font-heading font-black transition-all border ${
                  teamBSize === size
                    ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105'
                    : 'bg-black/40 text-slate-400 border-white/10 hover:border-blue-500/40'
                }`}
              >
                {size} {size === 1 ? 'Hero' : 'Heroes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4.5. Shared 3D live combat arena during simulation */}
      {activeFighterA && activeFighterB && (
        <BattlePresentation3D
          player={activeFighterA}
          opponent={activeFighterB}
          playerAttacking={p1Attacking}
          opponentAttacking={p2Attacking}
          playerTakingHit={p1TakingHit}
          opponentTakingHit={p2TakingHit}
          playerSuper={isSuperCutIn && p1Attacking}
          opponentSuper={isSuperCutIn && p2Attacking}
          playerDamage={p1DamageTaken}
          opponentDamage={p2DamageTaken}
          effectType={activeEffectType}
          comicBurst={activeComicBurst}
          signatureMoveName={activeSignatureMoveName}
          title={`DUEL SIMULATOR - ${activeConfig.label} MATCH ${currentMatchNumber}`}
          className={isClashing ? 'scale-[0.99] brightness-125 animate-shake' : ''}
        />
      )}
      {/* 4.8. TACTICAL POST-MATCH DEBRIEF & STRATEGY COACHING */}
      {(selectedHistoryMatch || latestAnalysis) && (
        (() => {
          const debrief = selectedHistoryMatch || latestAnalysis!;
          return (
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-[#140D08] via-[#0E0C14] to-[#080B16] shadow-[0_0_35px_rgba(245,158,11,0.25)] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <h3 className="font-heading font-black text-sm sm:text-base text-white uppercase tracking-wider">
                    🧠 TACTICAL MATCH #{debrief.matchNumber} DEBRIEF & COACHING ANALYSIS
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-heading font-black uppercase border ${
                  debrief.winner === 'A' 
                    ? 'bg-red-950/80 text-red-300 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.35)]' 
                    : 'bg-blue-950/80 text-blue-300 border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                }`}>
                  TEAM {debrief.winner} VICTORY • MVP: {debrief.mvpHero}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* What Winner Did To Win */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/50 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                      <span>WHAT {debrief.mvpHero.toUpperCase()} DID TO WIN</span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-300 bg-emerald-900/70 px-2 py-0.5 rounded border border-emerald-500/40">
                      VICTORY TACTIC
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                    {debrief.whatWinnerDid}
                  </p>
                </div>

                {/* What Defeated Hero Should Have Done */}
                <div className="p-4 rounded-2xl bg-cyan-950/30 border-2 border-cyan-500/50 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-cyan-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>WHAT {debrief.defeatedHero.toUpperCase()} SHOULD HAVE DONE</span>
                    </span>
                    <span className="text-[10px] font-black text-cyan-300 bg-cyan-900/70 px-2 py-0.5 rounded border border-cyan-500/40">
                      COACHING ADVICE
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-medium">
                    {debrief.whatLoserShouldHaveDone}
                  </p>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* 5. Fighter Slots Stage: Team A Roster vs Team B Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Team A Roster Slots */}
        <div className="glass-panel p-5 rounded-3xl border-2 border-red-500/50 bg-[#120B0D]/95 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-heading font-black text-base text-red-400 uppercase tracking-wide">
              TEAM A ROSTER ({teamA.length})
            </span>
            <span className="text-xs font-bold text-slate-400">
              Total PWR: <span className="text-amber-400 font-bold">{teamA.reduce((sum, c) => sum + c.overallPower, 0)}</span>
            </span>
          </div>

          {/* Merge Ultimate Character Banner for Team A */}
          {teamAFusions.length > 0 && (
            <div className="space-y-1.5 p-2.5 rounded-2xl bg-gradient-to-r from-red-950 via-purple-950 to-pink-950 border border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.35)] animate-pulse">
              <span className="text-[10px] font-black text-pink-300 uppercase tracking-wider block">
                ⚡ TAG-TEAM DUO SYNERGY DETECTED!
              </span>
              {teamAFusions.map((fusion, fIdx) => (
                <button
                  key={fIdx}
                  onClick={() => handleMergeUltimate('A', fusion)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
                >
                  <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>MERGE ULTIMATE: {fusion.hero1.name} + {fusion.hero2.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2.5">
            {teamA.map((char, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveSlotSelection({ team: 'A', index: idx })}
                className="p-2.5 rounded-2xl bg-black/60 hover:bg-red-950/40 border border-white/10 hover:border-red-400 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CharacterPortrait character={char} size="sm" />
                  <div className="min-w-0">
                    <strong className="text-white font-heading font-black text-sm block group-hover:text-red-300 truncate">
                      {char.name}
                    </strong>
                    <span className="text-[11px] text-slate-400 truncate block">
                      Grade {char.grade} • Power: <span className="text-amber-400 font-bold">{char.overallPower}</span>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-red-400 font-bold bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/30 flex-shrink-0">
                  Change
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team B Roster Slots */}
        <div className="glass-panel p-5 rounded-3xl border-2 border-blue-500/50 bg-[#0B0E16]/95 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-heading font-black text-base text-blue-400 uppercase tracking-wide">
              TEAM B ROSTER ({teamB.length})
            </span>
            <span className="text-xs font-bold text-slate-400">
              Total PWR: <span className="text-amber-400 font-bold">{teamB.reduce((sum, c) => sum + c.overallPower, 0)}</span>
            </span>
          </div>

          {/* Merge Ultimate Character Banner for Team B */}
          {teamBFusions.length > 0 && (
            <div className="space-y-1.5 p-2.5 rounded-2xl bg-gradient-to-r from-blue-950 via-cyan-950 to-purple-950 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.35)] animate-pulse">
              <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider block">
                ⚡ TAG-TEAM DUO SYNERGY DETECTED!
              </span>
              {teamBFusions.map((fusion, fIdx) => (
                <button
                  key={fIdx}
                  onClick={() => handleMergeUltimate('B', fusion)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
                >
                  <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>MERGE ULTIMATE: {fusion.hero1.name} + {fusion.hero2.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2.5">
            {teamB.map((char, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveSlotSelection({ team: 'B', index: idx })}
                className="p-2.5 rounded-2xl bg-black/60 hover:bg-blue-950/40 border border-white/10 hover:border-blue-400 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CharacterPortrait character={char} size="sm" />
                  <div className="min-w-0">
                    <strong className="text-white font-heading font-black text-sm block group-hover:text-blue-300 truncate">
                      {char.name}
                    </strong>
                    <span className="text-[11px] text-slate-400 truncate block">
                      Grade {char.grade} • Power: <span className="text-amber-400 font-bold">{char.overallPower}</span>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-blue-400 font-bold bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-500/30 flex-shrink-0">
                  Change
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Grand Series Champion Banner */}
      {seriesWinner && (
        <div className={`glass-panel p-6 rounded-3xl border-2 text-center max-w-xl mx-auto shadow-2xl animate-fadeIn ${
          seriesWinner === 'A' ? 'border-red-500 bg-red-950/40' : 'border-blue-500 bg-blue-950/40'
        }`}>
          <Trophy className={`w-14 h-14 mx-auto mb-2 animate-bounce ${seriesWinner === 'A' ? 'text-amber-400' : 'text-cyan-400'}`} />
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            {seriesWinner === 'A' ? '🏆 TEAM A WINS THE SERIES!' : '🏆 TEAM B WINS THE SERIES!'}
          </h2>
          <p className="text-sm text-amber-300 font-bold mt-1">
            Series Final Score: {seriesWinsA} - {seriesWinsB} ({activeConfig.label})
          </p>
        </div>
      )}

      {/* 7. Match Series History Table */}
      {matchHistory.length > 0 && (
        <div className="glass-panel p-4 rounded-3xl border border-white/10 bg-[#0A0D16]/95 space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase text-white tracking-wider">
                {activeConfig.label} MATCH BREAKDOWN HISTORY:
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              (Click any match to view Tactical Breakdown & Advice)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {matchHistory.map((m, idx) => {
              const isSelected = (selectedHistoryMatch?.matchNumber === m.matchNumber) || (!selectedHistoryMatch && latestAnalysis?.matchNumber === m.matchNumber);
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedHistoryMatch(m);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
                    isSelected ? 'ring-2 ring-amber-400 scale-[1.02]' : ''
                  } ${
                    m.winner === 'A' 
                      ? 'bg-red-950/40 border-red-500/40 text-red-200 hover:border-red-400' 
                      : 'bg-blue-950/40 border-blue-500/40 text-blue-200 hover:border-blue-400'
                  }`}
                >
                  <div>
                    <span className="font-mono font-bold block text-[10px] text-slate-400">
                      MATCH {m.matchNumber}
                    </span>
                    <span className="font-heading font-black text-white uppercase">
                      Team {m.winner} Victory
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                      MVP: {m.mvpHero}
                    </span>
                    {isSelected && (
                      <span className="text-[8px] font-black uppercase text-amber-400 animate-pulse">
                        ● VIEWING
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. Live Comic Lore Battle Logs */}
      {simulationLogs.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-black/80 space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
          <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-1">
            📖 COMIC LORE MATCH LOGS:
          </span>
          {simulationLogs.map((log, idx) => (
            <p key={idx} className="text-xs text-slate-300 font-mono leading-relaxed">
              {log}
            </p>
          ))}
        </div>
      )}

      {/* 9. Character Picker Modal Drawer */}
      {activeSlotSelection && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 bg-[#0C101A] max-w-3xl w-full max-h-[85vh] flex flex-col space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Select Hero for Team {activeSlotSelection.team} (Slot {activeSlotSelection.index + 1})
                </h3>
                <p className="text-xs text-slate-400">Choose from all 350 Marvel characters</p>
              </div>
              <button
                onClick={() => setActiveSlotSelection(null)}
                className="p-1.5 rounded-lg bg-stone-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 350 characters..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-1">
                {['ALL', 'MYTHIC', 'A', 'B', 'C'].map(grd => (
                  <button
                    key={grd}
                    type="button"
                    onClick={() => setGradeFilter(grd)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                      gradeFilter === grd
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {grd}
                  </button>
                ))}
              </div>
            </div>

            {/* Characters List Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 overflow-y-auto max-h-[50vh] pr-1">
              {filteredList.map(char => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => handleSelectCharacter(char)}
                  className="p-2 rounded-xl bg-black/50 hover:bg-purple-950/50 border border-white/10 hover:border-purple-400 transition-all flex items-center gap-2 text-left group"
                >
                  <CharacterPortrait character={char} size="sm" />
                  <div className="min-w-0 flex-1">
                    <span className="font-heading font-black text-xs text-white group-hover:text-purple-300 block truncate">
                      {char.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {char.grade} • <strong className="text-amber-400">{char.overallPower}</strong>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

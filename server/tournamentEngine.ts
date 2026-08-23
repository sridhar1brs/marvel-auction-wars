import { Player, TournamentMatch } from '../src/types/game';

export function generateTournamentBracket(players: Player[]): TournamentMatch[] {
  const matches: TournamentMatch[] = [];
  const n = players.length;

  if (n < 2) return matches;

  // Bracket sizing (2, 4, or 8 bracket slots)
  if (n === 2) {
    matches.push({
      id: 'match-final-1',
      roundName: 'Final',
      roundIndex: 0,
      matchIndex: 0,
      player1: players[0],
      player2: players[1],
      winner: null,
      status: 'READY',
      rounds: [],
      player1Score: 0,
      player2Score: 0,
      targetWins: Math.ceil(Math.min(players[0].collection.length, players[1].collection.length) / 2) || 1,
    });
    return matches;
  }

  if (n <= 4) {
    // 3 or 4 players -> Semifinals -> Finals
    const p1 = players[0];
    const p2 = players[1];
    const p3 = players[2];
    const p4 = players[3] || null;

    // Semi 1
    matches.push({
      id: 'match-semi-1',
      roundName: 'Semifinals',
      roundIndex: 0,
      matchIndex: 0,
      player1: p1,
      player2: p4, // If null, p1 gets a bye
      winner: p4 ? null : p1,
      isBye: !p4,
      status: p4 ? 'READY' : 'COMPLETED',
      rounds: [],
      player1Score: 0,
      player2Score: 0,
      targetWins: p4 ? Math.ceil(Math.min(p1.collection.length, p4.collection.length) / 2) || 1 : 1,
    });

    // Semi 2
    matches.push({
      id: 'match-semi-2',
      roundName: 'Semifinals',
      roundIndex: 0,
      matchIndex: 1,
      player1: p2,
      player2: p3,
      winner: null,
      status: 'READY',
      rounds: [],
      player1Score: 0,
      player2Score: 0,
      targetWins: Math.ceil(Math.min(p2.collection.length, p3.collection.length) / 2) || 1,
    });

    // Final placeholder
    matches.push({
      id: 'match-final-1',
      roundName: 'Final',
      roundIndex: 1,
      matchIndex: 0,
      player1: !p4 ? p1 : null,
      player2: null,
      winner: null,
      status: 'PENDING',
      rounds: [],
      player1Score: 0,
      player2Score: 0,
      targetWins: 2,
    });

    return matches;
  }

  // 5 to 8 Players: Quarterfinals -> Semifinals -> Final
  // Seed pairs: (1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6)
  const paddedPlayers: (Player | null)[] = [...players];
  while (paddedPlayers.length < 8) {
    paddedPlayers.push(null);
  }

  const qfPairs = [
    { p1: paddedPlayers[0], p2: paddedPlayers[7], idx: 0 },
    { p1: paddedPlayers[3], p2: paddedPlayers[4], idx: 1 },
    { p1: paddedPlayers[1], p2: paddedPlayers[6], idx: 2 },
    { p1: paddedPlayers[2], p2: paddedPlayers[5], idx: 3 },
  ];

  qfPairs.forEach(({ p1, p2, idx }) => {
    const isBye = !p2 && !!p1;
    matches.push({
      id: `match-qf-${idx + 1}`,
      roundName: 'Quarterfinals',
      roundIndex: 0,
      matchIndex: idx,
      player1: p1,
      player2: p2,
      winner: isBye ? p1 : null,
      isBye,
      status: isBye ? 'COMPLETED' : (p1 && p2 ? 'READY' : 'PENDING'),
      rounds: [],
      player1Score: 0,
      player2Score: 0,
      targetWins: p1 && p2 ? Math.ceil(Math.min(p1.collection.length, p2.collection.length) / 2) || 1 : 1,
    });
  });

  // Semifinals placeholders
  matches.push({
    id: 'match-semi-1',
    roundName: 'Semifinals',
    roundIndex: 1,
    matchIndex: 0,
    player1: matches[0].winner,
    player2: matches[1].winner,
    winner: null,
    status: matches[0].winner && matches[1].winner ? 'READY' : 'PENDING',
    rounds: [],
    player1Score: 0,
    player2Score: 0,
    targetWins: 2,
  });

  matches.push({
    id: 'match-semi-2',
    roundName: 'Semifinals',
    roundIndex: 1,
    matchIndex: 1,
    player1: matches[2].winner,
    player2: matches[3].winner,
    winner: null,
    status: matches[2].winner && matches[3].winner ? 'READY' : 'PENDING',
    rounds: [],
    player1Score: 0,
    player2Score: 0,
    targetWins: 2,
  });

  // Final placeholder
  matches.push({
    id: 'match-final-1',
    roundName: 'Final',
    roundIndex: 2,
    matchIndex: 0,
    player1: null,
    player2: null,
    winner: null,
    status: 'PENDING',
    rounds: [],
    player1Score: 0,
    player2Score: 0,
    targetWins: 2,
  });

  return matches;
}

export function advanceTournamentMatches(matches: TournamentMatch[]): {
  updatedMatches: TournamentMatch[];
  champion: Player | null;
} {
  const updated = [...matches];
  let champion: Player | null = null;

  // Check QF -> Semis advancement
  const qfMatches = updated.filter(m => m.roundName === 'Quarterfinals');
  const semiMatches = updated.filter(m => m.roundName === 'Semifinals');
  const finalMatch = updated.find(m => m.roundName === 'Final');

  if (qfMatches.length > 0 && semiMatches.length > 0) {
    if (qfMatches[0].winner && qfMatches[1].winner) {
      semiMatches[0].player1 = qfMatches[0].winner;
      semiMatches[0].player2 = qfMatches[1].winner;
      if (semiMatches[0].status === 'PENDING') semiMatches[0].status = 'READY';
    }
    if (qfMatches[2].winner && qfMatches[3].winner) {
      semiMatches[1].player1 = qfMatches[2].winner;
      semiMatches[1].player2 = qfMatches[3].winner;
      if (semiMatches[1].status === 'PENDING') semiMatches[1].status = 'READY';
    }
  }

  // Check Semis -> Final advancement
  if (semiMatches.length > 0 && finalMatch) {
    if (semiMatches[0].winner && semiMatches[1].winner) {
      finalMatch.player1 = semiMatches[0].winner;
      finalMatch.player2 = semiMatches[1].winner;
      if (finalMatch.status === 'PENDING') finalMatch.status = 'READY';
    }
  }

  // Check Final -> Champion
  if (finalMatch && finalMatch.winner) {
    champion = finalMatch.winner;
  }

  return { updatedMatches: updated, champion };
}

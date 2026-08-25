import { 
  GameState, 
  Player, 
  GameSettings, 
  AuctionState, 
  TournamentMatch,
  Character,
  GradeVoteOption,
  BattleActionType,
  BattleRound,
} from '../src/types/game';
import { ALL_CHARACTERS } from '../src/data/characters/index';
import { validateBid, validateSkipVote, calculateBotBid } from './auctionEngine';
import { generateTournamentBracket, advanceTournamentMatches } from './tournamentEngine';
import { simulateRoundDuel, getTierMatchedPairings } from './battleEngine';

export class GameRoom {
  public state: GameState;
  private timerInterval: NodeJS.Timeout | null = null;
  private gradeVoteTimeout: NodeJS.Timeout | null = null;
  private gradeVotes: Record<string, GradeVoteOption> = {};
  private onStateChange: (state: GameState) => void;

  constructor(roomId: string, hostPlayer: Player, onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.state = {
      roomId,
      isOnline: true,
      phase: 'ONLINE_LOBBY',
      settings: {
        playerCount: 4,
        startingMoney: 30,
        characterLimit: 4,
        auctionTimerSeconds: 15,
        antiSnipingSeconds: 6,
      },
      players: [hostPlayer],
      activePlayerIndex: 0,
      availableCharacters: [...ALL_CHARACTERS].sort(() => Math.random() - 0.5),
      purchasedCharacters: [],
      skippedCharacters: [],
      lastVotedCheckpoint: 0,
      queuedGrade: null,
      auction: {
        currentCharacter: null,
        currentBid: 0,
        highestBidderId: null,
        highestBidderName: null,
        timeRemaining: 15,
        isActive: false,
        bidsHistory: [],
        skipVotes: [],
        hasBidded: [],
        statusMessage: 'Waiting to start...',
      },
      tournamentMatches: [],
      currentMatchId: null,
      champion: null,
    };
  }

  public addPlayer(player: Player): boolean {
    if (this.state.players.length >= 10 || this.state.phase !== 'ONLINE_LOBBY') {
      return false;
    }
    this.state.players.push(player);
    this.notifyState();
    return true;
  }

  public removePlayer(playerId: string) {
    const idx = this.state.players.findIndex(p => p.id === playerId);
    if (idx !== -1) {
      const isHost = this.state.players[idx].isHost;
      this.state.players.splice(idx, 1);
      if (isHost && this.state.players.length > 0) {
        this.state.players[0].isHost = true;
      }
      this.notifyState();
    }
  }

  public setPlayerReady(playerId: string, isReady: boolean) {
    const p = this.state.players.find(pl => pl.id === playerId);
    if (p) {
      p.isReady = isReady;
      this.notifyState();
    }
  }

  public addBot(personality: 'Aggressive' | 'Value' | 'Cosmic' | 'Balanced') {
    if (this.state.players.length >= 8 || this.state.phase !== 'ONLINE_LOBBY') return;
    const botIndex = this.state.players.filter(p => p.isBot).length + 1;
    const botNames = ['JARVIS AI', 'FRIDAY AI', 'ULTRON BOT', 'VISION AI', 'EDITH BOT', 'ZOLA SYSTEM', 'KAREN AI', 'JOCASTA'];
    const botName = botNames[(botIndex - 1) % botNames.length];

    const bot: Player = {
      id: `bot-${Date.now()}-${botIndex}`,
      name: botName,
      avatar: '🤖',
      money: this.state.settings.startingMoney,
      collection: [],
      isHost: false,
      isReady: true,
      isBot: true,
      botPersonality: personality,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    this.state.players.push(bot);
    this.notifyState();
  }

  public updateSettings(settings: Partial<GameSettings>) {
    this.state.settings = { ...this.state.settings, ...settings };
    this.notifyState();
  }

  public startGame() {
    if (this.state.players.length < 2) return;
    // Set all starting moneys and reset rosters
    this.state.players.forEach(p => {
      p.money = this.state.settings.startingMoney;
      p.collection = [];
      p.stats = { battlesWon: 0, moneySpent: 0, highestBid: 0 };
    });

    this.state.purchasedCharacters = [];
    this.state.skippedCharacters = [];
    this.state.lastVotedCheckpoint = 0;
    this.state.queuedGrade = null;
    this.gradeVotes = {};

    this.state.phase = 'AUCTION_INTRO';
    this.notifyState();

    setTimeout(() => {
      this.startNextAuction();
    }, 2000);
  }

  public startNextAuction() {
    this.stopTimer();

    // 1. Check if all players completed character collection
    const needingPlayers = this.state.players.filter(
      p => p.collection.length < this.state.settings.characterLimit
    );

    if (needingPlayers.length === 0) {
      this.finishAuctionPhase();
      return;
    }

    // Emergency Funds: If a player who still needs characters has $0, grant $5 S.H.I.E.L.D. draft funds!
    needingPlayers.forEach(p => {
      if (p.money <= 0) {
        p.money = 5;
      }
    });

    // 2. Check 3-Round Cosmic Grade Tier Voting Checkpoint (Rounds 3, 6, 9, 12, 15...)
    const completedRounds = this.state.purchasedCharacters.length + this.state.skippedCharacters.length;
    const currentCheckpoint = Math.floor(completedRounds / 3);

    if (
      completedRounds > 0 && 
      completedRounds % 3 === 0 && 
      this.state.lastVotedCheckpoint !== currentCheckpoint && 
      this.state.phase !== 'GRADE_VOTING'
    ) {
      this.state.lastVotedCheckpoint = currentCheckpoint;
      this.state.phase = 'GRADE_VOTING';
      this.gradeVotes = {};
      this.notifyState();
      this.startGradeVoteTimer();
      return;
    }

    // 3. Find character lot tailored for players who STILL need to buy cards!
    const maxNeedingFunds = Math.max(1, ...needingPlayers.map(p => p.money));

    if (this.state.availableCharacters.length === 0) {
      this.state.availableCharacters = [...this.state.skippedCharacters].sort(() => Math.random() - 0.5);
      this.state.skippedCharacters = [];
    }

    let nextCharIndex = -1;

    // If a grade was queued from player voting, prioritize finding an affordable character of that tier!
    if (this.state.queuedGrade && this.state.queuedGrade !== 'MYSTERY') {
      nextCharIndex = this.state.availableCharacters.findIndex(
        c => c.grade === this.state.queuedGrade && c.startingPrice <= maxNeedingFunds
      );
      if (nextCharIndex === -1) {
        nextCharIndex = this.state.availableCharacters.findIndex(c => c.grade === this.state.queuedGrade);
      }
    }

    // If no queued grade or not found, find a character that active drafting players can afford!
    if (nextCharIndex === -1) {
      nextCharIndex = this.state.availableCharacters.findIndex(c => c.startingPrice <= maxNeedingFunds);
    }

    let nextChar: Character | null = null;
    if (nextCharIndex !== -1) {
      nextChar = this.state.availableCharacters.splice(nextCharIndex, 1)[0];
    } else {
      nextChar = this.state.availableCharacters.pop() || null;
    }

    if (!nextChar) {
      this.finishAuctionPhase();
      return;
    }

    // Dynamic Affordability Guarantee:
    // Cap starting price so remaining players can ALWAYS afford to bid and purchase!
    if (nextChar.startingPrice > maxNeedingFunds) {
      nextChar = {
        ...nextChar,
        startingPrice: Math.max(1, maxNeedingFunds),
      };
    }

    const isMythic = nextChar.grade === 'MYTHIC';
    const isBlindMode = this.state.settings.gameMode === 'blind_bidding' || this.state.queuedGrade === 'MYSTERY';
    const isMystery = isBlindMode || (!isMythic && Math.random() < 0.20);

    // The queued grade applies to THIS NEXT ROUND ONLY, then resets
    this.state.queuedGrade = null;

    this.state.auction = {
      currentCharacter: nextChar,
      currentBid: 0,
      highestBidderId: null,
      highestBidderName: null,
      timeRemaining: this.state.settings.auctionTimerSeconds,
      isActive: true,
      bidsHistory: [],
      skipVotes: [],
      hasBidded: [],
      isMysteryCrate: isMystery,
      statusMessage: (isMythic && !isBlindMode) 
        ? '⚡ MYTHIC CHARACTER DETECTED!' 
        : isMystery 
        ? '🎲 MYSTERY COSMIC CRATE DETECTED!' 
        : `Auctioning ${nextChar.name}`,
      isMythicRevealed: isMythic,
    };

    this.state.phase = (isMythic && !isBlindMode) ? 'AUCTION_REVEAL_MYTHIC' : 'AUCTION';
    this.notifyState();

    if (isMythic && !isBlindMode) {
      setTimeout(() => {
        if (this.state.phase === 'AUCTION_REVEAL_MYTHIC') {
          this.state.phase = 'AUCTION';
          this.notifyState();
          this.startTimer();
        }
      }, 3500);
    } else {
      this.startTimer();
    }
  }

  // 3-Round Grade Voting submission
  public submitGradeVote(playerId: string, vote: GradeVoteOption): { success: boolean } {
    this.gradeVotes[playerId] = vote;

    const humanPlayers = this.state.players.filter(p => !p.isBot);
    const allHumansVoted = humanPlayers.every(p => this.gradeVotes[p.id]);

    if (allHumansVoted) {
      this.finishGradeVoting();
    } else {
      this.notifyState();
    }

    return { success: true };
  }

  private startGradeVoteTimer() {
    this.stopGradeVoteTimer();
    this.gradeVoteTimeout = setTimeout(() => {
      if (this.state.phase === 'GRADE_VOTING') {
        this.finishGradeVoting();
      }
    }, 15000);
  }

  private stopGradeVoteTimer() {
    if (this.gradeVoteTimeout) {
      clearTimeout(this.gradeVoteTimeout);
      this.gradeVoteTimeout = null;
    }
  }

  private finishGradeVoting() {
    this.stopGradeVoteTimer();

    // Auto-fill votes for bots or non-voters
    this.state.players.forEach(p => {
      if (!this.gradeVotes[p.id]) {
        const options: GradeVoteOption[] = ['MYTHIC', 'A', 'B', 'C', 'MYSTERY'];
        this.gradeVotes[p.id] = options[Math.floor(Math.random() * options.length)];
      }
    });

    const counts: Record<string, number> = {};
    Object.values(this.gradeVotes).forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
    });

    let topChoice: GradeVoteOption = 'MYTHIC';
    let maxCount = -1;
    Object.entries(counts).forEach(([opt, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topChoice = opt as GradeVoteOption;
      }
    });

    this.state.queuedGrade = topChoice;
    this.state.phase = 'AUCTION';
    this.notifyState();

    setTimeout(() => {
      this.startNextAuction();
    }, 600);
  }

  public placeBid(playerId: string, amount: number): { success: boolean; error?: string } {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found.' };

    const validation = validateBid(player, amount, this.state.auction, this.state.settings);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    this.state.auction.currentBid = validation.newBid!;
    this.state.auction.highestBidderId = validation.newHighestBidderId!;
    this.state.auction.highestBidderName = validation.newHighestBidderName!;
    this.state.auction.timeRemaining = validation.timeRemaining!;
    this.state.auction.statusMessage = `Bid of $${amount} placed by ${player.name}`;
    
    if (!this.state.auction.hasBidded.includes(player.id)) {
      this.state.auction.hasBidded.push(player.id);
    }

    this.state.auction.bidsHistory.unshift({
      playerId: player.id,
      playerName: player.name,
      amount,
      timestamp: Date.now(),
    });

    if (amount > player.stats.highestBid) {
      player.stats.highestBid = amount;
    }

    this.notifyState();
    return { success: true };
  }

  public voteSkip(playerId: string): { success: boolean; isSkipped: boolean; error?: string } {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, isSkipped: false, error: 'Player not found.' };

    if (!this.state.auction.isActive || !this.state.auction.currentCharacter) {
      return { success: false, isSkipped: false, error: 'No active auction.' };
    }

    // Instant Skip: 1 person skip immediately advances the card as requested!
    this.state.auction.statusMessage = `⏭️ CARD SKIPPED BY ${player.name.toUpperCase()}!`;
    this.state.auction.isActive = false;
    this.stopTimer();

    if (this.state.auction.currentCharacter) {
      this.state.skippedCharacters.push(this.state.auction.currentCharacter);
    }

    this.notifyState();

    setTimeout(() => {
      this.startNextAuction();
    }, 400);

    return { success: true, isSkipped: true };
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (!this.state.auction.isActive) return;

      // Handle AI bot bids periodically during timer
      this.simulateBots();

      this.state.auction.timeRemaining -= 1;

      if (this.state.auction.timeRemaining <= 0) {
        this.handleAuctionTimeExpired();
      } else {
        this.notifyState();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private simulateBots() {
    const bots = this.state.players.filter(p => p.isBot && p.collection.length < this.state.settings.characterLimit);
    for (const bot of bots) {
      const bidAmount = calculateBotBid(bot, this.state.auction, this.state.settings);
      if (bidAmount !== null) {
        this.placeBid(bot.id, bidAmount);
        break; // Max 1 bot bid per second
      }
    }
  }

  private handleAuctionTimeExpired() {
    this.stopTimer();
    this.state.auction.isActive = false;

    const winnerId = this.state.auction.highestBidderId;
    const finalBid = this.state.auction.currentBid;
    const char = this.state.auction.currentCharacter;

    if (winnerId && char && finalBid > 0) {
      const winner = this.state.players.find(p => p.id === winnerId);
      if (winner) {
        // Strict duplicate protection
        const alreadyOwned = winner.collection.some(c => c.id === char.id);
        if (!alreadyOwned) {
          winner.money = Math.max(0, winner.money - finalBid);
          winner.collection.push(char);
          winner.stats.moneySpent += finalBid;
        }

        if (!this.state.purchasedCharacters.some(c => c.id === char.id)) {
          this.state.purchasedCharacters.push(char);
        }

        this.state.auction.statusMessage = `🎉 ${winner.name} won ${char.name} for $${finalBid}!`;
      }
    } else {
      if (char && !this.state.skippedCharacters.some(c => c.id === char.id)) {
        this.state.skippedCharacters.push(char);
      }
      this.state.auction.statusMessage = 'NO BIDS PLACED - Card remains unsold.';
    }

    this.state.phase = 'AUCTION_WINNER';
    this.notifyState();

    setTimeout(() => {
      this.startNextAuction();
    }, 4800);
  }

  private finishAuctionPhase() {
    this.stopTimer();
    this.state.phase = 'AUCTION_COMPLETE';
    this.notifyState();

    setTimeout(() => {
      this.state.phase = 'EQUIPMENT_SHOP';
      this.notifyState();
    }, 2000);
  }

  public instantSkipLot() {
    if (!this.state.auction.isActive) return;
    this.stopTimer();
    this.handleAuctionTimeExpired();
  }

  public concedeLot(playerId: string) {
    if (!this.state.auction.isActive) return;
    const highestBidderId = this.state.auction.highestBidderId;
    if (highestBidderId && highestBidderId !== playerId) {
      this.stopTimer();
      this.handleAuctionTimeExpired();
    }
  }

  public proceedToBattles() {
    // Guarantee every player has at least 1 hero to enter battle!
    this.state.players.forEach((p, idx) => {
      if (p.collection.length === 0) {
        const emergencyHero = ALL_CHARACTERS[idx % ALL_CHARACTERS.length] || ALL_CHARACTERS[0];
        p.collection = [{ ...emergencyHero, currentHp: 100, maxHp: 100, isFainted: false }];
      }
    });

    this.state.phase = 'BATTLE_TRANSITION';
    this.state.tournamentMatches = generateTournamentBracket(this.state.players);
    this.notifyState();

    setTimeout(() => {
      this.state.phase = 'TOURNAMENT_TREE';
      this.notifyState();
    }, 2500);
  }

  public updatePlayerCollection(playerId: string, updatedCollection: Character[], updatedMoney: number) {
    const player = this.state.players.find(p => p.id === playerId);
    if (player) {
      player.collection = updatedCollection;
      player.money = updatedMoney;
      this.notifyState();
    }
  }

  // Interactive Battle Execution for current match
  public playCurrentMatch(matchId: string) {
    const match = this.state.tournamentMatches.find(m => m.id === matchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') return;

    this.state.currentMatchId = matchId;
    match.status = 'IN_PROGRESS';
    match.rounds = [];
    match.player1Score = 0;
    match.player2Score = 0;
    match.player1Action = undefined;
    match.player2Action = undefined;
    match.player1Ready = match.player1.isBot ? true : false;
    match.player2Ready = match.player2.isBot ? true : false;

    // Initialize HP (100 HP) on all fighters in collection
    [match.player1, match.player2].forEach(p => {
      p.collection.forEach(c => {
        if (c.currentHp === undefined) c.currentHp = c.maxHp || 100;
        if (c.maxHp === undefined) c.maxHp = 100;
        c.isFainted = c.currentHp <= 0;
      });
    });

    this.state.phase = 'BATTLE_FIGHT';
    this.notifyState();
  }

  // Interactive player tactical move execution with READY lock
  public executeBattleAction(
    playerId: string,
    action: BattleActionType,
    fighterIndex?: number
  ): { success: boolean; alreadyReady?: boolean } {
    const match = this.state.tournamentMatches.find(m => m.id === this.state.currentMatchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') {
      return { success: false };
    }

    const isP1 = match.player1.id === playerId;
    const isP2 = match.player2.id === playerId;
    if (!isP1 && !isP2) return { success: false };

    // Idempotent check: if already locked and ready, ignore duplicate clicks
    if (isP1 && match.player1Ready && match.player1Action) {
      return { success: true, alreadyReady: true };
    }
    if (isP2 && match.player2Ready && match.player2Action) {
      return { success: true, alreadyReady: true };
    }

    if (isP1) {
      match.player1Action = action;
      match.player1Ready = true;
      if (fighterIndex !== undefined) match.player1SelectedHeroIndex = fighterIndex;
    } else {
      match.player2Action = action;
      match.player2Ready = true;
      if (fighterIndex !== undefined) match.player2SelectedHeroIndex = fighterIndex;
    }

    // Auto-choose move and set ready for Bot player if present
    if (match.player1.isBot && !match.player1Action) {
      const actions: BattleActionType[] = ['ATTACK', 'SPECIAL', 'DEFEND', 'ARTIFACT'];
      match.player1Action = actions[Math.floor(Math.random() * actions.length)];
      match.player1Ready = true;
    }
    if (match.player2.isBot && !match.player2Action) {
      const actions: BattleActionType[] = ['ATTACK', 'SPECIAL', 'DEFEND', 'ARTIFACT'];
      match.player2Action = actions[Math.floor(Math.random() * actions.length)];
      match.player2Ready = true;
    }

    // If BOTH players are explicitly READY -> RESOLVE CLASH!
    if (match.player1Ready && match.player2Ready && match.player1Action && match.player2Action) {
      this.resolveCurrentDuelClash(match);
    } else {
      this.notifyState();
    }

    return { success: true };
  }

  private resolveCurrentDuelClash(match: TournamentMatch) {
    const p1 = match.player1!;
    const p2 = match.player2!;

    let p1HeroIdx = match.player1SelectedHeroIndex ?? 0;
    let p2HeroIdx = match.player2SelectedHeroIndex ?? 0;

    let p1Hero = p1.collection[p1HeroIdx];
    let p2Hero = p2.collection[p2HeroIdx];

    // Ensure living hero
    if (!p1Hero || (p1Hero.currentHp !== undefined && p1Hero.currentHp <= 0)) {
      p1HeroIdx = p1.collection.findIndex(c => (c.currentHp ?? 100) > 0);
      if (p1HeroIdx === -1) p1HeroIdx = 0;
      p1Hero = p1.collection[p1HeroIdx];
      match.player1SelectedHeroIndex = p1HeroIdx;
    }
    if (!p2Hero || (p2Hero.currentHp !== undefined && p2Hero.currentHp <= 0)) {
      p2HeroIdx = p2.collection.findIndex(c => (c.currentHp ?? 100) > 0);
      if (p2HeroIdx === -1) p2HeroIdx = 0;
      p2Hero = p2.collection[p2HeroIdx];
      match.player2SelectedHeroIndex = p2HeroIdx;
    }

    const roundNumber = match.rounds.length + 1;
    const p1Action = match.player1Action || 'ATTACK';
    const p2Action = match.player2Action || 'ATTACK';

    const roundResult = simulateRoundDuel(p1, p1Hero, p2, p2Hero, roundNumber, p1Action, p2Action);

    // Synchronize HP changes back to hero objects
    p1Hero.currentHp = roundResult.player1HpRemaining;
    p2Hero.currentHp = roundResult.player2HpRemaining;
    p1Hero.isFainted = (p1Hero.currentHp ?? 100) <= 0;
    p2Hero.isFainted = (p2Hero.currentHp ?? 100) <= 0;

    match.rounds.push(roundResult);

    // Reset pending action locks for the next turn
    match.player1Action = undefined;
    match.player2Action = undefined;
    match.player1Ready = p1.isBot ? true : false;
    match.player2Ready = p2.isBot ? true : false;

    // Track knockout scoreboard (total enemy heroes defeated)
    match.player1Score = p2.collection.filter(c => (c.currentHp ?? 100) <= 0).length;
    match.player2Score = p1.collection.filter(c => (c.currentHp ?? 100) <= 0).length;

    // Check if entire team is KO'd (Health reaches 0 on all fighters of a team)
    const p1AllDead = p1.collection.every(c => (c.currentHp ?? 100) <= 0);
    const p2AllDead = p2.collection.every(c => (c.currentHp ?? 100) <= 0);
    const isMatchOver = p1AllDead || p2AllDead;

    if (isMatchOver) {
      const winner = p2AllDead ? p1 : p2;
      match.winner = winner;
      match.status = 'COMPLETED';
      winner.stats.battlesWon += 1;

      const { updatedMatches, champion } = advanceTournamentMatches(this.state.tournamentMatches);
      this.state.tournamentMatches = updatedMatches;
      this.state.champion = champion;

      this.notifyState();

      setTimeout(() => {
        this.state.phase = champion ? 'CHAMPION' : 'MATCH_RESULT';
        this.notifyState();
      }, 4000);
    } else {
      // Auto-switch to next living fighter if current fighter fainted
      if (p1Hero.isFainted) {
        const nextIdx = p1.collection.findIndex(c => (c.currentHp ?? 100) > 0);
        if (nextIdx !== -1) match.player1SelectedHeroIndex = nextIdx;
      }
      if (p2Hero.isFainted) {
        const nextIdx = p2.collection.findIndex(c => (c.currentHp ?? 100) > 0);
        if (nextIdx !== -1) match.player2SelectedHeroIndex = nextIdx;
      }
      this.notifyState();
    }
  }

  public concedeMatch(playerId: string): { success: boolean } {
    const match = this.state.tournamentMatches.find(m => m.id === this.state.currentMatchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') {
      return { success: false };
    }

    const isP1 = match.player1.id === playerId;
    const isP2 = match.player2.id === playerId;
    if (!isP1 && !isP2) return { success: false };

    const winner = isP1 ? match.player2 : match.player1;
    const loser = isP1 ? match.player1 : match.player2;

    loser.collection.forEach(c => {
      c.currentHp = 0;
      c.isFainted = true;
    });

    match.winner = winner;
    match.status = 'COMPLETED';
    winner.stats.battlesWon += 1;

    const { updatedMatches, champion } = advanceTournamentMatches(this.state.tournamentMatches);
    this.state.tournamentMatches = updatedMatches;
    this.state.champion = champion;

    this.notifyState();

    setTimeout(() => {
      this.state.phase = champion ? 'CHAMPION' : 'MATCH_RESULT';
      this.notifyState();
    }, 2500);

    return { success: true };
  }

  public skipMatch(): { success: boolean } {
    const match = this.state.tournamentMatches.find(m => m.id === this.state.currentMatchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') {
      return { success: false };
    }

    let iterations = 0;
    while ((match.status as string) !== 'COMPLETED' && iterations < 30) {
      iterations++;
      const p1Alive = match.player1.collection.some(c => (c.currentHp ?? 100) > 0);
      const p2Alive = match.player2.collection.some(c => (c.currentHp ?? 100) > 0);
      if (!p1Alive || !p2Alive) break;

      match.player1Action = 'ATTACK';
      match.player2Action = 'ATTACK';
      this.resolveCurrentDuelClash(match);
    }
    return { success: true };
  }

  public resetGame() {
    this.stopTimer();
    this.stopGradeVoteTimer();
    this.state.phase = 'ONLINE_LOBBY';
    this.state.availableCharacters = [...ALL_CHARACTERS].sort(() => Math.random() - 0.5);
    this.state.purchasedCharacters = [];
    this.state.skippedCharacters = [];
    this.state.tournamentMatches = [];
    this.state.currentMatchId = null;
    this.state.champion = null;
    this.state.lastVotedCheckpoint = 0;
    this.state.queuedGrade = null;
    this.gradeVotes = {};
    this.state.players.forEach(p => {
      p.money = this.state.settings.startingMoney;
      p.collection = [];
      p.isReady = p.isBot;
      p.stats = { battlesWon: 0, moneySpent: 0, highestBid: 0 };
    });
    this.notifyState();
  }

  private notifyState() {
    this.onStateChange({ ...this.state });
  }
}


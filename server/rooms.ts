import { 
  GameState, 
  Player, 
  GameSettings, 
  AuctionState, 
  TournamentMatch,
  Character,
} from '../src/types/game';
import { ALL_CHARACTERS } from '../src/data/characters/index';
import { validateBid, validateSkipVote, calculateBotBid } from './auctionEngine';
import { generateTournamentBracket, advanceTournamentMatches } from './tournamentEngine';
import { simulateRoundDuel, getTierMatchedPairings } from './battleEngine';

export class GameRoom {
  public state: GameState;
  private timerInterval: NodeJS.Timeout | null = null;
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
    if (this.state.players.length >= 8 || this.state.phase !== 'ONLINE_LOBBY') {
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
    // Set all starting moneys
    this.state.players.forEach(p => {
      p.money = this.state.settings.startingMoney;
      p.collection = [];
    });

    this.state.phase = 'AUCTION_INTRO';
    this.notifyState();

    setTimeout(() => {
      this.startNextAuction();
    }, 2000);
  }

  public startNextAuction() {
    this.stopTimer();

    // Check if all players completed character collection
    const activePlayers = this.state.players.filter(
      p => p.collection.length < this.state.settings.characterLimit
    );

    if (activePlayers.length === 0) {
      this.finishAuctionPhase();
      return;
    }

    // Pick next random character from remaining available pool
    if (this.state.availableCharacters.length === 0) {
      // Reshuffle skipped if completely exhausted
      this.state.availableCharacters = [...this.state.skippedCharacters].sort(() => Math.random() - 0.5);
      this.state.skippedCharacters = [];
    }

    const nextChar = this.state.availableCharacters.pop() || null;
    if (!nextChar) {
      this.finishAuctionPhase();
      return;
    }

    const isMythic = nextChar.grade === 'MYTHIC';

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
      statusMessage: isMythic ? '⚡ MYTHIC CHARACTER DETECTED!' : `Auctioning ${nextChar.name}`,
      isMythicRevealed: isMythic,
    };

    this.state.phase = isMythic ? 'AUCTION_REVEAL_MYTHIC' : 'AUCTION';
    this.notifyState();

    if (isMythic) {
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

    const result = validateSkipVote(player, this.state.auction, this.state.players);
    if (!result.valid) {
      return { success: false, isSkipped: false, error: result.error };
    }

    this.state.auction.skipVotes = result.newVotes;

    if (result.isSkipped) {
      this.state.auction.statusMessage = 'CARD SKIPPED BY UNANIMOUS VOTE!';
      this.state.auction.isActive = false;
      this.stopTimer();

      if (this.state.auction.currentCharacter) {
        this.state.skippedCharacters.push(this.state.auction.currentCharacter);
      }

      this.notifyState();

      setTimeout(() => {
        this.startNextAuction();
      }, 1500);
      return { success: true, isSkipped: true };
    }

    this.notifyState();
    return { success: true, isSkipped: false };
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
        winner.money -= finalBid;
        winner.collection.push(char);
        winner.stats.moneySpent += finalBid;
        this.state.purchasedCharacters.push(char);

        this.state.auction.statusMessage = `🎉 ${winner.name} won ${char.name} for $${finalBid}!`;
      }
    } else {
      if (char) {
        this.state.skippedCharacters.push(char);
      }
      this.state.auction.statusMessage = 'NO BIDS PLACED - Card remains unsold.';
    }

    this.state.phase = 'AUCTION_WINNER';
    this.notifyState();

    setTimeout(() => {
      this.startNextAuction();
    }, 3000);
  }

  private finishAuctionPhase() {
    this.stopTimer();
    this.state.phase = 'AUCTION_COMPLETE';
    this.notifyState();

    setTimeout(() => {
      this.state.phase = 'BATTLE_TRANSITION';
      this.state.tournamentMatches = generateTournamentBracket(this.state.players);
      this.notifyState();

      setTimeout(() => {
        this.state.phase = 'TOURNAMENT_TREE';
        this.notifyState();
      }, 3000);
    }, 2500);
  }

  // Battle execution for current match
  public playCurrentMatch(matchId: string) {
    const match = this.state.tournamentMatches.find(m => m.id === matchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') return;

    this.state.currentMatchId = matchId;
    match.status = 'IN_PROGRESS';

    const pairings = getTierMatchedPairings(match.player1.collection, match.player2.collection);
    match.rounds = [];
    match.player1Score = 0;
    match.player2Score = 0;

    this.state.phase = 'BATTLE_FIGHT';
    this.notifyState();

    // Sequentially resolve battle rounds with dramatic timeouts
    let roundIndex = 0;
    const runNextDuel = () => {
      if (roundIndex >= pairings.length) {
        // Match finished
        const winner = match.player1Score >= match.player2Score ? match.player1 : match.player2;
        match.winner = winner!;
        match.status = 'COMPLETED';
        winner!.stats.battlesWon += 1;

        const { updatedMatches, champion } = advanceTournamentMatches(this.state.tournamentMatches);
        this.state.tournamentMatches = updatedMatches;
        this.state.champion = champion;

        this.state.phase = champion ? 'CHAMPION' : 'MATCH_RESULT';
        this.notifyState();
        return;
      }

      const pairing = pairings[roundIndex];
      const result = simulateRoundDuel(
        match.player1!,
        pairing.p1Char,
        match.player2!,
        pairing.p2Char,
        roundIndex + 1
      );

      match.rounds.push(result);
      if (result.winnerPlayerId === match.player1!.id) {
        match.player1Score += 1;
      } else {
        match.player2Score += 1;
      }

      this.notifyState();
      roundIndex++;

      setTimeout(runNextDuel, 4000);
    };

    setTimeout(runNextDuel, 1500);
  }

  public resetGame() {
    this.stopTimer();
    this.state.phase = 'ONLINE_LOBBY';
    this.state.availableCharacters = [...ALL_CHARACTERS].sort(() => Math.random() - 0.5);
    this.state.purchasedCharacters = [];
    this.state.skippedCharacters = [];
    this.state.tournamentMatches = [];
    this.state.currentMatchId = null;
    this.state.champion = null;
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

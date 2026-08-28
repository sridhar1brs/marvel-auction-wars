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
  ChatMessage, 
  PlayerStatus,
  ChaosEvent,
  AscensionBattleState,
  AscensionBattlePlayer
} from '../src/types/game';
import { ALL_CHARACTERS } from '../src/data/characters/index';
import { validateBid, validateSkipVote, calculateBotBid } from './auctionEngine';
import { generateTournamentBracket, advanceTournamentMatches } from './tournamentEngine';
import { simulateRoundDuel, getTierMatchedPairings } from './battleEngine';
import { getRandomChaosEvent } from '../src/data/chaosEvents';
import { getSkillsForCharacter } from '../src/data/skills/characterSkills';

export interface AscensionBattleResult {
  roomId: string;
  mode: 'casual' | 'ranked';
  format: AscensionBattleState['format'];
  winnerId: string;
  playerIds: string[];
  matchToken: string;
}

/**
 * Server-owned Ascension room. It intentionally does not reuse GameRoom:
 * Auction rooms keep their legacy rules while Ascension rooms use canonical
 * cards and resolve every action on the server.
 */
export class OnlineBattleRoom {
  public readonly state: AscensionBattleState;
  private readonly onStateChange: (state: AscensionBattleState) => void;
  private readonly onResult: (result: AscensionBattleResult) => void;
  private disconnectTimers = new Map<string, NodeJS.Timeout>();
  private pendingSkillIds = new Map<string, string>();

  constructor(
    roomId: string,
    mode: 'casual' | 'ranked',
    format: AscensionBattleState['format'],
    onStateChange: (state: AscensionBattleState) => void,
    onResult: (result: AscensionBattleResult) => void
  ) {
    this.onStateChange = onStateChange;
    this.onResult = onResult;
    this.state = {
      roomId, mode, format, phase: 'LOBBY', maxPlayers: 10, hostId: '',
      players: [], currentRound: 0, activePlayerIds: [],
      selectedHeroIndexes: {}, pendingActions: {}, rounds: [], combatLogs: []
    };
  }

  addPlayer(player: AscensionBattlePlayer): { success: boolean; error?: string } {
    if (this.state.phase !== 'LOBBY') return { success: false, error: 'Battle has already started.' };
    if (this.state.players.length >= this.state.maxPlayers) return { success: false, error: 'Room is full (10 players maximum).' };
    if (this.state.players.some(p => p.profileId && p.profileId === player.profileId)) {
      return { success: false, error: 'You are already in this room.' };
    }
    if (!this.state.hostId) {
      player.isHost = true;
      this.state.hostId = player.id;
    }
    this.state.players.push(player);
    this.notify();
    return { success: true };
  }

  reconnect(profileId: string, socketId: string, name: string, avatar: string): boolean {
    const player = this.state.players.find(p => p.profileId === profileId);
    if (!player) return false;
    const oldSocketId = player.id;
    player.id = socketId;
    player.name = name;
    player.avatar = avatar;
    player.isConnected = true;
    if (this.state.hostId === oldSocketId) this.state.hostId = socketId;
    this.state.activePlayerIds = this.state.activePlayerIds.map(id => id === oldSocketId ? socketId : id);
    if (this.state.selectedHeroIndexes[oldSocketId] !== undefined) {
      this.state.selectedHeroIndexes[socketId] = this.state.selectedHeroIndexes[oldSocketId];
      delete this.state.selectedHeroIndexes[oldSocketId];
    }
    const timer = this.disconnectTimers.get(profileId);
    if (timer) clearTimeout(timer);
    this.disconnectTimers.delete(profileId);
    this.notify();
    return true;
  }

  removePlayer(playerId: string) {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return;
    if (this.state.phase === 'BATTLE') {
      player.isConnected = false;
      const identity = player.profileId || player.id;
      const timer = setTimeout(() => {
        if (!player.isConnected && this.state.phase === 'BATTLE') {
          const opponent = this.state.players.find(p => p.id !== playerId && p.isConnected);
          if (opponent) this.finish(opponent.id, `☠️ ${player.name} disconnected and forfeited.`);
        }
      }, 15000);
      this.disconnectTimers.set(identity, timer);
      this.notify();
      return;
    }
    this.state.players = this.state.players.filter(p => p.id !== playerId);
    if (this.state.hostId === playerId && this.state.players[0]) {
      this.state.players[0].isHost = true;
      this.state.hostId = this.state.players[0].id;
    }
    this.notify();
  }

  setTeam(playerId: string, team: Character[]): { success: boolean; error?: string } {
    if (this.state.phase !== 'LOBBY') return { success: false, error: 'Team selection is locked.' };
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found.' };
    if (!team.length || team.length > 5) return { success: false, error: 'Choose between 1 and 5 heroes.' };
    player.team = team;
    player.isReady = false;
    this.notify();
    return { success: true };
  }

  setReady(playerId: string, ready: boolean): { success: boolean; error?: string } {
    if (this.state.phase !== 'LOBBY') return { success: false, error: 'Lobby is closed.' };
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found.' };
    if (ready && player.team.length === 0) return { success: false, error: 'Select a team before readying up.' };
    player.isReady = ready;
    this.notify();
    return { success: true };
  }

  start(playerId: string, bypassReady = false): { success: boolean; error?: string } {
    if (this.state.phase !== 'LOBBY') return { success: false, error: 'Battle is not in the lobby.' };
    if (!bypassReady && this.state.hostId !== playerId) return { success: false, error: 'Only the host can start this battle.' };
    const active = this.state.players.filter(p => p.isConnected);
    if (active.length < 2) return { success: false, error: 'At least two connected players are required.' };
    if (!bypassReady && active.some(p => !p.isReady || p.team.length === 0)) {
      return { success: false, error: 'Every player must select a team and ready up.' };
    }
    if (this.state.mode === 'ranked' && active.length !== 2) {
      return { success: false, error: 'Ranked queue requires exactly two players.' };
    }
    this.state.phase = 'BATTLE';
    this.state.activePlayerIds = active.slice(0, 2).map(p => p.id);
    active.forEach(p => p.team.forEach(hero => {
      hero.currentHp = hero.maxHp || 100;
      hero.maxHp = hero.maxHp || 100;
      hero.isFainted = false;
      hero.usedSkillIds = [];
    }));
    this.state.combatLogs = [`⚔️ ${active[0].name} VS ${active[1].name}`, `Format: ${this.state.format.toUpperCase()} • ${this.state.mode.toUpperCase()}`];
    this.notify();
    return { success: true };
  }

  submitAction(playerId: string, action: BattleActionType, fighterIndex = 0, skillId?: string): { success: boolean; error?: string } {
    if (this.state.phase !== 'BATTLE') return { success: false, error: 'No active battle.' };
    if (!this.state.activePlayerIds.includes(playerId)) return { success: false, error: 'Spectators cannot control this battle.' };
    const player = this.state.players.find(p => p.id === playerId);
    if (!player || !player.isConnected) return { success: false, error: 'Player is disconnected.' };
    const validActions: BattleActionType[] = ['ATTACK', 'SPECIAL', 'DEFEND', 'ARTIFACT', 'SKILL_1', 'SKILL_2', 'SKILL_3', 'SKILL_4', 'SKILL_5', 'DUAL_STRIKE'];
    if (!validActions.includes(action)) return { success: false, error: 'Invalid battle action.' };
    if (this.state.pendingActions[playerId]) return { success: false, error: 'Action already locked for this round.' };
    const hero = player.team[fighterIndex];
    if (!hero || (hero.currentHp ?? 100) <= 0) return { success: false, error: 'Choose a living hero.' };
    if (skillId) {
      const known = getSkillsForCharacter(hero).some(skill => skill.id === skillId);
      if (!known) return { success: false, error: 'That signature skill is not available to this hero.' };
      hero.usedSkillIds = hero.usedSkillIds || [];
      if (hero.usedSkillIds.includes(skillId)) return { success: false, error: 'Signature skills can only be used once per battle.' };
      hero.usedSkillIds.push(skillId);
      this.pendingSkillIds.set(playerId, skillId);
    }
    this.state.selectedHeroIndexes[playerId] = fighterIndex;
    this.state.pendingActions[playerId] = action;
    const [firstId, secondId] = this.state.activePlayerIds;
    if (this.state.pendingActions[firstId] && this.state.pendingActions[secondId]) this.resolveRound();
    else this.notify();
    return { success: true };
  }

  private toPlayer(player: AscensionBattlePlayer): Player {
    return {
      id: player.id, name: player.name, avatar: player.avatar, money: 0, collection: player.team,
      isHost: player.isHost, isReady: player.isReady, isBot: false,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 }
    };
  }

  private resolveRound() {
    const [p1Id, p2Id] = this.state.activePlayerIds;
    const p1 = this.state.players.find(p => p.id === p1Id)!;
    const p2 = this.state.players.find(p => p.id === p2Id)!;
    const p1Hero = p1.team[this.state.selectedHeroIndexes[p1Id] ?? 0];
    const p2Hero = p2.team[this.state.selectedHeroIndexes[p2Id] ?? 0];
    const round = simulateRoundDuel(
      this.toPlayer(p1), p1Hero, this.toPlayer(p2), p2Hero, ++this.state.currentRound,
      this.state.pendingActions[p1Id], this.state.pendingActions[p2Id],
      this.pendingSkillIds.get(p1Id), this.pendingSkillIds.get(p2Id)
    );
    p1Hero.currentHp = round.player1HpRemaining;
    p2Hero.currentHp = round.player2HpRemaining;
    p1Hero.isFainted = p1Hero.currentHp <= 0;
    p2Hero.isFainted = p2Hero.currentHp <= 0;
    this.state.rounds.push(round);
    this.state.combatLogs.push(...round.log);
    this.state.pendingActions = {};
    this.pendingSkillIds.clear();
    if (p1.team.every(hero => (hero.currentHp ?? 100) <= 0)) return this.finish(p2Id, `🏆 ${p2.name} wins the Ascension battle!`);
    if (p2.team.every(hero => (hero.currentHp ?? 100) <= 0)) return this.finish(p1Id, `🏆 ${p1.name} wins the Ascension battle!`);
    if (p1Hero.isFainted) this.state.selectedHeroIndexes[p1Id] = p1.team.findIndex(hero => (hero.currentHp ?? 100) > 0);
    if (p2Hero.isFainted) this.state.selectedHeroIndexes[p2Id] = p2.team.findIndex(hero => (hero.currentHp ?? 100) > 0);
    this.notify();
  }

  private finish(winnerId: string, log: string) {
    if (this.state.phase === 'RESULT') return;
    this.state.phase = 'RESULT';
    this.state.winnerId = winnerId;
    this.state.combatLogs.push(log);
    this.notify();
    this.onResult({
      roomId: this.state.roomId, mode: this.state.mode, format: this.state.format,
      winnerId, playerIds: this.state.players.map(p => p.profileId || p.id),
      matchToken: `ascension-${this.state.roomId}-${Date.now()}`
    });
  }

  private notify() {
    this.onStateChange({ ...this.state, players: this.state.players.map(p => ({ ...p, team: p.team.map(hero => ({ ...hero })) })) });
  }
}

export class GameRoom {
  public state: GameState;
  private timerInterval: NodeJS.Timeout | null = null;
  private gradeVoteTimeout: NodeJS.Timeout | null = null;
  private gradeVotes: Record<string, GradeVoteOption> = {};
  private onStateChange: (state: GameState) => void;

  constructor(roomId: string, hostPlayer: Player, onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    hostPlayer.isHost = true;
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
    const validated = { ...settings };
    if (validated.startingMoney !== undefined) {
      validated.startingMoney = Math.min(1000, Math.max(10, Number(validated.startingMoney) || 10));
    }
    this.state.settings = { ...this.state.settings, ...validated };
    this.notifyState();
  }

  public startGame(): { success: boolean; error?: string } {
    if (this.state.players.length < 2) {
      return { success: false, error: 'At least two players are required to start.' };
    }
    const activePlayers = this.state.players.filter(player => !player.isDisconnected);
    if (activePlayers.some(player => !player.isBot && !player.isReady)) {
      return { success: false, error: 'Every connected player must be ready before the host can start.' };
    }
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
    return { success: true };
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

    // Trigger Chaos Auction Event if enabled
    if (this.state.settings.chaosAuctionEnabled) {
      const chaosEvent = getRandomChaosEvent();
      this.state.activeChaosEvent = chaosEvent;
      
      if (chaosEvent.effectType === 'speed_auction') {
        this.state.auction.timeRemaining = 5;
      } else if (chaosEvent.effectType === 'cheap_round') {
        nextChar.startingPrice = Math.max(2, nextChar.startingPrice - 4);
      } else if (chaosEvent.effectType === 'expensive_round') {
        nextChar.startingPrice += 5;
      } else if (chaosEvent.effectType === 'deadpool_chaos') {
        nextChar.startingPrice = 1;
      } else if (chaosEvent.effectType === 'super_soldier_serum') {
        nextChar.maxHp = 130;
        nextChar.currentHp = 130;
      } else if (chaosEvent.effectType === 'random_grade') {
        nextChar.overallPower += 5;
      } else if (chaosEvent.effectType === 'double_money') {
        this.state.players.forEach(p => { p.money += 10; });
      }
    } else {
      this.state.activeChaosEvent = null;
    }

    this.state.phase = (isMythic && !isBlindMode) ? 'AUCTION_REVEAL_MYTHIC' : 'AUCTION';
    this.syncPlayerStatuses();
    this.notifyState();

    if (isMythic && !isBlindMode) {
      setTimeout(() => {
        if (this.state.phase === 'AUCTION_REVEAL_MYTHIC') {
          this.state.phase = 'AUCTION';
          this.syncPlayerStatuses();
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

    if (player.flashbangedUntil && Date.now() < player.flashbangedUntil) {
      return { success: false, error: 'FLASHBANGED: Actions locked for 4 seconds.' };
    }

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

    if (player.flashbangedUntil && Date.now() < player.flashbangedUntil) {
      return { success: false, isSkipped: false, error: 'FLASHBANGED: Actions locked for 4 seconds.' };
    }

    // Leading bidder cannot vote to skip their own winning card
    if (this.state.auction.highestBidderId === player.id) {
      return { success: false, isSkipped: false, error: 'Leading bidder cannot vote to skip.' };
    }

    // Prevent duplicate votes from the same player
    if (!this.state.auction.skipVotes.includes(playerId)) {
      this.state.auction.skipVotes.push(playerId);
    }

    const eligiblePlayers = this.state.players.filter(
      p => p.collection.length < this.state.settings.characterLimit
    );

    // Skip ONLY when ALL eligible players have voted
    const allVoted = eligiblePlayers.length > 0 && eligiblePlayers.every(p => this.state.auction.skipVotes.includes(p.id));

    if (allVoted) {
      this.state.auction.statusMessage = `⏭️ CARD SKIPPED BY UNANIMOUS VOTE!`;
      this.state.auction.isActive = false;
      this.stopTimer();

      if (this.state.auction.currentCharacter) {
        this.state.skippedCharacters.push(this.state.auction.currentCharacter);
      }

      this.notifyState();

      setTimeout(() => {
        this.startNextAuction();
      }, 500);

      return { success: true, isSkipped: true };
    }

    this.state.auction.statusMessage = `🗳️ ${player.name} voted to skip (${this.state.auction.skipVotes.length}/${eligiblePlayers.length})`;
    this.notifyState();
    return { success: true, isSkipped: false };
  }

  public instantSkipLot(): { success: boolean } {
    if (!this.state.auction.isActive || !this.state.auction.currentCharacter) {
      return { success: false };
    }
    this.state.auction.statusMessage = `⚡ CARD INSTANTLY SKIPPED!`;
    this.state.auction.isActive = false;
    this.stopTimer();

    if (this.state.auction.currentCharacter) {
      this.state.skippedCharacters.push(this.state.auction.currentCharacter);
    }

    this.notifyState();
    setTimeout(() => {
      this.startNextAuction();
    }, 400);

    return { success: true };
  }

  public concedeLot(playerId: string): { success: boolean; error?: string } {
    if (!this.state.auction.isActive || !this.state.auction.currentCharacter) {
      return { success: false, error: 'No active auction.' };
    }
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found.' };

    if (player.flashbangedUntil && Date.now() < player.flashbangedUntil) {
      return { success: false, error: 'FLASHBANGED: Actions locked for 4 seconds.' };
    }

    if (this.state.auction.highestBidderId && this.state.auction.currentBid > 0) {
      this.state.auction.statusMessage = `🏳️ ${player.name} CONCEDED LOT TO ${this.state.auction.highestBidderName?.toUpperCase()}!`;
      this.handleAuctionTimeExpired();
    } else {
      this.state.auction.statusMessage = `🏳️ ${player.name} CONCEDED LOT!`;
      this.instantSkipLot();
    }

    return { success: true };
  }

  public triggerFlashbang(attackerId: string, targetId?: string): { success: boolean; error?: string } {
    const attacker = this.state.players.find(p => p.id === attackerId);
    if (!attacker) return { success: false, error: 'Player not found.' };

    if (attacker.flashbangedUntil && Date.now() < attacker.flashbangedUntil) {
      return { success: false, error: 'Cannot detonate while blinded.' };
    }

    const cost = Math.max(2, Math.round(this.state.settings.startingMoney * 0.05));
    const hasRelic = attacker.relics && (attacker.relics.includes('art-001-1') || attacker.relics.includes('art-026'));
    if (attacker.money < cost && !hasRelic) {
      return { success: false, error: `Insufficient funds for Flashbang ($${cost} required).` };
    }

    if (attacker.money >= cost) {
      attacker.money -= cost;
    }

    const lockUntil = Date.now() + 4000;
    this.state.players.forEach(p => {
      if (p.id !== attackerId && (!targetId || targetId === 'all' || p.id === targetId)) {
        p.flashbangedUntil = lockUntil;
        p.flashbangedBy = attacker.name;
      }
    });

    this.notifyState();
    return { success: true };
  }

  public useHealingPotion(playerId: string, heroId?: string): { success: boolean; error?: string } {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found.' };

    const isPotionItem = (item?: any) => {
      if (!item) return false;
      const id = (typeof item === 'string' ? item : item.id || '').toLowerCase();
      const name = (typeof item === 'object' && item.name ? item.name : '').toLowerCase();
      return (
        ['art-heal-01', 'art-heal-02', 'art-heal-03', 'art-025', 'relic-health-potion'].includes(id) ||
        id.includes('heal') ||
        id.includes('potion') ||
        id.includes('serum') ||
        id.includes('elixir') ||
        name.includes('heal') ||
        name.includes('potion') ||
        name.includes('serum') ||
        name.includes('elixir')
      );
    };

    // Check ownership in relics inventory, general inventory, or equipped on any hero
    const ownedRelicPotion = player.relics ? player.relics.find(isPotionItem) : undefined;
    const heroWithPotion = player.collection.find(c => isPotionItem(c.equippedArtifact));

    if (!ownedRelicPotion && !heroWithPotion) {
      return { success: false, error: 'Healing Potion not owned in inventory.' };
    }

    const hero = heroId 
      ? player.collection.find(c => c.id === heroId)
      : player.collection.find(c => (c.currentHp ?? 100) < (c.maxHp ?? 100) && (c.currentHp ?? 100) > 0) || player.collection[0];

    if (!hero) return { success: false, error: 'No valid hero to heal.' };

    const currentHp = hero.currentHp ?? 100;
    const maxHp = hero.maxHp ?? 100;
    hero.currentHp = Math.min(maxHp, currentHp + 40);

    // Consume 1 potion from player's inventory or equipped slot
    if (ownedRelicPotion && player.relics) {
      const idx = player.relics.indexOf(ownedRelicPotion);
      if (idx !== -1) player.relics.splice(idx, 1);
    } else if (heroWithPotion) {
      heroWithPotion.equippedArtifact = null;
    }

    this.notifyState();
    return { success: true };
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
          let actualDeduction = finalBid;
          const chaos = this.state.activeChaosEvent;

          // 🛡️ Vibranium Rebate: 50% Cashback Refund
          if (chaos && chaos.effectType === 'vibranium_rebate') {
            actualDeduction = Math.max(0, finalBid - Math.floor(finalBid * 0.5));
          }

          // 🕸️ Web-Snare Tax
          if (chaos && chaos.effectType === 'web_snare_tax' && winner.money >= 2) {
            actualDeduction += 2;
            char.stats.speed += 4;
          }

          // 📈 Premium Lot: +3 Permanent Power
          if (chaos && chaos.effectType === 'expensive_round') {
            char.overallPower += 3;
          }

          winner.money = Math.max(0, winner.money - actualDeduction);
          winner.collection.push(char);
          winner.stats.moneySpent += finalBid;

          // 🎁 Dual Crate Bonus Drop: Add 1 bonus ally
          if (chaos && chaos.effectType === 'double_auction' && this.state.availableCharacters.length > 0 && winner.collection.length < this.state.settings.characterLimit) {
            const bonusChar = this.state.availableCharacters.shift();
            if (bonusChar && !winner.collection.some(c => c.id === bonusChar.id)) {
              winner.collection.push(bonusChar);
              this.state.purchasedCharacters.push(bonusChar);
            }
          }

          // 👑 Asgardian Bounty Cache: Free Healing Potion
          if (chaos && chaos.effectType === 'god_tier_bounty') {
            winner.relics = winner.relics || [];
            winner.relics.push('relic-health-potion');
          }
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

  public discardCharacter(playerId: string, characterId: string): { success: boolean; error?: string } {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found.' };

    const initialCount = player.collection.length;
    player.collection = player.collection.filter(c => c.id !== characterId);

    if (player.collection.length === initialCount) {
      return { success: false, error: 'Character not found in collection.' };
    }

    // Strictly $0 refund: player.money remains identical!
    this.notifyState();
    return { success: true };
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

  public playMatch(matchId: string) {
    this.playCurrentMatch(matchId);
  }

  // Interactive player tactical move execution with READY lock and strict authorization
  public executeBattleAction(
    playerId: string,
    action: BattleActionType,
    fighterIndex?: number,
    skillId?: string
  ): { success: boolean; error?: string; alreadyReady?: boolean } {
    const match = this.state.tournamentMatches.find(m => m.id === this.state.currentMatchId);
    if (!match || !match.player1 || !match.player2 || match.status === 'COMPLETED') {
      return { success: false, error: 'No active match in progress.' };
    }

    const isP1 = match.player1.id === playerId;
    const isP2 = match.player2.id === playerId;
    if (!isP1 && !isP2) {
      return { success: false, error: 'Unauthorized: Spectators cannot control fighters.' };
    }

    const player = isP1 ? match.player1 : match.player2;
    if (player.flashbangedUntil && Date.now() < player.flashbangedUntil) {
      return { success: false, error: 'FLASHBANGED: Actions locked for 4 seconds.' };
    }

    // Idempotent check: if already locked and ready, ignore duplicate clicks
    if (isP1 && match.player1Ready && match.player1Action) {
      return { success: true, alreadyReady: true };
    }
    if (isP2 && match.player2Ready && match.player2Action) {
      return { success: true, alreadyReady: true };
    }

    // Validate fighter selection within owned collection
    const currentHeroIdx = fighterIndex !== undefined 
      ? fighterIndex 
      : (isP1 ? (match.player1SelectedHeroIndex ?? 0) : (match.player2SelectedHeroIndex ?? 0));

    const selectedHero = player.collection[currentHeroIdx] || player.collection[0];
    if (!selectedHero) {
      return { success: false, error: 'Selected hero not found in player inventory.' };
    }

    // Validate 1-time skill usage if using a signature skill
    if (skillId) {
      selectedHero.usedSkillIds = selectedHero.usedSkillIds || [];
      if (selectedHero.usedSkillIds.includes(skillId)) {
        return { success: false, error: 'Skill already used in this duel (1-time limit).' };
      }
      selectedHero.usedSkillIds.push(skillId);
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

    const roundResult = simulateRoundDuel(
      p1,
      p1Hero,
      p2,
      p2Hero,
      roundNumber,
      p1Action,
      p2Action,
      match.player1SkillId,
      match.player2SkillId
    );

    // Synchronize HP changes back to hero objects
    p1Hero.currentHp = roundResult.player1HpRemaining;
    p2Hero.currentHp = roundResult.player2HpRemaining;
    p1Hero.isFainted = (p1Hero.currentHp ?? 100) <= 0;
    p2Hero.isFainted = (p2Hero.currentHp ?? 100) <= 0;

    match.rounds.push(roundResult);

    // Reset pending action locks for the next turn
    match.player1Action = undefined;
    match.player2Action = undefined;
    match.player1SkillId = undefined;
    match.player2SkillId = undefined;
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
      match.player1Action = 'ATTACK';
      match.player2Action = 'ATTACK';
      this.resolveCurrentDuelClash(match);
    }
    return { success: true };
  }

  public isSpectator(playerId: string): boolean {
    if (this.state.phase !== 'BATTLE_FIGHT' && this.state.phase !== 'BATTLE_SELECT') {
      return false;
    }
    const currentMatch = this.state.tournamentMatches.find(m => m.id === this.state.currentMatchId);
    if (!currentMatch) return false;
    return currentMatch.player1?.id !== playerId && currentMatch.player2?.id !== playerId;
  }

  // 1. Spectator Chat (TODO-EXP-01)
  public sendSpectatorChat(playerId: string, message: string): { success: boolean; error?: string } {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'PLAYER_NOT_FOUND' };
    if (!message || !message.trim()) return { success: false, error: 'EMPTY_MESSAGE' };

    const chatMsg: ChatMessage = {
      id: `${Date.now()}-${playerId}`,
      senderId: player.id,
      senderName: player.name,
      senderAvatar: player.avatar,
      message: message.trim().slice(0, 200),
      timestamp: Date.now(),
      isSpectator: this.isSpectator(playerId),
    };

    if (!this.state.spectatorChat) {
      this.state.spectatorChat = [];
    }

    this.state.spectatorChat.push(chatMsg);
    if (this.state.spectatorChat.length > 100) {
      this.state.spectatorChat = this.state.spectatorChat.slice(-100);
    }

    this.notifyState();
    return { success: true };
  }

  // 2. Rematch Voting (TODO-EXP-03)
  public voteRematch(playerId: string): { success: boolean; allVoted: boolean } {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return { success: false, allVoted: false };

    if (!this.state.rematchVotes) {
      this.state.rematchVotes = [];
    }

    if (!this.state.rematchVotes.includes(playerId)) {
      this.state.rematchVotes.push(playerId);
    }

    const humanPlayers = this.state.players.filter(p => !p.isBot && !p.isDisconnected);
    const shouldReset = humanPlayers.length === 0 || humanPlayers.every(p => this.state.rematchVotes?.includes(p.id));

    if (shouldReset) {
      this.resetGame();
      return { success: true, allVoted: true };
    }

    this.notifyState();
    return { success: true, allVoted: false };
  }

  // 3. Host Match Settings (TODO-EXP-05)
  public updateHostSettings(playerId: string, newSettings: Partial<GameSettings>): { success: boolean; error?: string } {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player || !player.isHost) {
      return { success: false, error: 'UNAUTHORIZED_NOT_HOST' };
    }

    this.state.settings = {
      ...this.state.settings,
      ...newSettings,
    };
    this.notifyState();
    return { success: true };
  }

  // 4. Performance-Based Match MVP (TODO-EXP-07)
  public calculateMatchMVP(): Player | null {
    if (!this.state.players || this.state.players.length === 0) return null;

    let bestScore = -1;
    let mvpPlayer: Player | null = null;

    for (const p of this.state.players) {
      // Score factors: Battles Won (100 pts), Money Spent Efficiency, Squad Power
      const squadPower = p.collection.reduce((sum, c) => sum + c.overallPower, 0);
      const battlesScore = (p.stats?.battlesWon || 0) * 100;
      const damageScore = (p.stats?.damageDealt || 0) * 2;
      const efficiencyScore = Math.max(0, p.money * 5);
      const totalScore = battlesScore + damageScore + squadPower + efficiencyScore;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        mvpPlayer = p;
      }
    }

    return mvpPlayer;
  }

  // 5. Live Player Status Synchronization (TODO-EXP-02)
  public syncPlayerStatuses() {
    const currentMatch = this.state.tournamentMatches.find(m => m.id === this.state.currentMatchId);

    this.state.players.forEach(p => {
      if (p.isDisconnected) {
        p.status = 'DISCONNECTED';
        return;
      }

      if (this.state.phase === 'ONLINE_LOBBY') {
        p.status = p.isReady ? 'READY' : 'ONLINE';
      } else if (this.state.phase === 'AUCTION' || this.state.phase === 'AUCTION_REVEAL_MYTHIC') {
        p.status = 'BIDDING';
      } else if (this.state.phase === 'BATTLE_FIGHT' || this.state.phase === 'BATTLE_SELECT') {
        if (currentMatch) {
          const isFighter1 = currentMatch.player1?.id === p.id;
          const isFighter2 = currentMatch.player2?.id === p.id;
          if (isFighter1 || isFighter2) {
            p.status = (isFighter1 ? currentMatch.player1Ready : currentMatch.player2Ready) ? 'READY' : 'CHOOSING';
          } else {
            // Check if player was eliminated from tournament
            const isEliminated = this.state.tournamentMatches.some(
              m => m.status === 'COMPLETED' && m.winner && m.winner.id !== p.id && (m.player1?.id === p.id || m.player2?.id === p.id)
            );
            p.status = isEliminated ? 'ELIMINATED' : 'SPECTATING';
          }
        } else {
          p.status = 'WAITING';
        }
      } else {
        p.status = 'ONLINE';
      }
    });
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
    this.state.rematchVotes = [];
    this.state.spectatorChat = [];
    this.state.activeChaosEvent = null;
    this.gradeVotes = {};
    this.state.players.forEach(p => {
      p.money = this.state.settings.startingMoney;
      p.collection = [];
      p.isReady = p.isBot;
      p.stats = { battlesWon: 0, moneySpent: 0, highestBid: 0 };
    });
    this.syncPlayerStatuses();
    this.notifyState();
  }

  public notifyState() {
    this.syncPlayerStatuses();
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }
}

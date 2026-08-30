import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, GameSettings, BotPersonality, AscensionBattleState, BattleActionType } from '../types/game';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineState, setOnlineState] = useState<GameState | null>(null);
  const [ascensionState, setAscensionState] = useState<AscensionBattleState | null>(null);
  const [ascensionResult, setAscensionResult] = useState<any>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    // Connect to '/' which Netlify proxies to backend with full HTTPS SSL support
    const backendUrl = metaEnv?.VITE_BACKEND_URL || '/';

    const socket = io(backendUrl, {
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to server:', socket.id);

      const token = localStorage.getItem('mcu_auth_token');
      if (token) {
        socket.emit('authenticate_socket', { token });
        socket.emit('social_auth', { token });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setIsConnected(false);
    });

    socket.on('game_state_update', (state: GameState) => {
      setOnlineState(state);
    });
    socket.on('ascension_state_update', (state: AscensionBattleState) => {
      setAscensionState(state);
    });
    socket.on('ascension_match_found', (payload: { state?: AscensionBattleState }) => {
      if (payload?.state) setAscensionState(payload.state);
    });
    socket.on('ascension_match_result', (result: any) => {
      setAscensionResult(result);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = (playerName: string, avatar: string): Promise<{ success: boolean; roomId?: string; error?: string }> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve({ success: false, error: 'Socket not initialized' });
      const authToken = localStorage.getItem('mcu_auth_token') || undefined;
      socketRef.current.emit('create_room', { playerName, avatar, authToken }, (res: { success: boolean; roomId?: string; state?: GameState; error?: string }) => {
        if (res.success && res.state) {
          setOnlineState(res.state);
        }
        resolve(res);
      });
    });
  };

  const joinRoom = (roomId: string, playerName: string, avatar: string): Promise<{ success: boolean; error?: string }> => {
    let normalizedCode = (roomId || '').toUpperCase().trim();
    if (/^\d{4}$/.test(normalizedCode)) {
      normalizedCode = `MARVEL-${normalizedCode}`;
    }
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve({ success: false, error: 'Socket not initialized' });
      const authToken = localStorage.getItem('mcu_auth_token') || undefined;
      socketRef.current.emit('join_room', { roomId: normalizedCode, playerName, avatar, authToken }, (res: { success: boolean; state?: GameState; error?: string }) => {
        if (res.success && res.state) {
          setOnlineState(res.state);
        } else if (res.error) {
          setLastError(res.error);
        }
        resolve(res);
      });
    });
  };

  const ascensionRequest = <T extends object>(event: string, payload: object = {}): Promise<T & { success: boolean; error?: string }> => {
    return new Promise(resolve => {
      if (!socketRef.current) return resolve({ success: false, error: 'Socket not initialized' } as T & { success: boolean; error?: string });
      socketRef.current.emit(event, payload, (res: T & { success: boolean; error?: string }) => {
        if (res?.error) setLastError(res.error);
        resolve(res);
      });
    });
  };

  const queueAscension = (mode: 'casual' | 'ranked', format: string, teamIds: string[]): Promise<any> =>
    ascensionRequest('ascension_queue', { mode, format, teamIds, authToken: localStorage.getItem('mcu_auth_token') || undefined }).then(res => {
      if ((res as any).state) setAscensionState((res as any).state);
      return res;
    });

  const cancelAscensionQueue = (): Promise<any> => ascensionRequest('ascension_cancel_queue');

  const createAscensionRoom = (mode: 'casual' | 'ranked', format: string, teamIds: string[]): Promise<any> =>
    ascensionRequest('ascension_create_room', { mode, format, teamIds, authToken: localStorage.getItem('mcu_auth_token') || undefined }).then(res => {
      if ((res as any).state) setAscensionState((res as any).state);
      return res;
    });

  const joinAscensionRoom = (roomId: string, teamIds: string[]): Promise<any> =>
    ascensionRequest('ascension_join_room', { roomId, teamIds, authToken: localStorage.getItem('mcu_auth_token') || undefined }).then(res => {
      if ((res as any).state) setAscensionState((res as any).state);
      return res;
    });

  const setAscensionTeam = (teamIds: string[]): Promise<any> => ascensionRequest('ascension_set_team', { teamIds });

  const setAscensionReady = (isReady: boolean): Promise<any> => ascensionRequest('ascension_set_ready', { isReady });

  const startAscensionBattle = (): Promise<any> => ascensionRequest('ascension_start_battle');

  const submitAscensionAction = (action: BattleActionType, fighterIndex = 0, skillId?: string): Promise<any> =>
    ascensionRequest('ascension_action', { action, fighterIndex, skillId });

  const leaveAscensionRoom = (): Promise<any> => ascensionRequest('ascension_leave_room');

  const reconnectAscensionRoom = (roomId: string): Promise<any> =>
    ascensionRequest('ascension_reconnect', { roomId, authToken: localStorage.getItem('mcu_auth_token') || undefined });

  const setReady = (isReady: boolean) => {
    socketRef.current?.emit('set_ready', { isReady });
  };

  const addBot = (personality: BotPersonality) => {
    socketRef.current?.emit('add_bot', { personality });
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    socketRef.current?.emit('update_settings', settings);
  };

  const startGame = (): Promise<{ success: boolean; error?: string }> => {
    return new Promise(resolve => {
      if (!socketRef.current) return resolve({ success: false, error: 'Socket not initialized' });
      socketRef.current?.emit('start_game', (res: { success: boolean; error?: string }) => {
        if (res?.error) setLastError(res.error);
        resolve(res || { success: false, error: 'Socket not initialized' });
      });
    });
  };

  const placeBid = (amount: number): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('place_bid', { amount }, (res: { success: boolean; error?: string }) => {
        if (res.error) setLastError(res.error);
        resolve(res);
      });
    });
  };

  const voteSkip = (): Promise<{ success: boolean; isSkipped?: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('vote_skip', (res: { success: boolean; isSkipped?: boolean; error?: string }) => {
        resolve(res);
      });
    });
  };

  const instantSkipAuction = (): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('instant_skip', (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const concedeAuction = (): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('concede_lot', (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const submitGradeVote = (vote: any): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('vote_grade', { vote }, (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const concedeMatch = (): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('concede_match', (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const skipMatch = (): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('skip_match', (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const playMatch = (matchId: string) => {
    socketRef.current?.emit('play_match', { matchId });
  };

  const executeBattleAction = (action: any, fighterIndex?: number, skillId?: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('execute_battle_action', { action, fighterIndex, skillId }, (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const triggerFlashbang = (targetId: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('trigger_flashbang', { targetId }, (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const useHealingPotion = (heroId?: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current?.emit('use_healing_potion', { heroId }, (res: { success: boolean; error?: string }) => {
        resolve(res || { success: true });
      });
    });
  };

  const updateCollection = (collection: any[], money: number) => {
    socketRef.current?.emit('update_collection', { collection, money });
  };

  const proceedToBattles = () => {
    socketRef.current?.emit('proceed_to_battles');
  };

  const sendSpectatorChat = (message: string) => {
    socketRef.current?.emit('send_spectator_chat', { message });
  };

  const voteRematch = () => {
    socketRef.current?.emit('vote_rematch');
  };

  const updateHostSettings = (settings: Partial<GameSettings>) => {
    socketRef.current?.emit('update_host_settings', { settings });
  };

  const discardCharacter = (playerId: string, characterId: string) => {
    socketRef.current?.emit('discard_character', { playerId, characterId });
  };

  const restartGame = () => {
    socketRef.current?.emit('restart_game');
  };

  return {
    socket: socketRef.current,
    isConnected,
    onlineState,
    ascensionState,
    ascensionResult,
    setAscensionResult,
    lastError,
    setLastError,
    createRoom,
    joinRoom,
    queueAscension,
    cancelAscensionQueue,
    createAscensionRoom,
    joinAscensionRoom,
    setAscensionTeam,
    setAscensionReady,
    startAscensionBattle,
    submitAscensionAction,
    leaveAscensionRoom,
    reconnectAscensionRoom,
    setReady,
    addBot,
    updateSettings,
    startGame,
    placeBid,
    voteSkip,
    instantSkipAuction,
    concedeAuction,
    triggerFlashbang,
    useHealingPotion,
    submitGradeVote,
    playMatch,
    concedeMatch,
    skipMatch,
    executeBattleAction,
    updateCollection,
    discardCharacter,
    proceedToBattles,
    restartGame,
    sendSpectatorChat,
    voteRematch,
    updateHostSettings,
  };
}

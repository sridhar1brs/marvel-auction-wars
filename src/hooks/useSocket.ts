import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, GameSettings, BotPersonality } from '../types/game';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineState, setOnlineState] = useState<GameState | null>(null);
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
      setLastError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setIsConnected(false);
    });

    socket.on('game_state_update', (state: GameState) => {
      setOnlineState(state);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = (playerName: string, avatar: string): Promise<{ success: boolean; roomId?: string; error?: string }> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve({ success: false, error: 'Socket not initialized' });
      socketRef.current.emit('create_room', { playerName, avatar }, (res: { success: boolean; roomId?: string; state?: GameState; error?: string }) => {
        if (res.success && res.state) {
          setOnlineState(res.state);
        }
        resolve(res);
      });
    });
  };

  const joinRoom = (roomId: string, playerName: string, avatar: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve({ success: false, error: 'Socket not initialized' });
      socketRef.current.emit('join_room', { roomId, playerName, avatar }, (res: { success: boolean; state?: GameState; error?: string }) => {
        if (res.success && res.state) {
          setOnlineState(res.state);
        } else if (res.error) {
          setLastError(res.error);
        }
        resolve(res);
      });
    });
  };

  const setReady = (isReady: boolean) => {
    socketRef.current?.emit('set_ready', { isReady });
  };

  const addBot = (personality: BotPersonality) => {
    socketRef.current?.emit('add_bot', { personality });
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    socketRef.current?.emit('update_settings', settings);
  };

  const startGame = () => {
    socketRef.current?.emit('start_game');
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

  const playMatch = (matchId: string) => {
    socketRef.current?.emit('play_match', { matchId });
  };

  const restartGame = () => {
    socketRef.current?.emit('restart_game');
  };

  return {
    socket: socketRef.current,
    isConnected,
    onlineState,
    lastError,
    setLastError,
    createRoom,
    joinRoom,
    setReady,
    addBot,
    updateSettings,
    startGame,
    placeBid,
    voteSkip,
    playMatch,
    restartGame,
  };
}

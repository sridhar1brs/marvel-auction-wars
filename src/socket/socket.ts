import { io, Socket } from 'socket.io-client';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
const backendUrl = metaEnv?.VITE_BACKEND_URL || '/';

export const socket: Socket = io(backendUrl, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

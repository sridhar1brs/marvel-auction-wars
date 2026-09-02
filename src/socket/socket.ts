import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

// In split-domain deployments (e.g., Vercel frontend, Render backend), API_BASE_URL connects to the actual backend.
// In same-domain deployments or local development, it defaults to the current origin or '/'.
const socketTarget = API_BASE_URL || (typeof window !== 'undefined' && window.location.origin ? window.location.origin : '/');

export const socket: Socket = io(socketTarget, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

export function authenticateSocket(explicitToken?: string) {
  try {
    const token = explicitToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('mcu_auth_token') : null);
    if (token && socket && socket.connected) {
      socket.emit('authenticate_socket', { token });
      socket.emit('social_auth', { token });
    }
  } catch (err) {
    console.warn('[Socket] Failed to authenticate socket:', err);
  }
}

socket.on('connect', () => {
  console.log('[Socket] Connected to server successfully (ID: ' + socket.id + ')');
  authenticateSocket();
});

socket.on('reconnect', (attemptNumber) => {
  console.log('[Socket] Reconnected after ' + attemptNumber + ' attempts');
  authenticateSocket();
});

socket.on('connect_error', (err) => {
  console.warn('[Socket] Connection error:', err.message);
});

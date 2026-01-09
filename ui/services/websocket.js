import { io } from 'socket.io-client';
import { API_URL } from '../config/constants';

// Convert API_URL (e.g., 'http://localhost:3000/api') to WebSocket URL (e.g., 'http://localhost:3000')
const getWebSocketUrl = () => {
  const url = API_URL.replace('/api', '');
  return url;
};

let socket = null;

/**
 * Connects to WebSocket server
 * @returns {Object} Socket.io client instance
 */
export function connectWebSocket() {
  if (socket?.connected) {
    return socket;
  }

  const wsUrl = getWebSocketUrl();
  socket = io(wsUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    // WebSocket connected
  });

  socket.on('disconnect', () => {
    // WebSocket disconnected
  });

  socket.on('error', () => {
    // WebSocket error - silently handle
  });

  return socket;
}

/**
 * Disconnects from WebSocket server
 */
export function disconnectWebSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Gets the current socket instance (or null if not connected)
 * @returns {Object|null} Socket.io client instance or null
 */
export function getSocket() {
  return socket;
}

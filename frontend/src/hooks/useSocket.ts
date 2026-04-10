import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@chat/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      autoConnect: false,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      console.log('Connected to server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socketInstance.on('connect_error', () => {
      setIsConnecting(true);
    });

    const originalConnect = socketInstance.connect.bind(socketInstance);
    socketInstance.connect = () => {
      setIsConnecting(true);
      return originalConnect();
    };

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected, isConnecting };
};

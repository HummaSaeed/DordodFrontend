import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useWebSocket = () => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://dordod.com', {
      auth: {
        token: localStorage.getItem('accessToken')
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return socket.current;
}; 
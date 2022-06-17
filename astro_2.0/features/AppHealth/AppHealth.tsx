import { useEffect, useRef, VFC } from 'react';
import { useSocket } from 'context/SocketContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

export const AppHealth: VFC = () => {
  const { socket } = useSocket();
  const notyRef = useRef<boolean>(false);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        if (notyRef.current) {
          notyRef.current = false;
          showNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            description: 'Connection restored',
            lifetime: 20000,
          });
        }
      });
      socket.on('disconnect', () => {
        if (!notyRef.current) {
          notyRef.current = true;
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: 'Connection lost',
            lifetime: 20000,
          });
        }
      });
    }
  }, [socket]);

  return null;
};

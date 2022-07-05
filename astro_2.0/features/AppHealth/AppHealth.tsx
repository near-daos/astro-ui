import { useEffect, useRef, VFC } from 'react';
import { useSocket } from 'context/SocketContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useFlags } from 'launchdarkly-react-client-sdk';

export const AppHealth: VFC = () => {
  const { socket } = useSocket();
  const { appHealth } = useFlags();
  const notyRef = useRef<boolean>(false);

  useEffect(() => {
    if (socket && appHealth) {
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

    return () => {
      socket?.disconnect();
    };
  }, [appHealth, socket]);

  return null;
};

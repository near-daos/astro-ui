import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Notification } from 'types/notification';
import { NotificationsService } from 'services/NotificationsService';
import { useSocket } from 'context/SocketContext';

interface INotificationContext {
  notifications: Notification[];
  handleRead: () => void;
  handleDelete: () => void;
  handleMute: () => void;
}

/* eslint-disable @typescript-eslint/no-empty-function */

const NotificationsContext = createContext<INotificationContext>({
  notifications: [],
  handleRead: () => {},
  handleDelete: () => {},
  handleMute: () => {},
});

export const useNotifications = (): INotificationContext =>
  useContext(NotificationsContext);

export const NotificationsProvider: FC = ({ children }) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // todo - get notifications via socket.io here and setNotificatons
    (async () => {
      const response = await NotificationsService.getNotifications();

      setNotifications(response);
    })();

    if (socket) {
      socket.on('account-notification', () => {
        // todo - do not refetch full list, update only relevant
        NotificationsService.getNotifications().then(response => {
          setNotifications(response);
        });
      });
    }
  }, [socket]);

  const handleRead = useCallback(() => {
    // todo - call mark as read service action
  }, []);

  const handleDelete = useCallback(() => {
    // todo - call delete service action
  }, []);

  const handleMute = useCallback(() => {
    // todo - call mute service action
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, handleRead, handleDelete, handleMute }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

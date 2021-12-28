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
import { useAuthContext } from 'context/AuthContext';
import { SputnikNearService } from 'services/sputnik';
import { useMountedState } from 'react-use';

interface INotificationContext {
  notifications: Notification[];
  handleUpdate: (
    id: string,
    {
      isMuted,
      isRead,
      isArchived,
    }: {
      isMuted: boolean;
      isRead: boolean;
      isArchived: boolean;
    }
  ) => void;
  handleUpdateAll: (action: 'READ' | 'ARCHIVE') => void;
}

/* eslint-disable @typescript-eslint/no-empty-function */
const NotificationsContext = createContext<INotificationContext>({
  notifications: [],
  handleUpdate: () => {},
  handleUpdateAll: () => {},
});

export const useNotifications = (): INotificationContext =>
  useContext(NotificationsContext);

export const NotificationsProvider: FC = ({ children }) => {
  const { socket } = useSocket();
  const { accountId } = useAuthContext();
  const isMounted = useMountedState();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getNotifications = useCallback(async () => {
    const response = await NotificationsService.getNotifications(false, {
      offset: 0,
      limit: 3000,
      sort: 'createdAt,DESC',
    });

    if (isMounted()) {
      setNotifications(response.data);
    }
  }, [isMounted]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    if (socket) {
      socket.on('account-notification', () => {
        // todo - optimize
        getNotifications();
      });
    }
  }, [getNotifications, socket]);

  const handleUpdate = useCallback(
    async (id, { isRead, isMuted, isArchived }) => {
      const publicKey = await SputnikNearService.getPublicKey();
      const signature = await SputnikNearService.getSignature();

      if (accountId && publicKey && signature && isMounted()) {
        setNotifications(
          notifications.map(item => {
            if (item.id === id) {
              return {
                ...item,
                isRead,
                isMuted,
                isArchived,
              };
            }

            return item;
          })
        );

        await NotificationsService.updateNotification(id, {
          accountId,
          publicKey,
          signature,
          isRead,
          isMuted,
          isArchived,
        });

        await getNotifications();
      }
    },
    [accountId, getNotifications, isMounted, notifications]
  );

  const handleUpdateAll = useCallback(
    async (action: 'READ' | 'ARCHIVE') => {
      const publicKey = await SputnikNearService.getPublicKey();
      const signature = await SputnikNearService.getSignature();

      if (accountId && publicKey && signature && isMounted()) {
        if (action === 'READ') {
          await NotificationsService.readAllNotifications({
            accountId,
            publicKey,
            signature,
          });
        } else if (action === 'ARCHIVE') {
          await NotificationsService.archiveAllNotifications({
            accountId,
            publicKey,
            signature,
          });
        }

        await getNotifications();
      }
    },
    [accountId, getNotifications, isMounted]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        handleUpdate,
        handleUpdateAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

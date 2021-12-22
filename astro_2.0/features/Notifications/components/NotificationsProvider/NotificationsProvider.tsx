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
import { useRouter } from 'next/router';

interface INotificationContext {
  archivedNotifications: Notification[];
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
}

/* eslint-disable @typescript-eslint/no-empty-function */

const NotificationsContext = createContext<INotificationContext>({
  archivedNotifications: [],
  notifications: [],
  handleUpdate: () => {},
});

export const useNotifications = (): INotificationContext =>
  useContext(NotificationsContext);

export const NotificationsProvider: FC = ({ children }) => {
  const router = useRouter();
  const showArchived = router.query.notyType === 'archived';
  const { socket } = useSocket();
  const { accountId } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [archivedNotifications, setArchivedNotifications] = useState<
    Notification[]
  >([]);

  const getNotifications = useCallback(
    async (status: 'archived' | 'active') => {
      if (status === 'archived') {
        const response = await NotificationsService.getNotifications(true);

        setArchivedNotifications(response);
      } else {
        const response = await NotificationsService.getNotifications(false);

        setNotifications(response);
      }
    },
    []
  );

  useEffect(() => {
    if (showArchived) {
      getNotifications('archived');
    }
  }, [getNotifications, showArchived]);

  useEffect(() => {
    getNotifications('active');

    if (socket) {
      socket.on('account-notification', () => {
        getNotifications('active');
      });
    }
  }, [getNotifications, socket]);

  const handleUpdate = useCallback(
    async (id, { isRead, isMuted, isArchived }) => {
      const publicKey = await SputnikNearService.getPublicKey();
      const signature = await SputnikNearService.getSignature();

      if (accountId && publicKey && signature) {
        if (showArchived) {
          setArchivedNotifications(
            archivedNotifications.map(item => {
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
        } else {
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
        }

        await NotificationsService.updateNotification(id, {
          accountId,
          publicKey,
          signature,
          isRead,
          isMuted,
          isArchived,
        });

        await getNotifications('active');

        if (showArchived) {
          await getNotifications('archived');
        }
      }
    },
    [
      accountId,
      archivedNotifications,
      getNotifications,
      notifications,
      showArchived,
    ]
  );

  return (
    <NotificationsContext.Provider
      value={{
        archivedNotifications,
        notifications,
        handleUpdate,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

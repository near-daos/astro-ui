import { useCallback, useEffect, useState } from 'react';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { NotificationsService } from 'services/NotificationsService';
import { useAuthContext } from 'context/AuthContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { PaginationResponse } from 'types/api';
import { Notification, NotificationDTO } from 'types/notification';
import {
  useAsyncFn,
  useMount,
  useMountedState,
  useUpdateEffect,
} from 'react-use';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { useSocket } from 'context/SocketContext';
import { useRouter } from 'next/router';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';

type UpdateSettingsConfig = {
  daoId?: string | null;
  types?: string[];
  isAllMuted?: boolean;
  mutedUntilTimestamp?: string;
  enableSms?: boolean;
  enableEmail?: boolean;
};

export function useNotificationsSettings(): {
  updateSettings: (config: UpdateSettingsConfig) => void;
} {
  const { accountId, getPublicKeyAndSignature } = useAuthContext();

  async function getPrevConfig(
    accId: string,
    daoId: string | null | undefined
  ) {
    const daoToGet = daoId ? [daoId] : undefined;
    const prevConfigDTO = await NotificationsService.getNotificationsSettings(
      accId,
      daoToGet
    );

    const { types, isAllMuted, mutedUntilTimestamp, enableSms, enableEmail } =
      get(prevConfigDTO, '0') || {};

    return omitBy(
      {
        types,
        isAllMuted,
        mutedUntilTimestamp,
        enableSms,
        enableEmail,
      },
      isNil
    );
  }

  const updateSettings = useCallback(
    async (config: UpdateSettingsConfig) => {
      try {
        const { publicKey, signature } = await getPublicKeyAndSignature();

        const prevConfig = await getPrevConfig(accountId, config.daoId);

        if (publicKey && signature) {
          await NotificationsService.updateNotificationSettings({
            publicKey,
            signature,
            accountId,
            daoId: null,
            types: [],
            mutedUntilTimestamp: '0',
            isAllMuted: false,
            enableSms: false,
            enableEmail: false,
            ...prevConfig,
            ...config,
          });
        }
      } catch (err) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          description: err.message,
          lifetime: 20000,
        });
      }
    },
    [accountId, getPublicKeyAndSignature]
  );

  return {
    updateSettings,
  };
}

export function useNotificationsList(
  accountDaosIds?: string[],
  subscribedDaosIds?: string[]
): {
  notifications: PaginationResponse<Notification[]> | null;
  loadMore: () => void;
  handleRemove: (
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
} {
  const router = useRouter();
  const { socket } = useSocket();
  const { accountId, nearService } = useAuthContext();
  const [notifications, setNotifications] = useState<PaginationResponse<
    Notification[]
  > | null>(null);
  const isMounted = useMountedState();

  function getDaosIds() {
    const showSubscribed = router.query.notyType === 'subscribed';
    const showYourDaos = router.query.notyType === 'yourDaos';

    if (showYourDaos && accountDaosIds) {
      return accountDaosIds;
    }

    if (showSubscribed && subscribedDaosIds) {
      return subscribedDaosIds;
    }

    return null;
  }

  const [{ loading }, fetchData] = useAsyncFn(
    async (offset?: number) => {
      let accumulatedListData = null;

      const showArchived = router.query.notyType === 'archived';

      const res = await NotificationsService.getNotifications(
        showArchived ?? false,
        accountId,
        {
          offset:
            offset !== undefined ? offset : notifications?.data.length || 0,
          limit: LIST_LIMIT_DEFAULT,
          sort: 'createdAt,DESC',
          daoIds: getDaosIds(),
        }
      );

      accumulatedListData = {
        ...res,
        data:
          offset !== undefined
            ? res.data
            : [...(notifications?.data || []), ...res.data],
      };

      return accumulatedListData;
    },
    [notifications?.data?.length, router.query]
  );

  const loadMore = useCallback(
    async (offset?: number) => {
      if (loading) {
        return;
      }

      const newNotificationsData = await fetchData(offset);

      if (isMounted()) {
        setNotifications(newNotificationsData);
      }
    },
    [fetchData, isMounted, loading]
  );

  useMount(() => {
    (() => loadMore())();
  });

  useUpdateEffect(() => {
    loadMore(0);
  }, [router.query.notyType]);

  useEffect(() => {
    if (socket) {
      socket.on('account-notification', (noty: NotificationDTO) => {
        const newNoty = mapNotificationDtoToNotification([noty])[0];

        if (isMounted()) {
          const newData = {
            pageCount: notifications?.pageCount || 1,
            page: notifications?.page || 1,
            total: notifications?.total || 0,
            count:
              notifications?.count !== undefined ? notifications?.count + 1 : 0,
            data: notifications?.data ? [newNoty, ...notifications?.data] : [],
          };

          setNotifications(newData);
        }
      });
    }
  }, [
    fetchData,
    isMounted,
    notifications?.count,
    notifications?.data,
    notifications?.page,
    notifications?.pageCount,
    notifications?.total,
    socket,
  ]);

  const handleUpdate = useCallback(
    async (id, { isRead, isMuted, isArchived }) => {
      const publicKey = await nearService?.getPublicKey();
      const signature = await nearService?.getSignature();

      if (accountId && publicKey && signature && isMounted() && notifications) {
        setNotifications({
          ...notifications,
          data: notifications?.data?.map(item => {
            if (item.id === id) {
              return {
                ...item,
                isRead,
                isMuted,
                isArchived,
              };
            }

            return item;
          }),
        });

        const res = await NotificationsService.updateNotification(id, {
          accountId,
          publicKey,
          signature,
          isRead,
          isMuted,
          isArchived,
        });

        setNotifications({
          ...notifications,
          data: notifications?.data?.map(item => {
            if (item.id === res.id) {
              return res;
            }

            return item;
          }),
        });
      }
    },
    [accountId, isMounted, notifications, nearService]
  );

  const handleUpdateAll = useCallback(
    async (action: 'READ' | 'ARCHIVE') => {
      const publicKey = await nearService?.getPublicKey();
      const signature = await nearService?.getSignature();

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

        await loadMore(0);
      }
    },
    [accountId, loadMore, isMounted, nearService]
  );

  const handleRemove = useCallback(
    async (id: string, { isRead, isMuted, isArchived }) => {
      const publicKey = await nearService?.getPublicKey();
      const signature = await nearService?.getSignature();

      if (accountId && publicKey && signature && isMounted() && notifications) {
        const newData = notifications?.data.filter(item => item.id !== id);

        setNotifications({
          pageCount: notifications?.pageCount || 1,
          page: notifications?.page || 1,
          total: notifications?.total || 0,
          count: notifications?.count ? notifications?.count - 1 : 0,
          data: newData ?? [],
        });

        await NotificationsService.updateNotification(id, {
          accountId,
          publicKey,
          signature,
          isRead,
          isMuted,
          isArchived,
        });
      }
    },
    [accountId, isMounted, notifications, nearService]
  );

  return {
    notifications,
    loadMore,
    handleRemove,
    handleUpdate,
    handleUpdateAll,
  };
}

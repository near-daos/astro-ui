import { useCallback, useEffect, useState } from 'react';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { NotificationsService } from 'services/NotificationsService';
import { useAccountDaos } from 'services/ApiService/hooks/useAccountDaos';
import { useSubscribedDaos } from 'services/ApiService/hooks/useSubscribedDaos';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { PaginationResponse } from 'types/api';
import { DaoFeedItem } from 'types/dao';
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
import { SputnikHttpService } from 'services/sputnik';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';

import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';
import { NOTIFICATIONS_UPDATED } from 'features/notifications/notificationConstants';

import { DAO_RELATED_SETTINGS, PLATFORM_RELATED_SETTINGS } from './helpers';

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
  const { accountId, pkAndSignature } = useWalletContext();

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
        if (!pkAndSignature) {
          return;
        }

        const { publicKey, signature } = pkAndSignature;
        const prevConfig = await getPrevConfig(accountId, config.daoId);

        if (publicKey && signature) {
          await NotificationsService.updateNotificationSettings({
            publicKey,
            signature,
            accountId,
            daoId: null,
            types: [...DAO_RELATED_SETTINGS, ...PLATFORM_RELATED_SETTINGS],
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
    [accountId, pkAndSignature]
  );

  return {
    updateSettings,
  };
}

export function useNotificationsList(reactOnUpdates?: boolean): {
  notifications: PaginationResponse<Notification[]> | null;
  loadMore: () => void;
  loading: boolean;
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
  const { useOpenSearchDataApi } = useFlags();
  const { socket } = useSocket();
  const { accountId, pkAndSignature } = useWalletContext();
  const [notifications, setNotifications] = useState<PaginationResponse<
    Notification[]
  > | null>(null);
  const [accountDaosIds, setAccountDaosIds] = useState<string[]>([]);
  const [subscribedDaosIds, setSubscribedDaosIds] = useState<string[]>([]);
  const [daoIdsLoaded, setDaoIdsLoaded] = useState<boolean>(false);
  const { data: accountDaos } = useAccountDaos();
  const { data: subscribedDaos } = useSubscribedDaos();

  const isMounted = useMountedState();

  const getDaosIds = async () => {
    const showSubscribed = router.query.notyType === 'subscribed';
    const showYourDaos = router.query.notyType === 'yourDaos';

    if (!daoIdsLoaded) {
      if (accountId && useOpenSearchDataApi !== undefined) {
        const [accountDaosResponse, subscribedDaosResponse] =
          await Promise.allSettled([
            useOpenSearchDataApi
              ? Promise.resolve([] as DaoFeedItem[])
              : SputnikHttpService.getAccountDaos(accountId),
            useOpenSearchDataApi
              ? Promise.resolve([] as DaoFeedItem[])
              : SputnikHttpService.getAccountDaoSubscriptions(accountId),
          ]);

        let tmpAccountDaoIds: string[];
        let tmpSubscribedDaoIds: string[];

        if (useOpenSearchDataApi) {
          tmpAccountDaoIds = accountDaos?.map(item => item.id) ?? [];
        } else if (accountDaosResponse.status === 'fulfilled') {
          tmpAccountDaoIds = accountDaosResponse.value.map(item => item.id);
        } else {
          tmpAccountDaoIds = [];
        }

        if (useOpenSearchDataApi) {
          tmpSubscribedDaoIds = subscribedDaos?.map(item => item.id) ?? [];
        } else if (subscribedDaosResponse.status === 'fulfilled') {
          tmpSubscribedDaoIds = subscribedDaosResponse.value.map(
            item => item.id
          );
        } else {
          tmpSubscribedDaoIds = [];
        }

        setAccountDaosIds(tmpAccountDaoIds);
        setSubscribedDaosIds(tmpSubscribedDaoIds);

        setDaoIdsLoaded(true);

        if (showYourDaos && accountDaosIds) {
          return tmpAccountDaoIds;
        }

        if (showSubscribed && subscribedDaosIds) {
          return tmpSubscribedDaoIds;
        }

        return [...tmpAccountDaoIds, ...tmpSubscribedDaoIds];
      }
    }

    if (showYourDaos && accountDaosIds) {
      return accountDaosIds;
    }

    if (showSubscribed && subscribedDaosIds) {
      return subscribedDaosIds;
    }

    return null;
  };

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
          daoIds: await getDaosIds(),
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
    [notifications?.data?.length, router.query, accountId]
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

  useEffect(() => {
    if (accountId && isMounted() && !daoIdsLoaded) {
      loadMore();
    }
  }, [accountId, daoIdsLoaded, fetchData, isMounted, loadMore]);

  useUpdateEffect(() => {
    loadMore(0);
  }, [router.query.notyType]);

  useEffect(() => {
    if (socket) {
      socket.on('account-notification', (noty: NotificationDTO) => {
        const newNoty = mapNotificationDtoToNotification([noty])[0];

        if (isMounted()) {
          const newData = {
            total: notifications?.total || 0,
            data: notifications?.data ? [newNoty, ...notifications?.data] : [],
          };

          setNotifications(newData);
        }
      });
    }
  }, [fetchData, isMounted, notifications?.data, notifications?.total, socket]);

  const triggerUpdate = useCallback(() => {
    dispatchCustomEvent(NOTIFICATIONS_UPDATED, true);
  }, []);

  const handleUpdates = useCallback(async () => {
    const newNotificationsData = await fetchData(0);

    if (isMounted()) {
      setNotifications(newNotificationsData);
    }
  }, [fetchData, isMounted]);

  useEffect(() => {
    if (reactOnUpdates) {
      document.addEventListener(
        NOTIFICATIONS_UPDATED,
        handleUpdates as EventListener
      );
    }

    return () =>
      document.removeEventListener(
        NOTIFICATIONS_UPDATED,
        handleUpdates as EventListener
      );
  }, [handleUpdates, reactOnUpdates]);

  const handleUpdate = useCallback(
    async (id, { isRead, isMuted, isArchived }) => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

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

        triggerUpdate();
      }
    },
    [accountId, isMounted, notifications, triggerUpdate, pkAndSignature]
  );

  const handleUpdateAll = useCallback(
    async (action: 'READ' | 'ARCHIVE') => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (accountId && publicKey && signature && isMounted()) {
        if (action === 'READ') {
          await NotificationsService.readAllNotifications({
            accountId,
            publicKey,
            signature,
          });
          triggerUpdate();
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
    [accountId, isMounted, loadMore, triggerUpdate, pkAndSignature]
  );

  const handleRemove = useCallback(
    async (id: string, { isRead, isMuted, isArchived }) => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (accountId && publicKey && signature && isMounted() && notifications) {
        const newData = notifications?.data.filter(item => item.id !== id);

        setNotifications({
          total: notifications?.total || 0,
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

        triggerUpdate();
      }
    },
    [pkAndSignature, accountId, isMounted, notifications, triggerUpdate]
  );

  return {
    notifications,
    loadMore,
    handleRemove,
    handleUpdate,
    handleUpdateAll,
    loading: !daoIdsLoaded,
  };
}

export function useNotificationsCount(): number | null {
  const isMounted = useMountedState();
  const { accountId } = useWalletContext();
  const [counter, setCounter] = useState<number | null>(null);

  const [, fetchData] = useAsyncFn(async () => {
    try {
      const count = await NotificationsService.getNotificationsCount(accountId);

      if (isMounted()) {
        setCounter(count);
      }
    } catch (e) {
      console.error(e);
    }
  }, [accountId, isMounted]);

  const handleUpdates = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useMount(async () => {
    await fetchData();
  });

  useEffect(() => {
    document.addEventListener(
      NOTIFICATIONS_UPDATED,
      handleUpdates as EventListener
    );

    return () =>
      document.removeEventListener(
        NOTIFICATIONS_UPDATED,
        handleUpdates as EventListener
      );
  }, [handleUpdates]);

  return counter;
}

import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAO, DaoFeedItem, DaoSubscription } from 'types/dao';
import { useWalletContext } from 'context/WalletContext';
import { useRouter } from 'next/router';
import { useAccountDaos } from 'services/ApiService/hooks/useAccountDaos';
import { useSubscribedDaos } from 'services/ApiService/hooks/useSubscribedDaos';
import { useFlags } from 'launchdarkly-react-client-sdk';

function normalizeSubscriptions(
  data: DaoSubscription[]
): Record<string, { subscriptionId: string; dao: DAO }> {
  return data.reduce<Record<string, { subscriptionId: string; dao: DAO }>>(
    (res, item) => {
      res[item.dao.id] = {
        subscriptionId: item.id,
        dao: item.dao,
      };

      return res;
    },
    {}
  );
}

export function useDaoSubscriptions(): {
  // subscriptions: Record<string, { subscriptionId: string; dao: DAO }> | null;
  handleFollow: (daoId: string) => void;
  handleUnfollow: () => void;
  isLoading: boolean;
  isSubscribed: boolean;
} {
  const { useOpenSearchDataApi } = useFlags();
  const { query } = useRouter();
  const dao = query.dao as string;
  const { accountId, nearService, pkAndSignature } = useWalletContext();
  const [subscriptions, setSubscriptions] = useState<Record<
    string,
    { dao: DAO }
  > | null>(null);
  const { mutate: refreshAccountDaos } = useAccountDaos(true);
  const { data: subscribedDaos, mutate: refreshSubscribedDaos } =
    useSubscribedDaos();
  const subscription = subscriptions ? subscriptions[dao] : null;
  const isSubscribed =
    !!subscription || !!subscribedDaos?.find(item => item.id === dao);

  const getSubscriptions = useCallback(async () => {
    if (useOpenSearchDataApi || useOpenSearchDataApi === undefined) {
      return;
    }

    try {
      if (accountId) {
        const data = await SputnikHttpService.getAccountDaoSubscriptions(
          accountId
        );

        await refreshAccountDaos();
        setSubscriptions(normalizeSubscriptions(data));
      }
    } catch (err) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: err.message,
      });
    }
  }, [accountId, refreshAccountDaos, useOpenSearchDataApi]);

  const [{ loading }, handleFollow] = useAsyncFn(
    async daoId => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (publicKey && signature && accountId) {
        const result = await SputnikHttpService.updateAccountSubscription({
          accountId,
          daoId,
          publicKey,
          signature,
        });

        if (result) {
          await getSubscriptions();
          await refreshSubscribedDaos(
            currentData => {
              currentData?.push({
                id: daoId,
                daoId,
              } as unknown as DaoFeedItem);

              return currentData;
            },
            {
              revalidate: false,
            }
          );
          await refreshAccountDaos();
        }
      }
    },
    [nearService, pkAndSignature, refreshSubscribedDaos]
  );

  const [{ loading: loadingUnfollow }, handleUnfollow] =
    useAsyncFn(async () => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (publicKey && signature && accountId) {
        await SputnikHttpService.deleteAccountSubscription(dao, accountId, {
          accountId,
          publicKey,
          signature,
        });

        await getSubscriptions();
        await refreshSubscribedDaos(
          currentData => {
            return currentData?.filter(item => item.id !== dao);
          },
          { revalidate: false }
        );
        await refreshAccountDaos();
      }
    }, [
      accountId,
      getSubscriptions,
      nearService,
      pkAndSignature,
      dao,
      refreshSubscribedDaos,
    ]);

  useEffect(() => {
    if (accountId) {
      getSubscriptions();
    }
  }, [accountId, getSubscriptions]);

  return {
    isSubscribed,
    handleFollow,
    handleUnfollow,
    isLoading: loading || loadingUnfollow,
  };
}

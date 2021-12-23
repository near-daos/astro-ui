import { useCallback, useState } from 'react';
import { useAsyncFn, useMount } from 'react-use';
import { SputnikHttpService, SputnikNearService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAO, DaoSubscription } from 'types/dao';
import { useAuthContext } from 'context/AuthContext';

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
  subscriptions: Record<string, { subscriptionId: string; dao: DAO }> | null;
  handleFollow: (daoId: string) => void;
  handleUnfollow: (id: string) => void;
  isLoading: boolean;
} {
  const { accountId } = useAuthContext();
  const [subscriptions, setSubscriptions] = useState<Record<
    string,
    { subscriptionId: string; dao: DAO }
  > | null>(null);

  const getSubscriptions = useCallback(async () => {
    try {
      if (accountId) {
        const data = await SputnikHttpService.getAccountDaoSubscriptions(
          accountId
        );

        setSubscriptions(normalizeSubscriptions(data));
      }
    } catch (err) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: err.message,
      });
    }
  }, [accountId]);

  const [{ loading }, handleFollow] = useAsyncFn(async daoId => {
    const publicKey = await SputnikNearService.getPublicKey();
    const signature = await SputnikNearService.getSignature();

    if (publicKey && signature && accountId) {
      const result = await SputnikHttpService.updateAccountSubscription({
        accountId,
        daoId,
        publicKey,
        signature,
      });

      if (result) {
        getSubscriptions();
      }
    }
  }, []);

  const [{ loading: loadingUnfollow }, handleUnfollow] = useAsyncFn(
    async subscriptionId => {
      const publicKey = await SputnikNearService.getPublicKey();
      const signature = await SputnikNearService.getSignature();

      if (publicKey && signature && accountId) {
        await SputnikHttpService.deleteAccountSubscription(subscriptionId, {
          accountId,
          publicKey,
          signature,
        });

        await getSubscriptions();
      }
    },
    [accountId, getSubscriptions]
  );

  useMount(() => {
    getSubscriptions();
  });

  return {
    subscriptions,
    handleFollow,
    handleUnfollow,
    isLoading: loading || loadingUnfollow,
  };
}

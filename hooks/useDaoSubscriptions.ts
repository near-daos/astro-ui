import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAO, DaoSubscription } from 'types/dao';
import { useWalletContext } from 'context/WalletContext';
import { useRouter } from 'next/router';
import { useAccountDaos } from 'services/ApiService/hooks/useAccountDaos';

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
  const { query } = useRouter();
  const dao = query.dao as string;
  const { accountId, nearService, pkAndSignature } = useWalletContext();
  const [subscriptions, setSubscriptions] = useState<Record<
    string,
    { subscriptionId: string; dao: DAO }
  > | null>(null);
  const { mutate: refreshAccountDaos } = useAccountDaos(true);

  const getSubscriptions = useCallback(async () => {
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
  }, [accountId, refreshAccountDaos]);

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
        }
      }
    },
    [nearService, pkAndSignature]
  );

  const [{ loading: loadingUnfollow }, handleUnfollow] = useAsyncFn(
    async subscriptionId => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (publicKey && signature && accountId) {
        await SputnikHttpService.deleteAccountSubscription(
          dao,
          accountId,
          subscriptionId,
          {
            accountId,
            publicKey,
            signature,
          }
        );

        await getSubscriptions();
      }
    },
    [accountId, getSubscriptions, nearService, pkAndSignature, dao]
  );

  useEffect(() => {
    if (accountId) {
      getSubscriptions();
    }
  }, [accountId, getSubscriptions]);

  return {
    subscriptions,
    handleFollow,
    handleUnfollow,
    isLoading: loading || loadingUnfollow,
  };
}

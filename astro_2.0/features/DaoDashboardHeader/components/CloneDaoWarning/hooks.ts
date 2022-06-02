import { useWalletContext } from 'context/WalletContext';
import { useEffect, useState } from 'react';
import { Settings } from 'types/settings';
import { useAsyncFn, useMount } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { YOKTO_NEAR } from 'services/sputnik/constants';

export function useDaoSettings(
  daoId: string
): {
  loading: boolean;
  update: (updates: Record<string, unknown>) => Promise<void>;
  settings: Settings | null | undefined;
} {
  const { accountId, nearService } = useWalletContext();
  const [settings, setSettings] = useState<Settings | null>(null);

  const [{ loading }, getSettings] = useAsyncFn(async () => {
    const res = await SputnikHttpService.getDaoSettings(daoId);

    if (res) {
      setSettings(res);
    }
  }, [daoId]);

  const [{ loading: updatingStatus }, update] = useAsyncFn(
    async updates => {
      try {
        const latestSettings =
          (await SputnikHttpService.getDaoSettings(daoId)) ?? ({} as Settings);

        const newSettings: Settings = {
          ...latestSettings,
          ...updates,
        };

        const publicKey = await nearService?.getPublicKey();
        const signature = await nearService?.getSignature();

        if (publicKey && signature && accountId) {
          const res = await SputnikHttpService.updateDaoSettings(daoId, {
            accountId,
            publicKey,
            signature,
            settings: newSettings,
          });

          if (res) {
            setSettings(res);
          }
        }
      } catch (err) {
        const { message } = err;

        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: message,
        });
      }
    },
    [daoId, nearService]
  );

  useEffect(() => {
    (async () => {
      await getSettings();
    })();
  }, [getSettings]);

  return {
    loading: loading || updatingStatus,
    update,
    settings,
  };
}

const STORAGE_PRICE_PER_BYTE = 10_000_000_000_000_000_000;

export function useAccountState(): number | null {
  const { nearService } = useWalletContext();
  const [storagePrice, setStoragePrice] = useState<number | null>(null);

  const [, getState] = useAsyncFn(async () => {
    const res = nearService?.getAccount();

    if (res) {
      const state = await res.state();
      const { storage_usage: storageUsage } = state;

      const nearPrice = (STORAGE_PRICE_PER_BYTE * storageUsage) / YOKTO_NEAR;

      setStoragePrice(nearPrice);
    }
  }, []);

  useMount(() => getState());

  return storagePrice;
}

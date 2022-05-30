import { useWalletContext } from 'context/WalletContext';
import { useEffect, useState } from 'react';
import { Settings } from 'types/settings';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

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

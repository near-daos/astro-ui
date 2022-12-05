import { Settings } from 'types/settings';
import { useAsync, useAsyncFn, useMountedState } from 'react-use';
import { useWalletContext } from 'context/WalletContext';
import { useEffect, useRef, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useDao } from 'services/ApiService/hooks/useDao';
import { useFlags } from 'launchdarkly-react-client-sdk';

export function useDaoSettingsData(daoId: string | undefined): {
  loading: boolean;
  update: (updates: Record<string, unknown>) => Promise<void>;
  settings: Settings | null | undefined;
} {
  const { useOpenSearchDataApi } = useFlags();
  const isMounted = useMountedState();
  const { accountId, nearService, pkAndSignature } = useWalletContext();
  const [settings, setSettings] = useState<Settings | null>(null);
  const daoRef = useRef(daoId);
  const daoData = useDao(daoId);

  const { loading, value } = useAsync(async () => {
    if (!daoId || useOpenSearchDataApi || useOpenSearchDataApi === undefined) {
      return;
    }

    const res = await SputnikHttpService.getDaoSettings(daoId);

    if (res && isMounted()) {
      setSettings(res);
      daoRef.current = daoId;
    }
  }, [daoId, isMounted]);

  const [{ loading: updatingStatus }, update] = useAsyncFn(
    async updates => {
      if (!daoId) {
        return;
      }

      if (!pkAndSignature) {
        return;
      }

      try {
        const latestSettings =
          (await SputnikHttpService.getDaoSettings(daoId)) ?? ({} as Settings);

        const newSettings: Settings = {
          ...latestSettings,
          ...updates,
        };

        const { publicKey, signature } = pkAndSignature;

        if (publicKey && signature && accountId) {
          const res = await SputnikHttpService.updateDaoSettings(daoId, {
            accountId,
            publicKey,
            signature,
            settings: newSettings,
          });

          if (res && isMounted()) {
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
    [daoId, nearService, isMounted]
  );

  useEffect(() => {
    const newSettings = daoData.dao?.settings ?? value ?? null;

    if (settings) {
      setSettings(newSettings);
    }
  }, [daoData.dao?.settings, settings, value]);

  return {
    loading: loading || updatingStatus,
    update,
    settings: daoRef.current === daoId ? settings : null,
  };
}

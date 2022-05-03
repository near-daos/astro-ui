import { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import {
  CreateGovernanceTokenSteps,
  ProgressStatus,
  Settings,
} from 'types/settings';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useWalletContext } from 'context/WalletContext';

export function useCreateGovernanceTokenStatus(
  daoId: string
): {
  loading: boolean;
  status: ProgressStatus | null;
  update: ({
    step,
    proposalId,
  }: {
    step: CreateGovernanceTokenSteps | null;
    proposalId: number | null;
  }) => Promise<void>;
} {
  const { accountId, nearService } = useWalletContext();
  const [status, setStatus] = useState<ProgressStatus | null>(null);

  const [{ loading }, getSettings] = useAsyncFn(async () => {
    const settings = await SputnikHttpService.getDaoSettings(daoId);

    if (settings?.createGovernanceToken) {
      setStatus(settings.createGovernanceToken);
    }
  }, [daoId]);

  const [{ loading: updatingStatus }, update] = useAsyncFn(
    async ({ step, proposalId, flow }) => {
      try {
        const settings = await SputnikHttpService.getDaoSettings(daoId);

        const newSettings: Settings = {
          ...settings,
          createGovernanceToken: {
            step,
            proposalId,
            flow,
          },
        };

        const publicKey = await nearService?.getPublicKey();
        const signature = await nearService?.getSignature();

        if (publicKey && signature && accountId) {
          const resp = await SputnikHttpService.updateDaoSettings(daoId, {
            accountId,
            publicKey,
            signature,
            settings: newSettings,
          });

          if (resp.createGovernanceToken) {
            setStatus(resp.createGovernanceToken);
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
    status,
    update,
  };
}

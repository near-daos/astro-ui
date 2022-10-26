import { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import {
  CreateGovernanceTokenSteps,
  ProgressStatus,
  Settings,
} from 'types/settings';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { ProposalType } from 'types/proposal';
import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { UserPermissions } from 'types/context';
import { useDaoSettings } from 'context/DaoSettingsContext';
import { SputnikHttpService } from 'services/sputnik';
import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';
import { useRouter } from 'next/router';
import { useWalletContext } from 'context/WalletContext';

export function useCreateGovernanceTokenStatus(): {
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
  const [status, setStatus] = useState<ProgressStatus | null>(null);

  const { loading, settings, update: updateSettings } = useDaoSettings();

  const [{ loading: updatingStatus }, update] = useAsyncFn(
    async ({ step, proposalId, flow, ...rest }) => {
      try {
        const newSettings = {
          createGovernanceToken: {
            step,
            proposalId,
            flow,
            ...rest,
          },
        };

        await updateSettings(newSettings);
      } catch (err) {
        const { message } = err;

        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: message,
        });
      }
    },
    [updateSettings]
  );

  useEffect(() => {
    if (!settings) {
      return;
    }

    if (settings?.createGovernanceToken) {
      setStatus(settings.createGovernanceToken);
    }
  }, [settings]);

  return {
    loading: loading || updatingStatus,
    status,
    update,
  };
}

export function useLowBalanceWarning(
  userPermissions: UserPermissions,
  step?: CreateGovernanceTokenSteps
): boolean {
  const { tokens } = useDaoCustomTokens();

  const isPermitted =
    userPermissions.isCanCreateProposals &&
    userPermissions.allowedProposalsToCreate[ProposalType.SetStakingContract];

  if (!isPermitted || !tokens?.NEAR?.balance) {
    return false;
  }

  return (
    (!step || step < CreateGovernanceTokenSteps.ContractAcceptance) &&
    Number(tokens.NEAR.balance) < 11
  );
}

export function useUpdateGovernanceTokenWizardProgress(): {
  update: (
    daoId: string,
    updates: Record<string, string | boolean | null | number>
  ) => Promise<void>;
} {
  const router = useRouter();
  const { accountId, nearService, pkAndSignature } = useWalletContext();

  const [, update] = useAsyncFn(
    async (daoId, updates) => {
      if (!pkAndSignature) {
        return;
      }

      try {
        const latestSettings =
          (await SputnikHttpService.getDaoSettings(daoId)) ?? ({} as Settings);

        const newSettings: Settings = {
          ...latestSettings,
          createGovernanceToken: {
            ...(latestSettings.createGovernanceToken ?? {}),
            ...updates,
          },
        };

        const { publicKey, signature } = pkAndSignature;

        if (publicKey && signature && accountId) {
          await SputnikHttpService.updateDaoSettings(daoId, {
            accountId,
            publicKey,
            signature,
            settings: newSettings,
          });

          // redirect to wizard
          router.push({
            pathname: CREATE_GOV_TOKEN_PAGE_URL,
            query: {
              dao: daoId,
            },
          });
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
    [nearService, pkAndSignature, router]
  );

  return { update };
}

import { useAsyncFn, useMount } from 'react-use';

import { SputnikHttpService } from 'services/sputnik';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { useWalletContext } from 'context/WalletContext';

import {
  ProposalTemplate,
  TemplateUpdatePayload,
} from 'types/proposalTemplate';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useDaoProposalTemplates } from 'services/ApiService/hooks/useDaoProposalTemplates';

export function useProposalTemplates(daoId: string): {
  deleteTemplate: (id: string) => void;
  updateTemplate: (id: string, data: TemplateUpdatePayload) => void;
  templates: ProposalTemplate[];
  loading: boolean;
} {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId, pkAndSignature } = useWalletContext();
  const {
    data: templatesFromOpenSearch,
    isLoading,
    mutate,
  } = useDaoProposalTemplates(daoId);

  const [{ loading, value }, getTemplates] = useAsyncFn(async () => {
    if (useOpenSearchDataApi || useOpenSearchDataApi === undefined) {
      return undefined;
    }

    return SputnikHttpService.getProposalTemplates(daoId);
  }, [accountId, useOpenSearchDataApi]);

  const templates = templatesFromOpenSearch ?? value ?? [];

  useMount(async () => {
    await getTemplates();
  });

  const [, updateTemplate] = useAsyncFn(
    async (id, data) => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;
      const { name, isEnabled, config, description } = data;

      if (publicKey && signature) {
        try {
          await SputnikHttpService.updateProposalTemplate(daoId, id, {
            accountId,
            publicKey,
            signature,
            name,
            description,
            isEnabled,
            config,
          });

          showNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            lifetime: 10000,
            description: 'Successfully updated proposal template',
          });

          await getTemplates();
          await mutate();
        } catch (e) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            lifetime: 20000,
            description: e.message,
          });
        }
      }
    },
    [accountId, pkAndSignature, getTemplates, mutate]
  );

  const [, deleteTemplate] = useAsyncFn(
    async id => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (publicKey && signature) {
        try {
          await SputnikHttpService.deleteProposalTemplate(daoId, id, {
            accountId,
            publicKey,
            signature,
          });

          showNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            lifetime: 10000,
            description: 'Successfully deleted proposal template',
          });

          await getTemplates();
          await mutate();
        } catch (e) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            lifetime: 20000,
            description: e.message,
          });
        }
      }
    },
    [accountId, pkAndSignature, getTemplates, mutate]
  );

  return {
    deleteTemplate,
    updateTemplate,
    templates,
    loading: loading || isLoading,
  };
}

export function useSaveTemplates(): {
  saveTemplates: (data: TemplateUpdatePayload[]) => Promise<void>;
} {
  const { accountId, pkAndSignature } = useWalletContext();

  const [, saveTemplates] = useAsyncFn(
    async data => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (publicKey && signature) {
        try {
          await Promise.all(
            data.map(
              ({
                daoId,
                name,
                description = '',
                isEnabled,
                config,
              }: TemplateUpdatePayload) => {
                return SputnikHttpService.saveProposalTemplate(daoId, {
                  accountId,
                  publicKey,
                  signature,
                  name,
                  isEnabled,
                  description,
                  config,
                });
              }
            )
          );

          sendGAEvent({
            name: GA_EVENTS.SAVE_FC_TEMPLATE,
            accountId,
            params: {
              templateName: data[0].name,
              daoIds: data
                .map((item: TemplateUpdatePayload) => item.daoId)
                .join(','),
            },
          });

          showNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            lifetime: 10000,
            description: 'Successfully saved proposal template',
          });
        } catch (e) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            lifetime: 20000,
            description: e.message,
          });
        }
      }
    },
    [accountId, pkAndSignature]
  );

  return {
    saveTemplates,
  };
}

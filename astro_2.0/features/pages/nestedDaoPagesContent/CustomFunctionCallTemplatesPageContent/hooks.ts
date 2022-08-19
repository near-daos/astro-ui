import { useState } from 'react';
import { useAsyncFn, useMount, useMountedState } from 'react-use';

import { SputnikHttpService } from 'services/sputnik';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { useWalletContext } from 'context/WalletContext';

import {
  ProposalTemplate,
  TemplateUpdatePayload,
} from 'types/proposalTemplate';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';

export function useProposalTemplates(daoId: string): {
  deleteTemplate: (id: string) => void;
  updateTemplate: (id: string, data: TemplateUpdatePayload) => void;
  templates: ProposalTemplate[];
  loading: boolean;
} {
  const { accountId, pkAndSignature } = useWalletContext();
  const isMounted = useMountedState();
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);

  const [{ loading }, getTemplates] = useAsyncFn(async () => {
    const res = await SputnikHttpService.getProposalTemplates(daoId);

    if (isMounted()) {
      setTemplates(res);
    }
  }, [accountId, isMounted]);

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
          const updatedTemplate =
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

          setTemplates(
            templates.map(item => {
              if (item.id === updatedTemplate.id) {
                return updatedTemplate;
              }

              return item;
            })
          );
        } catch (e) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            lifetime: 20000,
            description: e.message,
          });
        }
      }
    },
    [accountId, pkAndSignature, templates]
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

          setTemplates(templates.filter(item => item.id !== id));
        } catch (e) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            lifetime: 20000,
            description: e.message,
          });
        }
      }
    },
    [accountId, pkAndSignature, templates]
  );

  return {
    deleteTemplate,
    updateTemplate,
    templates,
    loading,
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

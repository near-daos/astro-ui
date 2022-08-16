import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { omit } from 'lodash';

import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';
import { useWalletContext } from 'context/WalletContext';
import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { getNewProposalObject } from 'astro_2.0/features/CreateProposal/helpers/newProposalObject';
import { keysToCamelCase } from 'utils/keysToCamelCase';
import { DRAFT_PAGE_URL } from 'constants/routing';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';

type UseSubmitDraftProps = {
  proposalType: ProposalType;
  proposalVariant: ProposalVariant;
  dao: DAO;
  daoTokens: Record<string, Token>;
  bountyId?: number;
  draftId?: string;
  isEditDraft?: boolean;
};

export const useSubmitDraft = ({
  dao,
  proposalType,
  proposalVariant,
  daoTokens,
  bountyId,
  draftId,
  isEditDraft,
}: UseSubmitDraftProps): {
  onDraftSubmit: (formValues: Record<string, unknown>) => Promise<void>;
} => {
  const router = useRouter();
  const { draftsService } = useDraftsContext();
  const { accountId, pkAndSignature } = useWalletContext();

  const onDraftSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const proposalData = omit(data, ['title', 'description']);

      if (pkAndSignature && accountId) {
        try {
          const newProposal = await getNewProposalObject(
            dao,
            proposalVariant,
            proposalData,
            daoTokens,
            accountId,
            bountyId
          );

          let kind = {};

          if (newProposal && newProposal.data) {
            kind = keysToCamelCase(newProposal.data);
          }

          let response;

          if (isEditDraft) {
            response = await draftsService.patchDraft({
              id: draftId || '',
              daoId: dao.id,
              title: data.title as string,
              description: data.description as string,
              type: proposalType,
              kind: {
                type: proposalType,
                proposalVariant,
                ...kind,
              },
              accountId,
              publicKey: pkAndSignature.publicKey || '',
              signature: pkAndSignature.signature || '',
            });
          } else {
            response = await draftsService.createDraft({
              daoId: dao.id,
              title: data.title as string,
              description: data.description as string,
              type: proposalType,
              kind: {
                type: proposalType,
                proposalVariant,
                ...kind,
              },
              accountId,
              publicKey: pkAndSignature.publicKey || '',
              signature: pkAndSignature.signature || '',
            });

            sendGAEvent({
              name: GA_EVENTS.CREATE_DRAFT_PROPOSAL,
              daoId: dao.id,
              accountId,
              params: {
                variant: proposalVariant,
                draftId: response.data,
              },
            });
          }

          router.push({
            pathname: DRAFT_PAGE_URL,
            query: {
              dao: dao.id,
              draft: response.data,
            },
          });
        } catch (e) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            lifetime: 20000,
            description: e?.message,
          });
        }
      }
    },
    [
      accountId,
      bountyId,
      dao,
      daoTokens,
      draftsService,
      draftId,
      isEditDraft,
      pkAndSignature,
      proposalType,
      proposalVariant,
      router,
    ]
  );

  return { onDraftSubmit };
};

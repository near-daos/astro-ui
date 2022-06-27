import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { omit } from 'lodash';

import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { useWalletContext } from 'context/WalletContext';
import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { Hashtag } from 'types/draftProposal';
import { getNewProposalObject } from 'astro_2.0/features/CreateProposal/helpers/newProposalObject';
import { keysToCamelCase } from 'utils/keysToCamelCase';
import { DRAFT_PAGE_URL } from 'constants/routing';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

type UseSubmitDraftProps = {
  proposalType: ProposalType;
  proposalVariant: ProposalVariant;
  dao: DAO;
  daoTokens: Record<string, Token>;
  bountyId?: number;
};

export const useSubmitDraft = ({
  dao,
  proposalType,
  proposalVariant,
  daoTokens,
  bountyId,
}: UseSubmitDraftProps): {
  onDraftSubmit: (formValues: Record<string, unknown>) => Promise<void>;
} => {
  const router = useRouter();
  const { draftsService } = useDraftsContext();
  const { accountId, pkAndSignature } = useWalletContext();

  const onDraftSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const proposalData = omit(data, ['title', 'description', 'hashtags']);

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

          const newDraftResponse = await draftsService.createDraft({
            daoId: dao.id,
            title: data.title as string,
            description: data.description as string,
            hashtags: (data.hashtags as Hashtag[]).map(
              hashtag => hashtag.value
            ),
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

          router.push({
            pathname: DRAFT_PAGE_URL,
            query: {
              dao: dao.id,
              draft: newDraftResponse.data,
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
      pkAndSignature,
      proposalType,
      proposalVariant,
      router,
    ]
  );

  return { onDraftSubmit };
};

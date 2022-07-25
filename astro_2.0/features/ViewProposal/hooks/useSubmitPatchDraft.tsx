import { useRouter } from 'next/router';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { useWalletContext } from 'context/WalletContext';
import { DraftProposal, Hashtag } from 'types/draftProposal';
import { DRAFT_PAGE_URL } from 'constants/routing';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useCallback } from 'react';
import { ProposalFeedItem, ProposalType } from 'types/proposal';

type UseSubmitPatchDraftProps = {
  daoId: string;
  draftId: string;
  proposal?: ProposalFeedItem | DraftProposal;
};

export const useSubmitPatchDraft = ({
  daoId,
  draftId,
  proposal,
}: UseSubmitPatchDraftProps): {
  onDraftPatchSubmit: (formValues: Record<string, unknown>) => Promise<void>;
} => {
  const router = useRouter();
  const { draftsService } = useDraftsContext();
  const { accountId, pkAndSignature } = useWalletContext();

  const onDraftPatchSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (pkAndSignature && accountId) {
        try {
          const updatedDraftResponse = await draftsService.patchDraft({
            id: draftId,
            title: data.title as string,
            description: data.description as string,
            hashtags:
              (data.hashtags as Hashtag[])?.map(hashtag => hashtag.value) ?? [],
            daoId,
            kind: proposal?.kind,
            type: proposal?.kind.type || ProposalType.AddBounty,
            accountId,
            publicKey: pkAndSignature.publicKey || '',
            signature: pkAndSignature.signature || '',
          });

          router.push({
            pathname: DRAFT_PAGE_URL,
            query: {
              dao: daoId,
              draft: updatedDraftResponse.data,
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
      daoId,
      draftId,
      draftsService,
      pkAndSignature,
      proposal?.kind,
      router,
    ]
  );

  return { onDraftPatchSubmit };
};

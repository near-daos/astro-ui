// import { useRouter } from 'next/router';

// import { EDIT_DRAFT_PAGE_URL } from 'constants/routing';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { useWalletContext } from 'context/WalletContext';
import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

import { getNewProposalObject } from '../helpers/newProposalObject';
import { pick } from 'lodash';

type UseSubmitDraftProps = {
  selectedProposalVariant: ProposalVariant;
  dao: DAO;
  daoTokens: Record<string, Token>;
  bountyId: number | undefined;
};

export const useSubmitDraft = ({
  dao,
  selectedProposalVariant,
  daoTokens,
  bountyId,
}: UseSubmitDraftProps): {
  onDraftSubmit: (formValues: Record<string, unknown>) => Promise<void>;
} => {
  // const router = useRouter();
  const { draftsService } = useDraftsContext();
  const { accountId, nearService } = useWalletContext();

  const onDraftSubmit = async (formValues: Record<string, unknown>) => {
    let newProposal = await getNewProposalObject(
      dao,
      selectedProposalVariant,
      formValues,
      daoTokens,
      accountId,
      bountyId
    );
    const publicKey = await nearService?.getPublicKey();
    const signature = await nearService?.getSignature();

    const pickedData = pick(formValues, ['title', 'description']);

    const preparedResult = {
      daoId: dao.id,
      title: pickedData.title,
      description: pickedData.description,
      type: selectedProposalVariant,
    };

    // {
    //   "type": "ChangeConfig",
    //   "kind": {
    //   "type": "ChangeConfig",
    //     "config": "string",
    //     "policy": {
    //     "proposalBond": "string",
    //       "bountyBond": "string",
    //       "proposalPeriod": 0,
    //       "bountyForgivenessPeriod": 0,
    //       "defaultVotePolicy": {
    //       "weightKind": "TokenWeight",
    //         "quorum": 0,
    //         "kind": "Weight",
    //         "weight": 0,
    //         "ratio": [
    //         "string"
    //       ]
    //     },
    //     "roles": {
    //       "isArchived": true,
    //         "createdAt": "2022-06-20T20:13:09.581Z",
    //         "updatedAt": "2022-06-20T20:13:09.581Z",
    //         "id": "string",
    //         "name": "string",
    //         "kind": {
    //         "group": [
    //           "string"
    //         ]
    //       },
    //       "balance": 0,
    //         "accountIds": [
    //         "string"
    //       ],
    //         "permissions": [
    //         "string"
    //       ],
    //         "votePolicy": {}
    //     }
    //   },
    //   "memberId": "string",
    //     "role": "string",
    //     "receiverId": "string",
    //     "actions": [
    //     {
    //       "methodName": 0,
    //       "args": "string",
    //       "deposit": "string",
    //       "gas": "string"
    //     }
    //   ],
    //     "hash": "string",
    //     "methodName": "string",
    //     "tokenId": "string",
    //     "msg": "string",
    //     "stakingId": "string",
    //     "bounty": "string",
    //     "bountyId": "string"
    // },
    //   "hashtags": [
    //   "string"
    // ]
    // }

    console.log(
      'formValues',
      formValues,
      'newProposal',
      newProposal,
      'preparedResult',
      preparedResult
    );

    if (publicKey && signature && accountId) {
      draftsService
        .createDraft({
          ...formValues,
          accountId,
          publicKey,
          signature,
          kind: { test: 'test' },
        })
        .then(response => {
          console.log('response', response.data);
        });
    }
  };

  return { onDraftSubmit };
};

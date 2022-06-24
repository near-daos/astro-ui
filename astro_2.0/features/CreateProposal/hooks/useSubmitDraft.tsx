import { useRouter } from 'next/router';
import { omit } from 'lodash';

import { DRAFT_PAGE_URL } from 'constants/routing';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { useWalletContext } from 'context/WalletContext';
import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { Hashtag } from 'types/draftProposal';

// import {
//   DEFAULT_CREATE_DAO_GAS,
//   DEFAULT_PROPOSAL_GAS,
//   DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
// } from 'services/sputnik/constants';
import { getNewProposalObject } from 'astro_2.0/features/CreateProposal/helpers/newProposalObject';

type UseSubmitDraftProps = {
  proposalType: ProposalType;
  proposalVariant: ProposalVariant;
  dao: DAO;
  initialValues?: Record<string, unknown>;
  daoTokens: Record<string, Token>;
  bountyId?: number;
};

// const createDraftKind = (
//   formValues: Record<string, unknown>,
//   proposalVariant: ProposalVariant,
//   initialValues: Record<string, unknown> = {},
//   daoTokens: Record<string, Token>,
//   accountId: string
// ): Record<string, unknown> => {
//   switch (proposalVariant) {
//     case ProposalVariant.ProposeGetUpgradeCode: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
//         versionHash: initialValues?.versionHash,
//       };
//     }
//     case ProposalVariant.ProposeUpdateGroup: {
//       return {
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
//         groups: initialValues.groups,
//       };
//     }
//     case ProposalVariant.ProposeUpgradeSelf: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
//         versionHash: initialValues?.versionHash,
//       };
//     }
//     case ProposalVariant.ProposeRemoveUpgradeCode: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
//         versionHash: initialValues?.versionHash,
//       };
//     }
//     case ProposalVariant.ProposeCreateDao: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_CREATE_DAO_GAS,
//         displayName: initialValues.displayName,
//       };
//     }
//     case ProposalVariant.ProposeTransferFunds: {
//       const tokens = (daoTokens as Record<string, Token>) ?? {};
//       const tokensIds = Object.values(tokens).map(item => item.symbol);
//
//       const tokensFields = tokensIds.reduce<Record<string, string | null>>(
//         (res, item) => {
//           res[`${item}_amount`] = null;
//
//           res[`${item}_target`] = initialValues.target as string;
//
//           return res;
//         },
//         {}
//       );
//
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_CREATE_DAO_GAS,
//         daoTokens,
//         ...tokensFields,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeCreateBounty: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         token: 'NEAR',
//         amount: formValues.amount,
//         slots: formValues.slots,
//         deadlineThreshold: formValues.deadlineThreshold,
//         deadlineUnits: 'days',
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeDoneBounty: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         target: accountId,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeTransfer: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         token: 'NEAR',
//         amount: formValues.amount,
//         target: formValues.target,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeDaoName: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         displayName: formValues.displayName,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeDaoPurpose: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         purpose: formValues.purpose,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeDaoLinks: {
//       const initial = initialValues as { links?: string[] };
//
//       const links = initial ? initial?.links?.map(item => ({ url: item })) : [];
//
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//         links,
//       };
//     }
//     case ProposalVariant.ProposeCreateToken: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         tokenName: formValues.tokenName,
//         totalSupply: formValues.totalSupply,
//         tokenImage: formValues.tokenImage,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
//       return {
//         gas: DEFAULT_PROPOSAL_GAS,
//       };
//     }
//     case ProposalVariant.ProposeStakingContractDeployment: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         unstakingPeriod: '345',
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeAcceptStakingContract: {
//       return {
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeTokenDistribution: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         groups: formValues.groups,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeDaoLegalInfo: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposePoll: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeAddMember: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         group: formValues.group,
//         memberName: formValues.memberName,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeCreateGroup:
//     case ProposalVariant.ProposeRemoveMember: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         group: formValues.group,
//         memberName: formValues.memberName,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeVotingPolicy: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         amount: formValues.amount,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeBonds: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         createProposalBond: formValues.createProposalBond,
//         claimBountyBond: formValues.claimBountyBond,
//         proposalExpireTime: formValues.proposalExpireTime,
//         unclaimBountyTime: formValues.unclaimBountyTime,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeDaoFlag: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         flagCover: formValues.flagCover,
//         flagLogo: formValues.flagLogo,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeCustomFunctionCall: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         smartContractAddress: formValues.smartContractAddress,
//         methodName: formValues.methodName,
//         json: formValues.json,
//         deposit: '0',
//         token: 'NEAR',
//         actionsGas: DEFAULT_PROPOSAL_GAS,
//         gas: DEFAULT_PROPOSAL_GAS,
//         functionCallType: 'Custom',
//         timeout: 24,
//         timeoutGranularity: 'Hours',
//         ...initialValues,
//       };
//     }
//     case ProposalVariant.ProposeChangeProposalVotingPermissions:
//     case ProposalVariant.ProposeChangeProposalCreationPermissions: {
//       return {
//         details: formValues.details,
//         externalUrl: formValues.externalUrl,
//         amount: formValues.amount,
//         gas: DEFAULT_PROPOSAL_GAS,
//         ...initialValues,
//       };
//     }
//     default: {
//       return {};
//     }
//   }
// };

export const useSubmitDraft = ({
  dao,
  proposalType,
  proposalVariant,
  // initialValues = {},
  daoTokens,
  bountyId,
}: UseSubmitDraftProps): {
  onDraftSubmit: (formValues: Record<string, unknown>) => Promise<void>;
} => {
  const router = useRouter();
  const { draftsService } = useDraftsContext();
  const { accountId, nearService } = useWalletContext();

  const onDraftSubmit = async (data: Record<string, unknown>) => {
    const publicKey = await nearService?.getPublicKey();
    const signature = await nearService?.getSignature();

    const proposalData = omit(data, ['title', 'description', 'hashtags']);

    if (publicKey && signature && accountId) {
      try {
        const proposal = getNewProposalObject(
          dao,
          proposalVariant,
          proposalData,
          daoTokens,
          accountId,
          bountyId
        );

        const newDraft = await draftsService.createDraft({
          daoId: dao.id,
          title: data.title as string,
          description: data.description as string,
          hashtags: (data.hashtags as Hashtag[]).map(hashtag => hashtag.value),
          type: proposalType,
          kind: {
            proposalVariant,
            ...proposal,
          },
          accountId,
          publicKey,
          signature,
        });

        router.push({
          pathname: DRAFT_PAGE_URL,
          query: {
            dao: dao.id,
            draft: newDraft.data,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return { onDraftSubmit };
};

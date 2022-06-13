/* istanbul ignore file */

import { ProposalVariant } from 'types/proposal';
import {
  DEFAULT_CREATE_DAO_GAS,
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
} from 'services/sputnik/constants';
import { Token } from 'types/token';

export function getFormInitialValues(
  selectedProposalType: ProposalVariant,
  accountId: string,
  initialValues: Record<string, unknown> = {},
  daoTokens?: Record<string, Token>,
  isDraft?: boolean
): Record<string, unknown> {
  let result: Record<string, unknown>;

  switch (selectedProposalType) {
    case ProposalVariant.ProposeGetUpgradeCode: {
      result = {
        details: `Upgrading your DAO requires you to retrieve the new code you want your DAO to run. This proposal is to get a copy of the upgrade code. The code comes from the Sputnik DAO Factory, the same place your DAO came from when you created it.`,
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
      break;
    }
    case ProposalVariant.ProposeUpdateGroup: {
      result = {
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        groups: initialValues.groups,
      };
      break;
    }
    case ProposalVariant.ProposeUpgradeSelf: {
      result = {
        details: `Now that your DAO has a copy of the code it wants to run, it's time to propose that the DAO "Upgrades Itself." This proposal will switch the DAO from running its old code to the code you retrieved in step 1.`,
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
      break;
    }
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      result = {
        details: `Your DAO is now running the latest code! This proposal is to delete the upgrade code which you retrieved from the factory. Deleting that code saves NEAR for your DAO. It's safe to delete that code because smart contracts always store a copy of the code they're running.`,
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
      break;
    }
    case ProposalVariant.ProposeCreateDao: {
      return {
        details: `Because V2 DAOs can not be upgraded we will create a new DAO running the V3 smart contract. After this step we will transfer all assets to the V3 DAO.`,
        externalUrl: '',
        gas: DEFAULT_CREATE_DAO_GAS,
        displayName: initialValues.displayName,
      };
    }
    case ProposalVariant.ProposeTransferFunds: {
      const tokens = (daoTokens as Record<string, Token>) ?? {};
      const tokensIds = Object.values(tokens).map(item => item.symbol);

      const tokensFields = tokensIds.reduce<Record<string, string | null>>(
        (res, item) => {
          res[`${item}_amount`] = null;

          res[`${item}_target`] = initialValues.target as string;

          return res;
        },
        {}
      );

      result = {
        details: `To manage our assets with our new V3 DAO we will transfer them from our old V2 DAO. We're creating the proposals all at once but each proposal needs separate approval.`,
        externalUrl: '',
        gas: DEFAULT_CREATE_DAO_GAS,
        daoTokens,
        ...tokensFields,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeCreateBounty: {
      result = {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: '',
        slots: '',
        deadlineThreshold: '',
        deadlineUnits: 'days',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeDoneBounty: {
      result = {
        details: '',
        externalUrl: '',
        target: accountId,
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeTransfer: {
      result = {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: '',
        target: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeDaoName: {
      result = {
        details: '',
        externalUrl: '',
        displayName: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      result = {
        details: '',
        externalUrl: '',
        purpose: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      const initial = initialValues as { links?: string[] };

      const links = initial ? initial?.links?.map(item => ({ url: item })) : [];

      result = {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
        links,
      };
      break;
    }
    case ProposalVariant.ProposeCreateToken: {
      result = {
        details: '',
        externalUrl: '',
        tokenName: '',
        totalSupply: '',
        tokenImage: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeStakingContractDeployment: {
      result = {
        details: '',
        externalUrl: '',
        unstakingPeriod: '345',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeAcceptStakingContract: {
      result = {
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeTokenDistribution: {
      result = {
        details: '',
        externalUrl: '',
        groups: [],
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      result = {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposePoll: {
      result = {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeAddMember: {
      result = {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeCreateGroup:
    case ProposalVariant.ProposeRemoveMember: {
      result = {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      result = {
        details: '',
        externalUrl: '',
        amount: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeBonds: {
      result = {
        details: '',
        externalUrl: '',
        createProposalBond: '',
        claimBountyBond: '',
        proposalExpireTime: '',
        unclaimBountyTime: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      result = {
        details: '',
        externalUrl: '',
        flagCover: '',
        flagLogo: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      result = {
        details: '',
        externalUrl: '',
        smartContractAddress: '',
        methodName: '',
        json: '{\n  \n}',
        deposit: '0',
        token: 'NEAR',
        actionsGas: DEFAULT_PROPOSAL_GAS,
        gas: DEFAULT_PROPOSAL_GAS,

        functionCallType: 'Custom',
        timeout: 24,
        timeoutGranularity: 'Hours',
        ...initialValues,
      };
      break;
    }
    case ProposalVariant.ProposeChangeProposalVotingPermissions:
    case ProposalVariant.ProposeChangeProposalCreationPermissions: {
      result = {
        details: '',
        externalUrl: '',
        amount: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
      break;
    }
    default: {
      result = {};
      break;
    }
  }

  if (isDraft) {
    result.title = '';
    result.hashtags = [];
    result.description = '';
  }

  return result;
}

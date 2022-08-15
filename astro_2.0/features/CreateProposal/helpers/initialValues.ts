/* istanbul ignore file */

import { TFunction } from 'react-i18next';
import { ProposalVariant } from 'types/proposal';
import {
  DEFAULT_CREATE_DAO_GAS,
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
} from 'services/sputnik/constants';
import { Token } from 'types/token';
import { DAO } from 'types/dao';

export function getFormInitialValues(
  t: TFunction,
  selectedProposalType: ProposalVariant,
  accountId: string,
  initialValues: Record<string, unknown> = {},
  daoTokens?: Record<string, Token>,
  isDraft?: boolean,
  dao?: DAO
): Record<string, unknown> {
  let result: Record<string, unknown>;

  const getDescr = (key: string) =>
    t(`proposalCard.functionCalls.${key}.description`);

  switch (selectedProposalType) {
    case ProposalVariant.ProposeGetUpgradeCode: {
      result = {
        details: getDescr('proposeGetUpgradeCode'),
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
        details: getDescr('proposeUpgradeSelf'),
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
      break;
    }
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      result = {
        details: getDescr('proposeRemoveUpgradeCode'),
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
      break;
    }
    case ProposalVariant.ProposeCreateDao: {
      result = {
        details: getDescr('proposeCreateDao'),
        externalUrl: '',
        gas: DEFAULT_CREATE_DAO_GAS,
        displayName: initialValues.displayName,
      };
      break;
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
        details: getDescr('proposeTransferFunds'),
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

      let links = initial
        ? initial?.links?.map(item => ({ url: item, id: item }))
        : null;

      if (!links || links.length === 0) {
        links = dao?.links?.map(item => ({ url: item, id: item })) || [];
      }

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
    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
      result = {
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
    result.title = initialValues.title || '';
    result.details = initialValues.description || '';
    result.description = initialValues.description || '';
    result.gas = DEFAULT_PROPOSAL_GAS;
  }

  return result;
}

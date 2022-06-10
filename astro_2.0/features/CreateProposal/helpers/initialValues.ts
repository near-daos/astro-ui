/* istanbul ignore file */

import { TFunction } from 'react-i18next';
import { ProposalVariant } from 'types/proposal';
import {
  DEFAULT_CREATE_DAO_GAS,
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
} from 'services/sputnik/constants';
import { Token } from 'types/token';

export function getFormInitialValues(
  t: TFunction,
  selectedProposalType: ProposalVariant,
  accountId: string,
  initialValues: Record<string, unknown> = {},
  daoTokens?: Record<string, Token>
): Record<string, unknown> {
  const getDescr = (key: string) =>
    t(`proposalCard.functionCalls.${key}.description`);

  switch (selectedProposalType) {
    case ProposalVariant.ProposeGetUpgradeCode: {
      return {
        details: getDescr('proposeGetUpgradeCode'),
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
    }
    case ProposalVariant.ProposeUpdateGroup: {
      return {
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        groups: initialValues.groups,
      };
    }
    case ProposalVariant.ProposeUpgradeSelf: {
      return {
        details: getDescr('proposeUpgradeSelf'),
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
    }
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      return {
        details: getDescr('proposeRemoveUpgradeCode'),
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
    }
    case ProposalVariant.ProposeCreateDao: {
      return {
        details: getDescr('proposeCreateDao'),
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

      return {
        details: getDescr('proposeTransferFunds'),
        externalUrl: '',
        gas: DEFAULT_CREATE_DAO_GAS,
        daoTokens,
        ...tokensFields,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeCreateBounty: {
      return {
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
    }
    case ProposalVariant.ProposeDoneBounty: {
      return {
        details: '',
        externalUrl: '',
        target: accountId,
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeTransfer: {
      return {
        details: '',
        externalUrl: '',
        token: 'NEAR',
        amount: '',
        target: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return {
        details: '',
        externalUrl: '',
        displayName: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return {
        details: '',
        externalUrl: '',
        purpose: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      const initial = initialValues as { links?: string[] };

      const links = initial ? initial?.links?.map(item => ({ url: item })) : [];

      return {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
        links,
      };
    }
    case ProposalVariant.ProposeCreateToken: {
      return {
        details: '',
        externalUrl: '',
        tokenName: '',
        totalSupply: '',
        tokenImage: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
      return {
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeStakingContractDeployment: {
      return {
        details: '',
        externalUrl: '',
        unstakingPeriod: '345',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeAcceptStakingContract: {
      return {
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeTokenDistribution: {
      return {
        details: '',
        externalUrl: '',
        groups: [],
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      return {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposePoll: {
      return {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeAddMember: {
      return {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeCreateGroup:
    case ProposalVariant.ProposeRemoveMember: {
      return {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return {
        details: '',
        externalUrl: '',
        amount: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeChangeBonds: {
      return {
        details: '',
        externalUrl: '',
        createProposalBond: '',
        claimBountyBond: '',
        proposalExpireTime: '',
        unclaimBountyTime: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      return {
        details: '',
        externalUrl: '',
        flagCover: '',
        flagLogo: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      return {
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
    }
    case ProposalVariant.ProposeChangeProposalVotingPermissions:
    case ProposalVariant.ProposeChangeProposalCreationPermissions: {
      return {
        details: '',
        externalUrl: '',
        amount: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...initialValues,
      };
    }
    default: {
      return {};
    }
  }
}

/* istanbul ignore file */

import { ProposalVariant } from 'types/proposal';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';

export function getFormInitialValues(
  selectedProposalType: ProposalVariant,
  accountId: string,
  initialValues?: Record<string, unknown>
): Record<string, unknown> {
  switch (selectedProposalType) {
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
      };
    }
    case ProposalVariant.ProposeDoneBounty: {
      return {
        details: '',
        externalUrl: '',
        target: accountId,
        gas: DEFAULT_PROPOSAL_GAS,
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
      };
    }
    case ProposalVariant.ProposeChangeDaoName: {
      return {
        details: '',
        externalUrl: '',
        displayName: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return {
        details: '',
        externalUrl: '',
        purpose: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoLinks: {
      return {
        details: '',
        externalUrl: '',
        links: [],
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeContractAcceptance: {
      return {
        unstakingPeriod: '345',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeTokenDistribution: {
      return {
        groups: [],
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo: {
      return {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposePoll: {
      return {
        details: '',
        externalUrl: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeAddMember: {
      const preset = initialValues || {};

      return {
        details: '',
        externalUrl: '',
        group: '',
        memberName: '',
        gas: DEFAULT_PROPOSAL_GAS,
        ...preset,
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
      };
    }
    case ProposalVariant.ProposeChangeVotingPolicy: {
      return {
        details: '',
        externalUrl: '',
        amount: '',
        gas: DEFAULT_PROPOSAL_GAS,
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
      };
    }
    case ProposalVariant.ProposeChangeDaoFlag: {
      return {
        details: '',
        externalUrl: '',
        flagCover: '',
        flagLogo: '',
        gas: DEFAULT_PROPOSAL_GAS,
      };
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      return {
        details: '',
        externalUrl: '',
        smartContractAddress: '',
        methodName: '',
        json: '',
        deposit: '0',
        token: 'NEAR',
        actionsGas: DEFAULT_PROPOSAL_GAS,
        gas: DEFAULT_PROPOSAL_GAS,

        functionCallType: 'Custom',
        timeout: 24,
        timeoutGranularity: 'Hours',
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

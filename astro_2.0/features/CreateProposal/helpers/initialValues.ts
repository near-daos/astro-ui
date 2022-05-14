/* istanbul ignore file */

import { ProposalVariant } from 'types/proposal';
import {
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
} from 'services/sputnik/constants';

export function getFormInitialValues(
  selectedProposalType: ProposalVariant,
  accountId: string,
  initialValues?: Record<string, unknown>
): Record<string, unknown> {
  switch (selectedProposalType) {
    case ProposalVariant.ProposeGetUpgradeCode: {
      return {
        details: `Upgrading your DAO requires you to retrieve the new code you want your DAO to run. This step gets V3 code from the Sputnik DAO Factory.This is the same place your DAO came from when you created it.\nIt's advised to get your DAO members online for the upgrade process. That way it will be fast to approve each of the 3 upgrade steps.`,
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
    }
    case ProposalVariant.ProposeUpgradeSelf: {
      return {
        details: `The second step to upgrade your DAO is to run the V3 code you retrieved from the factory. You do this by proposing that the DAO "Upgrades Itself".\nLike the previous step it's advised to have DAO members online for fast proposal approval. After your DAO approves this proposal you’ll be upgraded to V3!`,
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
      };
    }
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      return {
        details: `When you upgraded to V3 your DAO stored a copy of that code to its address. That means you can delete the copy of the code you retrieved from the factory. Deleting the extra code copy saves NEAR for your DAO!`,
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: initialValues?.versionHash,
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

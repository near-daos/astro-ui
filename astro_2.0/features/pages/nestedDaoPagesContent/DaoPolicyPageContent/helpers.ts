import { ProposalType } from 'types/proposal';
import { APP_TO_CONTRACT_PROPOSAL_TYPE } from 'utils/dataConverter';

export type SelectorRow = {
  label: string;
  config: boolean;
  policy: boolean;
  call: boolean;
  upgradeSelf: boolean;
  upgradeRemote: boolean;
  setStakingContract: boolean;
  bounty: boolean;
  bountyDone: boolean;
  transfer: boolean;
  poll: boolean;
  removeMember: boolean;
  addMember: boolean;
};

export function getInitialCreationPermissions(dao: {
  policy: {
    roles: {
      kind: 'Everyone' | 'Group' | 'Member';
      name: string;
      slug?: string;
      permissions: string[];
    }[];
  };
}): SelectorRow[] {
  // TODO: check is there are only one role with kind Everyone
  // role => role.kind === 'Everyone' && role.slug === 'all'

  const { roles } = dao.policy;

  return roles.map(group => {
    const allowAll =
      group.permissions.indexOf('*:*') !== -1 ||
      group.permissions.indexOf('*:AddProposal') !== -1;

    const config =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.ChangeConfig]
        }:AddProposal`
      ) !== -1;

    const policy =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.ChangePolicy]
        }:AddProposal`
      ) !== -1;

    const bounty =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.AddBounty]}:AddProposal`
      ) !== -1;

    const bountyDone =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.BountyDone]}:AddProposal`
      ) !== -1;

    const transfer =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.Transfer]}:AddProposal`
      ) !== -1;

    const call =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.FunctionCall]
        }:AddProposal`
      ) !== -1;

    const poll =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.Vote]}:AddProposal`
      ) !== -1;

    const removeMember =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.RemoveMemberFromRole]
        }:AddProposal`
      ) !== -1;

    const addMember =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.AddMemberToRole]
        }:AddProposal`
      ) !== -1;

    const upgradeSelf =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.UpgradeSelf]}:AddProposal`
      ) !== -1;

    const upgradeRemote =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.UpgradeRemote]
        }:AddProposal`
      ) !== -1;

    const setStakingContract =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.SetStakingContract]
        }:AddProposal`
      ) !== -1;

    return {
      label: group.name,
      policy,
      bounty,
      bountyDone,
      transfer,
      poll,
      removeMember,
      addMember,
      config,
      call,
      upgradeRemote,
      upgradeSelf,
      setStakingContract,
    };
  });
}

export function getInitialVotingPermissions(dao: {
  policy: {
    roles: {
      kind: 'Everyone' | 'Group' | 'Member';
      name: string;
      permissions: string[];
    }[];
  };
}): SelectorRow[] {
  return dao.policy.roles.map(group => {
    const allowAll =
      group.permissions.indexOf('*:*') !== -1 ||
      group.permissions.indexOf('*:VoteApprove') !== -1;

    const config =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.ChangeConfig]
        }:VoteApprove`
      ) !== -1;

    const policy =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.ChangePolicy]
        }:VoteApprove`
      ) !== -1;

    const bounty =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.AddBounty]}:VoteApprove`
      ) !== -1;

    const bountyDone =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.BountyDone]}:VoteApprove`
      ) !== -1;

    const transfer =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.Transfer]}:VoteApprove`
      ) !== -1;

    const call =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.FunctionCall]
        }:VoteApprove`
      ) !== -1;

    const poll =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.Vote]}:VoteApprove`
      ) !== -1;

    const removeMember =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.RemoveMemberFromRole]
        }:VoteApprove`
      ) !== -1;

    const addMember =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.AddMemberToRole]
        }:VoteApprove`
      ) !== -1;

    const upgradeSelf =
      allowAll ||
      group.permissions.indexOf(
        `${APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.UpgradeSelf]}:VoteApprove`
      ) !== -1;

    const upgradeRemote =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.UpgradeRemote]
        }:VoteApprove`
      ) !== -1;

    const setStakingContract =
      allowAll ||
      group.permissions.indexOf(
        `${
          APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.SetStakingContract]
        }:VoteApprove`
      ) !== -1;

    return {
      label: group.name,
      policy,
      bounty,
      bountyDone,
      transfer,
      poll,
      removeMember,
      addMember,
      call,
      config,
      setStakingContract,
      upgradeSelf,
      upgradeRemote,
    };
  });
}

export function isOptionDisabled(
  dataField: string,
  groupName: string,
  value: boolean
): boolean {
  if (groupName.toLowerCase() !== 'council') {
    return false;
  }

  switch (dataField) {
    case 'config':
    case 'policy':
    case 'addMember':
    case 'removeMember': {
      return value;
    }
    default: {
      return false;
    }
  }
}

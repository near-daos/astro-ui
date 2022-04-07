import { ProposalType } from 'types/proposal';

export type SelectorRow = {
  label: string;
  policy: boolean;
  bounty: boolean;
  transfer: boolean;
  poll: boolean;
  removeMember: boolean;
  addMember: boolean;
  createGroup: boolean;
};

export function getInitialCreationPermissions(dao: {
  groups: {
    name: string;
    permissions: string[];
  }[];
}): SelectorRow[] {
  return dao.groups.map(group => {
    const allowAll =
      group.permissions.indexOf('*:*') !== -1 ||
      group.permissions.indexOf('*:AddProposal') !== -1;

    const policy =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.ChangePolicy}:AddProposal`) !==
        -1;

    const bounty =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.AddBounty}:AddProposal`) !== -1;

    const transfer =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.Transfer}:AddProposal`) !== -1;

    const poll =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.Vote}:AddProposal`) !== -1;

    const removeMember =
      allowAll ||
      group.permissions.indexOf(
        `${ProposalType.RemoveMemberFromRole}:AddProposal`
      ) !== -1;

    const addMember =
      allowAll ||
      group.permissions.indexOf(
        `${ProposalType.AddMemberToRole}:AddProposal`
      ) !== -1;

    // const createGroup =
    //   allowAll ||
    //   group.permissions.indexOf(`${ProposalType.}:VoteApprove`) !==
    //   -1;

    return {
      label: group.name,
      policy,
      bounty,
      transfer,
      poll,
      removeMember,
      addMember,
      createGroup: false,
    };
  });
}

export function getInitialVotingPermissions(dao: {
  groups: {
    name: string;
    permissions: string[];
  }[];
}): SelectorRow[] {
  return dao.groups.map(group => {
    const allowAll =
      group.permissions.indexOf('*:*') !== -1 ||
      group.permissions.indexOf('*:VoteApprove') !== -1;

    const policy =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.ChangePolicy}:VoteApprove`) !==
        -1;

    const bounty =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.AddBounty}:VoteApprove`) !== -1;

    const transfer =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.Transfer}:VoteApprove`) !== -1;

    const poll =
      allowAll ||
      group.permissions.indexOf(`${ProposalType.Vote}:VoteApprove`) !== -1;

    const removeMember =
      allowAll ||
      group.permissions.indexOf(
        `${ProposalType.RemoveMemberFromRole}:VoteApprove`
      ) !== -1;

    const addMember =
      allowAll ||
      group.permissions.indexOf(
        `${ProposalType.AddMemberToRole}:VoteApprove`
      ) !== -1;

    // const createGroup =
    //   allowAll ||
    //   group.permissions.indexOf(`${ProposalType.}:VoteApprove`) !==
    //   -1;

    return {
      label: group.name,
      policy,
      bounty,
      transfer,
      poll,
      removeMember,
      addMember,
      createGroup: false,
    };
  });
}

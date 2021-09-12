/* eslint-disable camelcase */
import { DaoRole } from './role';

export type FunctionCallAction = {
  methodName: string;
  args: string;
  deposit: string;
  gas: string;
};

export enum ProposalType {
  AddMemberToRole = 'AddMemberToRole',
  RemoveMemberFromRole = 'RemoveMemberFromRole',
  FunctionCall = 'FunctionCall',
  Transfer = 'Transfer',
  SetStakingContract = 'SetStakingContract',
  ChangePolicy = 'ChangePolicy',
  ChangeConfig = 'ChangeConfig',
  UpgradeSelf = 'UpgradeSelf',
  UpgradeRemote = 'UpgradeRemote',
  AddBounty = 'AddBounty',
  BountyDone = 'BountyDone',
  Vote = 'Vote'
}

export type Bounty = {
  description: string;
  token: string;
  amount: string;
  times: number;
  max_deadline: string;
};

export type ProposalKind =
  | {
      type: ProposalType.AddMemberToRole;
      memberId: string;
      role: string;
    }
  | {
      type: ProposalType.RemoveMemberFromRole;
      memberId: string;
      role: string;
    }
  | {
      type: ProposalType.FunctionCall;
      receiverId: string;
      actions: FunctionCallAction[];
    }
  | {
      type: ProposalType.UpgradeRemote;
      receiverId: string;
      hash: string;
      methodName: string;
    }
  | {
      type: ProposalType.UpgradeSelf;
      hash: string;
    }
  | {
      type: ProposalType.BountyDone;
      receiverId: string;
      bountyId: string;
    }
  | {
      type: ProposalType.AddBounty;
      bounty: Bounty;
    }
  | {
      type: ProposalType.Transfer;
      tokenId: string;
      receiverId: string;
      amount: string;
      msg: string | null;
    }
  | { type: ProposalType.SetStakingContract; stakingId: string }
  | { type: ProposalType.ChangePolicy; policy: PolicyType }
  | { type: ProposalType.Vote };

export type ProposalStatus =
  | 'Approved'
  | 'InProgress'
  | 'Rejected'
  | 'Removed'
  | 'Expired'
  | 'Moved';

export type Proposal = {
  id: string;
  daoId: string;
  target: string;
  proposer: string;
  description: string;
  status: ProposalStatus;
  kind: ProposalKind;
  votePeriodEnd: string;
  voteYes: number;
  voteNo: number;
  txHash: string;
  votes: {
    [key: string]: 'Yes' | 'No';
  };
  // votePeriodConvertedEndDate: Date;   --- not working with SSR
  createdAt: string;
};

export interface CreateProposalParams {
  daoId: string;
  description: string;
  kind:
    | 'ChangeConfig'
    | 'ChangePolicy'
    | 'AddMemberToRole'
    | 'RemoveMemberFromRole'
    | 'UpgradeSelf'
    | 'UpgradeRemote'
    | 'Transfer'
    | 'AddBounty'
    | 'BountyDone'
    | 'Vote';
  data:
    | ChangeConfig
    | ChangePolicy
    | AddRemoveMemberRole
    | UpgradeSelf
    | UpgradeRemote
    | Transfer
    | AddBounty
    | BountyDone
    | Vote;
  bond: string;
}

interface AddBounty {
  bounty: Bounty;
}

interface UpgradeRemote {
  // valid account id
  receiver_id: string;
  method_name: string;
  hash: string;
}

interface UpgradeSelf {
  hash: string;
}

interface DefaultVaultPolicy {
  weightKind: string;
  kind: string;
  ratio: number[];
  quorum: string;
}

// TODO describe proposal type properly
// eslint-disable-next-line
export type PolicyType = Object & {
  roles: DaoRole[];
  bountyBond: string;
  proposalBond: string;
  proposalPeriod: string;
  defaultVotePolicy: DefaultVaultPolicy;
  bountyForgivenessPeriod: string;
};

interface ChangePolicy {
  policy: unknown;
}

interface AddRemoveMemberRole {
  // valid account id
  member_id: string;
  role: string;
}

interface Transfer {
  token_id: string;
  // valid account id
  receiver_id: string;
  amount: string;
}

interface BountyDone {
  bounty_id: string;
  // valid account id
  receiver_id: string;
}

interface ChangeConfig {
  config: DaoConfig;
}

export interface DaoConfig {
  name: string;
  purpose: string;
  metadata: string;
}

enum Vote {
  Approve = 0x0,
  Reject = 0x1,
  Remove = 0x2
}

/* eslint-disable camelcase */
import { DAO } from 'types/dao';
import { PolicyType } from 'types/policy';
import { ProposalAction } from 'types/role';

export type DaoDetails = {
  name: string;
  displayName: string | undefined;
  logo: string;
};

export type FunctionCallAction = {
  method_name: string;
  args: string;
  deposit: string;
  gas: string;
};

export interface ProposalVotingPermissions {
  canApprove: boolean;
  canReject: boolean;
  canDelete: boolean;
}

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
  Vote = 'Vote',
}

export enum ProposalVariant {
  ProposeTransfer = 'ProposeTransfer',
  ProposeCreateBounty = 'ProposeCreateBounty',
  ProposeDoneBounty = 'ProposeDoneBounty',
  ProposeChangeDaoName = 'ProposeChangeDaoName',
  ProposeChangeDaoPurpose = 'ProposeChangeDaoPurpose',
  ProposeChangeDaoLinks = 'ProposeChangeDaoLinks',
  ProposeChangeDaoFlag = 'ProposeChangeDaoFlag',
  ProposeChangeDaoLegalInfo = 'ProposeChangeDaoLegalInfo',
  ProposeChangeVotingPolicy = 'ProposeChangeVotingPolicy',
  ProposeChangeBonds = 'ProposeChangeBonds',
  ProposeCreateGroup = 'ProposeCreateGroup',
  ProposeAddMember = 'ProposeAddMember',
  ProposeRemoveMember = 'ProposeRemoveMember',
  ProposePoll = 'ProposePoll',
  ProposeDefault = 'ProposeDefault',
  ProposeCustomFunctionCall = 'ProposeCustomFunctionCall',
  ProposeCreateToken = 'ProposeCreateToken',
  ProposeTokenDistribution = 'ProposeTokenDistribution',
  ProposeContractAcceptance = 'ProposeContractAcceptance',
}

export type VoteAction = 'VoteApprove' | 'VoteRemove' | 'VoteReject';

export type AddBountyRequest = {
  description: string;
  token: string;
  amount: string;
  times: number;
  max_deadline: string;
};

export type BountyDoneProposalType = {
  type: ProposalType.BountyDone;
  receiverId: string;
  bountyId: string;
  completedDate?: string;
};

export type BountyAddProposalType = {
  type: ProposalType.AddBounty;
  status: 'InProgress' | 'Approved';
  bountyId?: string;
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
  | BountyDoneProposalType
  | {
      type: ProposalType.AddBounty;
      bounty: AddBountyRequest;
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
  | {
      type: ProposalType.ChangeConfig;
      config: { metadata: string; name: string; purpose: string };
    }
  | { type: ProposalType.Vote };

export type ProposalStatus =
  | 'Approved'
  | 'InProgress'
  | 'Rejected'
  | 'Removed'
  | 'Expired'
  | 'Moved';

type ProposalProperties = {
  id: string;
  proposalId: number;
  daoId: string;
  proposer: string;
  commentsCount: number;
  description: string;
  status: ProposalStatus;
  kind: ProposalKind;
  votePeriodEnd: string;
  votePeriodEndDate: string;
  updatedAt: string | null;
  voteYes: number;
  voteNo: number;
  voteRemove: number;
  voteStatus: string;
  isFinalized: boolean;
  txHash: string;
  votes: {
    [key: string]: 'Yes' | 'No' | 'Dismiss';
  };
  createdAt: string;
  daoDetails: DaoDetails;
  link: string;
  proposalVariant: ProposalVariant;
  actions: ProposalActionData[];
  permissions?: {
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    isCouncil: boolean;
  };
};

export type Proposal = {
  dao: DAO | null;
} & ProposalProperties;

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
    | 'Vote'
    | 'FunctionCall';
  data?:
    | ChangeConfig
    | ChangePolicy
    | AddRemoveMemberRole
    | UpgradeSelf
    | UpgradeRemote
    | Transfer
    | AddBounty
    | BountyDone
    | Vote
    | FunctionCall;
  bond: string;
  gas?: number;
}

interface AddBounty {
  bounty: AddBountyRequest;
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

interface ChangePolicy {
  policy: unknown;
}

interface AddRemoveMemberRole {
  // valid account id
  member_id: string;
  role: string;
}

interface FunctionCall {
  receiver_id: string;
  actions: FunctionCallAction[];
}

export interface Transfer {
  token_id: string;
  // valid account id
  receiver_id: string;
  amount: string;
}

interface BountyDone {
  bounty_id: number;
  // valid account id
  receiver_id: string;
}

interface ChangeConfig {
  config: DaoConfig;
}

export interface DaoConfig {
  name: string;
  purpose: string;
  metadata: string | undefined;
}

export type ConfigChangeReason =
  | 'Changing name/purpose'
  | 'Changing links'
  | 'Changing flag';

enum Vote {
  Approve = 0x0,
  Reject = 0x1,
  Remove = 0x2,
}

export enum ProposalStatuses {
  All = 'all',
  Active = 'active',
  Approved = 'approved',
  Failed = 'failed',
}

export enum ProposalsFeedStatuses {
  All = 'all',
  Active = 'active',
  VoteNeeded = 'voteNeeded',
  Approved = 'approved',
  Failed = 'failed',
}

export enum ProposalCategories {
  Governance = 'Governance',
  Financial = 'Financial',
  Bounties = 'Bounties',
  Members = 'Groups',
  Polls = 'Polls',
}

export interface Indexed {
  [key: string]: Proposal[];
}

export interface ProposalsByEndTime extends Indexed {
  lessThanHourProposals: Proposal[];
  lessThanDayProposals: Proposal[];
  lessThanWeekProposals: Proposal[];
  moreThanWeekProposals: Proposal[];
  otherProposals: Proposal[];
}

export interface ProposalActionData {
  id: string;
  proposalId: string;
  accountId: string;
  action: ProposalAction;
  transactionHash: string;
  timestamp: string;
}

export type ProposalCommentReport = {
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  commentId: number;
  accountId: string;
  reason: string;
};

export type CommentContextType = 'Proposal' | 'BountyContext';

export interface ProposalComment {
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  id: number;
  daoId: string;
  contextId: string;
  contextType: CommentContextType;
  accountId: string;
  message: string;
  reports: ProposalCommentReport[];
}

type AuthorizedRequest = {
  accountId: string;
  publicKey: string;
  signature: string;
};

export type SendCommentsInput = {
  contextId: string;
  contextType: CommentContextType;
  message: string;
};

export type ReportCommentsInput = {
  commentId: number;
  reason: string;
};

export type DeleteCommentsInput = {
  reason: string;
};

export type SendProposalComment = AuthorizedRequest & SendCommentsInput;
export type ReportProposalComment = AuthorizedRequest & ReportCommentsInput;
export type DeleteProposalComment = AuthorizedRequest & DeleteCommentsInput;

export type ProposalFeedItem = {
  dao: {
    id: string;
    name: string;
    logo: string;
    flagCover: string;
    flagLogo: string;
    legal: {
      legalStatus?: string;
      legalLink?: string;
    };
    numberOfMembers: number;
    policy: {
      daoId: string;
      defaultVotePolicy: {
        weightKind: string;
        kind: string;
        ratio: number[];
        quorum: string;
      };
    };
  };
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    isCouncil: boolean;
  };
} & ProposalProperties;

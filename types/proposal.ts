/* eslint-disable camelcase */

export enum ProposalStatus {
  // Vote for proposal has failed due (not enuough votes).
  Fail = 'Fail',
  // Given voting policy, the uncontested minimum of votes was acquired.
  // Delaying the finalization of the proposal to check that there is no contenders (who would vote against).
  Delay = 'Delay',
  // Proposal has successfully passed.
  Success = 'Success',
  // Proposal was rejected by the vote.
  Reject = 'Reject',
  // Proposal is in active voting stage.
  Vote = 'Vote'
}

export enum ProposalType {
  ChangeVotePeriod = 'ChangeVotePeriod',
  RemoveCouncil = 'RemoveCouncil',
  NewCouncil = 'NewCouncil',
  ChangePurpose = 'ChangePurpose',
  Payout = 'Payout'
}

export type ProposalKind =
  | {
      type: ProposalType.Payout;
      amount: string;
    }
  | {
      type: ProposalType.ChangeVotePeriod;
      votePeriod: string;
    }
  | {
      type: ProposalType.NewCouncil;
    }
  | {
      type: ProposalType.RemoveCouncil;
    }
  | {
      type: ProposalType.ChangePurpose;
      purpose: string;
    };

export type ProposalKindRaw =
  | {
      type: ProposalType.Payout;
      amount: string;
    }
  | {
      type: ProposalType.ChangeVotePeriod;
      vote_period: string;
    }
  | {
      type: ProposalType.NewCouncil;
    }
  | {
      type: ProposalType.RemoveCouncil;
    }
  | {
      type: ProposalType.ChangePurpose;
      purpose: string;
    };

export type ProposalRaw = {
  id: string;
  target: string;
  proposer: string;
  description: string;
  status: string;
  kind: ProposalKindRaw;
  votePeriodEnd: string;
  voteYes: number;
  voteNo: number;
  txHash: string;
  votes: { [key: string]: 'Yes' | 'No' };
};

export type Proposal = {
  id: number;
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

interface Bounty {
  // Description of the bounty.
  description: string;
  // Token the bounty will be paid out.
  token: string;
  // Amount to be paid out.
  amount: string;
  // How many times this bounty can be done.
  times: string;
  // Max deadline from claim that can be spend on this bounty.
  // Duration in nanosecond wrapped into a struct for JSON serialization as a string.
  max_deadline: string;
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

// TODO describe proposal type properly
// eslint-disable-next-line
export type PolicyType = Object & {
  roles: unknown[];
  bountyBond: string;
  proposalBond: string;
  proposalPeriod: string;
  defaultVotePolicy: unknown;
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

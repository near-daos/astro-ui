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

export type CreateProposalParams = {
  daoId: string;
  target: string;
  bond: string;
  description: string;
  kind: ProposalKind;
  link: string;
};

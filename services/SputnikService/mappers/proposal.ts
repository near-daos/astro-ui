import get from 'lodash/get';
import { Proposal, ProposalKind } from 'types/proposal';
import { DaoDTO } from 'services/SputnikService/mappers/dao';

export type ProposalDTO = {
  createTimestamp: string;
  createdAt: string;
  daoId: string;
  description: string;
  id: string;
  isArchived: boolean;
  kind: ProposalKind;
  proposalId: number;
  proposer: string;
  status: 'Approved';
  submissionTime: string;
  transactionHash: string;
  updateTimestamp: string;
  updateTransactionHash: string;
  updatedAt: string;
  voteCounts: Record<string, number[]>;
  votes: Record<string, 'Approve' | 'Reject' | 'Remove'>;
  dao: DaoDTO;
};

type VoteState = 'Yes' | 'No' | 'Dismiss';

export interface GetProposalsResponse {
  data: ProposalDTO[];
}

function getProposalVotingEndDate(
  submissionTime: string,
  proposalPeriod: string
): string {
  const endsAt = (Number(submissionTime) + Number(proposalPeriod)) / 1000000;

  return new Date(endsAt).toISOString();
}

function getVotesStatistic(proposal: ProposalDTO) {
  const result = {
    voteYes: 0,
    voteNo: 0,
    voteRemove: 0,
    votes: {} as Record<string, VoteState>
  };

  Object.keys(proposal.votes).forEach(key => {
    let value: VoteState;

    if (proposal.votes[key] === 'Approve') {
      result.voteYes += 1;
      value = 'Yes';
    } else if (proposal.votes[key] === 'Reject') {
      result.voteNo += 1;
      value = 'No';
    } else {
      result.voteRemove += 1;
      value = 'Dismiss';
    }

    result.votes[key] = value;
  });

  return result;
}

export const mapProposalDTOToProposal = (
  proposalDTO: ProposalDTO
): Proposal => {
  return {
    ...getVotesStatistic(proposalDTO),
    id: proposalDTO.id,
    proposalId: proposalDTO.proposalId,
    daoId: proposalDTO.daoId,
    target: '',
    proposer: proposalDTO.proposer,
    description: proposalDTO.description,
    status: proposalDTO.status,
    kind: proposalDTO.kind,
    votePeriodEnd: getProposalVotingEndDate(
      get(proposalDTO, 'submissionTime'),
      get(proposalDTO, 'dao.policy.proposalPeriod')
    ),
    txHash: proposalDTO.transactionHash,
    createdAt: proposalDTO.createdAt,
    daoDetails: {
      name: proposalDTO.dao.config.name,
      logo: `https://sputnik-dao.s3.eu-central-1.amazonaws.com/${
        proposalDTO.daoId
      }?timestamp=${Date.now()}`
    }
  };
};

export const mapProposalDTOListToProposalList = (
  proposalList: ProposalDTO[]
): Proposal[] => {
  return proposalList.map(proposalItem => {
    return mapProposalDTOToProposal(proposalItem);
  });
};

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

export const mapProposalDTOToProposal = (
  proposalDTO: ProposalDTO
): Proposal => {
  return {
    id: proposalDTO.id,
    proposalId: proposalDTO.proposalId,
    daoId: proposalDTO.daoId,
    target: '',
    proposer: proposalDTO.proposer,
    description: proposalDTO.description,
    status: proposalDTO.status,
    kind: proposalDTO.kind,
    // todo
    votePeriodEnd: '',
    voteYes: Object.values(proposalDTO.voteCounts).reduce(
      (res, item) => res + item[0],
      0
    ),
    voteNo: Object.values(proposalDTO.voteCounts).reduce(
      (res, item) => res + item[1],
      0
    ),
    voteRemove: Object.values(proposalDTO.voteCounts).reduce(
      (res, item) => res + item[2],
      0
    ),
    txHash: proposalDTO.transactionHash,
    votes: Object.keys(proposalDTO.votes).reduce((res, key) => {
      let value: VoteState;

      if (proposalDTO.votes[key] === 'Approve') {
        value = 'Yes';
      } else if (proposalDTO.votes[key] === 'Reject') {
        value = 'No';
      } else {
        value = 'Dismiss';
      }

      res[key] = value;

      return res;
    }, {} as Record<string, VoteState>),
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

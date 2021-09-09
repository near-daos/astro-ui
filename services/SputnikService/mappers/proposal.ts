import { Proposal, ProposalKind } from 'types/proposal';

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
  votes: Record<string, 'Approve'>;
};

export interface GetProposalsResponse {
  data: ProposalDTO[];
}

export const mapProposalDTOToProposal = (
  proposalDTO: ProposalDTO
): Proposal => {
  return {
    id: proposalDTO.id,
    daoId: proposalDTO.daoId,
    target: '',
    proposer: proposalDTO.proposer,
    description: proposalDTO.description,
    status: proposalDTO.status,
    kind: proposalDTO.kind,
    votePeriodEnd: '',
    voteYes: Object.values(proposalDTO.voteCounts).reduce(
      (res, item) => res + item[0],
      0
    ),
    voteNo: Object.values(proposalDTO.voteCounts).reduce(
      (res, item) => res + item[1],
      0
    ),
    txHash: proposalDTO.transactionHash,
    votes: Object.keys(proposalDTO.votes).reduce((res, key) => {
      res[key] = proposalDTO.votes[key] === 'Approve' ? 'Yes' : 'No';

      return res;
    }, {} as Record<string, 'Yes' | 'No'>),
    createdAt: proposalDTO.createdAt
  };
};

export const mapProposalDTOListToProposalList = (
  proposalList: ProposalDTO[]
): Proposal[] => {
  return proposalList.map(proposalItem => {
    return mapProposalDTOToProposal(proposalItem);
  });
};

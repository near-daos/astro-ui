import { Token } from 'components/cards/member-card';
import { PolicyType } from 'types/policy';

export type DaoVotePolicy = {
  weightKind: string;
  quorum: string;
  kind: string;
  ratio: number[];
  weight: string;
};

export type TGroup = {
  members: string[];
  name: string;
  permissions: string[];
  votePolicy: Record<string, DaoVotePolicy>;
  slug: string;
};

export type Member = {
  id: string;
  name: string;
  groups: string[];
  tokens: Token;
  votes: number;
} & { [key: string]: string | string[] | Token | number };

export type DAO = {
  id: string;
  txHash: string;
  name: string;
  description: string;
  members: number;
  funds: string;
  proposals: number;
  totalProposals: number;
  activeProposalsCount: number;
  totalProposalsCount: number;
  createdAt: string;
  groups: TGroup[];
  policy: PolicyType;
  links: string[];
  displayName: string;
  votes?: number;
  logo?: string;
  flagCover?: string;
  flagLogo?: string;
  lastProposalId: number;
};

export type DAOPreview = {
  id: string;
  name: string;
  description: string;
  funds: string;
  flagCover?: string;
  flagLogo?: string;
  links: string[];
  displayName: string;
};

export type VotePolicyRequest = {
  // eslint-disable-next-line camelcase
  weight_kind: string;
  quorum: string;
  threshold: number[] | string;
};

export type RolesRequest = {
  name: string;
  kind: string | { Group: string[] };
  permissions: string[];
  // eslint-disable-next-line camelcase
  vote_policy: Record<string, VotePolicyRequest>;
};

export type PolicyTypeRequest = {
  roles: RolesRequest[];
  defaultVotePolicy: VotePolicyRequest;
  proposalBond: string;
  proposalPeriod: string;
  bountyBond: string;
  bountyForgivenessPeriod: string;
};

export interface CreateDaoInput {
  name: string;
  purpose: string;
  bond: string;
  votePeriod: string;
  gracePeriod: string;
  links: [];
  flagCover: string;
  flagLogo: string;
  amountToTransfer: string;
  displayName: string;
  policy: PolicyTypeRequest;
}

import { Token } from 'components/cards/member-card';
import { PolicyType } from './proposal';

export type DaoVotePolicy = {
  weightKind: string;
  quorum: string;
  kind: string;
  ratio: number[];
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
  name: string;
  description: string;
  members: number;
  funds: string;
  proposals: number;
  createdAt: string;
  logo: string;
  groups: TGroup[];
  policy: PolicyType;
  links: string[];
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
  flag: string;
  amountToTransfer: string;
  policy: PolicyTypeRequest;
}

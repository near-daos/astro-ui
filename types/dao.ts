import { Token } from 'components/cards/member-card';
import { DaoRole } from 'types/role';
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
  votePolicy: DaoVotePolicy;
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
  link?: string | null;
};

export type VotePolicyRequest = {
  // eslint-disable-next-line camelcase
  weight_kind: 'RoleWeight' | 'TokenWeight';
  quorum: string;
  threshold: [number, number];
};

export type RolesRequest = {
  // eslint-disable-next-line camelcase
  vote_policy: Record<string, string>;
} & Pick<DaoRole, 'name' | 'kind' | 'permissions'>;

export type PolicyTypeRequest = {
  roles: RolesRequest[];
};

export interface CreateDaoInput {
  name: string;
  purpose: string;
  council: 'council';
  bond: string;
  votePeriod: string;
  gracePeriod: string;
  amountToTransfer: string;
  // eslint-disable-next-line camelcase
  default_vote_policy: VotePolicyRequest;
  policy: PolicyTypeRequest;
}

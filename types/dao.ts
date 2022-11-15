import { Token } from 'components/cards/member-card/types';
import { PolicyType } from 'types/policy';
import { Token as DaoToken } from 'types/token';

export type DaoVotePolicy = {
  weightKind: string;
  quorum: string;
  kind: string;
  ratio: number[];
  threshold?: number[];
  weight?: string;
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
  tokens?: Token;
  votes: number;
} & { [key: string]: string | string[] | Token | number };

export type DaoVersion = {
  createdAt: string;
  hash: string;
  version: number[];
  commitId: string;
  changelogUrl: string;
};

type DaoProperties = {
  id: string;
  name: string;
  description: string;
  flagCover?: string;
  flagLogo?: string;
  links: string[];
  displayName: string;
  legal?: {
    legalStatus?: string;
    legalLink?: string;
  };
};

export type DAO = {
  txHash: string;
  members: number;
  daoVersionHash: string;
  daoVersion: DaoVersion;
  daoMembersList: string[];
  funds: string;
  totalProposals: number;
  activeProposalsCount: number;
  totalProposalsCount: number;
  totalDaoFunds: number;
  createdAt: string;
  groups: TGroup[];
  policy: PolicyType;
  votes?: number;
  logo?: string;
  lastProposalId: number;
  stakingContract?: string;
  delegations?: DaoDelegation[];
  tokens?: DaoToken[];
  followers?: string[];
} & DaoProperties;

export type DAOPreview = {
  funds: string;
} & DaoProperties;

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
  legal?: {
    legalStatus?: string;
    legalLink?: string;
  };
  gas: string | number;
}

export interface CreateDaoCustomInput {
  name: string;
  amountToTransfer: string;
  gas: string | number;
  args: string;
}

export type DaoSubscription = {
  id: string;
  dao: DAO;
};

export type DaoSubscriptionInput = {
  accountId: string;
  publicKey: string;
  signature: string;
};

export type UpdateDaoSubscription = {
  daoId: string;
} & DaoSubscriptionInput;

export type DaoFeedItem = {
  createdAt: string;
  numberOfMembers: number;
  numberOfGroups: number;
  accountIds: string[];
  activeProposalCount: number;
  totalProposalCount: number;
  totalDaoFunds: number;
  txHash: string;
  logo?: string;
  policy: {
    daoId: string;
    roles: {
      name: string;
      accountIds: string[];
    }[];
  };
  council: string[];
  isCouncil: boolean;
} & DaoProperties;

export type DaoDelegation = {
  id: string;
  daoId: string;
  balance: string;
  accountId: string;
  delegators: Record<string, string>;
};

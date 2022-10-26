import { DeadlineUnit } from 'types/bounties';

type ExternalLink = {
  id: string;
  url: string;
};

export interface LinksFormData {
  links: ExternalLink[];
  details: '';
  externalUrl: '';
}

export interface BondsAndDeadlinesData {
  createProposalBond: number;
  proposalExpireTime: number;
  claimBountyBond: number;
  unclaimBountyTime: number;
  details: string;
  externalUrl: string;
}

export type CreateBountyInput = {
  token: string;
  amount: number;
  details: string;
  externalUrl: string;
  slots: number;
  deadlineThreshold: number;
  deadlineUnit: DeadlineUnit;
};

export type Member = {
  name: string;
  value: number;
};

export type TokenDistributionGroup = {
  name: string;
  isCustom: boolean;
  groupTotal: string;
  members?: Member[];
};

export interface TokenDistributionInput {
  groups: TokenDistributionGroup[];
}

export interface CreateTokenInput {
  details: string;
  externalUrl: string;
  tokenName: string;
  totalSupply: string;
  tokenImage: '';
}

export type CreateProposalAction = 'createGovernanceToken';

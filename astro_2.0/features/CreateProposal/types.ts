import { DeadlineUnit } from 'components/cards/bounty-card/types';

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

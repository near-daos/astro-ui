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

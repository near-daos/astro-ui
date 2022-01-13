import { PolicyTypeRequest } from 'types/dao';

export interface CreateDaoParams {
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

export interface ClaimBountyParams {
  daoId: string;
  bountyId: number;
  deadline: string;
  bountyBond: string;
  gas?: string | number;
}

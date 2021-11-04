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
}

export interface ClaimBountyParams {
  daoId: string;
  bountyId: number;
  deadline: string;
  bountyBond: string;
}

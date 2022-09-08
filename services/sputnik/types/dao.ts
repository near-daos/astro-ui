import { PolicyTypeRequest } from 'types/dao';
import { BaseParams } from './api';

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

export type DaosParams = {
  daoId?: string | null;
  daoFilter?: 'All DAOs' | 'My DAOs' | 'Following DAOs' | null;
  daosIdsFilter?: string[];
};

export type DaoParams = BaseParams & {
  daoId?: string;
};

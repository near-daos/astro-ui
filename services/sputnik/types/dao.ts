import { DaoVersion, PolicyTypeRequest } from 'types/dao';
import { BaseParams } from './api';

export type RawMeta = [string, DaoVersion];

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
  daosIdsFilter?: string[];
};

export type DaoParams = BaseParams & {
  daoId?: string;
};

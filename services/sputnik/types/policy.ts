import { DaoVotePolicy } from 'types/dao';
import { DaoRole } from 'types/role';

export type DaoPolicy = {
  createdAt: string;
  daoId: string;
  proposalBond: string;
  bountyBond: string;
  proposalPeriod: string;
  bountyForgivenessPeriod: string;
  defaultVotePolicy: DaoVotePolicy;
  roles: DaoRole[];
};

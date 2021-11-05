// TODO describe proposal type properly
// eslint-disable-next-line
import { DaoRole, DefaultVotePolicy } from 'types/role';

export type PolicyType = Record<string, unknown> & {
  roles: DaoRole[];
  bountyBond: string;
  proposalBond: string;
  proposalPeriod: string;
  defaultVotePolicy: DefaultVotePolicy;
  bountyForgivenessPeriod: string;
};

import { Proposal } from 'types/proposal';
import { DAO } from 'types/dao';

export type UserPermissions = {
  isCanCreateProposals: boolean;
};

export type DaoContext = {
  userPermissions: UserPermissions;
  dao: DAO;
  policyAffectsProposals: Proposal[];
};

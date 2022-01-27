import { ProposalFeedItem } from 'types/proposal';
import { DAO } from 'types/dao';

export type UserPermissions = {
  isCanCreateProposals: boolean;
  isCanCreatePolicyProposals: boolean;
};

export type DaoContext = {
  userPermissions: UserPermissions;
  dao: DAO;
  policyAffectsProposals: ProposalFeedItem[];
};

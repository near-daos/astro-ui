import { SputnikHttpService } from 'services/sputnik';
import { DaoFeedItem } from 'types/dao';
import { DaoContext } from 'types/context';
import {
  getAllowedProposalsToCreate,
  getAllowedProposalsToVote,
} from 'astro_2.0/features/CreateProposal/createProposalHelpers';

interface GetDaoListProps {
  sort?: string;
  offset?: number;
  limit?: number;
  filter?: string;
  createdBy?: string;
}

export async function getDaosList({
  sort,
  offset,
  limit,
  filter,
}: GetDaoListProps): Promise<{
  daos: DaoFeedItem[];
  total: number;
}> {
  const dao = await SputnikHttpService.getDaoList({
    sort,
    offset,
    limit,
    filter,
  });

  if (!dao) {
    return {
      daos: [],
      total: 0,
    };
  }

  return {
    daos: dao.data.map(rec => ({
      ...rec,
      council: rec.council || null,
      isCouncil: rec.isCouncil || false,
    })),
    total: dao.total,
  };
}

export async function getDaoContext(
  accountId: string | undefined,
  daoId: string
): Promise<DaoContext | undefined> {
  const [dao, policyAffectsProposals] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.findPolicyAffectsProposals(daoId),
  ]);

  if (!dao) {
    return undefined;
  }

  const allowedProposalsToCreate = getAllowedProposalsToCreate(accountId, dao);
  const isCanCreateProposals = !!Object.values(allowedProposalsToCreate).find(
    value => value
  );

  return {
    dao,
    userPermissions: {
      isCanCreateProposals,
      allowedProposalsToCreate,
      allowedProposalsToVote: getAllowedProposalsToVote(accountId, dao),
      isCanCreatePolicyProposals: !policyAffectsProposals.length,
    },
    policyAffectsProposals,
  };
}

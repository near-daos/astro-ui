import { SputnikService } from 'services/SputnikService';
import { getActiveProposalsCountByDao } from 'hooks/useAllProposals';
import { DAO } from 'types/dao';

interface GetDaoListProps {
  sort?: string;
  offset: number;
  limit: number;
}

export async function getDaosList({
  sort,
  offset,
  limit
}: GetDaoListProps): Promise<{
  daos: DAO[];
  total: number;
}> {
  const { data: daoList, total } = await SputnikService.getDaoList({
    sort,
    offset,
    limit
  });
  const daoIds = daoList.map(item => item.id);
  const proposals = await SputnikService.getFilteredProposals({
    daosIdsFilter: daoIds
  });
  const activeProposalsByDao = getActiveProposalsCountByDao(proposals);

  const newData = daoList.map(item => ({
    ...item,
    proposals: activeProposalsByDao[item.id] ?? 0
  }));

  return {
    daos: newData,
    total
  };
}

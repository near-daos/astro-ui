import { SputnikHttpService } from 'services/sputnik';
import { DaoFeedItem } from 'types/dao';

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
    daos: dao.data,
    total: dao.total,
  };
}

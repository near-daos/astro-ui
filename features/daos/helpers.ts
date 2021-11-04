import { SputnikHttpService } from 'services/sputnik';
import { DAO } from 'types/dao';

interface GetDaoListProps {
  sort?: string;
  offset: number;
  limit: number;
}

export async function getDaosList({
  sort,
  offset,
  limit,
}: GetDaoListProps): Promise<{
  daos: DAO[];
  total: number;
}> {
  const { data, total } = await SputnikHttpService.getDaosFeed({
    sort,
    offset,
    limit,
  });

  return {
    daos: data,
    total,
  };
}

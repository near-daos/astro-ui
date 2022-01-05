import { SputnikHttpService } from 'services/sputnik';
import { DAO } from 'types/dao';

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
  daos: DAO[];
  total: number;
}> {
  const { data, total } = await SputnikHttpService.getDaoList({
    sort,
    offset,
    limit,
    filter,
  });

  return {
    daos: data,
    total,
  };
}

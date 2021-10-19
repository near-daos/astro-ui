import { DAO } from 'types/dao';
import { getDaosList } from 'features/daos/helpers';
import AllDaosPage from './AllDaosPage';

interface GetDaoListQuery {
  sort?: string;
  offset?: number;
  limit?: number;
}

export async function getServerSideProps({
  query
}: {
  query: GetDaoListQuery;
}): Promise<{
  props: { data: DAO[]; total: number };
}> {
  const { daos: data, total } = await getDaosList({
    offset: 0,
    limit: 20,
    sort: (query.sort as string) ?? ''
  });

  return {
    props: {
      data,
      total
    }
  };
}

export default AllDaosPage;

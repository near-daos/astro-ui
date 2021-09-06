import { DAO } from 'types/dao';
import { SputnikService } from 'services/SputnikService';

import BrowseAllDaos from './BrowseAllDaos';

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
  props: { data: DAO[] };
}> {
  const data = await SputnikService.getDaoList(query);

  return {
    props: {
      data
    }
  };
}

export default BrowseAllDaos;

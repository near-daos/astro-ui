import { DAO } from 'types/dao';
import { SputnikService } from 'services/SputnikService';
import { getActiveProposalsCountByDao } from 'hooks/useAllProposals';

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
  props: { data: DAO[] };
}> {
  const data = await SputnikService.getDaoList(query);
  const proposals = await SputnikService.getProposals(undefined, 0, 500);
  const activeProposalsByDao = getActiveProposalsCountByDao(proposals);

  return {
    props: {
      data: data.map(item => ({
        ...item,
        proposals: activeProposalsByDao[item.id] ?? 0
      }))
    }
  };
}

export default AllDaosPage;

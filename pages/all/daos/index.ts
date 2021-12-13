import { DAO } from 'types/dao';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDaosList } from 'features/daos/helpers';
import AllDaosPage from './AllDaosPage';

interface GetDaoListQuery {
  sort?: string;
  offset?: number;
  limit?: number;
}

export async function getServerSideProps({
  query,
  locale = 'en',
}: {
  query: GetDaoListQuery;
  locale: string;
}): Promise<{
  props: { data: DAO[]; total: number };
}> {
  const { daos: data, total } = await getDaosList({
    offset: 0,
    limit: 20,
    sort: (query.sort as string) ?? '',
  });

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      data,
      total,
    },
  };
}

export default AllDaosPage;

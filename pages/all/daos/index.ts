import { DaoFeedItem } from 'types/dao';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDaosList } from 'features/daos/helpers';
import nextI18NextConfig from 'next-i18next.config.js';

import AllDaosPage from './AllDaosPage';

interface GetDaoListQuery {
  sort?: string;
  offset?: number;
  limit?: number;
  daosView?: string;
}

export async function getServerSideProps({
  query,
  locale = 'en',
}: {
  query: GetDaoListQuery;
  locale: string;
}): Promise<{
  props: { data: DaoFeedItem[]; total: number };
}> {
  const daosView = query.daosView ? (query.daosView as string) : 'active';

  const { daos: data, total } = await getDaosList({
    offset: 0,
    limit: 20,
    sort: (query.sort as string) ?? '',
    filter:
      daosView === 'active'
        ? 'status||$eq||Active'
        : 'status||$in||Active,Inactive',
  });

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      data,
      total,
    },
  };
}

export default AllDaosPage;

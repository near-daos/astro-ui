import { DaoFeedItem } from 'types/dao';
import { getClient } from 'utils/launchdarkly-server-client';
import {
  getDaosList,
  getDaosListFromOpenSearch,
  getFilterValue,
} from 'features/daos/helpers';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

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
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);
  const client = await getClient();
  const useOpenSearchDataApi = await client.variation(
    'use-open-search-data-api',
    {
      key: account ?? '',
    },
    false
  );

  const daosView = query.daosView ? (query.daosView as string) : 'active';

  const fetcher = useOpenSearchDataApi
    ? getDaosListFromOpenSearch
    : getDaosList;

  const { daos: data, total } = await fetcher({
    offset: 0,
    limit: 20,
    sort: query.sort as string,
    filter: getFilterValue(useOpenSearchDataApi, daosView),
  });

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      data,
      total,
    },
  };
}

export default AllDaosPage;

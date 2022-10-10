import { GetServerSideProps } from 'next';
import { getClient } from 'utils/launchdarkly-server-client';
import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';
import { OpenSearchApiService } from 'services/SearchService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { DaoFeedItem } from 'types/dao';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);
  const client = await getClient();
  const useOpenSearchDataApi = await client.variation(
    'use-open-search-data-api',
    {
      key: account ?? '',
    },
    false
  );

  let accountDaos: DaoFeedItem[] = [];

  if (account) {
    accountDaos = useOpenSearchDataApi
      ? await new OpenSearchApiService().getAccountDaos(account)
      : await SputnikHttpService.getAccountDaos(account);
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      accountDaos,
    },
  };
};

export default MyDaosPage;

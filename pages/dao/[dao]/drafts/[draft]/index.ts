import { GetServerSideProps } from 'next';
// eslint-disable-next-line camelcase
import { unstable_serialize } from 'swr';

import { CookieService } from 'services/CookieService';
import { DraftsService } from 'services/DraftsService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';
import { getClient } from 'utils/launchdarkly-server-client';
import { fetcher as getDraft } from 'services/ApiService/hooks/useDraft';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  const draftService = new DraftsService();

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const accountId = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const client = await getClient();
  const flags = await client.allFlagsState({
    key: accountId ?? '',
  });
  const useOpenSearchDataApi = flags.getFlagValue('use-open-search-data-api');

  const daoId = query.dao as string;
  const draftId = query.draft as string;

  const daoContext = await getDaoContext(accountId, daoId as string);

  const dao = daoContext?.dao;

  const draft = useOpenSearchDataApi
    ? await getDraft('draft', daoId, draftId, accountId)
    : await draftService.getDraft(draftId, dao, accountId);

  if (!draft || !daoContext) {
    return {
      props: {
        ...(await getTranslations(locale)),
      },
      redirect: {
        permanent: true,
        destination: `/dao/${daoId}/drafts`,
      },
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      dao,
      draft,
      daoContext,
      fallback: {
        [unstable_serialize(['draft', daoId, draftId, accountId])]: draft,
      },
    },
  };
};

export { default } from './DraftPage';

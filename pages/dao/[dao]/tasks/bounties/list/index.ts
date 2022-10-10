import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { BountiesListPageProps } from './BountiesListPage';

export const getServerSideProps: GetServerSideProps<
  BountiesListPageProps
> = async ({ req, query, locale = 'en' }) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, bountiesContext] = await Promise.all([
    getDaoContext(account, daoId),
    SputnikHttpService.getBountiesContext(daoId, account, {
      bountySort: query.bountySort ? (query.bountySort as string) : null,
      bountyFilter: query.bountyFilter ? (query.bountyFilter as string) : null,
      bountyPhase: null,
      limit: 1000 + Number((Math.random() * 100).toFixed(0)),
    }),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      daoContext,
      bountiesContext: bountiesContext?.data || [],
      ...(await getDefaultAppVersion()),
    },
  };
};

export { default } from './BountiesListPage';

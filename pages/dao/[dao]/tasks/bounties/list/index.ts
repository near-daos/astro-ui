import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';
import { getDaoContext } from 'features/daos/helpers';

import { BountiesListPageProps } from './BountiesListPage';

export const getServerSideProps: GetServerSideProps<BountiesListPageProps> = async ({
  req,
  query,
  locale = 'en',
}) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, bountiesContext] = await Promise.all([
    getDaoContext(account, daoId),
    SputnikHttpService.getBountiesContext(daoId, account, {
      bountySort: query.bountySort ? (query.bountySort as string) : null,
      bountyFilter: query.bountyFilter ? (query.bountyFilter as string) : null,
      bountyPhase: null,
    }),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      daoContext,
      bountiesContext: bountiesContext?.data || [],
    },
  };
};

export { default } from './BountiesListPage';

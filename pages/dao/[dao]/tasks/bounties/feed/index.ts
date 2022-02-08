import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

import { CookieService } from 'services/CookieService';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ACCOUNT_COOKIE } from 'constants/cookies';

import { BountiesFeedPageProps } from './BountiesFeedPage';

export const getServerSideProps: GetServerSideProps<BountiesFeedPageProps> = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const { bountySort, bountyFilter, bountyPhase, dao: daoId } = query;

  const [daoContext, bountiesContext] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId as string),
    SputnikHttpService.getBountiesContext(daoId as string, account, {
      bountySort: bountySort ? (bountySort as string) : null,
      bountyFilter: bountyFilter ? (bountyFilter as string) : null,
      bountyPhase: bountyPhase ? (bountyPhase as string) : null,
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
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
      bountiesContext,
    },
  };
};

export { default } from './BountiesFeedPage';

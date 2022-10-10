import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';

import { CookieService } from 'services/CookieService';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ACCOUNT_COOKIE } from 'constants/cookies';

import { getTranslations } from 'utils/getTranslations';

import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { BountiesPageProps } from './BountiesPage';

export const getServerSideProps: GetServerSideProps<
  BountiesPageProps
> = async ({ req, query, locale = 'en' }) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const { bountySort, bountyFilter, bountyPhase } = query;

  const [bountiesContext] = await Promise.all([
    SputnikHttpService.getBountiesContext('', account, {
      bountySort: bountySort ? (bountySort as string) : null,
      bountyFilter: bountyFilter ? (bountyFilter as string) : null,
      bountyPhase: bountyPhase ? (bountyPhase as string) : null,
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
    }),
  ]);

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      bountiesContext,
    },
  };
};

export { default } from './BountiesPage';

import { GetServerSideProps } from 'next';

import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';

import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';

import { getTranslations } from 'utils/getTranslations';

import { GroupPageProps } from './GroupPage';

export const getServerSideProps: GetServerSideProps<GroupPageProps> = async ({
  req,
  query,
  locale = 'en',
}) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, membersStats] = await Promise.all([
    getDaoContext(account, daoId),
    SputnikHttpService.getDaoMembersStats(daoId),
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
      membersStats,
    },
  };
};

export { default } from './GroupPage';

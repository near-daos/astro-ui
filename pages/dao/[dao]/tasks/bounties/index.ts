import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

import { BountiesPageProps } from './BountiesPage';

export const getServerSideProps: GetServerSideProps<BountiesPageProps> = async ({
  req,
  query,
  locale = 'en',
}) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, bounties, bountyDoneProposals] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId),
    SputnikHttpService.getBountiesByDaoId(daoId),
    SputnikHttpService.getActiveBountyDoneProposalsByDaoId(daoId),
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
      initialBounties: bounties,
      bountyDoneProposals,
    },
  };
};

export { default } from './BountiesPage';

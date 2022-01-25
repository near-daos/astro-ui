import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoId = query.dao as string;
  const bountyId = query.bounty as string;

  const [dao, bountyContext, daoContext] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getBountyContextById(bountyId),
    SputnikHttpService.getDaoContext(account, daoId as string),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  const proposalId = bountyContext.proposal.id;

  const proposal = await SputnikHttpService.getProposalById(proposalId);

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      dao,
      bountyContext,
      proposal,
      daoContext,
    },
  };
};

export { default } from './BountyPage';

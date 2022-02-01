import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { extractMembersFromDao } from 'astro_2.0/features/CreateProposal/helpers';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoId = query.dao as string;
  const proposalId = query.proposal as string;

  const [dao, proposal, membersStats, daoContext] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getProposalById(proposalId, account),
    SputnikHttpService.getDaoMembersStats(daoId),
    SputnikHttpService.getDaoContext(account, daoId as string),
  ]);

  const members = dao ? extractMembersFromDao(dao, membersStats) : [];

  if (!daoContext || !proposal) {
    return {
      props: {
        ...(await serverSideTranslations(
          locale,
          ['common', 'notificationsPage'],
          nextI18NextConfig
        )),
      },
      redirect: {
        permanent: true,
        destination: `/dao/${daoId}/proposals`,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      dao,
      proposal,
      members,
      daoContext,
    },
  };
};

export { default } from './ProposalPage';

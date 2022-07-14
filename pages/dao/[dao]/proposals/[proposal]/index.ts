import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { extractMembersFromDao } from 'astro_2.0/features/CreateProposal/helpers';
import { getDaoContext } from 'features/daos/helpers';
import {
  getActiveTokenHolders,
  getTokensVotingPolicyDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import { getClient } from 'utils/launchdarkly-server-client';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoId = query.dao as string;
  const proposalId = query.proposal as string;

  const client = await getClient();
  const governanceToken = await client.variation(
    'governance-token',
    {
      key: account ?? '',
    },
    false
  );

  const [proposal, membersStats, daoContext, delegations] = await Promise.all([
    SputnikHttpService.getProposalById(proposalId, account),
    SputnikHttpService.getDaoMembersStats(daoId),
    getDaoContext(account, daoId as string),
    SputnikHttpService.getDelegations(daoId, governanceToken),
  ]);

  const dao = daoContext?.dao;

  const { balance } = getTokensVotingPolicyDetails(dao);
  const activeTokenHolders = getActiveTokenHolders(delegations, balance);

  const members = dao
    ? extractMembersFromDao(dao, membersStats, activeTokenHolders)
    : [];

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

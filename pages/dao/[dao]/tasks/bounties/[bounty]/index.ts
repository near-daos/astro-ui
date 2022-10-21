import { GetServerSideProps } from 'next';

import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { fetcher as getBountyContext } from 'services/ApiService/hooks/useBounty';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { getDaoContext } from 'features/daos/helpers';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';
import { getClient } from 'utils/launchdarkly-server-client';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const client = await getClient();
  const flags = await client.allFlagsState({
    key: account ?? '',
  });
  const useOpenSearchDataApi = flags.getFlagValue('use-open-search-data-api');

  const daoId = query.dao as string;
  const bountyId = query.bounty as string;

  const [bountyContext, daoContext] = await Promise.all([
    useOpenSearchDataApi
      ? getBountyContext('bounty', bountyId)
      : SputnikHttpService.getBountyContextById(bountyId, account),
    getDaoContext(account, daoId as string),
  ]);

  const dao = daoContext?.dao;

  if (!daoContext || !bountyContext || !dao) {
    return {
      notFound: true,
    };
  }

  const userBountyDoneProposal = bountyContext.bounty?.bountyDoneProposals.find(
    item => item.proposer === account && item.status === 'InProgress'
  );

  let bountyDoneProposal = null;

  if (userBountyDoneProposal) {
    bountyDoneProposal = await SputnikHttpService.getProposalById(
      userBountyDoneProposal.id,
      account
    );
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      dao,
      bountyContext,
      proposal: bountyContext.proposal,
      daoContext,
      bountyDoneProposal,
      ...(await getDefaultAppVersion()),
    },
  };
};

export { default } from './BountyPage';

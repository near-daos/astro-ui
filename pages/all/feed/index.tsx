import React from 'react';
import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ProposalsFeedStatuses } from 'types/proposal';
import { ProposalsQueries } from 'services/sputnik/types/proposals';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { Feed } from 'astro_2.0/features/Feed';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE, FEED_STATUS_COOKIE } from 'constants/cookies';
import Head from 'next/head';

const MyFeedPage = (props: React.ComponentProps<typeof Feed>): JSX.Element => (
  <>
    <Head>
      <title>Global feed</title>
    </Head>
    <Feed {...props} title="Global Feed" />
  </>
);

export const getServerSideProps: GetServerSideProps<React.ComponentProps<
  typeof Feed
>> = async ({ query, locale = 'en' }) => {
  const accountId = CookieService.get(ACCOUNT_COOKIE);
  const lastFeedStatus = CookieService.get(FEED_STATUS_COOKIE);
  const {
    category,
    status = !lastFeedStatus || lastFeedStatus === 'voteNeeded'
      ? ProposalsFeedStatuses.Active
      : lastFeedStatus,
  } = query as ProposalsQueries;
  const res = await SputnikHttpService.getProposalsList({
    category,
    status,
    limit: LIST_LIMIT_DEFAULT,
    daoFilter: 'All DAOs',
    accountId,
  });

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      initialProposals: res,
      initialProposalsStatusFilterValue: status,
    },
  };
};

export default MyFeedPage;

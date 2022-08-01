import React, { ReactNode } from 'react';
import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { ProposalsFeedStatuses } from 'types/proposal';
import { ProposalsQueries } from 'services/sputnik/types/proposals';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { Feed } from 'astro_2.0/features/Feed';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE, FEED_STATUS_COOKIE } from 'constants/cookies';

import { getAppVersion, useAppVersion } from 'hooks/useAppVersion';

import { FeedLayout } from 'astro_3.0/features/FeedLayout';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { ProposalsFeed } from 'astro_3.0/features/ProposalsFeed';
import { Page } from 'pages/_app';

const GlobalFeedPage: Page<React.ComponentProps<typeof Feed>> = props => {
  const { appVersion } = useAppVersion();

  return (
    <>
      <Head>
        <title>My proposals feed</title>
      </Head>
      {appVersion === 3 ? (
        <ProposalsFeed {...props} />
      ) : (
        <Feed {...props} title="Global Feed" />
      )}
    </>
  );
};

GlobalFeedPage.getLayout = function getLayout(page: ReactNode) {
  const appVersion = getAppVersion();

  return (
    <>
      {appVersion === 3 && <FeedLayout />}
      <MainLayout>{page}</MainLayout>
    </>
  );
};

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

export default GlobalFeedPage;

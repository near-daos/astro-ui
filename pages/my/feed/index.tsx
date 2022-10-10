import React, { ReactNode } from 'react';
import { GetServerSideProps } from 'next';

import { ProposalsFeedStatuses } from 'types/proposal';
import { Feed } from 'astro_2.0/features/Feed';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ALL_FEED_URL } from 'constants/routing';
import Head from 'next/head';

import { FeedLayout } from 'astro_3.0/features/FeedLayout';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { useAppVersion } from 'hooks/useAppVersion';
import { ProposalsFeed } from 'astro_3.0/features/ProposalsFeed';
import { Page } from 'pages/_app';
import { CreateProposalSelector } from 'astro_3.0/components/CreateProposalSelector';

import { getTranslations } from 'utils/getTranslations';

import { useTranslation } from 'next-i18next';
import { getClient } from 'utils/launchdarkly-server-client';
import styles from './MyFeedPage.module.scss';

const MyFeedPage: Page<
  React.ComponentProps<typeof Feed> & { defaultApplicationUiVersion: number }
> = ({ defaultApplicationUiVersion, ...props }) => {
  const { appVersion: selectedAppVersion } = useAppVersion();
  const { t } = useTranslation();
  const appVersion = selectedAppVersion || defaultApplicationUiVersion;

  return (
    <>
      <Head>
        <title>My proposals feed</title>
      </Head>
      {appVersion === 3 ? (
        <ProposalsFeed {...props} className={styles.root}>
          <CreateProposalSelector />
        </ProposalsFeed>
      ) : (
        <MainLayout>
          <Feed {...props} title={t('myProposalsFeed')} />
        </MainLayout>
      )}
    </>
  );
};

MyFeedPage.getLayout = function getLayout(page: ReactNode) {
  return (
    <>
      <FeedLayout />
      {page}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  React.ComponentProps<typeof Feed>
> = async ({ query, locale = 'en' }) => {
  const { category, status = ProposalsFeedStatuses.VoteNeeded } =
    query as ProposalsQueries;
  const accountId = CookieService.get(ACCOUNT_COOKIE);
  const client = await getClient();

  const defaultApplicationUiVersion = await client.variation(
    'default-application-ui-version',
    {
      key: accountId ?? '',
    },
    false
  );

  if (!accountId) {
    return {
      redirect: {
        permanent: true,
        destination: ALL_FEED_URL,
      },
    };
  }

  let res = await SputnikHttpService.getProposalsListByAccountId(
    {
      category,
      status,
      limit: LIST_LIMIT_DEFAULT,
      daoFilter: 'All DAOs',
      accountId,
    },
    accountId
  );

  // If no proposals found and it is not because of filter -> redirect to global feed
  if (res?.data?.length === 0) {
    res = await SputnikHttpService.getProposalsListByAccountId(
      {
        category,
        status: ProposalsFeedStatuses.All,
        limit: LIST_LIMIT_DEFAULT,
        daoFilter: 'All DAOs',
        accountId,
      },
      accountId
    );

    if (res?.data?.length === 0) {
      return {
        redirect: {
          destination: ALL_FEED_URL,
          permanent: true,
        },
      };
    }
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      initialProposals: res,
      initialProposalsStatusFilterValue: status,
      defaultApplicationUiVersion,
    },
  };
};

export default MyFeedPage;

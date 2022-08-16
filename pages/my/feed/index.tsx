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
import { getAppVersion, useAppVersion } from 'hooks/useAppVersion';
import { ProposalsFeed } from 'astro_3.0/features/ProposalsFeed';
import { Page } from 'pages/_app';
import { AllTokensProvider } from 'context/AllTokensContext';

import { getTranslations } from 'utils/getTranslations';
import { useTranslation } from 'next-i18next';

import styles from './MyFeedPage.module.scss';

const MyFeedPage: Page<React.ComponentProps<typeof Feed>> = props => {
  const { appVersion } = useAppVersion();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>My proposals feed</title>
      </Head>
      <AllTokensProvider>
        <AllTokensProvider>
          {appVersion === 3 ? (
            <ProposalsFeed {...props} className={styles.root} />
          ) : (
            <MainLayout>
              <Feed {...props} title={t('myProposalsFeed')} />
            </MainLayout>
          )}
        </AllTokensProvider>
      </AllTokensProvider>
    </>
  );
};

MyFeedPage.getLayout = function getLayout(page: ReactNode) {
  const appVersion = getAppVersion();

  return (
    <>
      {appVersion === 3 && <FeedLayout />}
      {page}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<React.ComponentProps<
  typeof Feed
>> = async ({ query, locale = 'en' }) => {
  const {
    category,
    status = ProposalsFeedStatuses.VoteNeeded,
  } = query as ProposalsQueries;
  const accountId = CookieService.get(ACCOUNT_COOKIE);

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
    },
  };
};

export default MyFeedPage;

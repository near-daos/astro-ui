import Head from 'next/head';
import React, { ReactNode } from 'react';
import { GetServerSideProps } from 'next';

import { ProposalsFeedStatuses } from 'types/proposal';
import { ProposalsQueries } from 'services/sputnik/types/proposals';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { Feed } from 'astro_2.0/features/Feed';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

import { getAppVersion, useAppVersion } from 'hooks/useAppVersion';

import { FeedLayout } from 'astro_3.0/features/FeedLayout';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { ProposalsFeed } from 'astro_3.0/features/ProposalsFeed';
import { Page } from 'pages/_app';
import { AllTokensProvider } from 'context/AllTokensContext';

import { getTranslations } from 'utils/getTranslations';
import { useTranslation } from 'next-i18next';

import styles from './GlobalFeedPage.module.scss';

const GlobalFeedPage: Page<React.ComponentProps<typeof Feed>> = props => {
  const { appVersion } = useAppVersion();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>My proposals feed</title>
      </Head>
      <AllTokensProvider>
        {appVersion === 3 ? (
          <ProposalsFeed {...props} className={styles.root} />
        ) : (
          <MainLayout>
            <Feed {...props} title={t('globalFeed')} />
          </MainLayout>
        )}
      </AllTokensProvider>
    </>
  );
};

GlobalFeedPage.getLayout = function getLayout(page: ReactNode) {
  const appVersion = getAppVersion();

  return (
    <>
      {appVersion === 3 && <FeedLayout />}
      {page}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  React.ComponentProps<typeof Feed>
> = async ({ query, locale = 'en' }) => {
  const accountId = CookieService.get(ACCOUNT_COOKIE);
  const { category, status = ProposalsFeedStatuses.Active } =
    query as ProposalsQueries;
  const res = await SputnikHttpService.getProposalsList({
    category,
    status,
    limit: LIST_LIMIT_DEFAULT,
    daoFilter: 'All DAOs',
    accountId,
  });

  return {
    props: {
      ...(await getTranslations(locale)),
      initialProposals: res,
      initialProposalsStatusFilterValue: status,
    },
  };
};

export default GlobalFeedPage;

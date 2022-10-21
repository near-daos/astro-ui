import React, { ReactNode } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getClient } from 'utils/launchdarkly-server-client';

import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { ALL_FEED_URL } from 'constants/routing';

import { Page } from 'pages/_app';
import { Feed } from 'astro_2.0/features/Feed';
import { FeedLayout } from 'astro_3.0/features/FeedLayout';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { CreateProposalSelector } from 'astro_3.0/components/CreateProposalSelector';
import { ProposalsFeedNext } from 'astro_3.0/features/ProposalsFeedNext';

import { useAppVersion } from 'hooks/useAppVersion';
import { getTranslations } from 'utils/getTranslations';

import { ProposalsFeed } from 'astro_3.0/features/ProposalsFeed';
import { ProposalsFeedStatuses } from 'types/proposal';
import { useFlags } from 'launchdarkly-react-client-sdk';

import styles from './MyFeedPage.module.scss';

const MyFeedPage: Page<{ defaultApplicationUiVersion: number }> = ({
  defaultApplicationUiVersion,
  ...props
}) => {
  const { useOpenSearchDataApi } = useFlags();
  const { appVersion: selectedAppVersion } = useAppVersion();
  const { t } = useTranslation();
  const appVersion = selectedAppVersion || defaultApplicationUiVersion;

  function renderFeed() {
    if (useOpenSearchDataApi === undefined) {
      return null;
    }

    return useOpenSearchDataApi ? (
      <ProposalsFeedNext {...props} isMyFeed className={styles.root}>
        <CreateProposalSelector />
      </ProposalsFeedNext>
    ) : (
      <ProposalsFeed
        initialProposals={null}
        initialProposalsStatusFilterValue={ProposalsFeedStatuses.All}
      >
        <CreateProposalSelector />
      </ProposalsFeed>
    );
  }

  return (
    <>
      <Head>
        <title>My proposals feed</title>
      </Head>
      {appVersion === 3 ? (
        renderFeed()
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

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const accountId = CookieService.get(ACCOUNT_COOKIE);
  const client = await getClient();

  const flags = await client.allFlagsState({
    key: accountId ?? '',
  });

  const defaultApplicationUiVersion = flags.getFlagValue(
    'default-application-ui-version'
  );

  if (!accountId) {
    return {
      redirect: {
        permanent: true,
        destination: ALL_FEED_URL,
      },
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      defaultApplicationUiVersion,
    },
  };
};

export default MyFeedPage;

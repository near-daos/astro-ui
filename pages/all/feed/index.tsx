import Head from 'next/head';
import React, { ReactNode } from 'react';
import { GetServerSideProps } from 'next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { Feed } from 'astro_2.0/features/Feed';

import { useAppVersion } from 'hooks/useAppVersion';

import { CreateProposalSelector } from 'astro_3.0/components/CreateProposalSelector';
import { FeedLayout } from 'astro_3.0/features/FeedLayout';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { Page } from 'pages/_app';

import { getTranslations } from 'utils/getTranslations';
import { useTranslation } from 'next-i18next';

import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { ProposalsFeed } from 'astro_3.0/features/ProposalsFeed';
import { ProposalsFeedNext } from 'astro_3.0/features/ProposalsFeedNext';

import { ProposalsFeedStatuses } from 'types/proposal';

import styles from './GlobalFeedPage.module.scss';

const GlobalFeedPage: Page<{ defaultApplicationUiVersion: number }> = ({
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
      <ProposalsFeedNext {...props} className={styles.root}>
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
        <title>All proposals feed</title>
      </Head>
      {appVersion === 3 ? (
        renderFeed()
      ) : (
        <MainLayout>
          <Feed {...props} title={t('globalFeed')} />
        </MainLayout>
      )}
    </>
  );
};

GlobalFeedPage.getLayout = function getLayout(page: ReactNode) {
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
  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
    },
  };
};

export default GlobalFeedPage;

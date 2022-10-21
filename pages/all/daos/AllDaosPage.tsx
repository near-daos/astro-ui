import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { DaoFeedItem } from 'types/dao';

import { Page } from 'pages/_app';

import { DaosList } from 'astro_2.0/components/DaosList';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { Daos } from 'astro_2.0/features/Daos';
import { DaosNext } from 'astro_3.0/features/DaosNext';

interface BrowseAllDaosProps {
  data: DaoFeedItem[];
  total: number;
}

const AllDaosPage: Page<BrowseAllDaosProps> = ({
  data: initialData = [],
  total: totalItemsAvailable,
}) => {
  const { useOpenSearchDataApi } = useFlags();

  function renderContent() {
    if (useOpenSearchDataApi === undefined) {
      return null;
    }

    return useOpenSearchDataApi ? (
      <DaosNext />
    ) : (
      <Daos total={totalItemsAvailable} data={initialData} />
    );
  }

  return (
    <DaosList label="allDaos">
      <Head>
        <title>All Daos</title>
      </Head>
      {renderContent()}
    </DaosList>
  );
};

AllDaosPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default AllDaosPage;

import React, { ReactNode } from 'react';
import { Loader } from 'components/loader';

import { DaoFeedItem } from 'types/dao';

import { Page } from 'pages/_app';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { CfcLibraryNext } from 'astro_3.0/features/CfcLibraryNext/CfcLibraryNext';
import { CfcLibraryLegacy } from 'astro_2.0/features/CfcLibraryLegacy';

interface Props {
  accountDaos: DaoFeedItem[];
}

const CfcLibraryPage: Page<Props> = ({ accountDaos }) => {
  const { useOpenSearchDataApi } = useFlags();

  if (useOpenSearchDataApi === undefined) {
    return <Loader />;
  }

  if (useOpenSearchDataApi) {
    return <CfcLibraryNext />;
  }

  return <CfcLibraryLegacy accountDaos={accountDaos} />;
};

CfcLibraryPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default CfcLibraryPage;

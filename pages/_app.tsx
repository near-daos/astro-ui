import { SWRConfig } from 'swr';
import isEmpty from 'lodash/isEmpty';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import 'styles/globals.scss';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import CreateLayout from 'components/create-layout/CreateLayout';

import { AuthWrapper } from 'context/AuthContext';

import { useDAOList } from 'hooks/useDAOList';
import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';

import { SputnikService } from 'services/SputnikService';

function usePageLayout(): React.FC {
  const router = useRouter();

  if (router.route.match('/create-dao')) {
    return CreateLayout;
  }

  return PageLayout;
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const [walletInitialized, setWalletInitialized] = useState(false);

  const Layout = usePageLayout();

  useMount(async () => {
    await SputnikService.init();
    setWalletInitialized(true);
  });

  const { isLoading: isLoadingDAOList, daos } = useDAOList(walletInitialized);
  const { daos: userDaos } = useDaoListPerCurrentUser(walletInitialized);

  useEffect(() => {
    if (!isLoadingDAOList && isEmpty(userDaos)) {
      router.push('/all-communities');
    }
    // eslint-disable-next-line
  }, [isLoadingDAOList]);

  if (walletInitialized && !isLoadingDAOList) {
    return (
      <SWRConfig value={{ fallback: { '/daos': daos } }}>
        <AuthWrapper>
          <ModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalProvider>
        </AuthWrapper>
      </SWRConfig>
    );
  }

  return <div />;
}

export default MyApp;

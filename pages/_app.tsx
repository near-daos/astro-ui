import { useDAOList } from 'hooks/useDAOList';
import { useMount } from 'react-use';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import type { AppProps } from 'next/app';

import { store } from 'store';
import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import CreateLayout from 'components/create-layout/CreateLayout';

import { AuthWrapper } from 'context/AuthContext';

import { SputnikService } from 'services/SputnikService';

import 'styles/globals.scss';
import { SWRConfig } from 'swr';

function usePageLayout(): React.FC {
  const router = useRouter();

  if (router.route.match('/create-dao')) {
    return CreateLayout;
  }

  return PageLayout;
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [walletInitialized, setWalletInitialized] = useState(false);

  const Layout = usePageLayout();

  useMount(async () => {
    await SputnikService.init();
    setWalletInitialized(true);
  });

  const { isLoading: isLoadingDAOList, daos } = useDAOList(walletInitialized);

  if (walletInitialized && !isLoadingDAOList) {
    return (
      <SWRConfig value={{ fallback: { '/daos': daos } }}>
        <Provider store={store}>
          <AuthWrapper>
            <ModalProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </AuthWrapper>
        </Provider>
      </SWRConfig>
    );
  }

  return <div />;
}

export default MyApp;

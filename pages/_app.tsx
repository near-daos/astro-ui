import { useMount } from 'react-use';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import type { AppProps } from 'next/app';

import { store } from 'store';
import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import CreateLayout from 'components/create-layout/CreateLayout';
import { DataPrefetch } from 'features/data-prefetch/DataPrefetch';

import { AuthWrapper } from 'context/AuthContext';

import { SputnikService } from 'services/SputnikService';

import 'styles/globals.scss';

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

  if (walletInitialized) {
    return (
      <Provider store={store}>
        <DataPrefetch />
        <AuthWrapper>
          <ModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalProvider>
        </AuthWrapper>
      </Provider>
    );
  }

  return <div />;
}

export default MyApp;

import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import CreateLayout from 'components/create-layout/CreateLayout';

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
      <AuthWrapper>
        <ModalProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ModalProvider>
      </AuthWrapper>
    );
  }

  return <div />;
}

export default MyApp;

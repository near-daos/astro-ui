import CreateLayout from 'components/create-layout/CreateLayout';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';

import { AuthWrapper } from 'context/AuthContext';
import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';
import type { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';

import { SputnikService } from 'services/SputnikService';
import 'styles/globals.scss';
import { SWRConfig } from 'swr';
import { useDAOList } from 'hooks/useDAOList';
import { CookieService } from 'services/CookieService';

function usePageLayout(): React.FC {
  const router = useRouter();

  if (router.route.match('/create-dao')) {
    return CreateLayout;
  }

  return PageLayout;
}

function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const [walletInitialized, setWalletInitialized] = useState(false);
  const account = CookieService.get('account');

  const Layout = usePageLayout();

  useMount(async () => {
    SputnikService.init();
    setWalletInitialized(true);
  });

  const { daos } = useDAOList(walletInitialized);
  const { daos: userDaos } = useDaoListPerCurrentUser();

  useEffect(() => {
    if (router.pathname === '/' && userDaos != null && userDaos.length) {
      router.push('/home');
    } else if (router.pathname === '/' && userDaos != null) {
      router.push('/all-communities');
    } else if (!walletInitialized && router.pathname === '/') {
      router.push('/all-communities');
    }
  }, [router, userDaos, walletInitialized]);

  useEffect(() => {
    if (!account && SputnikService.getAccountId()) {
      SputnikService.logout().then(() => {
        router.push('/all-communities');
      });
    }
  }, [account, router]);

  if (walletInitialized) {
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

App.getInitialProps = async ({ ctx }: AppContext) => {
  CookieService.initServerSideCookies(ctx.req?.headers.cookie || null);

  return {};
};

export default App;

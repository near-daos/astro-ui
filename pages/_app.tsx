import { SWRConfig } from 'swr';
import sortBy from 'lodash/sortBy';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { AppContext, AppProps } from 'next/app';

import { ALL_DAOS_URL, CREATE_DAO_URL } from 'constants/routing';

import { AuthWrapper } from 'context/AuthContext';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import CreateLayout from 'components/create-layout/CreateLayout';

import { AccountDataContext } from 'features/account-data';

import { SputnikService } from 'services/SputnikService';
import { CookieService } from 'services/CookieService';

import 'styles/globals.scss';

function usePageLayout(): React.FC {
  const router = useRouter();

  if (router.route.match(CREATE_DAO_URL)) {
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

  useEffect(() => {
    if (!account && SputnikService.getAccountId()) {
      SputnikService.logout().then(() => {
        router.push(ALL_DAOS_URL);
      });
    }
  }, [account, router]);

  if (walletInitialized) {
    return (
      <SWRConfig value={{ fallback: pageProps?.fallback || {} }}>
        <AuthWrapper>
          <ModalProvider>
            <AccountDataContext.Provider
              value={{ accountDaos: pageProps?.accountDaos }}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </AccountDataContext.Provider>
          </ModalProvider>
        </AuthWrapper>
      </SWRConfig>
    );
  }

  return <div />;
}

App.getInitialProps = async ({ ctx, router }: AppContext) => {
  const { req, res } = ctx;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>('account');

  if (account) {
    const data = await SputnikService.getAccountDaos(account);

    return {
      pageProps: {
        accountDaos: sortBy(data, 'id')
      }
    };
  }

  if (router.pathname === '/' && res != null) {
    res.writeHead(302, { location: ALL_DAOS_URL });
    res.end();

    return {
      daos: []
    };
  }

  return {};
};

export default App;

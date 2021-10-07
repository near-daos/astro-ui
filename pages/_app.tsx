import CreateLayout from 'components/create-layout/CreateLayout';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';

import { AuthWrapper } from 'context/AuthContext';
import type { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';

import { SputnikService } from 'services/SputnikService';
import 'styles/globals.scss';
import { SWRConfig } from 'swr';
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

  useEffect(() => {
    if (!account && SputnikService.getAccountId()) {
      SputnikService.logout().then(() => {
        router.push('/all-communities');
      });
    }
  }, [account, router]);

  if (walletInitialized) {
    return (
      <SWRConfig value={{ fallback: pageProps?.fallback || {} }}>
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

App.getInitialProps = async ({ ctx, router }: AppContext) => {
  CookieService.initServerSideCookies(ctx.req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>('account');

  const { res } = ctx;

  if (account) {
    const data = await SputnikService.getAccountDaos(account);

    if (router.pathname === '/' && res != null) {
      if (data.length > 0) {
        res.writeHead(302, { location: `/home` });
      } else {
        res.writeHead(302, { location: '/all-communities' });
      }

      res.end();
    }

    return {
      pageProps: {
        fallback: { [`/daos/account-daos/${account}`]: data }
      }
    };
  }

  if (router.pathname === '/' && res != null) {
    res.writeHead(302, { location: '/all-communities' });
    res.end();

    return {
      daos: []
    };
  }

  return {};
};

export default App;

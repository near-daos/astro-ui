import React from 'react';
import { useRouter } from 'next/router';
import type { AppContext, AppProps } from 'next/app';

import { SWRConfig } from 'swr';
import { useMount } from 'react-use';

import { CREATE_DAO_URL, MY_FEED_URL, ALL_FEED_URL } from 'constants/routing';

import { AuthWrapper } from 'context/AuthContext';
import { CustomTokensProvider } from 'context/CustomTokensContext';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import CreateLayout from 'components/create-layout/CreateLayout';

import { SputnikService } from 'services/SputnikService';
import { CookieService } from 'services/CookieService';

import { ACCOUNT_COOKIE, DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';

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
  const Layout = usePageLayout();

  useMount(async () => {
    SputnikService.init();

    CookieService.set(
      ACCOUNT_COOKIE,
      SputnikService.getAccountId(),
      DEFAULT_OPTIONS
    );
    CookieService.set(DAO_COOKIE, router.query.dao, DEFAULT_OPTIONS);
  });

  return (
    <SWRConfig value={{ fallback: pageProps?.fallback || {} }}>
      <AuthWrapper>
        <CustomTokensProvider>
          <ModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalProvider>
        </CustomTokensProvider>
      </AuthWrapper>
    </SWRConfig>
  );
}

App.getInitialProps = async ({ ctx, router }: AppContext) => {
  const { req, res } = ctx;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  if (account && res && router.pathname === '/') {
    res.writeHead(302, { location: MY_FEED_URL });
    res.end();

    return {};
  }

  if (router.pathname === '/' && res != null && !account) {
    res.writeHead(302, { location: ALL_FEED_URL });
    res.end();

    return {
      daos: []
    };
  }

  return {};
};

export default App;

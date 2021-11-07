import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { AppContext, AppProps } from 'next/app';

import { SWRConfig } from 'swr';
import { useMount } from 'react-use';

import { ALL_DAOS_URL, CREATE_DAO_URL, MY_FEED_URL } from 'constants/routing';

import { AuthWrapper } from 'context/AuthContext';
import { CustomTokensProvider } from 'context/CustomTokensContext';

import { ModalProvider } from 'components/modal';
import PageLayout from 'components/page-layout/PageLayout';
import CreateLayoutNew from 'astro_2.0/components/CreateLayout/CreateLayout';
import { MobileNav } from 'astro_2.0/components/navigation/MobileNav';
import { SearchResults } from 'features/search/search-results';

import { SputnikNearService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';

import { ACCOUNT_COOKIE, DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';

import 'styles/globals.scss';

const AppUILayout: React.FC = ({ children }) => {
  const router = useRouter();

  const Layout = router.route.match(CREATE_DAO_URL)
    ? CreateLayoutNew
    : PageLayout;

  return <Layout>{children}</Layout>;
};

function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  useMount(async () => {
    SputnikNearService.init();

    CookieService.set(
      ACCOUNT_COOKIE,
      SputnikNearService.getAccountId(),
      DEFAULT_OPTIONS
    );
    CookieService.set(DAO_COOKIE, router.query.dao, DEFAULT_OPTIONS);
  });

  return (
    <SWRConfig value={{ fallback: pageProps?.fallback || {} }}>
      <AuthWrapper>
        <CustomTokensProvider>
          <ModalProvider>
            <SearchResults>
              <Head>
                <title>Astro</title>
              </Head>

              <AppUILayout>
                <Component {...pageProps} />
              </AppUILayout>

              <MobileNav />
            </SearchResults>
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
    res.writeHead(302, { location: ALL_DAOS_URL });
    res.end();

    return {
      daos: [],
    };
  }

  return {};
};

export default App;

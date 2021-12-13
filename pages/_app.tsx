import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { AppContext, AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

import { SWRConfig } from 'swr';
import { useMount } from 'react-use';

import { ALL_FEED_URL, MY_FEED_URL } from 'constants/routing';

import { AuthWrapper } from 'context/AuthContext';

import { ModalProvider } from 'components/modal';
import { PageLayout } from 'astro_2.0/components/PageLayout';
import { MobileNav } from 'astro_2.0/components/navigation/MobileNav';
import { SearchResults } from 'features/search/search-results';

import { SputnikNearService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';

import { ACCOUNT_COOKIE, DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';

import 'styles/globals.scss';

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
        <ModalProvider>
          <SearchResults>
            <Head>
              <title>Astro</title>
            </Head>

            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>

            <MobileNav />
          </SearchResults>
        </ModalProvider>
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
      daos: [],
    };
  }

  return {};
};

export default appWithTranslation(App);

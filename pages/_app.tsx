import React, { FunctionComponent, useEffect } from 'react';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from 'next-i18next.config';
import type { AppContext, AppProps } from 'next/app';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { appConfig as applicationConfig } from 'config';
import { useRouter } from 'next/router';
import { ALL_FEED_URL, MY_FEED_URL } from 'constants/routing';

import { AuthWrapper } from 'context/AuthContext';

import { ModalProvider } from 'components/modal';
import { PageLayout } from 'astro_2.0/components/PageLayout';
import { MobileNav } from 'astro_2.0/components/navigation/MobileNav';
import { SearchResults } from 'features/search/search-results';

import { CookieService } from 'services/CookieService';

import { ACCOUNT_COOKIE, DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';

import { SocketProvider } from 'context/SocketContext';

import { useIntercomAdjust } from 'hooks/useIntercomAdjust';

import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';
import { useAppInitialize } from 'hooks/useAppInitialize';

import 'styles/globals.scss';
import { AppMonitoring } from 'astro_2.0/features/AppMonitoring/AppMonitoring';

function App({ Component, pageProps }: AppProps): JSX.Element | null {
  const router = useRouter();
  const initialized = useAppInitialize();

  useEffect(() => {
    CookieService.set(DAO_COOKIE, router.query.dao, DEFAULT_OPTIONS);
  }, [router]);

  useIntercomAdjust();

  if (!initialized) {
    return null;
  }

  return (
    <>
      <AppMonitoring />
      <ModalProvider>
        <AuthWrapper>
          <SocketProvider>
            <SearchResults>
              <Head>
                <title>Astro</title>
              </Head>
              <PageLayout>
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </PageLayout>
              <MobileNav />
            </SearchResults>
          </SocketProvider>
        </AuthWrapper>
      </ModalProvider>
    </>
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

export default withLDProvider({
  clientSideID: applicationConfig.LAUNCHDARKLY_ID as string,
  reactOptions: {
    useCamelCaseFlagKeys: true,
  },
})(appWithTranslation(App, nextI18NextConfig) as FunctionComponent);

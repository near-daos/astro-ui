import React, { FunctionComponent, useEffect } from 'react';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import type { AppContext, AppProps } from 'next/app';
import { withLDProvider } from 'launchdarkly-react-client-sdk';

import nextI18NextConfig from 'next-i18next.config';
import { appConfig as applicationConfig } from 'config';

import { ModalProvider } from 'components/modal';
import { PageLayout } from 'astro_2.0/components/PageLayout';
import { MobileNav } from 'astro_2.0/components/navigation/MobileNav';
import { SearchResults } from 'features/search/search-results';

import { SocketProvider } from 'context/SocketContext';

import { useIntercomAdjust } from 'hooks/useIntercomAdjust';

import 'styles/globals.scss';
import { useRouter } from 'next/router';
import { WrappedWalletContext } from 'context/WalletContext';
import { CookieService } from 'services/CookieService';
import { DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';
import { AppMonitoring } from 'astro_2.0/features/AppMonitoring/AppMonitoring';
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';
import { useAppInitialize } from 'hooks/useAppInitialize';

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
      <WrappedWalletContext>
        <ModalProvider>
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
        </ModalProvider>
      </WrappedWalletContext>
    </>
  );
}

App.getInitialProps = async ({ ctx }: AppContext) => {
  const { req } = ctx;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  return {};
};

export default withLDProvider({
  clientSideID: applicationConfig.LAUNCHDARKLY_ID as string,
  reactOptions: {
    useCamelCaseFlagKeys: true,
  },
})(appWithTranslation(App, nextI18NextConfig) as FunctionComponent);

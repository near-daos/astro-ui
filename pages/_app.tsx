import React, { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import type { AppContext, AppProps } from 'next/app';
import type { NextPage } from 'next';

import nextI18NextConfig from 'next-i18next.config';

import { ModalProvider } from 'components/modal';
import { PageLayout } from 'astro_2.0/components/PageLayout';
import { MobileNav } from 'astro_2.0/components/navigation/MobileNav';
import { SearchResults } from 'features/search/search-results';

import { SocketProvider } from 'context/SocketContext';

import { useIntercomAdjust } from 'hooks/useIntercomAdjust';

import { useRouter } from 'next/router';
import { WrappedWalletContext } from 'context/WalletContext';
import { CookieService } from 'services/CookieService';
import { DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';
import { AppMonitoring } from 'astro_2.0/features/AppMonitoring/AppMonitoring';
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';
import { useAppInitialize } from 'hooks/useAppInitialize';
import { FeatureFlagsProvider } from 'astro_2.0/features/FeatureFlagsProvider/FeatureFlagsProvider';

import 'styles/globals.scss';
import { useAppVersion } from 'hooks/useAppVersion';
import { MobileAppNavigation } from 'astro_3.0/features/MobileAppNavigation';

type GetLayout = (page: ReactNode) => ReactNode;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Page<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type MyAppProps<P = {}> = AppProps<P> & {
  Component: Page<P>;
};

const defaultGetLayout: GetLayout = (page: ReactNode): ReactNode => page;

function App({ Component, pageProps }: MyAppProps): JSX.Element | null {
  const router = useRouter();
  const initialized = useAppInitialize();
  const getLayout = Component.getLayout ?? defaultGetLayout;
  const { appVersion } = useAppVersion();

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
        <FeatureFlagsProvider>
          <ModalProvider>
            <SocketProvider>
              <SearchResults>
                <Head>
                  <title>Astro</title>
                </Head>
                <PageLayout>
                  <ErrorBoundary>
                    {getLayout(<Component {...pageProps} />)}
                  </ErrorBoundary>
                </PageLayout>
                {appVersion === 3 ? <MobileAppNavigation /> : <MobileNav />}
              </SearchResults>
            </SocketProvider>
          </ModalProvider>
        </FeatureFlagsProvider>
      </WrappedWalletContext>
    </>
  );
}

App.getInitialProps = async ({ ctx }: AppContext) => {
  const { req } = ctx;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  return {};
};

export default appWithTranslation(App, nextI18NextConfig);

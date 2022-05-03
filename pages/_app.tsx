import React, { FunctionComponent, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { appWithTranslation } from 'next-i18next';
import type { AppContext, AppProps } from 'next/app';
import { withLDProvider } from 'launchdarkly-react-client-sdk';

import nextI18NextConfig from 'next-i18next.config';
import { appConfig as applicationConfig } from 'config';

import { configService } from 'services/ConfigService';

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
import { gtag, gtagScript } from 'constants/googleTagManager';
import { DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';

function App({ Component, pageProps }: AppProps): JSX.Element | null {
  const router = useRouter();
  const { appConfig } = configService.get();

  useEffect(() => {
    CookieService.set(DAO_COOKIE, router.query.dao, DEFAULT_OPTIONS);
  }, [router]);

  useIntercomAdjust();

  return (
    <>
      {appConfig?.GOOGLE_ANALYTICS_KEY && (
        <>
          <Script
            strategy="lazyOnload"
            id="gtag"
            src={gtag(appConfig.GOOGLE_ANALYTICS_KEY)}
          />

          <Script strategy="lazyOnload" id="gtagScript">
            {gtagScript(appConfig.GOOGLE_ANALYTICS_KEY)}
          </Script>
        </>
      )}
      <ModalProvider>
        <WrappedWalletContext>
          <SocketProvider>
            <SearchResults>
              <Head>
                <title>Astro</title>
              </Head>

              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>

              <MobileNav />
            </SearchResults>
          </SocketProvider>
        </WrappedWalletContext>
      </ModalProvider>
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

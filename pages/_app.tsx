import React, { FunctionComponent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from 'next-i18next.config';
import type { AppContext, AppProps } from 'next/app';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { appConfig as applicationConfig } from 'config';

import { ALL_FEED_URL, MY_FEED_URL } from 'constants/routing';

import { AuthWrapper } from 'context/AuthContext';

import { ModalProvider } from 'components/modal';
import { PageLayout } from 'astro_2.0/components/PageLayout';
import { MobileNav } from 'astro_2.0/components/navigation/MobileNav';
import { SearchResults } from 'features/search/search-results';

import { SputnikNearService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { configService } from 'services/ConfigService';

import { ACCOUNT_COOKIE, DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';

import { SocketProvider } from 'context/SocketContext';

import { useAppConfig } from 'hooks/useAppConfig';
import { useIntercomAdjust } from 'hooks/useIntercomAdjust';

import 'styles/globals.scss';
import { daoStatsService } from 'services/DaoStatsService';

function App({ Component, pageProps }: AppProps): JSX.Element | null {
  const router = useRouter();
  const { appConfig, nearConfig } = useAppConfig();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    if (!appConfig || !nearConfig) {
      return;
    }

    configService.init(nearConfig, appConfig);
    daoStatsService.init(appConfig);

    SputnikNearService.init(nearConfig, appConfig);

    const accountCookieOptions = appConfig.APP_DOMAIN
      ? { ...DEFAULT_OPTIONS, domain: appConfig.APP_DOMAIN }
      : DEFAULT_OPTIONS;

    CookieService.set(
      ACCOUNT_COOKIE,
      SputnikNearService.getAccountId(),
      accountCookieOptions
    );
    CookieService.set(DAO_COOKIE, router.query.dao, DEFAULT_OPTIONS);

    setAppInitialized(true);
  }, [appConfig, nearConfig, router.query.dao]);

  useIntercomAdjust();

  if (!appInitialized) {
    return null;
  }

  return (
    <AuthWrapper>
      <SocketProvider>
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
      </SocketProvider>
    </AuthWrapper>
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
  clientSideID: applicationConfig.launchDarklyId as string,
  reactOptions: {
    useCamelCaseFlagKeys: true,
  },
})(appWithTranslation(App, nextI18NextConfig) as FunctionComponent);

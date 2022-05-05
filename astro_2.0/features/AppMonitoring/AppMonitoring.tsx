import React, { FC } from 'react';
import Script from 'next/script';
import { gtag, gtagScript } from 'constants/googleTagManager';
import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

export const AppMonitoring: FC = () => {
  const { appConfig } = configService.get();
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  if (appConfig?.GOOGLE_ANALYTICS_KEY) {
    return (
      <>
        <Script
          strategy="lazyOnload"
          id="gtag"
          src={gtag(appConfig.GOOGLE_ANALYTICS_KEY)}
        />

        <Script strategy="lazyOnload" id="gtagScript">
          {gtagScript(appConfig.GOOGLE_ANALYTICS_KEY, accountId)}
        </Script>
      </>
    );
  }

  return null;
};

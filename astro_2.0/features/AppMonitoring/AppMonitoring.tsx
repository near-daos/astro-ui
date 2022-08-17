import React, { FC, useEffect } from 'react';
import Script from 'next/script';
import { datadogRum } from '@datadog/browser-rum';
import { gtag, gtagScript } from 'constants/googleTagManager';
import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

export const AppMonitoring: FC = () => {
  const { appConfig } = configService.get();
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  useEffect(() => {
    // only initialize when in the browser
    if (
      typeof window !== 'undefined' &&
      appConfig?.DD_APPLICATION_ID &&
      appConfig?.DD_CLIENT_TOKEN
    ) {
      datadogRum.init({
        applicationId: appConfig?.DD_APPLICATION_ID,
        clientToken: appConfig?.DD_CLIENT_TOKEN,
        site: 'us5.datadoghq.com',
        service: appConfig?.DD_SERVICE,
        sampleRate: 100,
        premiumSampleRate: 100,
        trackInteractions: true,
        defaultPrivacyLevel: 'mask-user-input',
      });

      datadogRum.setUser({
        id: CookieService.get(ACCOUNT_COOKIE),
      });

      datadogRum.startSessionReplayRecording();
    }
  }, [appConfig]);

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

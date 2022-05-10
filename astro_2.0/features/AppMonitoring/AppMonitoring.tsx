import React, { FC, useEffect } from 'react';
import Script from 'next/script';
import { gtag, gtagScript } from 'constants/googleTagManager';
import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

// you can import these packages anywhere
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

export const AppMonitoring: FC = () => {
  const { appConfig } = configService.get();
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  useEffect(() => {
    // only initialize when in the browser
    if (typeof window !== 'undefined' && appConfig?.LOG_ROCKET_APP_ID) {
      LogRocket.init(appConfig.LOG_ROCKET_APP_ID);
      // plugins should also only be initialized when in the browser
      setupLogRocketReact(LogRocket);

      // This is an example script - don't forget to change it!
      LogRocket.identify(CookieService.get(ACCOUNT_COOKIE));
    }
  }, [appConfig?.LOG_ROCKET_APP_ID]);

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

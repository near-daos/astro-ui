import { ACCOUNT_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

import { configService } from 'services/ConfigService';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SputnikNearService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';

const Callback: NextPage = () => {
  useEffect(() => {
    if (window.opener?.sputnikRequestSignInCompleted) {
      const { searchParams } = new URL(window.location.toString());
      const accountId = searchParams.get('account_id') || undefined;
      const errorCode = (searchParams.get('errorCode') ||
        undefined) as SputnikWalletErrorCodes;

      const { appConfig, nearConfig } = configService.get();

      // eslint-disable-next-line no-console
      console.log(appConfig, nearConfig);

      if (appConfig && nearConfig) {
        window.opener.sputnikRequestSignInCompleted({ accountId, errorCode });

        // we need to reinit wallet service after login
        const walletService = new SputnikWalletService(nearConfig);

        window.nearService = new SputnikNearService(walletService);

        const accountCookieOptions = appConfig.APP_DOMAIN
          ? { ...DEFAULT_OPTIONS, domain: appConfig.APP_DOMAIN }
          : DEFAULT_OPTIONS;

        CookieService.set(ACCOUNT_COOKIE, accountId, accountCookieOptions);

        setTimeout(() => {
          window.close();
        }, 1500);
      }
    } else {
      console.error('Unable to find login callback function');
      window.close();
    }
  }, []);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
  locale = 'en',
}) => {
  const accountId = query.account_id;

  res.setHeader(
    'set-cookie',
    `${ACCOUNT_COOKIE}=${accountId}; path=/; Max-Age=${Number.MAX_SAFE_INTEGER}`
  );

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
    },
  };
};

export default Callback;

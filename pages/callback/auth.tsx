import { ACCOUNT_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SputnikNearService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { getNearConfig, NEAR_ENV } from 'config/near';

const Callback: NextPage = () => {
  useEffect(() => {
    const { searchParams } = new URL(window.location.toString());
    const accountId = searchParams.get('account_id') || undefined;
    const errorCode = (searchParams.get('errorCode') ||
      undefined) as SputnikWalletErrorCodes;

    const intervalId = setInterval(() => {
      if (window.APP_CONFIG && window.opener?.sputnikRequestSignInCompleted) {
        window.opener.sputnikRequestSignInCompleted({ accountId, errorCode });

        const nearConfig = getNearConfig(
          (window.APP_CONFIG.NEAR_ENV || 'development') as NEAR_ENV
        );

        // we need to reinit wallet service after login
        const walletService = new SputnikWalletService(nearConfig);

        window.nearService = new SputnikNearService(walletService);

        const accountCookieOptions = window.APP_CONFIG.APP_DOMAIN
          ? { ...DEFAULT_OPTIONS, domain: window.APP_CONFIG.APP_DOMAIN }
          : DEFAULT_OPTIONS;

        CookieService.set(ACCOUNT_COOKIE, accountId, accountCookieOptions);

        clearInterval(intervalId);

        setTimeout(() => {
          window.close();
        }, 1500);
      }
    }, 500);
  }, []);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
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

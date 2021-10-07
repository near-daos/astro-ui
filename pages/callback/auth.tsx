import { NextPage } from 'next';
import { useEffect } from 'react';
import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';

const COOKIE_EXPIRES_TIME = Number(
  process.env.NEXT_PUBLIC_ACCOUNT_COOKIE_EXPIRES
);

const Callback: NextPage = () => {
  useEffect(() => {
    if (window.opener && window.opener.sputnikRequestSignInCompleted) {
      SputnikService.init();

      const expirationDate = new Date();

      expirationDate.setDate(expirationDate.getDate() + COOKIE_EXPIRES_TIME);
      CookieService.set('account', SputnikService.getAccountId(), {
        secure: window.location.protocol === 'https:', // To make it work properly on deploys
        path: '/',
        expires: Number.isInteger(COOKIE_EXPIRES_TIME)
          ? expirationDate
          : undefined
      });

      window.opener?.sputnikRequestSignInCompleted(
        SputnikService.getAccountId()
      );

      setTimeout(() => {
        window.close();
      }, 1500);
    } else {
      console.error('Unable to find login callback function');
      setTimeout(() => {
        window.close();
      }, 1500);
    }
  }, []);

  return null;
};

export default Callback;

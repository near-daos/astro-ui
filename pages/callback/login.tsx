import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { LoginResponse, WalletType } from 'types/config';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

const Login: NextPage = () => {
  const { query } = useRouter();
  const { selector, accountId, loginPageLogin } = useWalletSelectorContext();

  useEffect(() => {
    function callOnLogin(result: LoginResponse = {}) {
      window.close();

      if (window.opener?.onLogin) {
        window.opener?.onLogin(result);
      }
    }

    if (accountId) {
      callOnLogin();
    } else {
      const { wallet } = query;

      loginPageLogin(wallet as WalletType).catch(error => {
        callOnLogin({ error });
      });
    }
  }, [query, selector, accountId, loginPageLogin]);

  return null;
};

export default Login;

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

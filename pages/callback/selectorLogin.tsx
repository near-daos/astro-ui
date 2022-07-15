import first from 'lodash/first';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { LoginResponse, WalletType } from 'types/config';

import { useWalletContext } from 'context/WalletContext';

const SelectorLogin: NextPage = () => {
  const { query } = useRouter();
  const { selector, signInSelectorWallet } = useWalletContext();

  useEffect(() => {
    function callOnLogin(result: LoginResponse = {}) {
      window.close();

      if (window.opener?.onLogin) {
        window.opener?.onLogin(result);
      }
    }

    async function handleMount() {
      let accountId;

      if (selector) {
        try {
          const wallet = await selector?.wallet();

          const accounts = await wallet?.getAccounts();

          const { accountId: currentAcc = '' } = first(accounts) || {};

          accountId = currentAcc;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("Can not get account, but that's ok");
        }

        if (accountId) {
          callOnLogin();
        } else {
          const { wallet } = query;

          signInSelectorWallet(wallet as WalletType).catch((error: Error) => {
            callOnLogin({ error });
          });
        }
      }
    }

    handleMount();
  }, [query, selector, signInSelectorWallet]);

  return null;
};

export default SelectorLogin;

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

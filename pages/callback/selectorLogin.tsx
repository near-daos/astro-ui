import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useWallet } from 'context/WalletContext/hooks/useWallet';

import { configService } from 'services/ConfigService';

const SelectorLogin: NextPage = () => {
  const { query } = useRouter();
  const { currentWallet } = useWallet({
    setConnectingToWallet: () => 0,
  });

  useEffect(() => {
    function callOnLogin() {
      window.close();

      if (window.opener?.onLogin) {
        window.opener?.onLogin();
      }
    }

    async function handleMount() {
      if (currentWallet) {
        const signedIn = await currentWallet?.isSignedIn();

        if (signedIn) {
          callOnLogin();
        } else {
          const { nearConfig } = configService.get();

          currentWallet.signIn(nearConfig.contractName);
        }
      }
    }

    handleMount();
  }, [query, currentWallet]);

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

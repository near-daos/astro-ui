import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';

import { WalletType } from 'types/config';

import { useWallet } from 'context/WalletContext/hooks/useWallet';

import { configService } from 'services/ConfigService';

import { getTranslations } from 'utils/getTranslations';

const SelectorLogin: NextPage = () => {
  const router = useRouter();
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

          currentWallet.signIn(nearConfig.contractName).then(() => {
            if (router.query.wallet !== WalletType.SELECTOR_NEAR) {
              router.reload();
            }
          });
        }
      }
    }

    handleMount();
  }, [router, currentWallet]);

  return null;
};

export default SelectorLogin;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};

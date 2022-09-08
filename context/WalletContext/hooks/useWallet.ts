import isNil from 'lodash/isNil';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'react-use';
import { useCallback, useEffect, useState } from 'react';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { WalletType } from 'types/config';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

import { CookieService } from 'services/CookieService';
import { initNearWallet } from 'context/WalletContext/utils/initNearWallet';
import { initSenderWallet } from 'context/WalletContext/utils/initSenderWallet';

// import { useSelector } from './walletSelector/useSelector';
import { initWalletSelector } from 'context/WalletContext/utils/initWalletSelector';
import { configService } from 'services/ConfigService';

type ReturnVal = {
  removePersistedWallet: () => void;
  currentWallet: WalletService | null;
  setWallet: (walletService: WalletService) => void;
  getWallet: (walletType: WalletType) => Promise<WalletService | undefined>;
};

export const useWallet = (): ReturnVal => {
  const router = useRouter();

  const [persistedWallet, setPersistedWallet, removePersistedWallet] =
    useLocalStorage('selectedWallet');

  const [currentWallet, setCurrentWallet] = useState<WalletService | null>(
    null
  );

  const getWallet = useCallback(
    (walletType: WalletType) => {
      switch (walletType) {
        case WalletType.NEAR:
          return initNearWallet();
        case WalletType.SENDER:
          return initSenderWallet(router.reload);
        case WalletType.SELECTOR_NEAR:
        case WalletType.SELECTOR_SENDER: {
          return initWalletSelector(walletType);
        }
        default:
          return Promise.resolve(undefined);
      }
    },
    [router]
  );

  const setWallet = useCallback(
    async (wallet: WalletService) => {
      setPersistedWallet(wallet.getWalletType());
      setCurrentWallet(wallet);

      const accountId = await wallet.getAccountId();

      CookieService.set(ACCOUNT_COOKIE, accountId, {
        path: '/',
      });
    },
    [setPersistedWallet]
  );

  // const { initiateSignInSelectorWallets } = useSelector({
  //   setWallet,
  // });

  useEffect(() => {
    async function initWallet() {
      if (isNil(persistedWallet)) {
        CookieService.remove(ACCOUNT_COOKIE);
      } else {
        const wallet = await getWallet(persistedWallet as WalletType);

        if (!wallet) {
          return;
        }

        const isSignedIn = await wallet.isSignedIn();

        if (!isSignedIn) {
          const { nearConfig } = configService.get();

          await wallet.signIn(nearConfig.contractName);

          return;
        }

        const accountId = await wallet.getAccountId();

        CookieService.set(ACCOUNT_COOKIE, accountId, {
          path: '/',
        });

        setCurrentWallet(wallet);
      }
    }

    initWallet();
  }, [getWallet, persistedWallet]);

  return {
    getWallet,
    setWallet,
    currentWallet,
    removePersistedWallet,
  };
};

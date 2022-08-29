import {
  NetworkId,
  WalletSelector,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { setupSender } from '@near-wallet-selector/sender';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import { WalletType } from 'types/config';

import { LOGIN_PAGE, SELECTOR_TRANSACTION_PAGE_URL } from 'constants/routing';

import { configService } from 'services/ConfigService';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';
import { WalletSelectorService } from 'services/sputnik/SputnikNearService/walletServices/WalletSelectorService';

import { useTrackSelectorAccount } from './useTrackSelectorAccount';
import { useSelectorLsAccount } from './useSelectorLsAccount';

type InputProps = {
  setWallet: (wallet: WalletService) => void;
  setConnectingToWallet: (connecting: boolean) => void;
};

type ReturnType = {
  selector?: WalletSelector;
  initiateSignInSelectorWallets: (walletId: WalletType) => Promise<unknown>;
};

/**
 * The login process is very fragile and tricky.
 * The main thing to know is that "selector" instance is being instantiated ONCE for the app.
 * It's the time when it reads info from local storage, figures out if you were logged in, what is your wallet, etc.
 * After that instance object lives inside of the wallet-selector library until app lives and it won't
 * update even if you try to create it once more.
 *
 * The login process works in a following way. We open a new window where "/callback/selectorLogin" page is loaded.
 * The app in this "secondary" window has it's own instance of the "selector". Then user is being navigated to
 * wallet to log into it. Wallet navigates user back to "/callback/selectorLogin" after login process. Proper keys are
 * being written into local storage on the "/callback/selectorLogin".
 * NOTE: "selector" is not instantiated in the "main" window with main app for now.
 *
 * Only when proper keys are in local storage and "secondary" window has authenticated user, we send a signal that
 * selector can be created in the "main" window. Selector sees all proper info in the local storage and creates
 * authenticated instance.
 *
 * NOTE: we need to reload page when user logs out to destroy "selector" instance in the window. Otherwise the flow
 * will stop working.
 */
export function useSelector(props: InputProps): ReturnType {
  const { query, pathname } = useRouter();

  const { nearConfig } = configService.get();

  const { setWallet, setConnectingToWallet } = props;

  const [selector, setSelector] = useState<WalletSelector>();
  const [selectorAccountId] = useSelectorLsAccount();
  const [canCreateSelector, setCanCreateSelector] = useState(
    !!selectorAccountId ||
      pathname === LOGIN_PAGE ||
      pathname === SELECTOR_TRANSACTION_PAGE_URL
  );

  useTrackSelectorAccount(selector);

  useEffect(() => {
    async function createSelector() {
      const s = await setupWalletSelector({
        // debug: true,
        network: nearConfig.networkId as NetworkId,
        modules: [setupMyNearWallet(), setupSender()],
      });

      try {
        const wallet = await s.wallet(query.wallet as string);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const walletService = new WalletSelectorService(wallet, s);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setWallet(walletService);
      } catch (e) {
        console.error('Failed to get wallet from wallet selector.', e);
      }

      setSelector(s);
    }

    if (canCreateSelector) {
      createSelector();
    }
  }, [query, setWallet, canCreateSelector, nearConfig.networkId]);

  const initiateSignInSelectorWallets = useCallback(
    (walletId: WalletType) => {
      setConnectingToWallet(true);

      window.open(`${window.origin}${LOGIN_PAGE}?wallet=${walletId}`, '_blank');

      return new Promise(resolve => {
        window.onLogin = async () => {
          setCanCreateSelector(true);

          resolve('');

          setConnectingToWallet(false);
        };
      });
    },
    [setCanCreateSelector, setConnectingToWallet]
  );

  return {
    selector,
    initiateSignInSelectorWallets,
  };
}

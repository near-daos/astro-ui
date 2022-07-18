import {
  Account,
  NetworkId,
  BrowserWallet,
  WalletSelector,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import { useCallback, useEffect, useState } from 'react';
import { setupSender } from '@near-wallet-selector/sender';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import { WalletType } from 'types/config';

import { isSelectorWalletType } from 'utils/isSelectorWalletType';

import { configService } from 'services/ConfigService';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';
import { WalletSelectorService } from 'services/sputnik/SputnikNearService/walletServices/WalletSelectorService';

import { useTrackSelectorAccount } from './useTrackSelectorAccount';

type ReturnType = {
  selector?: WalletSelector;
  signInSelectorWallet: (walletType: WalletType) => Promise<Account[]>;
};

type InputProps = {
  canCreate: boolean;
  setWallet: (wallet: WalletService) => void;
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
  const { nearConfig } = configService.get();

  const { canCreate, setWallet } = props;

  const [selector, setSelector] = useState<WalletSelector>();

  useTrackSelectorAccount(selector);

  useEffect(() => {
    async function createSelector() {
      const s = await setupWalletSelector({
        // debug: true,
        network: nearConfig.networkId as NetworkId,
        modules: [setupNearWallet(), setupMyNearWallet(), setupSender()],
      });

      try {
        const wallet = await s.wallet();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const walletService = new WalletSelectorService(wallet);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setWallet(walletService);
      } catch (e) {
        console.error('Failed to get wallet from wallet selector.', e);
      }

      setSelector(s);
    }

    if (canCreate) {
      createSelector();
    }
  }, [setWallet, canCreate, nearConfig.networkId]);

  const signInSelectorWallet = useCallback(
    async (walletType: WalletType) => {
      if (!isSelectorWalletType(walletType)) {
        throw new Error(
          `Wrong wallet type provided to wallet selector: ${walletType}`
        );
      }

      const wallet = (await selector?.wallet(
        walletType as string
      )) as BrowserWallet;

      const result = await wallet?.signIn({
        contractId: nearConfig.contractName,
      });

      return result;
    },
    [selector, nearConfig]
  );

  return {
    selector,
    signInSelectorWallet,
  };
}

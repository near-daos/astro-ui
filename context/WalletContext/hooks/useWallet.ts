import { useAsync } from 'react-use';
import { useCallback, useEffect, useState } from 'react';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { WalletType } from 'types/config';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

import { CookieService } from 'services/CookieService';
import { configService } from 'services/ConfigService';
import {
  NetworkId,
  setupWalletSelector,
  WalletSelector,
} from '@near-wallet-selector/core';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { WalletSelectorService } from 'services/sputnik/SputnikNearService/walletServices/WalletSelectorService';
import { distinctUntilChanged, map } from 'rxjs';

type ReturnVal = {
  currentWallet: WalletService | null;
  getWallet: (walletType: WalletType) => Promise<WalletService | undefined>;
  walletSelector: WalletSelector | undefined;
};

export const useWallet = (): ReturnVal => {
  const [currentWallet, setCurrentWallet] = useState<WalletService | null>(
    null
  );

  const { value: walletSelector } = useAsync(async () => {
    const { nearConfig } = configService.get();

    return setupWalletSelector({
      network: nearConfig.networkId as NetworkId,
      modules: [
        setupMyNearWallet(),
        setupSender(),
        setupHereWallet(),
        setupMeteorWallet(),
      ],
    });
  }, []);

  const getWallet = useCallback(
    async (walletType: WalletType) => {
      if (!walletSelector) {
        return undefined;
      }

      const wallet = await walletSelector.wallet(walletType as string);

      // In case we are logged in using Sender wallet - listen for an updates and reload
      // the app so wallet will be reinitialized
      if (window.near) {
        window.near.on('accountChanged', async () => {
          window.location.reload();
        });
      }

      return new WalletSelectorService(wallet, walletSelector);
    },
    [walletSelector]
  );

  useEffect(() => {
    const accountSubscription = walletSelector?.store.observable
      .pipe(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        map(state => {
          return state.selectedWalletId;
        }),
        distinctUntilChanged()
      )
      .subscribe(async selectedWalletId => {
        if (!selectedWalletId) {
          return;
        }

        const wallet = await getWallet(selectedWalletId as WalletType);

        if (wallet) {
          const accountId = await wallet.getAccountId();

          CookieService.set(ACCOUNT_COOKIE, accountId, {
            path: '/',
          });

          setCurrentWallet(wallet);
        }
      });

    return () => accountSubscription?.unsubscribe();
  }, [getWallet, walletSelector]);

  useEffect(() => {
    async function initWallet() {
      const state = walletSelector?.store.getState();

      if (!state) {
        CookieService.remove(ACCOUNT_COOKIE);
      } else {
        const { selectedWalletId } = state;

        if (!selectedWalletId) {
          return;
        }

        const wallet = await getWallet(selectedWalletId as WalletType);

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
  }, [getWallet, walletSelector?.store]);

  return {
    getWallet,
    currentWallet,
    walletSelector,
  };
};

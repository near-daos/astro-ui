import {
  NetworkId,
  WalletSelector,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import { useEffect, useState } from 'react';
import { setupSender } from '@near-wallet-selector/sender';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';
import { WalletSelectorService } from 'services/sputnik/SputnikNearService/walletServices/WalletSelectorService';

type ReturnType = {
  selector?: WalletSelector;
};

type InputProps = {
  canCreate: boolean;
  networkId: string;
  setWallet: (wallet: WalletService) => void;
};

export function useSelector(props: InputProps): ReturnType {
  const { canCreate, networkId, setWallet } = props;

  const [selector, setSelector] = useState<WalletSelector>();

  useEffect(() => {
    async function createSelector() {
      const s = await setupWalletSelector({
        // debug: true,
        network: networkId as NetworkId,
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
  }, [networkId, canCreate, setWallet]);

  return {
    selector,
  };
}

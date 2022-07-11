import {
  WalletSelector,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import { useEffect, useState } from 'react';
import { setupSender } from '@near-wallet-selector/sender';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

type ReturnType = {
  selector?: WalletSelector;
};

export function useSelector(canCreate: boolean): ReturnType {
  const [selector, setSelector] = useState<WalletSelector>();

  useEffect(() => {
    async function createSelector() {
      const s = await setupWalletSelector({
        // debug: true,
        network: 'testnet',
        modules: [setupNearWallet(), setupMyNearWallet(), setupSender()],
      });

      setSelector(s);
    }

    if (canCreate) {
      createSelector();
    }
  }, [canCreate]);

  return {
    selector,
  };
}

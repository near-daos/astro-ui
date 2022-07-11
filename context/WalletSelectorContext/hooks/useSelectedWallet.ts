/* eslint-disable  @typescript-eslint/ban-ts-comment */

import { useEffect, useState } from 'react';
import { distinctUntilChanged, map } from 'rxjs';
import { WalletSelector } from '@near-wallet-selector/core';

import { WalletType } from 'types/config';

type ReturnType = {
  selectedWalletId?: WalletType;
};

export function useSelectedWallet(selector?: WalletSelector): ReturnType {
  const [selectedWalletId, setSelectedWalletId] = useState<WalletType>();

  useEffect(() => {
    const walletSubscription = selector?.store.observable
      .pipe(
        // @ts-ignore
        map(state => state.selectedWalletId),
        distinctUntilChanged()
      )
      .subscribe(nextWalletId => {
        const wallet = (nextWalletId || undefined) as WalletType;

        setSelectedWalletId(wallet);
      });

    return () => walletSubscription?.unsubscribe();
  }, [selector]);

  return {
    selectedWalletId,
  };
}

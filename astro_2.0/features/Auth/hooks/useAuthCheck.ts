/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useCallback } from 'react';

import { WalletType } from 'types/config';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

export const useAuthCheck = <T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T => {
  const { accountId, login } = useWalletSelectorContext();

  return useCallback(
    (...args: Parameters<T>) => {
      if (accountId) {
        callback(...args);

        return;
      }

      login(WalletType.NEAR);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountId, login, ...deps]
  ) as T;
};

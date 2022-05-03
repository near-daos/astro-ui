/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useCallback } from 'react';
import { useWalletContext } from 'context/WalletContext';
import { WalletType } from 'types/config';

export const useAuthCheck = <T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T => {
  const { accountId, login } = useWalletContext();

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

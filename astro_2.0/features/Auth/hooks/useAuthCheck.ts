/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useCallback } from 'react';
import { useAuthContext } from 'context/AuthContext';

export const useAuthCheck = <T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T => {
  const { accountId, login } = useAuthContext();

  return useCallback(
    (...args: Parameters<T>) => {
      if (accountId) {
        callback(...args);

        return;
      }

      login();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountId, login, ...deps]
  ) as T;
};

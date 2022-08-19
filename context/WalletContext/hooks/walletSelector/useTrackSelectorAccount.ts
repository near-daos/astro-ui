/* eslint-disable  @typescript-eslint/ban-ts-comment */

import first from 'lodash/first';
import { useCallback, useEffect } from 'react';
import { distinctUntilChanged, map } from 'rxjs';
import { AccountState, WalletSelector } from '@near-wallet-selector/core';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { CookieService } from 'services/CookieService';

import { useSelectorLsAccount } from './useSelectorLsAccount';

type ReturnType = {
  accountId: string;
  removeAccountId: () => void;
};

export function useTrackSelectorAccount(selector?: WalletSelector): ReturnType {
  const [accountId = '', setSelectorAccountId, removeSelectorAccountId] =
    useSelectorLsAccount();

  const syncAccountState = useCallback(
    (accounts: AccountState[]) => {
      const { accountId: acc } = first(accounts) || {};

      if (acc) {
        setSelectorAccountId(acc);
      } else {
        removeSelectorAccountId();
      }

      CookieService.set(ACCOUNT_COOKIE, acc || '', {
        path: '/',
      });
    },
    [setSelectorAccountId, removeSelectorAccountId]
  );

  useEffect(() => {
    const accountSubscription = selector?.store.observable
      .pipe(
        // @ts-ignore
        map(state => state.accounts),
        distinctUntilChanged()
      )
      .subscribe(nextAccounts => {
        syncAccountState(nextAccounts);
      });

    return () => accountSubscription?.unsubscribe();
  }, [selector, syncAccountState]);

  return {
    accountId,
    removeAccountId: removeSelectorAccountId,
  };
}

import {
  WalletSelector,
  setupWalletSelector,
  BrowserWallet,
  AccountState,
} from '@near-wallet-selector/core';
import { useMount } from 'react-use';
import { map, distinctUntilChanged } from 'rxjs';
import { FC, createContext, useState, useContext, useEffect } from 'react';

import { setupSender } from '@near-wallet-selector/sender';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import { WALLETS } from 'types/config';

interface IWalletSelectorContext {
  logIn: (walletId: WALLETS) => Promise<void>;
  selector?: WalletSelector;
  connecting: boolean;
}

export const WalletSelectorContext = createContext<IWalletSelectorContext>(
  {} as IWalletSelectorContext
);

export const WalletSelectorProvider: FC = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector>();
  const [connecting, setConnecting] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);

  const syncAccountState = (
    currentAccountId: string | null,
    newAccounts: Array<AccountState>
  ) => {
    if (!newAccounts.length) {
      localStorage.removeItem('accountId');
      setAccountId(null);
      setAccounts([]);

      return;
    }

    const validAccountId =
      currentAccountId &&
      newAccounts.some(x => x.accountId === currentAccountId);
    const newAccountId = validAccountId
      ? currentAccountId
      : newAccounts[0].accountId;

    localStorage.setItem('accountId', newAccountId || '');
    setAccountId(newAccountId);
    setAccounts(newAccounts);
  };

  useMount(async () => {
    const s = await setupWalletSelector({
      network: 'testnet',
      modules: [setupNearWallet(), setupMyNearWallet(), setupSender()],
    });

    const state = s.store.getState();

    syncAccountState(localStorage.getItem('accountId'), state.accounts);

    console.log('>>>', s);

    setSelector(s);
  });

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map(state => state.accounts),
        distinctUntilChanged()
      )
      .subscribe(nextAccounts => {
        console.log('Accounts Update', nextAccounts);

        syncAccountState(accountId, nextAccounts);
      });

    return () => subscription.unsubscribe();
  }, [selector, accountId]);

  async function logIn(walletId: WALLETS) {
    setConnecting(true);

    const wallet = await selector?.wallet(walletId);

    (wallet as BrowserWallet)?.signIn({ contractId: 'test.testnet' });

    setConnecting(false);
  }

  return (
    <WalletSelectorContext.Provider value={{ logIn, selector, connecting }}>
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelectorContext(): IWalletSelectorContext {
  return useContext(WalletSelectorContext);
}

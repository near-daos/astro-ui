/* eslint-disable  @typescript-eslint/ban-ts-comment */

import {
  FC,
  useMemo,
  useState,
  useContext,
  useEffect,
  useCallback,
  createContext,
} from 'react';
import {
  AccountState,
  BrowserWallet,
  WalletSelector,
  setupWalletSelector,
} from '@near-wallet-selector/core';
import first from 'lodash/first';
import { map, distinctUntilChanged } from 'rxjs';
import { useLocalStorage, useMount } from 'react-use';

import { setupSender } from '@near-wallet-selector/sender';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import { WalletType } from 'types/config';

interface IWalletSelectorContext {
  accountId: string;
  connecting: boolean;
  selector?: WalletSelector;
  selectedWalletId?: WalletType;
  logIn: (walletId: WalletType) => Promise<void>;
  logOut: () => Promise<void>;
}

export const WalletSelectorContext = createContext<IWalletSelectorContext>(
  {} as IWalletSelectorContext
);

export const WalletSelectorProvider: FC = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector>();
  const [connecting, setConnecting] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<WalletType>();
  const [accountId = '', setAccountId, removeAccountId] = useLocalStorage(
    'accountId'
  );

  const syncAccountState = useCallback(
    (accounts: AccountState[]) => {
      const { accountId: acc } = first(accounts) || {};

      if (acc) {
        setAccountId(acc);
      } else {
        removeAccountId();
      }
    },
    [setAccountId, removeAccountId]
  );

  useMount(async () => {
    const s = await setupWalletSelector({
      network: 'testnet',
      modules: [setupNearWallet(), setupMyNearWallet(), setupSender()],
    });

    setSelector(s);
  });

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

    return () => {
      accountSubscription?.unsubscribe();
      walletSubscription?.unsubscribe();
    };
  }, [selector, syncAccountState]);

  const logIn = useCallback(
    async (walletId: WalletType) => {
      setConnecting(true);

      const wallet = (await selector?.wallet(walletId)) as BrowserWallet;

      try {
        await wallet?.signIn({ contractId: 'test.testnet' });
      } catch (e) {
        console.error(e);
      } finally {
        setConnecting(false);
      }
    },
    [selector]
  );

  const logOut = useCallback(async () => {
    const wallet = (await selector?.wallet()) as BrowserWallet;

    try {
      await wallet.signOut();

      removeAccountId();
    } catch (e) {
      console.error(e);
    }
  }, [selector, removeAccountId]);

  // console.log('>>>', selector);

  const values = useMemo(
    () => ({
      accountId,
      logIn,
      logOut,
      selector,
      connecting,
      selectedWalletId,
    }),
    [accountId, logIn, logOut, selector, connecting, selectedWalletId]
  );

  return (
    <WalletSelectorContext.Provider value={values}>
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelectorContext(): IWalletSelectorContext {
  return useContext(WalletSelectorContext);
}

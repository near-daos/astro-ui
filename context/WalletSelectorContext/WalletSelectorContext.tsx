/* eslint-disable  @typescript-eslint/ban-ts-comment */

import {
  FC,
  useMemo,
  useState,
  useContext,
  useCallback,
  createContext,
} from 'react';
import {
  Account,
  BrowserWallet,
  WalletSelector,
} from '@near-wallet-selector/core';
import { useRouter } from 'next/router';

import { LOGIN_PAGE } from 'constants/routing';

import { LoginResponse, WalletType } from 'types/config';

import { configService } from 'services/ConfigService';

import { useSelector } from './hooks/useSelector';
import { useLsAccount } from './hooks/useLsAccount';
import { useGetAccount } from './hooks/useGetAccount';
import { useSelectedWallet } from './hooks/useSelectedWallet';

interface IWalletSelectorContext {
  accountId: string;
  connecting: boolean;
  selector?: WalletSelector;
  selectedWalletId?: WalletType;
  login: (walletId: WalletType) => Promise<unknown>;
  loginPageLogin: (walletId: WalletType) => Promise<Account[]>;
  logout: () => Promise<void>;
}

export const WalletSelectorContext = createContext<IWalletSelectorContext>(
  {} as IWalletSelectorContext
);

/**
 * The login process is very fragile and tricky.
 * The main thing to know is that "selector" instance is being instantiated once for the app.
 * It's the time when it reads info from local storage, figures out if you were logged in, what is your wallet, etc.
 * After that instance object lives inside of the wallet-selector library until app lives and it won't
 * update even if you try to create it once more.
 *
 * The login process works in a following way. We open a new window where "/callback/login" page is loaded.
 * The app in this "secondary" window has it's own instance of the "selector". Then user is being navigated to
 * wallet to log into it. Wallet navigates user back to "/callback/login" after login process. Proper keys are
 * being written into local storage on the "/callback/login".
 * NOTE: "selector" is not instantiated in the "main" window with main app for now.
 *
 * Only when proper keys are in local storage and "secondary" window has authenticated user, we send a signal that
 * selector can be created in the "main" window. Selector sees all proper info in the local storage and creates
 * authenticated instance.
 *
 * NOTE: we need to reload page when user logs out to destroy "selector" instance in the window. Otherwise the flow
 * will stop working.
 */
export const WalletSelectorProvider: FC = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const [acc] = useLsAccount();
  const [canCreate, setCanCreate] = useState(pathname === LOGIN_PAGE || !!acc);

  const { selector } = useSelector(canCreate);
  const { accountId, removeAccountId } = useGetAccount(selector);
  const { selectedWalletId } = useSelectedWallet(selector);
  const [connecting, setConnecting] = useState(false);

  const { nearConfig } = useMemo(() => {
    return configService.get();
  }, []);

  // actual "login" that will be called on the "login" page
  const loginPageLogin = useCallback(
    async (walletType: WalletType) => {
      if (!Object.values(WalletType).includes(walletType)) {
        throw new Error(`Wrong wallet type provided: ${walletType}`);
      }

      const wallet = (await selector?.wallet(walletType)) as BrowserWallet;

      const result = await wallet?.signIn({
        contractId: nearConfig.contractName,
      });

      return result;
    },
    [selector, nearConfig]
  );

  const login = useCallback(async (walletId: WalletType) => {
    setConnecting(true);

    window.open(`${window.origin}${LOGIN_PAGE}?wallet=${walletId}`, '_blank');

    return new Promise((resolve, reject) => {
      window.onLogin = async (result: LoginResponse) => {
        const { error } = result;

        if (error) {
          // we might catch an error if  unsupported wallet type is provided
          reject(result);
        }

        try {
          setCanCreate(true);

          resolve('');
        } catch (e) {
          console.error(e);
          reject(e);
        }

        setConnecting(false);
      };
    });
  }, []);

  const logout = useCallback(async () => {
    const wallet = (await selector?.wallet()) as BrowserWallet;

    try {
      await wallet.signOut();

      removeAccountId();

      // we need to reload page to clear "selector" instance
      await router.reload();
    } catch (e) {
      console.error(e);
    }
  }, [router, selector, removeAccountId]);

  const values = useMemo(
    () => ({
      login,
      logout,
      selector,
      accountId,
      connecting,
      loginPageLogin,
      selectedWalletId,
    }),
    [
      login,
      logout,
      selector,
      accountId,
      connecting,
      loginPageLogin,
      selectedWalletId,
    ]
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

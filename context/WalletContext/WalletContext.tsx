import {
  FC,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from 'react';
import get from 'lodash/get';
import { useBoolean } from 'react-use';
import { useRouter } from 'next/router';
import { Account, WalletSelector } from '@near-wallet-selector/core';

import { LoginResponse, WalletType } from 'types/config';
import {
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/walletServices/types';

import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikNearService } from 'services/sputnik';
import { ConnectingWalletModal } from 'astro_2.0/features/Auth/components/ConnectingWalletModal';

import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { isSelectorWalletType } from 'utils/isSelectorWalletType';

import { LOGIN_PAGE } from 'constants/routing';
import {
  NEAR_WALLET_METADATA,
  SENDER_WALLET_METADATA,
} from 'services/sputnik/SputnikNearService/walletServices/constants';

import { PkAndSignature } from './types';

import { useWallet } from './hooks/useWallet';
import { useAvailableAccounts } from './hooks/useAvailableAccounts';
import { usePkAndSignature } from './hooks/usePkAndSignature';
import { useSelector } from './hooks/walletSelector/useSelector';
import { useCanCreateSelector } from './hooks/walletSelector/useCanCreateSelector';

export interface WalletContext {
  selector?: WalletSelector;
  availableWallets: WalletMeta[];
  currentWallet: WalletType | null;
  accountId: string;
  connectingToWallet: boolean;
  login: (walletType: WalletType) => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (walletType: WalletType, accountId: string) => void;
  switchWallet: (walletType: WalletType) => void;
  availableAccounts: string[];
  pkAndSignature: PkAndSignature | null;
  signInSelectorWallet: (walletType: WalletType) => Promise<Account[]>;
  // todo get rid of
  nearService: SputnikNearService | null;
}

const WalletContext = createContext<WalletContext>({} as WalletContext);

export const WrappedWalletContext: FC = ({ children }) => {
  const {
    getWallet,
    setWallet,
    currentWallet,
    removePersistedWallet,
  } = useWallet();

  const { nearConfig } = configService.get();
  const { canCreateSelector, setCanCreateSelector } = useCanCreateSelector();

  const { selector, signInSelectorWallet } = useSelector({
    setWallet,
    canCreate: canCreateSelector,
  });

  const pkAndSignature = usePkAndSignature(currentWallet);
  const availableAccounts = useAvailableAccounts(currentWallet);
  const [currentAccount, setCurrentAccount] = useState('');

  const [connectingToWallet, setConnectingToWallet] = useBoolean(false);

  const router = useRouter();

  useEffect(() => {
    async function updateAccountId() {
      if (currentWallet) {
        const account = await currentWallet.getAccountId();

        setCurrentAccount(account);
      }
    }

    updateAccountId();
  }, [currentWallet]);

  const signIn = useCallback(
    async (wallet: WalletService, contractName: string) => {
      setConnectingToWallet(true);

      const isSignedIn = await wallet.isSignedIn();

      if (!isSignedIn) {
        await wallet.signIn(contractName);
      }

      setWallet(wallet);

      setConnectingToWallet(false);

      const accountId = await wallet.getAccountId();

      sendGAEvent({
        name: GA_EVENTS.SIGN_IN,
        accountId,
      });
    },
    [setWallet, setConnectingToWallet]
  );

  const initiateSignInSelectorWallets = useCallback(
    (walletId: WalletType) => {
      setConnectingToWallet(true);

      window.open(`${window.origin}${LOGIN_PAGE}?wallet=${walletId}`, '_blank');

      return new Promise((resolve, reject) => {
        window.onLogin = async (result: LoginResponse) => {
          const { error } = result;

          if (error) {
            // we might catch an error if unsupported wallet type is provided
            reject(result);
          }

          try {
            setCanCreateSelector(true);

            resolve('');
          } catch (e) {
            console.error(e);
            reject(e);
          }

          setConnectingToWallet(false);
        };
      });
    },
    [setCanCreateSelector, setConnectingToWallet]
  );

  const login = useCallback(
    async (walletType: WalletType) => {
      if (isSelectorWalletType(walletType)) {
        initiateSignInSelectorWallets(walletType);
      } else {
        const wallet = await getWallet(walletType);

        if (!wallet) {
          return;
        }

        signIn(wallet, nearConfig.contractName);
      }
    },
    [signIn, getWallet, nearConfig.contractName, initiateSignInSelectorWallets]
  );

  const logout = useCallback(async () => {
    const accountId = (await currentWallet?.getAccountId()) ?? '';

    sendGAEvent({
      name: GA_EVENTS.SIGN_OUT,
      accountId,
    });

    CookieService.remove(ACCOUNT_COOKIE);
    removePersistedWallet();

    currentWallet?.logout();

    router.reload();
  }, [currentWallet, removePersistedWallet, router]);

  const switchAccount = useCallback(
    async (walletType: WalletType, accountId: string) => {
      // Currently its NEAR wallet specific only
      if (walletType !== WalletType.NEAR) {
        return;
      }

      const nearWallet = await getWallet(WalletType.NEAR);

      if (!nearWallet) {
        return;
      }

      // eslint-disable-next-line no-underscore-dangle
      const keypair = await nearWallet
        .getKeyStore()
        .getKey(nearConfig.networkId, accountId);

      if (!keypair) {
        return;
      }

      const authData = {
        accountId,
        allKeys: [keypair.getPublicKey().toString()],
      };

      // new wallet instance will take the new auth_key and will reinit the account
      window.localStorage.setItem(
        'sputnik_wallet_auth_key',
        JSON.stringify(authData)
      );

      CookieService.set(ACCOUNT_COOKIE, accountId, {
        path: '/',
      });

      sendGAEvent({
        name: GA_EVENTS.SWITCH_ACCOUNT,
        accountId,
      });

      router.reload();
    },
    [getWallet, nearConfig.networkId, router]
  );

  const switchWallet = useCallback(
    async (walletType: WalletType) => {
      const selectedWallet = await getWallet(walletType);

      if (!selectedWallet || !currentWallet) {
        return;
      }

      await signIn(selectedWallet, nearConfig.contractName);

      const currentWalletAccountId = await currentWallet.getAccountId();
      const selectedWalletAccountId = await selectedWallet.getAccountId();

      sendGAEvent({
        name: GA_EVENTS.SWITCH_WALLET,
        accountId: selectedWalletAccountId,
        params: {
          wallet: walletType,
          previousAccountId: currentWalletAccountId,
        },
      });

      if (currentWalletAccountId !== selectedWalletAccountId) {
        router.reload();
      }
    },
    [currentWallet, getWallet, nearConfig.contractName, router, signIn]
  );

  const walletContext = useMemo(() => {
    const availableWallets = [NEAR_WALLET_METADATA];

    const senderWalletAvailable = get(window, 'near.isSender') || false;

    if (senderWalletAvailable) {
      availableWallets.push(SENDER_WALLET_METADATA);
    }

    return {
      login,
      logout,
      selector,
      switchWallet,
      switchAccount,
      pkAndSignature,
      availableWallets,
      availableAccounts,
      connectingToWallet,
      signInSelectorWallet,
      accountId: currentAccount,
      currentWallet: currentWallet?.getWalletType() ?? null,
      nearService: currentWallet ? new SputnikNearService(currentWallet) : null,
    };
  }, [
    login,
    logout,
    selector,
    switchWallet,
    switchAccount,
    currentWallet,
    pkAndSignature,
    currentAccount,
    availableAccounts,
    connectingToWallet,
    signInSelectorWallet,
  ]);

  return (
    <WalletContext.Provider value={walletContext}>
      {children}
      {connectingToWallet && (
        <ConnectingWalletModal
          isOpen
          onClose={() => setConnectingToWallet(false)}
          walletType={walletContext?.currentWallet ?? WalletType.NEAR}
        />
      )}
    </WalletContext.Provider>
  );
};

export function useWalletContext(): WalletContext {
  return useContext(WalletContext);
}

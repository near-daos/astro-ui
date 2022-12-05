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
import { useRouter } from 'next/router';
import { WalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';

import { WalletType } from 'types/config';
import { WalletMeta } from 'services/sputnik/SputnikNearService/walletServices/types';

import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikNearService } from 'services/sputnik';

import { GA_EVENTS, sendGAEvent } from 'utils/ga';

import {
  NEAR_WALLET_METADATA,
  SENDER_WALLET_METADATA,
} from 'services/sputnik/SputnikNearService/walletServices/constants';

import { PkAndSignature } from './types';

import { useWallet } from './hooks/useWallet';
import { usePkAndSignature } from './hooks/usePkAndSignature';
import { useAvailableAccounts } from './hooks/useAvailableAccounts';

export interface WalletContext {
  availableWallets: WalletMeta[];
  currentWallet: WalletType | null;
  accountId: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (walletType: WalletType, accountId: string) => void;
  switchWallet: () => void;
  availableAccounts: string[];
  pkAndSignature: PkAndSignature | null;
  walletSelector: WalletSelector | undefined;
  // todo get rid of
  nearService: SputnikNearService | null;
}

const WalletContext = createContext<WalletContext>({} as WalletContext);

export const WrappedWalletContext: FC = ({ children }) => {
  const router = useRouter();
  const { nearConfig } = configService.get();

  const { getWallet, currentWallet, walletSelector } = useWallet();

  const pkAndSignature = usePkAndSignature(currentWallet);
  const availableAccounts = useAvailableAccounts(currentWallet);
  const [currentAccount, setCurrentAccount] = useState('');

  const modal = useMemo(() => {
    if (!walletSelector) {
      return undefined;
    }

    return setupModal(walletSelector, {
      contractId: nearConfig.contractName,
    });
  }, [nearConfig.contractName, walletSelector]);

  useEffect(() => {
    async function updateAccountId() {
      if (currentWallet) {
        const account = await currentWallet.getAccountId();

        setCurrentAccount(account);
      }
    }

    updateAccountId();
  }, [currentWallet, getWallet, walletSelector]);

  const login = useCallback(async () => {
    if (!modal) {
      return;
    }

    modal.show();
  }, [modal]);

  const logout = useCallback(async () => {
    const accountId = (await currentWallet?.getAccountId()) ?? '';

    sendGAEvent({
      name: GA_EVENTS.SIGN_OUT,
      accountId,
    });

    CookieService.remove(ACCOUNT_COOKIE, { path: '/' });

    await currentWallet?.logout();

    router.reload();
  }, [currentWallet, router]);

  // Deprecated
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

  const switchWallet = useCallback(() => {
    if (!modal) {
      return;
    }

    modal.show();
  }, [modal]);

  const walletContext = useMemo(() => {
    const availableWallets = [NEAR_WALLET_METADATA];

    const senderWalletAvailable = get(window, 'near.isSender') || false;

    if (senderWalletAvailable) {
      availableWallets.push(SENDER_WALLET_METADATA);
    }

    return {
      login,
      logout,
      switchWallet,
      switchAccount,
      pkAndSignature,
      availableWallets,
      availableAccounts,
      accountId: currentAccount,
      currentWallet: currentWallet?.getWalletType() ?? null,
      nearService: currentWallet ? new SputnikNearService(currentWallet) : null,
      walletSelector,
    };
  }, [
    login,
    logout,
    switchWallet,
    switchAccount,
    currentWallet,
    pkAndSignature,
    currentAccount,
    availableAccounts,
    walletSelector,
  ]);

  return (
    <WalletContext.Provider value={walletContext}>
      {children}
    </WalletContext.Provider>
  );
};

export function useWalletContext(): WalletContext {
  return useContext(WalletContext);
}

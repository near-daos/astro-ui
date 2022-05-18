import { WalletType } from 'types/config';
import {
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/services/types';
import { createContext, FC, useCallback, useContext, useMemo } from 'react';
import { useBoolean } from 'react-use';

import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikNearService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { ConnectingWalletModal } from 'astro_2.0/features/Auth/components/ConnectingWalletModal';
import {
  PkAndSignature,
  useAvailableAccounts,
  useWallet,
  usePkAndSignature,
} from 'context/WalletContextHooks';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';

export interface WalletContext {
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
  // todo get rid of
  nearService: SputnikNearService | null;
}

const WalletContext = createContext<WalletContext>({} as WalletContext);

export const WrappedWalletContext: FC = ({ children }) => {
  const [
    currentWallet,
    availableWallets,
    getWallet,
    setWallet,
    removePersistedWallet,
  ] = useWallet();
  const availableAccounts = useAvailableAccounts(currentWallet);
  const pkAndSignature = usePkAndSignature(currentWallet);
  const { nearConfig } = configService.get();

  const [connectingToWallet, toggleConnection] = useBoolean(false);

  const router = useRouter();

  const signIn = useCallback(
    async (wallet: WalletService, contractName: string) => {
      toggleConnection(true);

      if (!wallet.isSignedIn()) {
        await wallet.signIn(contractName);
      }

      setWallet(wallet);

      toggleConnection(false);

      sendGAEvent({
        name: GA_EVENTS.SIGN_IN,
        accountId: wallet.getAccountId(),
      });
    },
    [setWallet, toggleConnection]
  );

  const login = useCallback(
    async (walletType: WalletType) => {
      const wallet = getWallet(walletType);

      if (!wallet) {
        return;
      }

      signIn(wallet, nearConfig.contractName);
    },
    [getWallet, nearConfig.contractName, signIn]
  );

  const logout = useCallback(async () => {
    sendGAEvent({
      name: GA_EVENTS.SIGN_OUT,
      accountId: currentWallet?.getAccountId() ?? '',
    });

    CookieService.remove(ACCOUNT_COOKIE);
    removePersistedWallet();
    availableWallets.forEach(wallet => wallet.logout());
    router.reload();
  }, [availableWallets, currentWallet, removePersistedWallet, router]);

  const switchAccount = useCallback(
    async (walletType: WalletType, accountId: string) => {
      // Currently its NEAR wallet specific only
      if (walletType !== WalletType.NEAR) {
        return;
      }

      const nearWallet = getWallet(WalletType.NEAR);

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
      const selectedWallet = getWallet(walletType);

      if (!selectedWallet || !currentWallet) {
        return;
      }

      await signIn(selectedWallet, nearConfig.contractName);

      const currentWalletAccountId = currentWallet.getAccountId();
      const selectedWalletAccountId = selectedWallet.getAccountId();

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
    return {
      nearService: currentWallet ? new SputnikNearService(currentWallet) : null,
      availableWallets: availableWallets.map(availableWallet =>
        availableWallet.walletMeta()
      ),
      accountId: currentWallet?.getAccountId() ?? '',
      currentWallet: currentWallet?.getWalletType() ?? null,
      connectingToWallet,
      availableAccounts,
      pkAndSignature,
      login,
      logout,
      switchAccount,
      switchWallet,
    };
  }, [
    availableAccounts,
    availableWallets,
    connectingToWallet,
    currentWallet,
    login,
    logout,
    pkAndSignature,
    switchAccount,
    switchWallet,
  ]);

  return (
    <WalletContext.Provider value={walletContext}>
      {children}
      {connectingToWallet && (
        <ConnectingWalletModal
          isOpen
          onClose={() => toggleConnection(false)}
          walletType={walletContext?.currentWallet ?? WalletType.NEAR}
        />
      )}
    </WalletContext.Provider>
  );
};

export function useWalletContext(): WalletContext {
  return useContext(WalletContext);
}

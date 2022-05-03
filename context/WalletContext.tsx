import { WalletType } from 'types/config';
import {
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/services/types';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useBoolean, useLocalStorage } from 'react-use';
import { useAvailableWallets } from 'hooks/useAvailableWallets';

import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikNearService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { ConnectingWalletModal } from 'astro_2.0/features/Auth/components/ConnectingWalletModal';

export interface WalletContext {
  availableWallets: WalletMeta[];
  currentWallet: WalletType | null;
  accountId: string;
  connectingToWallet: boolean;
  login: (walletType: WalletType) => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (walletType: WalletType, accountId: string) => void;
  switchWallet: (walletType: WalletType) => void;
  getAvailableAccounts: () => Promise<string[]>;
  getPublicKeyAndSignature: () => Promise<PkAndSignature | null>;
  // todo get rid of
  nearService: SputnikNearService | null;
}

export type PkAndSignature =
  | { publicKey: string | null; signature: string | null }
  | Record<string, never>;

const WalletContext = createContext<WalletContext>({} as WalletContext);

export const WrappedWalletContext: FC = ({ children }) => {
  const availableWallets = useAvailableWallets();
  const [walletContext, setWalletContext] = useState<WalletContext>(
    {} as WalletContext
  );
  const [
    persistedWallet,
    setPersistedWallet,
    removePersistedWallet,
  ] = useLocalStorage('selectedWallet');

  const [connectingToWallet, toggleConnection] = useBoolean(false);

  const router = useRouter();

  const signIn = useCallback(
    async (wallet: WalletService, contractName: string) => {
      toggleConnection(true);

      if (!wallet.isSignedIn()) {
        await wallet.signIn(contractName);
      }

      CookieService.set(ACCOUNT_COOKIE, wallet.getAccountId(), {
        path: '/',
      });

      toggleConnection(false);

      setPersistedWallet(wallet.getWalletType());
    },
    [setPersistedWallet, toggleConnection]
  );

  useEffect(() => {
    const currentWallet = availableWallets.find(
      wallet => wallet.getWalletType() === persistedWallet
    );

    const { nearConfig } = configService.get();

    const selectedWalletContext: WalletContext = {
      nearService: currentWallet ? new SputnikNearService(currentWallet) : null,
      availableWallets: availableWallets.map(wallet => wallet.walletMeta()),
      accountId: currentWallet?.getAccountId() ?? '',
      currentWallet: currentWallet?.getWalletType() ?? null,
      connectingToWallet,
      getAvailableAccounts: async () => {
        if (!currentWallet) {
          return [];
        }

        return currentWallet.getAvailableAccounts();
      },
      async getPublicKeyAndSignature(): Promise<PkAndSignature | null> {
        if (!currentWallet) {
          return null;
        }

        const [publicKey, signature] = await Promise.all([
          currentWallet.getPublicKey(),
          currentWallet.getSignature(),
        ]);

        return {
          publicKey,
          signature,
        };
      },
      async login(walletType: WalletType) {
        const selectedWallet = availableWallets.find(
          wallet => wallet.getWalletType() === walletType
        );

        if (!selectedWallet) {
          return;
        }

        signIn(selectedWallet, nearConfig.contractName);
      },
      async logout(): Promise<void> {
        CookieService.remove(ACCOUNT_COOKIE);
        removePersistedWallet();
        availableWallets.forEach(wallet => wallet.logout());
      },
      async switchAccount(
        walletType: WalletType,
        accountId: string
      ): Promise<void> {
        // Currently its NEAR wallet specific only
        if (walletType !== WalletType.NEAR) {
          return;
        }

        const nearWallet = availableWallets.find(
          wallet => wallet.getWalletType() === WalletType.NEAR
        );

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

        setPersistedWallet(WalletType.NEAR);
      },
      async switchWallet(walletType: WalletType): Promise<void> {
        const selectedWallet = availableWallets.find(
          wallet => wallet.getWalletType() === walletType
        );

        if (!selectedWallet) {
          return;
        }

        await signIn(selectedWallet, nearConfig.contractName);

        if (walletContext.accountId !== selectedWallet.getAccountId()) {
          router.reload();
        }
      },
    };

    setWalletContext(selectedWalletContext);
  }, [
    availableWallets,
    connectingToWallet,
    signIn,
    persistedWallet,
    router,
    setPersistedWallet,
    walletContext.accountId,
    removePersistedWallet,
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

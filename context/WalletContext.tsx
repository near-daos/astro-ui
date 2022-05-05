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
  const [currentWallet, availableWallets, getWallet, setWallet] = useWallet();
  const availableAccounts = useAvailableAccounts();
  const pkAndSignature = usePkAndSignature();
  const [walletContext, setWalletContext] = useState<WalletContext>(
    {} as WalletContext
  );

  const [, , removePersistedWallet] = useLocalStorage('selectedWallet');

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
    },
    [setWallet, toggleConnection]
  );

  useEffect(() => {
    const { nearConfig } = configService.get();

    const selectedWalletContext: WalletContext = {
      nearService: currentWallet ? new SputnikNearService(currentWallet) : null,
      availableWallets,
      accountId: currentWallet?.getAccountId() ?? '',
      currentWallet: currentWallet?.getWalletType() ?? null,
      connectingToWallet,
      availableAccounts,
      pkAndSignature,
      async login(walletType: WalletType) {
        const wallet = getWallet(walletType);

        if (!wallet) {
          return;
        }

        signIn(wallet, nearConfig.contractName);
      },
      async logout(): Promise<void> {
        CookieService.remove(ACCOUNT_COOKIE);
        removePersistedWallet();
        availableWallets.forEach(wallet => getWallet(wallet.id)?.logout());
      },
      async switchAccount(
        walletType: WalletType,
        accountId: string
      ): Promise<void> {
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

        router.reload();
      },
      async switchWallet(walletType: WalletType): Promise<void> {
        const selectedWallet = getWallet(walletType);

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
    router,
    walletContext.accountId,
    removePersistedWallet,
    availableAccounts,
    pkAndSignature,
    currentWallet,
    getWallet,
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

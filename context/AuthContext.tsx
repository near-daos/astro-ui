import { useRouter } from 'next/router';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useCookie, useEffectOnce, useLocalStorage } from 'react-use';

import { ALL_FEED_URL } from 'constants/routing';
import { ACCOUNT_COOKIE, DAO_COOKIE } from 'constants/cookies';

import { SputnikWalletError } from 'errors/SputnikWalletError';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { CookieService } from 'services/CookieService';
import { configService } from 'services/ConfigService';
import { WalletType } from 'types/config';
import { SputnikNearService } from 'services/sputnik';
import { initNearService } from 'utils/init';
import { ConnectingWalletModal } from 'astro_2.0/features/Auth/components/ConnectingWalletModal';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';

export type PkAndSignMethod = () => Promise<
  | {
      publicKey: string | null;
      signature: string | null;
    }
  | Record<string, never>
>;

interface AuthContextInterface {
  accountId: string;
  login: (walletType: WalletType) => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (walletType: WalletType, accountId: string) => void;
  switchWallet: (walletType: WalletType) => void;
  nearService: SputnikNearService | undefined;
  connectionInProgress: boolean;
  availableNearWalletAccounts: string[];
  getPublicKeyAndSignature: PkAndSignMethod;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

export const AuthWrapper: FC = ({ children }) => {
  const router = useRouter();
  const [
    connectingToWallet,
    setConnectingToWallet,
  ] = useState<WalletType | null>(null);
  const [connectionInProgress, setConnectionInProgress] = useState(false);
  const [, , deleteAccountCookie] = useCookie(ACCOUNT_COOKIE);
  const [, , deleteDaoCookie] = useCookie(DAO_COOKIE);
  const [
    selectedWallet,
    setSelectedWallet,
    removeSelectedWallet,
  ] = useLocalStorage('selectedWallet', WalletType.NEAR.toString());

  const [availableNearAccounts, setAvailableNearAccounts] = useState<string[]>(
    []
  );

  const [nearService, setNearService] = useState<
    SputnikNearService | undefined
  >(undefined);

  const [accountId, setAccountId] = useState<string>(
    CookieService.get(ACCOUNT_COOKIE)
  );
  const { nearConfig } = configService.get();

  const logout = useCallback(async () => {
    await nearService?.logout();
    removeSelectedWallet();

    CookieService.remove(ACCOUNT_COOKIE);

    deleteAccountCookie();
    deleteDaoCookie();
    setNearService(undefined);

    setAccountId('');
    router.push(ALL_FEED_URL);
  }, [
    deleteDaoCookie,
    router,
    deleteAccountCookie,
    removeSelectedWallet,
    nearService,
  ]);

  const initService = useCallback(
    async (walletType: WalletType) => {
      setConnectionInProgress(true);

      const service = await initNearService(Number(walletType));

      setConnectionInProgress(false);

      const initState = async () => {
        CookieService.set(ACCOUNT_COOKIE, service?.getAccountId(), {
          path: '/',
        });

        setNearService(service);

        setAccountId(service?.getAccountId() ?? '');

        const availableAccounts = (await service?.getAvailableAccounts()) ?? [];

        setAvailableNearAccounts(availableAccounts);

        setSelectedWallet(walletType.toString());
      };

      if (!service?.isSignedIn()) {
        try {
          await service?.signIn(nearConfig.contractName);
          initState();
        } catch (e) {
          await logout();
        }
      } else {
        initState();
      }
    },
    [logout, setSelectedWallet, nearConfig.contractName]
  );

  useEffectOnce(() => {
    if (!accountId) {
      return;
    }

    initService(Number(selectedWallet));
  });

  const switchAccount = useCallback(
    async (walletType: WalletType, account: string) => {
      const sputnikWallet = nearService?.getWallet(
        walletType
      ) as SputnikWalletService;

      if (!sputnikWallet) {
        return;
      }

      const keypair = await sputnikWallet
        .getKeyStore()
        .getKey(nearConfig.networkId, account);

      const authData = {
        accountId: account,
        allKeys: [keypair.toString()],
      };

      // new wallet instance will take the new auth_key and will reinit the account
      window.localStorage.setItem(
        'sputnik_wallet_auth_key',
        JSON.stringify(authData)
      );

      await initService(WalletType.NEAR);
    },
    [nearService, nearConfig.networkId, initService]
  );

  useEffect(() => {
    if (window.near) {
      window.near.on('accountChanged', () => {
        initService(WalletType.SENDER);
      });
    }
  }, [initService]);

  const switchWallet = useCallback(
    async (walletType: WalletType) => {
      await initNearService(walletType);

      setSelectedWallet(walletType.toString());

      setAccountId(nearService?.getAccountId() ?? '');

      CookieService.set(ACCOUNT_COOKIE, nearService?.getAccountId(), {
        path: '/',
      });
    },
    [nearService, setSelectedWallet]
  );

  const login = useCallback(
    async (walletType: WalletType) => {
      try {
        setConnectingToWallet(walletType);
        await initService(walletType);
        setConnectingToWallet(null);
        router.reload();
      } catch (err) {
        console.warn(err);

        if (err instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: err.message,
            lifetime: 20000,
          });
        }
      }
    },
    [initService, router]
  );

  const getPublicKeyAndSignature = useCallback(async () => {
    if (nearService) {
      const [publicKey, signature] = await Promise.all([
        nearService?.getPublicKey(),
        nearService?.getSignature(),
      ]);

      return {
        publicKey,
        signature,
      };
    }

    return Promise.resolve({});
  }, [nearService]);

  const data = useMemo(
    () => ({
      accountId,
      login,
      logout,
      nearService,
      connectionInProgress,
      availableNearWalletAccounts: availableNearAccounts,
      switchAccount,
      switchWallet,
      getPublicKeyAndSignature,
    }),
    [
      availableNearAccounts,
      accountId,
      connectionInProgress,
      login,
      logout,
      nearService,
      switchAccount,
      switchWallet,
      getPublicKeyAndSignature,
    ]
  );

  return (
    <AuthContext.Provider value={data}>
      {children}
      {connectingToWallet !== null && (
        <ConnectingWalletModal
          isOpen
          onClose={() => setConnectingToWallet(null)}
          walletType={connectingToWallet}
        />
      )}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextInterface {
  return useContext(AuthContext);
}

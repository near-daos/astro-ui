import { useRouter } from 'next/router';
import {
  createContext,
  FC,
  useCallback,
  useContext,
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

interface AuthContextInterface {
  accountId: string;
  login: (walletType: WalletType) => Promise<void>;
  logout: () => Promise<void>;
  nearService: SputnikNearService | undefined;
  isLoggedIn: () => boolean;
}

const AuthContext = createContext<AuthContextInterface>({
  accountId: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: walletType => Promise.resolve(),
  logout: () => Promise.resolve(),
  isLoggedIn: () => false,
  nearService: undefined,
});

export const AuthWrapper: FC = ({ children }) => {
  const router = useRouter();
  const [
    connectingToWallet,
    setConnectingToWallet,
  ] = useState<WalletType | null>(null);
  const [, , deleteAccountCookie] = useCookie(ACCOUNT_COOKIE);
  const [, , deleteDaoCookie] = useCookie(DAO_COOKIE);
  const [
    selectedWallet,
    setSelectedWallet,
    removeSelectedWallet,
  ] = useLocalStorage('selectedWallet', WalletType.NEAR.toString());

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
      const service = await initNearService(Number(walletType));

      const initState = () => {
        CookieService.set(ACCOUNT_COOKIE, service?.getAccountId(), {
          path: '/',
        });

        setNearService(service);

        setAccountId(service?.getAccountId() ?? '');

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

  const data = useMemo(
    () => ({
      accountId,
      login,
      logout,
      nearService,
      isLoggedIn: () => !!nearService,
    }),
    [accountId, login, logout, nearService]
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

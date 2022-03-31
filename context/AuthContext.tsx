import { useRouter } from 'next/router';
import { createContext, FC, useCallback, useContext, useState } from 'react';
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

  const initService = useCallback(
    async (walletType: WalletType) => {
      const service = await initNearService(Number(walletType));

      if (!service?.isSignedIn()) {
        await service?.signIn(nearConfig.contractName);
      }

      CookieService.set(ACCOUNT_COOKIE, service?.getAccountId(), {
        path: '/',
      });

      setNearService(service);

      setAccountId(service?.getAccountId() ?? '');

      setSelectedWallet(walletType.toString());
    },
    [setSelectedWallet, nearConfig.contractName]
  );

  useEffectOnce(() => {
    if (!accountId) {
      return;
    }

    // const selectedWallet =
    //   window.localStorage.getItem('selectedWallet') ?? WalletType.NEAR;

    initService(Number(selectedWallet));
  });

  async function login(walletType: WalletType) {
    try {
      await initService(walletType);
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
  }

  async function logout() {
    await nearService?.logout();
    removeSelectedWallet();

    CookieService.remove(ACCOUNT_COOKIE);

    deleteAccountCookie();
    deleteDaoCookie();
    setNearService(undefined);

    setAccountId('');
    router.push(ALL_FEED_URL);
  }

  const data = {
    accountId,
    login,
    logout,
    nearService,
    isLoggedIn: () => !!accountId,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextInterface {
  return useContext(AuthContext);
}

import { useRouter } from 'next/router';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useCookie, useEffectOnce } from 'react-use';

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
  const [initWallet, setInitWallet] = useState(false);

  const [nearService, setNearService] = useState<
    SputnikNearService | undefined
  >(undefined);

  const [accountId, setAccountId] = useState<string>(
    CookieService.get(ACCOUNT_COOKIE)
  );
  const { nearConfig } = configService.get();

  const initService = useCallback(async () => {
    const selectedWallet =
      window.localStorage.getItem('selectedWallet') ?? WalletType.NEAR;
    const service = await initNearService(Number(selectedWallet));

    if (!service?.isSignedIn()) {
      await service?.signIn(nearConfig.contractName);
    }

    if (Number(selectedWallet) === WalletType.SENDER) {
      CookieService.set(ACCOUNT_COOKIE, service?.getAccountId());
    }

    setNearService(service);
    setInitWallet(false);
    setAccountId(service?.getAccountId() ?? '');
  }, [setNearService, setInitWallet, setAccountId, nearConfig.contractName]);

  useEffectOnce(() => {
    if (!accountId) {
      return;
    }

    initService();
  });

  useEffect(() => {
    if (!initWallet) {
      return;
    }

    initService();
  }, [initService, initWallet]);

  async function login(walletType: WalletType) {
    try {
      window.localStorage.setItem('selectedWallet', walletType.toString());

      setInitWallet(true);
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

    CookieService.remove(ACCOUNT_COOKIE);

    deleteAccountCookie();
    deleteDaoCookie();

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

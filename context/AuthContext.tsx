import { useRouter } from 'next/router';
import { createContext, FC, useContext, useState } from 'react';
import { useCookie } from 'react-use';

import { ALL_FEED_URL } from 'constants/routing';
import { ACCOUNT_COOKIE, DAO_COOKIE } from 'constants/cookies';

import { SputnikWalletError } from 'errors/SputnikWalletError';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { CookieService } from 'services/CookieService';
import { configService } from 'services/ConfigService';
import { WalletType } from 'types/config';
import { SputnikNearService } from 'services/sputnik';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';

interface AuthContextInterface {
  accountId: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  switchWallet: (walletType: WalletType) => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface>({
  accountId: '',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  switchWallet: () => Promise.resolve(),
});

export const AuthWrapper: FC = ({ children }) => {
  const router = useRouter();
  const [, , deleteAccountCookie] = useCookie(ACCOUNT_COOKIE);
  const [, , deleteDaoCookie] = useCookie(DAO_COOKIE);
  const [accountId, setAccountId] = useState<string>(
    CookieService.get(ACCOUNT_COOKIE)
  );
  const { nearConfig } = configService.get();

  async function login() {
    try {
      if (!window.nearService) {
        const walletService = new SputnikWalletService(nearConfig);

        window.nearService = new SputnikNearService(walletService);
      }

      await window.nearService?.signIn(nearConfig.contractName);

      const id = window.nearService?.getAccountId();

      if (id) {
        setAccountId(id);
      }
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

  async function switchWallet(walletType: WalletType) {
    await window.nearService.switchWallet(walletType);
  }

  async function logout() {
    await window.nearService?.logout();

    setAccountId('');
    deleteAccountCookie();
    deleteDaoCookie();

    router.push(ALL_FEED_URL);
  }

  const data = {
    accountId,
    login,
    logout,
    switchWallet,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextInterface {
  return useContext(AuthContext);
}

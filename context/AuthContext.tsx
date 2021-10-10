import { useRouter } from 'next/router';
import { createContext, FC, useContext, useState } from 'react';

import { ALL_DAOS_URL, MY_DAOS_URL } from 'constants/routing';
import { ACCOUNT_COOKIE, DAO_COOKIE } from 'constants/cookies';

import { SputnikService } from 'services/SputnikService';
import { CookieService } from 'services/CookieService';

interface AuthContextInterface {
  accountId: string;
  login: () => void;
  logout: () => void;
}

/* eslint-disable @typescript-eslint/no-empty-function */
const AuthContext = createContext<AuthContextInterface>({
  accountId: '',
  login: () => {},
  logout: () => {}
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const AuthWrapper: FC = ({ children }) => {
  const router = useRouter();
  const [accountId, setAccountId] = useState(SputnikService.getAccountId());

  async function login() {
    try {
      await SputnikService.login();

      const id = SputnikService.getAccountId();

      if (id) {
        setAccountId(id);
      }

      router.push(MY_DAOS_URL);
    } catch (err) {
      // TODO: add error handling
      console.error(err);
    }
  }

  async function logout() {
    await SputnikService.logout();

    setAccountId('');
    CookieService.remove(ACCOUNT_COOKIE);
    CookieService.remove(DAO_COOKIE);

    router.push(ALL_DAOS_URL);
  }

  const data = {
    accountId,
    login,
    logout
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextInterface {
  return useContext(AuthContext);
}

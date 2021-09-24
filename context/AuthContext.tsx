import { useCookie } from 'react-use';
import { useRouter } from 'next/router';
import { createContext, FC, useContext, useState } from 'react';

import { DAO_COOKIE } from 'constants/cookies';
import { SputnikService } from 'services/SputnikService';

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
  const [, , deleteSelectedDaoCookie] = useCookie(DAO_COOKIE);

  async function login() {
    await SputnikService.login();

    const id = SputnikService.getAccountId();

    if (id) {
      setAccountId(id);
    }
  }

  async function logout() {
    deleteSelectedDaoCookie();
    await SputnikService.logout();
    setAccountId('');
    router.push('/all-communities');
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

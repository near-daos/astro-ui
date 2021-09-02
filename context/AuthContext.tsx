import { createContext, FC, useContext, useState } from 'react';

import { SputnikService } from 'services/SputnikService';

interface AuthContextInterface {
  accountId: string;
  login: () => void;
}

const AuthContext = createContext<AuthContextInterface>({
  accountId: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login: () => {}
});

export const AuthWrapper: FC = ({ children }) => {
  const [accountId, setAccountId] = useState(SputnikService.getAccountId());

  async function login() {
    await SputnikService.login();

    const id = SputnikService.getAccountId();

    if (id) {
      setAccountId(id);
    }
  }

  const data = {
    accountId,
    login
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextInterface {
  return useContext(AuthContext);
}

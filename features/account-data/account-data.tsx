import { createContext, useContext } from 'react';
import { DAO } from 'types/dao';

interface IAccountDataContext {
  accountDaos: DAO[];
}

export const AccountDataContext = createContext<IAccountDataContext>({
  accountDaos: []
});

export const useAccountData = (): IAccountDataContext =>
  useContext(AccountDataContext);

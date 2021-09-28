import { createContext, useContext } from 'react';
import { DAO } from 'types/dao';

export const BountyPageContext = createContext({
  dao: {} as DAO
});

interface IBountyPageContext {
  dao: DAO;
}

export const useBountyPageContext = (): IBountyPageContext =>
  useContext(BountyPageContext);

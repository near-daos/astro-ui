import { createContext, useContext } from 'react';
import { DAO } from 'types/dao';
import { Tokens } from 'context/CustomTokensContext';

export const BountyPageContext = createContext<IBountyPageContext>({
  dao: undefined,
  tokens: {}
});

interface IBountyPageContext {
  dao: DAO | undefined;
  tokens: Tokens;
}

export const useBountyPageContext = (): IBountyPageContext =>
  useContext(BountyPageContext);

import { createContext, FC, useContext, useMemo } from 'react';
import { useDaoCustomTokens as useDaoCustomTokensData } from 'hooks/useCustomTokens';
import { TokensContext } from 'context/types';

export const DaoTokensContext = createContext<TokensContext | undefined>(
  undefined
);

export const useDaoCustomTokens = (): TokensContext => {
  const context = useContext(DaoTokensContext);

  if (context === undefined) {
    throw new Error(
      'useDaoCustomTokens was used outside of its DaoTokensContext provider'
    );
  }

  return context;
};

export const DaoTokensProvider: FC = ({ children }) => {
  const { tokens } = useDaoCustomTokensData();

  const contextValue = useMemo(() => {
    return {
      tokens,
    };
  }, [tokens]);

  return (
    <DaoTokensContext.Provider value={contextValue}>
      {children}
    </DaoTokensContext.Provider>
  );
};

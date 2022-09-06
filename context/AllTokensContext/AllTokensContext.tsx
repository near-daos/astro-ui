import { createContext, FC, useContext, useMemo } from 'react';
import { useAllCustomTokens as useAllCustomTokensData } from 'hooks/useCustomTokens';
import { TokensContext } from 'context/types';

export const AllTokensContext = createContext<TokensContext | undefined>(
  undefined
);

export const useAllCustomTokens = (): TokensContext => {
  const context = useContext(AllTokensContext);

  if (context === undefined) {
    throw new Error(
      'useAllCustomTokens was used outside of its AllTokensContext provider'
    );
  }

  return context;
};

export const AllTokensProvider: FC = ({ children }) => {
  const { tokens } = useAllCustomTokensData();

  const contextValue = useMemo(() => {
    return {
      tokens,
    };
  }, [tokens]);

  return (
    <AllTokensContext.Provider value={contextValue}>
      {children}
    </AllTokensContext.Provider>
  );
};

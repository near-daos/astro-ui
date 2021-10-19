import reduce from 'lodash/reduce';
import { createContext, FC, useCallback, useContext, useState } from 'react';

import { TokenType } from 'types/token';
import { SputnikService } from 'services/SputnikService';

export type Tokens = Record<string, TokenType>;

interface CustomTokensContextInterface {
  tokens: Tokens;
  fetchAndSetTokens: () => void;
  setTokens: (tokens: TokenType[]) => void;
}

/* eslint-disable @typescript-eslint/no-empty-function */
const CustomTokensContext = createContext<CustomTokensContextInterface>({
  tokens: {},
  fetchAndSetTokens: () => {},
  setTokens: () => {}
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const CustomTokensProvider: FC = ({ children }) => {
  const [tokens, setInnerTokens] = useState<Tokens>({});

  const setTokens = useCallback((tkns: TokenType[]) => {
    const resToken = reduce(
      tkns,
      (acc, token) => {
        const { id } = token;

        acc[id] = token;

        return acc;
      },
      {} as Tokens
    );

    setInnerTokens(resToken);
  }, []);

  async function fetchAndSetTokens() {
    const t = await SputnikService.getAllTokens();

    setTokens(t);
  }

  const data = {
    tokens,
    setTokens,
    fetchAndSetTokens
  };

  return (
    <CustomTokensContext.Provider value={data}>
      {children}
    </CustomTokensContext.Provider>
  );
};

export function useCustomTokensContext(): CustomTokensContextInterface {
  return useContext(CustomTokensContext);
}

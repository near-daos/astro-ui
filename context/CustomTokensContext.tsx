import reduce from 'lodash/reduce';
import { createContext, FC, useCallback, useContext, useState } from 'react';

import { SputnikService } from 'services/SputnikService';
import { Token } from 'types/token';

export type Tokens = Record<string, Token>;

interface CustomTokensContextInterface {
  tokens: Tokens;
  fetchAndSetTokens: () => void;
  setTokens: (tokens: Token[]) => void;
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

  const setTokens = useCallback((tkns: Token[]) => {
    const resToken = reduce(
      tkns,
      (acc, token) => {
        const { symbol } = token;

        acc[symbol] = token;

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

import { createContext, useContext } from 'react';

import { Token } from 'types/token';

export type Tokens = Record<string, Token>;

interface CustomTokensContextInterface {
  tokens: Tokens;
}

/* eslint-disable @typescript-eslint/no-empty-function */
export const CustomTokensContext = createContext<CustomTokensContextInterface>({
  tokens: {},
});
/* eslint-enable @typescript-eslint/no-empty-function */

export function useCustomTokensContext(): CustomTokensContextInterface {
  return useContext(CustomTokensContext);
}

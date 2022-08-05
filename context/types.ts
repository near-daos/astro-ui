import { Token } from 'types/token';

export type Tokens = Record<string, Token>;

export interface TokensContext {
  tokens: Tokens;
}

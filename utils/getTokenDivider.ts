import { Tokens } from 'context/CustomTokensContext';

import { NEAR_TOKEN } from 'features/types';

import { YOKTO_NEAR } from 'services/sputnik/constants';

export function getTokenDivider(tokens: Tokens, tokenName?: string): number {
  if (!tokenName || tokenName === NEAR_TOKEN) {
    return YOKTO_NEAR;
  }

  const tokenSymbol = tokenName.split('.')[0];
  const ft = tokens[tokenSymbol];

  return ft ? 10 ** ft.decimals : YOKTO_NEAR;
}

import { Tokens } from 'context/CustomTokensContext';

import { NEAR_TOKEN } from 'features/types';

import { yoktoNear } from 'services/SputnikService';

export function getTokenDivider(tokens: Tokens, tokenName?: string): number {
  if (!tokenName || tokenName === NEAR_TOKEN) {
    return yoktoNear;
  }

  const tokenSymbol = tokenName.split('.')[0];
  const ft = tokens[tokenSymbol];

  return ft ? 10 ** ft.decimals : yoktoNear;
}

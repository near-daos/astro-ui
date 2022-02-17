import { Token } from 'types/token';
import { getAccumulatedTokenValue } from 'features/treasury/helpers';

export function getFundsInUsdFromTokens(tokens: Record<string, Token>): string {
  const total = getAccumulatedTokenValue(tokens);

  return `${total.toFixed(2)} USD`;
}

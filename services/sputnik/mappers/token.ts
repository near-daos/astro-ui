import { formatYoktoValue } from 'utils/format';
import { Token, TokenResponse } from 'types/token';

export function mapTokensDTOToTokens(data: TokenResponse[]): Token[] {
  return data.map(item => {
    return {
      ...item,
      balance: formatYoktoValue(item.balance, item.decimals),
    };
  });
}

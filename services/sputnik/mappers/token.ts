import { formatYoktoValue } from 'helpers/format';
import { TokenType } from 'types/token';

export function mapTokensDTOToTokens(data: TokenType[]): TokenType[] {
  return data.map(item => {
    return {
      ...item,
      totalSupply: formatYoktoValue(item.totalSupply)
    };
  });
}

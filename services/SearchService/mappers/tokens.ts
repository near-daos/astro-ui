import { TokenIndex } from 'services/SearchService/types';
import { Token } from 'types/token';
import { formatYoktoValue } from 'utils/format';

export function mapTokenIndexToToken(index: TokenIndex): Token {
  return {
    id: index.token.id,
    tokenId: index.tokenId,
    decimals: index.token.decimals,
    symbol: index.token.symbol,
    icon: index.token.icon,
    totalSupply: index.token.totalSupply,
    balance: formatYoktoValue(index.balance, index.token.decimals),
    price: index.token.price,
  };
}

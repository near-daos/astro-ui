import { TokenIndex } from 'services/SearchService/types';
import { Token } from 'types/token';
import { formatYoktoValue } from 'utils/format';

export function mapTokenIndexToToken(index: TokenIndex): Token {
  return {
    id: index.id,
    tokenId: index.tokenId === 'NEAR' ? '' : index.tokenId,
    decimals: index.decimals,
    symbol: index.symbol,
    icon: index.icon ?? '',
    totalSupply: index.totalSupply,
    balance: formatYoktoValue(index.balance, index.decimals),
    price: index.price ?? '',
  };
}

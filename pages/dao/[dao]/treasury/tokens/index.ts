import Tokens, {
  TokensPageProps
} from 'pages/dao/[dao]/treasury/tokens/TokensPage';
import { SputnikService } from 'services/SputnikService';
import { TokenType } from 'types/token';
import { getChartData } from 'features/treasury/helpers';

interface GetTokensQuery {
  dao: string;
  offset?: number;
  limit?: number;
}

export const getServerSideProps = async ({
  query
}: {
  query: GetTokensQuery;
}): Promise<{
  props: TokensPageProps;
}> => {
  const tokens = await SputnikService.getTokens(query);
  const dao = await SputnikService.getDaoById(query.dao);
  const transactions = await SputnikService.getTransfers(query.dao);

  const totalTokensValue = tokens.reduce(
    (res, item) => res + Number(item.totalSupply),
    Number(dao?.funds) ?? 0
  );

  return {
    props: {
      data: {
        chartData: getChartData(transactions),
        tokens: [
          {
            id: 'NEAR',
            totalSupply: dao?.funds ?? '0',
            icon: 'near',
            name: 'near'
          } as TokenType,
          ...tokens
        ],
        totalValue: dao?.funds ?? '0',
        totalTokensValue
      }
    }
  };
};

export default Tokens;

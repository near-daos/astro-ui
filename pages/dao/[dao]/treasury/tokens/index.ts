import Tokens, {
  TokensPageProps
} from 'pages/dao/[dao]/treasury/tokens/TokensPage';
import { SputnikService } from 'services/SputnikService';
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
  const daoId = query.dao as string;

  const daoTokens = await SputnikService.getAccountTokens(daoId);
  const dao = await SputnikService.getDaoById(daoId);
  const receipts = await SputnikService.getAccountReceipts(daoId);

  return {
    props: {
      data: {
        chartData: getChartData(receipts),
        daoTokens,
        totalValue: dao?.funds ?? '0',
        receipts
      }
    }
  };
};

export default Tokens;

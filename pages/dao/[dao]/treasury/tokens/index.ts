import Tokens, {
  TokensPageProps
} from 'pages/dao/[dao]/treasury/tokens/TokensPage';
import { SputnikHttpService } from 'services/sputnik';
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
  const daoId = query.dao;

  const [daoTokens, dao, receipts] = await Promise.all([
    SputnikHttpService.getAccountTokens(daoId),
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getAccountReceipts(daoId)
  ]);

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

import Bounties, {
  BountiesPageProps
} from 'pages/dao/[dao]/tasks/bounties/BountiesPage';
import { GetServerSideProps } from 'next';
import { SputnikService } from 'services/SputnikService';
import { Tokens } from 'context/CustomTokensContext';
import reduce from 'lodash/reduce';

export const getServerSideProps: GetServerSideProps<BountiesPageProps> = async ({
  query
}) => {
  const daoId = query.dao as string;
  const [dao, tokens, bountiesDone, bounties] = await Promise.all([
    SputnikService.getDaoById(daoId),
    SputnikService.getAccountTokens(daoId),
    SputnikService.getBountiesDone(daoId),
    SputnikService.getBountiesByDaoId(daoId)
  ]);

  if (!dao) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      dao,
      bountiesDone,
      bounties,
      // todo refactor
      tokens: reduce(
        tokens,
        (acc, token) => {
          const { symbol } = token;

          acc[symbol] = token;

          return acc;
        },
        {} as Tokens
      )
    }
  };
};

export default Bounties;

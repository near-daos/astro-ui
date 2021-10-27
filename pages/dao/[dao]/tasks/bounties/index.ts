import Bounties, {
  BountiesPageProps,
} from 'pages/dao/[dao]/tasks/bounties/BountiesPage';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { Tokens } from 'context/CustomTokensContext';
import reduce from 'lodash/reduce';

export const getServerSideProps: GetServerSideProps<BountiesPageProps> = async ({
  query,
}) => {
  const daoId = query.dao as string;
  const [dao, tokens, bountiesDone, bounties] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getAccountTokens(daoId),
    SputnikHttpService.getBountiesDone(daoId),
    SputnikHttpService.getBountiesByDaoId(daoId),
  ]);

  if (!dao) {
    return {
      notFound: true,
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
      ),
    },
  };
};

export default Bounties;

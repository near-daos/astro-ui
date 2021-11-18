import Bounties, {
  BountiesPageProps,
} from 'pages/dao/[dao]/tasks/bounties/BountiesPage';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';

export const getServerSideProps: GetServerSideProps<BountiesPageProps> = async ({
  query,
}) => {
  const daoId = query.dao as string;
  const [dao, bounties, policyAffectsProposals] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getBountiesByDaoId(daoId),
    SputnikHttpService.findPolicyAffectsProposals(daoId),
  ]);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dao,
      bounties,
      policyAffectsProposals,
    },
  };
};

export default Bounties;

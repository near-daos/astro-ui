import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { ProposalCategories, ProposalStatuses } from 'types/proposal';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import DaoPage from './DaoPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { status, category, dao: daoId } = query;

  const [dao, initialProposalsData, policyAffectsProposals] = await Promise.all(
    [
      SputnikHttpService.getDaoFromFeedById(daoId as string),
      SputnikHttpService.getProposalsList({
        offset: 0,
        limit: LIST_LIMIT_DEFAULT,
        daoId: daoId as string,
        category: category as ProposalCategories,
        status: status as ProposalStatuses,
      }),
      SputnikHttpService.findPolicyAffectsProposals(daoId as string),
    ]
  );

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dao,
      initialProposalsData,
      policyAffectsProposals,
    },
  };
};

export default DaoPage;

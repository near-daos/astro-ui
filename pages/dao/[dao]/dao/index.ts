import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { ProposalCategories, ProposalStatuses } from 'types/proposal';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import DaoPage from './DaoPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { proposalStatus, proposalCagegory, dao: daoId } = query;

  const [
    dao,
    tokens,
    initialProposalsData,
    policyAffectsProposals,
  ] = await Promise.all([
    SputnikHttpService.getDaoFromFeedById(daoId as string),
    SputnikHttpService.getAccountTokens(daoId as string),
    SputnikHttpService.getProposalsList({
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoId: daoId as string,
      category: proposalCagegory as ProposalCategories,
      status: proposalStatus as ProposalStatuses,
    }),
    SputnikHttpService.findPolicyAffectsProposals(daoId as string),
  ]);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dao,
      tokens,
      initialProposalsData,
      policyAffectsProposals,
    },
  };
};

export default DaoPage;

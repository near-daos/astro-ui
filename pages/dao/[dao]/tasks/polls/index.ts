import Polls, { PollsPageProps } from 'pages/dao/[dao]/tasks/polls/PollsPage';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalCategories, ProposalStatuses } from 'types/proposal';

export default Polls;

export const getServerSideProps: GetServerSideProps<PollsPageProps> = async ({
  query,
}) => {
  const daoId = query.dao as string;
  const status = query.status as ProposalStatuses;

  const [dao, initialPollsData] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getProposalsList({
      category: ProposalCategories.Polls,
      daoId,
      status,
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoFilter: 'All DAOs',
    }),
  ]);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dao,
      initialPollsData,
    },
  };
};

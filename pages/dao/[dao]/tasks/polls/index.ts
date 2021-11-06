import Polls, { PollsPageProps } from 'pages/dao/[dao]/tasks/polls/PollsPage';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { FeedCategories, ProposalStatuses } from 'types/proposal';

export default Polls;

export const getServerSideProps: GetServerSideProps<PollsPageProps> = async ({
  query,
}) => {
  const daoId = query.dao as string;
  const status = query.status as ProposalStatuses;

  const dao = await SputnikHttpService.getDaoById(daoId);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  const initialPollsData = await SputnikHttpService.getProposalsList({
    daoViewFilter: dao.name,
    category: FeedCategories.Polls,
    status,
    offset: 0,
    limit: LIST_LIMIT_DEFAULT,
    daoFilter: 'All DAOs',
  });

  return {
    props: {
      dao,
      initialPollsData,
    },
  };
};

import Polls from 'pages/tasks/polls/PollsPage';

import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';

export async function getServerSideProps({
  query
}: {
  query: string;
}): Promise<{
  props: { data: Proposal[] };
}> {
  const data = await SputnikService.getProposals(query);

  return {
    props: {
      data
    }
  };
}

export default Polls;

import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import {
  DaoFilterValues,
  ProposalFilterValues
} from 'features/member-home/types';
import { SputnikService } from 'services/SputnikService';
import { mapBountyResponseToBounty } from 'services/SputnikService/mappers/bounty';
import { Bounty } from 'components/cards/bounty-card/types';
import { Proposal } from 'types/proposal';
import { MyFeedPage } from './MyFeedPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { tab, daoViewFilter } = query;
  const accountId = CookieService.get('account');

  let proposals: Proposal[] = [];
  let bounties: Bounty[] = [];

  const filter = {
    daoFilter: 'My DAOs' as DaoFilterValues,
    proposalFilter: 'Active proposals' as ProposalFilterValues,
    daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null
  };

  switch (tab) {
    case '1': {
      bounties = await SputnikService.getBounties().then(result => {
        return result
          .map(mapBountyResponseToBounty)
          .filter(bounty =>
            bounty.claimedBy.find(
              claim => claim.accountId === SputnikService.getAccountId()
            )
          );
      });
      break;
    }
    case '2': {
      proposals = await SputnikService.getFilteredProposals(
        {
          ...filter,
          proposalFilter: 'Polls' as ProposalFilterValues
        },
        accountId
      );
      break;
    }
    case '0':
    default: {
      proposals = await SputnikService.getFilteredProposals(
        {
          ...filter,
          proposalFilter: 'Active proposals' as ProposalFilterValues
        },
        accountId
      );
    }
  }

  return {
    props: {
      proposals,
      bounties,
      filter
    }
  };
};

export default MyFeedPage;

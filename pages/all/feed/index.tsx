import { GetServerSideProps } from 'next';

import { Proposal } from 'types/proposal';
import { Token } from 'types/token';

import { Bounty } from 'components/cards/bounty-card/types';

import {
  DaoFilterValues,
  ProposalFilterOptions,
  ProposalFilterStatusOptions,
} from 'features/member-home/types';

import { mapBountyResponseToBounty } from 'services/sputnik/mappers';
import { filterProposalsByStatus } from 'features/feed/helpers';
import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import AllFeedPage from './AllFeedPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { tab, daoViewFilter, status } = query;
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  const filter = {
    daoFilter: 'All DAOs' as DaoFilterValues,
    proposalFilter: 'Active proposals' as ProposalFilterOptions,
    daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null,
    status: status ? (status as ProposalFilterStatusOptions) : null,
  };

  let proposalFilter: ProposalFilterOptions;

  switch (tab) {
    case '1': {
      proposalFilter = 'Governance';
      break;
    }
    case '2': {
      proposalFilter = 'Financial';
      break;
    }
    case '4': {
      proposalFilter = 'Polls';
      break;
    }
    case '5': {
      proposalFilter = 'Groups';
      break;
    }
    case '0':
    default: {
      proposalFilter = null;
    }
  }

  const [apiTokens, bounties, proposals]: [
    Token[],
    Bounty[],
    Proposal[]
  ] = await Promise.all([
    SputnikHttpService.getAllTokens(),
    Promise.resolve().then(async () => {
      if (tab === '3') {
        const result = await SputnikHttpService.getBounties();

        return result
          .map(mapBountyResponseToBounty)
          .filter(bounty =>
            bounty.claimedBy.find(claim => claim.accountId === accountId)
          );
      }

      return [];
    }),
    Promise.resolve().then(async () => {
      if (tab === '3') return [];

      let result = await SputnikHttpService.getFilteredProposals(
        {
          ...filter,
          proposalFilter,
        },
        accountId
      );

      if (filter.status === 'Active proposals') {
        result = result.filter(item => item.status === 'InProgress');
      } else if (filter.status === 'Failed') {
        const failedStatuses = ['Rejected', 'Expired', 'Moved'];

        result = result.filter(item => failedStatuses.includes(item.status));
      }

      return result;
    }),
  ]);

  return {
    props: {
      proposals: filterProposalsByStatus(filter.status, proposals),
      bounties,
      filter,
      apiTokens,
    },
  };
};

export default AllFeedPage;

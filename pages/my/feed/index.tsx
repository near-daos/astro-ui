import { GetServerSideProps } from 'next';
import isEmpty from 'lodash/isEmpty';

import { Proposal } from 'types/proposal';

import { Bounty } from 'components/cards/bounty-card/types';

import {
  DaoFilterValues,
  ProposalFilterOptions,
  ProposalFilterStatusOptions
} from 'features/member-home/types';

import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';
import { mapBountyResponseToBounty } from 'services/sputnik/mappers';
import { filterProposalsByStatus } from 'features/feed/helpers';

import { ACCOUNT_COOKIE } from 'constants/cookies';
import MyFeedPage from './MyFeedPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { tab, daoViewFilter, status } = query;
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  let proposals: Proposal[] = [];
  let bounties: Bounty[] = [];

  const filter = {
    daoFilter: 'My DAOs' as DaoFilterValues,
    proposalFilter: 'Active proposals' as ProposalFilterOptions,
    daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null,
    status: status ? (status as ProposalFilterStatusOptions) : null
  };

  let proposalFilter;

  switch (tab) {
    case '1': {
      proposalFilter = 'Governance' as ProposalFilterOptions;
      break;
    }
    case '2': {
      proposalFilter = 'Financial' as ProposalFilterOptions;
      break;
    }
    case '4': {
      proposalFilter = 'Polls' as ProposalFilterOptions;
      break;
    }
    case '5': {
      proposalFilter = 'Groups' as ProposalFilterOptions;
      break;
    }
    case '0':
    default: {
      proposalFilter = null;
    }
  }

  if (tab === '3') {
    bounties = await SputnikService.getBounties().then(result => {
      return result
        .map(mapBountyResponseToBounty)
        .filter(bounty =>
          bounty.claimedBy.find(claim => claim.accountId === accountId)
        );
    });
  } else {
    proposals = await SputnikService.getFilteredProposals(
      {
        ...filter,
        proposalFilter
      },
      accountId
    );
  }

  // Additional filtering for expired proposals
  if (filter.status === 'Active proposals') {
    proposals = proposals.filter(item => item.status === 'InProgress');
  } else if (filter.status === 'Failed') {
    const failedStatuses = ['Rejected', 'Expired', 'Moved'];

    proposals = proposals.filter(item => failedStatuses.includes(item.status));
  }

  const apiTokens = (await SputnikService.getAllTokens()) || [];

  // If no proposals found and it is not because of filter -> redirect to all communities
  if (isEmpty(query) && proposals.length === 0) {
    return {
      redirect: {
        destination: '/all/feed',
        permanent: true
      }
    };
  }

  return {
    props: {
      proposals: filterProposalsByStatus(filter.status, proposals),
      bounties,
      filter,
      apiTokens
    }
  };
};

export default MyFeedPage;

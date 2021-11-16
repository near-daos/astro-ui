import { GetServerSideProps } from 'next';
import isEmpty from 'lodash/isEmpty';

import { Proposal } from 'types/proposal';

import {
  DaoFilterValues,
  ProposalFilterOptions,
  ProposalFilterStatusOptions
} from 'features/member-home/types';

import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';
import { filterProposalsByStatus } from 'features/feed/helpers';

import { ACCOUNT_COOKIE } from 'constants/cookies';
import { ALL_FEED_URL } from 'constants/routing';
import MyFeedPage from './MyFeedPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { type, tab, daoViewFilter } = query;
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  let proposals: Proposal[] = [];

  function getStatus(): ProposalFilterStatusOptions {
    switch (tab) {
      case '1': {
        return 'Active proposals';
      }
      case '2': {
        return 'Approved';
      }
      case '3': {
        return 'Failed';
      }
      default: {
        return null;
      }
    }
  }

  const filter = {
    daoFilter: 'My DAOs' as DaoFilterValues,
    proposalFilter: 'Active proposals' as ProposalFilterOptions,
    daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null,
    status: getStatus()
  };

  let proposalFilter;

  switch (type) {
    case 'Governance': {
      proposalFilter = 'Governance' as ProposalFilterOptions;
      break;
    }
    case 'Financial': {
      proposalFilter = 'Financial' as ProposalFilterOptions;
      break;
    }
    case 'Polls': {
      proposalFilter = 'Polls' as ProposalFilterOptions;
      break;
    }
    case 'Groups': {
      proposalFilter = 'Groups' as ProposalFilterOptions;
      break;
    }
    case 'Bounties': {
      proposalFilter = 'Bounties' as ProposalFilterOptions;
      break;
    }
    case '0':
    default: {
      proposalFilter = null;
    }
  }

  proposals = await SputnikService.getFilteredProposals(
    {
      ...filter,
      proposalFilter
    },
    accountId
  );

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
        destination: ALL_FEED_URL,
        permanent: true
      }
    };
  }

  return {
    props: {
      proposals: filterProposalsByStatus(filter.status, proposals),
      filter,
      apiTokens
    }
  };
};

export default MyFeedPage;

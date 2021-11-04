// import React from 'react';
// import { NextPage, GetServerSideProps } from 'next';
// import { Proposal } from 'types/proposal';
// import { Bounty } from 'components/cards/bounty-card/types';
// import {
//   ProposalsFilter,
//   DaoFilterValues,
//   ProposalFilterOptions,
//   ProposalFilterStatusOptions,
// } from 'features/member-home/types';
// import { Feed } from 'features/feed/feed';
// import { Token } from 'types/token';
//
// import { mapBountyResponseToBounty } from 'services/sputnik/mappers';
// import { filterProposalsByStatus } from 'features/feed/helpers';
// import { CookieService } from 'services/CookieService';
// import { SputnikHttpService } from 'services/sputnik';
//
// import { ACCOUNT_COOKIE } from 'constants/cookies';
//
// interface HomeProps {
//   proposals: Proposal[];
//   bounties: Bounty[];
//   filter: ProposalsFilter;
//   apiTokens: Token[];
// }
//
// const AllFeedPage: NextPage<HomeProps> = props => {
//   return <Feed title="All Activity Feed" {...props} />;
// };
//
// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const { tab, daoViewFilter, status } = query;
//   const accountId = CookieService.get(ACCOUNT_COOKIE);
//
//   const filter = {
//     daoFilter: 'All DAOs' as DaoFilterValues,
//     proposalFilter: 'Active proposals' as ProposalFilterOptions,
//     daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null,
//     status: status ? (status as ProposalFilterStatusOptions) : null,
//   };
//
//   let proposalFilter: ProposalFilterOptions;
//
//   switch (tab) {
//     case '1': {
//       proposalFilter = 'Governance';
//       break;
//     }
//     case '2': {
//       proposalFilter = 'Financial';
//       break;
//     }
//     case '4': {
//       proposalFilter = 'Polls';
//       break;
//     }
//     case '5': {
//       proposalFilter = 'Groups';
//       break;
//     }
//     case '0':
//     default: {
//       proposalFilter = null;
//     }
//   }
//
//   const [apiTokens, bounties, proposals]: [
//     Token[],
//     Bounty[],
//     Proposal[]
//   ] = await Promise.all([
//     SputnikHttpService.getAllTokens(),
//     Promise.resolve().then(async () => {
//       if (tab === '3') {
//         const result = await SputnikHttpService.getBounties();
//
//         return result.data
//           .map(mapBountyResponseToBounty)
//           .filter(bounty =>
//             bounty.claimedBy.find(claim => claim.accountId === accountId)
//           );
//       }
//
//       return [];
//     }),
//     Promise.resolve().then(async () => {
//       if (tab === '3') return [];
//
//       let result = await SputnikHttpService.getFilteredProposals(
//         {
//           ...filter,
//           proposalFilter,
//         },
//         accountId
//       );
//
//       if (filter.status === 'Active proposals') {
//         result = result.filter(item => item.status === 'InProgress');
//       } else if (filter.status === 'Failed') {
//         const failedStatuses = ['Rejected', 'Expired', 'Moved'];
//
//         result = result.filter(item => failedStatuses.includes(item.status));
//       }
//
//       return result;
//     }),
//   ]);
//
//   return {
//     props: {
//       proposals: filterProposalsByStatus(filter.status, proposals),
//       bounties,
//       filter,
//       apiTokens,
//     },
//   };
// };
//
// export default AllFeedPage;

/**
 * NEW FEED CODEBASE START BELOW
 * */

import React from 'react';
import { GetServerSideProps } from 'next';

import { ProposalsQueries } from 'services/sputnik/types/proposals';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import Feed from 'astro_2.0/components/Feed';

export const getServerSideProps: GetServerSideProps<React.ComponentProps<
  typeof Feed
>> = async ({ query }) => {
  const { category, status } = query as ProposalsQueries;
  const res = await SputnikHttpService.getProposalsList({
    category,
    status,
    limit: LIST_LIMIT_DEFAULT,
    daoFilter: 'All DAOs',
  });

  return {
    props: {
      initialProposals: res,
    },
  };
};

export default Feed;

import { GetServerSideProps } from 'next';

import { getProposalFilter } from 'features/member-home';
import { DaoFilterValues } from 'features/member-home/types';

import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';

import { AllFeedPage } from './AllFeedPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { tab, daoFilter, daoViewFilter } = query;
  const accountId = CookieService.get('account');

  const filter = {
    daoFilter: daoFilter ? (daoFilter as DaoFilterValues) : 'All DAOs',
    proposalFilter: getProposalFilter(tab),
    daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null
  };

  const proposals = await SputnikService.getFilteredProposals(
    filter,
    accountId
  );

  return {
    props: {
      proposals
    }
  };
};

export default AllFeedPage;

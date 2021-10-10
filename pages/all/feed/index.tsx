import { GetServerSideProps } from 'next';

import { getProposalFilter } from 'features/member-home';
import { DaoFilterValues } from 'features/member-home/types';

import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';

import { ACCOUNT_COOKIE } from 'constants/cookies';
import AllFeedPage from './AllFeedPage';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { tab, daoViewFilter } = query;
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  const filter = {
    daoFilter: 'All DAOs' as DaoFilterValues,
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

import React from 'react';
import { GetServerSideProps } from 'next';

import { Feed } from 'astro_2.0/components/Feed';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

const MyFeedPage = (props: React.ComponentProps<typeof Feed>): JSX.Element => (
  <Feed {...props} />
);

export const getServerSideProps: GetServerSideProps<React.ComponentProps<
  typeof Feed
>> = async ({ query }) => {
  const { category, status } = query as ProposalsQueries;
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  if (!accountId) {
    return {
      redirect: {
        permanent: true,
        destination: '/all/feed',
      },
    };
  }

  const res = await SputnikHttpService.getProposalsList(
    {
      category,
      status,
      limit: LIST_LIMIT_DEFAULT,
      daoFilter: 'All DAOs',
    },
    accountId
  );

  return {
    props: {
      initialProposals: res,
    },
  };
};

export default MyFeedPage;

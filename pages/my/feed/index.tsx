import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { GetServerSideProps } from 'next';

import { ProposalsFeedStatuses } from 'types/proposal';
import { Feed } from 'astro_2.0/features/Feed';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ALL_FEED_URL } from 'constants/routing';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

const MyFeedPage = (props: React.ComponentProps<typeof Feed>): JSX.Element => (
  <Feed {...props} title="My proposals feed" />
);

export const getServerSideProps: GetServerSideProps<React.ComponentProps<
  typeof Feed
>> = async ({ query, locale = 'en' }) => {
  const {
    category,
    status = ProposalsFeedStatuses.All,
  } = query as ProposalsQueries;
  const accountId = CookieService.get(ACCOUNT_COOKIE);

  if (!accountId) {
    return {
      redirect: {
        permanent: true,
        destination: ALL_FEED_URL,
      },
    };
  }

  const res = await SputnikHttpService.getProposalsListByAccountId(
    {
      category,
      status,
      limit: LIST_LIMIT_DEFAULT,
      daoFilter: 'All DAOs',
      accountId,
    },
    accountId
  );

  // If no proposals found and it is not because of filter -> redirect to global feed
  if (isEmpty(query) && res?.data?.length === 0) {
    return {
      redirect: {
        destination: ALL_FEED_URL,
        permanent: true,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      initialProposals: res,
      initialProposalsStatusFilterValue: status,
    },
  };
};

export default MyFeedPage;

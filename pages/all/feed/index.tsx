import React from 'react';
import { GetServerSideProps } from 'next';

import { ProposalsQueries } from 'services/sputnik/types/proposals';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { Feed } from 'astro_2.0/features/Feed';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

const MyFeedPage = (props: React.ComponentProps<typeof Feed>): JSX.Element => (
  <Feed {...props} title="Global Feed" />
);

export const getServerSideProps: GetServerSideProps<React.ComponentProps<
  typeof Feed
>> = async ({ query, locale = 'en' }) => {
  const { category, status } = query as ProposalsQueries;
  const res = await SputnikHttpService.getProposalsList({
    category,
    status,
    limit: LIST_LIMIT_DEFAULT,
    daoFilter: 'All DAOs',
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig)),
      initialProposals: res,
    },
  };
};

export default MyFeedPage;

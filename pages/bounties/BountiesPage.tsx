import React, { VFC } from 'react';
import Head from 'next/head';

import { BountyContext } from 'types/bounties';

import { Bounties } from 'astro_3.0/features/Bounties';

import { PaginationResponse } from 'types/api';

export interface BountiesPageProps {
  bountiesContext: PaginationResponse<BountyContext[]> | null;
}

const BountiesPage: VFC<BountiesPageProps> = ({ bountiesContext }) => {
  return (
    <>
      <Head>
        <title>Bounties</title>
      </Head>
      <Bounties initialData={bountiesContext} />
    </>
  );
};

export default BountiesPage;

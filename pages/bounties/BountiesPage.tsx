import React, { ReactNode } from 'react';
import Head from 'next/head';

import { BountyContext } from 'types/bounties';

import { Bounties } from 'astro_3.0/features/Bounties';

import { PaginationResponse } from 'types/api';
import { Page } from 'pages/_app';

export interface BountiesPageProps {
  bountiesContext: PaginationResponse<BountyContext[]> | null;
}

const BountiesPage: Page<BountiesPageProps> = ({ bountiesContext }) => {
  return (
    <>
      <Head>
        <title>Bounties</title>
      </Head>
      <Bounties initialData={bountiesContext} />
    </>
  );
};

BountiesPage.getLayout = function getLagout(page: ReactNode) {
  return <>{page}</>;
};

export default BountiesPage;

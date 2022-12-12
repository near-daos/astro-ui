import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { BountyContext } from 'types/bounties';

import { Bounties } from 'astro_3.0/features/Bounties';
import { BountiesData, BountiesV2 } from 'astro_3.0/features/BountiesV2';

import { PaginationResponse } from 'types/api';
import { Page } from 'pages/_app';

export interface BountiesPageProps {
  bountiesContext: PaginationResponse<BountyContext[]> | null;

  // feature flag: use-bounties-list-v2
  bountiesData: BountiesData | null;
}

const BountiesPage: Page<BountiesPageProps> = ({
  bountiesContext,
  bountiesData,
}) => {
  const { useBountiesListV2 } = useFlags();

  return (
    <>
      <Head>
        <title>Bounties</title>
      </Head>

      {useBountiesListV2 ? (
        <BountiesV2 initialData={bountiesData} />
      ) : (
        <Bounties initialData={bountiesContext} />
      )}
    </>
  );
};

BountiesPage.getLayout = function getLagout(page: ReactNode) {
  return <>{page}</>;
};

export default BountiesPage;

import React, { FC } from 'react';

import { DaoTokensContext } from 'context/DaoTokensContext';
import { AllTokensContext } from 'context/AllTokensContext';

import { useAllCustomTokens } from 'hooks/useCustomTokens';

import { MainLayout } from 'astro_3.0/features/MainLayout';
import { BountiesFeedFilters } from 'astro_3.0/features/Bounties/components/BountiesFeedFilters';
import { BountiesFeed } from 'astro_3.0/features/Bounties/components/BountiesFeed';

import { PaginationResponse } from 'types/api';
import { BountyContext } from 'types/bounties';

interface Props {
  initialData: PaginationResponse<BountyContext[]> | null;
}

export const Bounties: FC<Props> = ({ initialData }) => {
  const { tokens } = useAllCustomTokens();

  return (
    <AllTokensContext.Provider value={{ tokens }}>
      <DaoTokensContext.Provider value={{ tokens }}>
        <MainLayout>
          <h1>Bounties</h1>
          <BountiesFeedFilters />
          <BountiesFeed initialData={initialData} />
        </MainLayout>
      </DaoTokensContext.Provider>
    </AllTokensContext.Provider>
  );
};

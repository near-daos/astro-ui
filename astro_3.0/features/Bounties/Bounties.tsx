import React, { FC } from 'react';

import { DaoTokensContext } from 'context/DaoTokensContext';
import { AllTokensContext } from 'context/AllTokensContext';

import { useAllCustomTokens } from 'hooks/useCustomTokens';

import { BountiesFeed } from 'astro_3.0/features/Bounties/components/BountiesFeed';

import { PaginationResponse } from 'types/api';
import { BountyContext } from 'types/bounties';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { BountiesFeedNext } from './components/BountiesFeedNext';

interface Props {
  initialData: PaginationResponse<BountyContext[]> | null;
}

export const Bounties: FC<Props> = ({ initialData }) => {
  const { tokens } = useAllCustomTokens();
  const { useOpenSearchDataApi } = useFlags();

  function renderFeed() {
    if (useOpenSearchDataApi === undefined) {
      return null;
    }

    return useOpenSearchDataApi ? (
      <BountiesFeedNext />
    ) : (
      <BountiesFeed initialData={initialData} />
    );
  }

  return (
    <AllTokensContext.Provider value={{ tokens }}>
      <DaoTokensContext.Provider value={{ tokens }}>
        {renderFeed()}
      </DaoTokensContext.Provider>
    </AllTokensContext.Provider>
  );
};

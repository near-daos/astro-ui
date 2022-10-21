import React, { FC, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import { BountiesFeedFilters } from 'astro_3.0/features/Bounties/components/BountiesFeedFilters';
import { BountiesListView } from 'astro_2.0/features/Bounties/components/BountiesListView';
import { Pagination } from 'components/Pagination';

import { useBounties } from 'services/ApiService/hooks/useBounties';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { DAO } from 'types/dao';
import { Tokens } from 'types/token';
import { ProposalVariant } from 'types/proposal';

import styles from 'astro_3.0/features/Bounties/components/BountiesFeedNext/BountiesFeedNext.module.scss';

interface Props {
  dao?: DAO;
  tokens?: Tokens;
  handleCreateProposal?: (
    id: number,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void;
}

export const DaoBountiesList: FC<Props> = ({
  dao,
  tokens,
  handleCreateProposal,
}) => {
  const [total, setTotal] = useState(0);
  const [activePage, setActivePage] = useState(0);

  const { data } = useBounties(activePage);

  const pageChangeHandler = useCallback(({ selected }) => {
    setActivePage(selected);
  }, []);

  const pageCount = Math.ceil(total / LIST_LIMIT_DEFAULT);
  const bountiesContext = data ? data.data : [];

  useEffect(() => {
    if (!data) {
      return;
    }

    if (total !== data.total) {
      setTotal(data.total);
    }
  }, [data, total]);

  return (
    <main className={cn(styles.root)}>
      <BountiesFeedFilters />
      <BountiesListView
        bountiesContext={bountiesContext}
        dao={dao}
        tokens={tokens}
        handleCreateProposal={handleCreateProposal}
      />
      <Pagination
        pageCount={pageCount}
        onPageActive={pageChangeHandler}
        onPageChange={pageChangeHandler}
      />
    </main>
  );
};

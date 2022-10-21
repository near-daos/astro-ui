import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useMedia } from 'react-use';

import {
  CategoriesFeedFilter,
  ListItem,
} from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';

import { IconName } from 'components/Icon';
import { MobileFilters } from 'astro_3.0/features/ProposalsFeed/components/MobileFilters';

import { BountiesFeedSort } from 'astro_3.0/features/Bounties/components/BountiesFeedSort';

import styles from './BountiesFeedFilters.module.scss';

interface Props {
  className?: string;
}

const FEED_OPTIONS = [
  {
    label: 'Proposal Phase',
    value: 'proposalPhase',
  },
  {
    label: 'Available Bounty',
    value: 'availableBounty',
  },
  {
    label: 'In Progress',
    value: 'inProgress',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
];

export const BountiesFeedFilters: FC<Props> = ({ className }) => {
  const isMobile = useMedia('(max-width: 1023px)');

  const statusOptions = useMemo<ListItem[]>(() => {
    return [
      {
        value: 'proposer',
        label: 'My',
        icon: 'filterClock' as IconName,
        queryName: 'bountyFilter',
      },
      {
        value: 'numberOfClaims',
        label: 'Empty',
        icon: 'filterClock' as IconName,
        queryName: 'bountyFilter',
      },
    ];
  }, []);

  const categoriesOptions = useMemo<ListItem[]>(
    () =>
      FEED_OPTIONS.map(
        item =>
          ({
            ...item,
            queryName: 'bountyPhase',
          } as ListItem)
      ),
    []
  );

  const filterOptions = useMemo(() => {
    if (isMobile) {
      return statusOptions;
    }

    return [...statusOptions, ...categoriesOptions];
  }, [categoriesOptions, isMobile, statusOptions]);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.scrollableFilter}>
        <CategoriesFeedFilter
          list={filterOptions}
          disabled={false}
          hideAllOption
          shallowUpdate
          className={styles.categoriesFilter}
        />
      </div>

      <div className={styles.last}>
        <BountiesFeedSort />
      </div>

      <div className={styles.mobileFilters}>
        <MobileFilters />
      </div>
    </div>
  );
};

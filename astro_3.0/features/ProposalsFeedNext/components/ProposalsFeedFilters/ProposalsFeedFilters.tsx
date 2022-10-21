import React, { FC, useMemo } from 'react';
import clsx from 'classnames';

import { IconName } from 'components/Icon';

import { ProposalsFeedStatuses } from 'types/proposal';

import { ListItem } from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';
import { CategoriesFeedFilter } from 'astro_3.0/features/ProposalsFeedNext/components/CategoriesFeedFilter';
import { AdditionalFilters } from 'astro_3.0/features/ProposalsFeedNext/components/AdditionalFilters';

import { FEED_CATEGORIES } from 'constants/proposals';

import styles from './ProposalsFeedFilters.module.scss';

interface Props {
  className?: string;
  onFilterChange?: () => void;
  hideCategories?: boolean;
}

export const ProposalsFeedFilters: FC<Props> = ({
  className,
  onFilterChange,
  hideCategories,
}) => {
  const statusOptions = useMemo<ListItem[]>(() => {
    return [
      {
        value: ProposalsFeedStatuses.VoteNeeded,
        label: 'Vote',
        icon: 'filterClock' as IconName,
        queryName: 'status',
      },
      {
        value: ProposalsFeedStatuses.Approved,
        label: 'Approved',
        icon: 'filterCheck' as IconName,
        queryName: 'status',
      },
      {
        value: ProposalsFeedStatuses.Failed,
        label: 'Failed',
        icon: 'filterClose' as IconName,
        queryName: 'status',
      },
    ];
  }, []);

  const categoriesOptions = useMemo<ListItem[]>(
    () =>
      hideCategories
        ? []
        : FEED_CATEGORIES.map(
            item =>
              ({
                ...item,
                queryName: 'category',
              } as ListItem)
          ),
    [hideCategories]
  );

  const filterOptions = useMemo(() => {
    return [...statusOptions, ...categoriesOptions];
  }, [categoriesOptions, statusOptions]);

  return (
    <div className={clsx(styles.root, className)}>
      <AdditionalFilters />
      <div className={styles.scrollableFilter}>
        <CategoriesFeedFilter
          onFilterChange={onFilterChange}
          list={filterOptions}
          disabled={false}
          className={styles.categoriesFilter}
        />
      </div>
    </div>
  );
};

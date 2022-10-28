import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useMedia } from 'react-use';

import {
  CategoriesFeedFilter,
  ListItem,
} from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';
import { IconName } from 'components/Icon';
import { FeedSort } from 'astro_3.0/components/FeedSort';
import { DraftsMobileFilters } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftsMobileFilters';

import { FEED_CATEGORIES } from 'constants/proposals';

import styles from './DraftsFeedFilters.module.scss';

interface Props {
  className?: string;
}

export const DraftsFeedFilters: FC<Props> = ({ className }) => {
  const isMobile = useMedia('(max-width: 1023px)');

  const statusOptions = useMemo<ListItem[]>(() => {
    return [
      {
        value: '',
        label: 'All',
        icon: 'filterClock' as IconName,
        queryName: 'state',
      },
      {
        value: 'open',
        label: 'On discussion',
        icon: 'filterClock' as IconName,
        queryName: 'state',
      },
      {
        value: 'closed',
        label: 'Converted to proposal',
        icon: 'filterClock' as IconName,
        queryName: 'state',
      },
    ];
  }, []);

  const categoriesOptions = useMemo<ListItem[]>(
    () =>
      FEED_CATEGORIES.map(
        item =>
          ({
            ...item,
            queryName: 'category',
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
        <FeedSort />
      </div>

      <div className={styles.mobileFilters}>
        <DraftsMobileFilters />
      </div>
    </div>
  );
};

import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import {
  CategoriesFeedFilter,
  ListItem,
} from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';

import { FEED_CATEGORIES } from 'constants/proposals';

import { FeedSort } from 'astro_3.0/components/FeedSort';
import { StatusFeedFilter } from 'astro_3.0/features/ProposalsFeed/components/StatusFeedFilter';

import { MobileFilters } from 'astro_3.0/features/ProposalsFeed/components/MobileFilters';

import styles from './ProposalsFeedFilters.module.scss';

interface Props {
  className?: string;
}

export const ProposalsFeedFilters: FC<Props> = ({ className }) => {
  const { t } = useTranslation();

  const feedCategoriesOptions = useMemo<ListItem[]>(
    () =>
      FEED_CATEGORIES.map(
        item =>
          ({
            ...item,
            label: t(item.label.toLowerCase()),
          } as ListItem)
      ),
    [t]
  );

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.scrollableFilter}>
        <StatusFeedFilter className={styles.statusFilter} />
      </div>

      <div className={cn(styles.scrollableFilter, styles.hideOnMobiles)}>
        <CategoriesFeedFilter
          queryName="category"
          list={feedCategoriesOptions}
          disabled={false}
          hideAllOption
          className={styles.categoriesFilter}
        />
      </div>

      <div className={styles.last}>
        <FeedSort />
      </div>

      <div className={styles.mobileFilters}>
        <MobileFilters />
      </div>
    </div>
  );
};

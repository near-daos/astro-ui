import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { CategoriesFeedFilter } from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';

import { FEED_CATEGORIES } from 'constants/proposals';

import { ProposalsFeedSort } from 'astro_3.0/features/ProposalsFeed/components/ProposalsFeedSort';
import { StatusFeedFilter } from 'astro_3.0/features/ProposalsFeed/components/StatusFeedFilter';

import styles from './ProposalsFeedFilters.module.scss';

interface Props {
  className?: string;
}

export const ProposalsFeedFilters: FC<Props> = ({ className }) => {
  const { t } = useTranslation();

  const feedCategoriesOptions = useMemo(
    () =>
      FEED_CATEGORIES.map(item => ({
        ...item,
        label: t(item.label.toLowerCase()),
      })),
    [t]
  );

  return (
    <div className={cn(styles.root, className)}>
      <StatusFeedFilter />

      <span className={styles.separator} />

      <CategoriesFeedFilter
        queryName="category"
        list={feedCategoriesOptions}
        disabled={false}
      />

      <span className={cn(styles.separator, styles.last)} />

      <ProposalsFeedSort />
    </div>
  );
};

import React, { FC } from 'react';

import { DraftsStatusFilter } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftsStatusFilter';
import { DraftsFilters } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftsFilters';
import { FeedSort } from 'astro_3.0/components/FeedSort';

import styles from './DraftsFiltersContainer.module.scss';

export const DraftsFiltersContainer: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.first}>
        <DraftsStatusFilter />
        <div className={styles.divider} />
      </div>
      <DraftsFilters />
      <div className={styles.last}>
        <div className={styles.divider} />
        <FeedSort />
      </div>
    </div>
  );
};

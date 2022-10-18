import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMedia } from 'react-use';

import {
  CategoriesFeedFilter,
  ListItem,
} from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';

import { FEED_CATEGORIES } from 'constants/proposals';

import { FeedSort } from 'astro_3.0/components/FeedSort';
import { IconName } from 'components/Icon';
import { MobileFilters } from 'astro_3.0/features/ProposalsFeed/components/MobileFilters';

import { ProposalsFeedStatuses } from 'types/proposal';

import styles from './ProposalsFeedFilters.module.scss';

interface Props {
  className?: string;
}

export const ProposalsFeedFilters: FC<Props> = ({ className }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const isMobile = useMedia('(max-width: 1023px)');

  const { pathname } = router;

  const isMyFeed = pathname.startsWith('/my');

  const statusOptions = useMemo<ListItem[]>(() => {
    const initialList = [
      {
        value: ProposalsFeedStatuses.Active,
        label: t('feed.filters.active'),
        icon: 'filterClock' as IconName,
        queryName: 'status',
      },
    ];

    if (isMyFeed) {
      initialList.push({
        value: ProposalsFeedStatuses.VoteNeeded,
        label: t('feed.filters.vote'),
        icon: 'filterClock' as IconName,
        queryName: 'status',
      });
    }

    return [
      ...initialList,
      {
        value: ProposalsFeedStatuses.Approved,
        label: t('feed.filters.approved'),
        icon: 'filterCheck' as IconName,
        queryName: 'status',
      },
      {
        value: ProposalsFeedStatuses.Failed,
        label: t('feed.filters.failed'),
        icon: 'filterClose' as IconName,
        queryName: 'status',
      },
    ];
  }, [isMyFeed, t]);

  const categoriesOptions = useMemo<ListItem[]>(
    () =>
      FEED_CATEGORIES.map(
        item =>
          ({
            ...item,
            label: t(item.label.toLowerCase()),
            queryName: 'category',
          } as ListItem)
      ),
    [t]
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
        <MobileFilters />
      </div>
    </div>
  );
};

import React, { FC, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';

import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { DaoStatsTopics } from 'astro_2.0/features/Discover/constants';

import styles from './TopicsFilter.module.scss';

const FINANCIAL_OPTIONS = [
  DaoStatsTopics.FLOW,
  DaoStatsTopics.TVL,
  DaoStatsTopics.TOKENS,
];

export const TopicsFilter: FC = () => {
  const router = useRouter();
  const topic = router.query.topic as DaoStatsTopics;
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(
    topic && FINANCIAL_OPTIONS.includes(topic) ? 'financial' : 'overview'
  );
  const isMobile = useMedia('(max-width: 1280px)');

  const [overviewOptions, financialOptions] = useMemo(() => {
    const overview = [
      {
        label: t('discover.generalInfo'),
        value: DaoStatsTopics.GENERAL_INFO,
      },
      {
        label: t('discover.usersAndActivity'),
        value: DaoStatsTopics.USERS_AND_ACTIVITY,
      },
      {
        label: t('discover.governance'),
        value: DaoStatsTopics.GOVERNANCE,
      },
    ];

    const financial = [
      {
        label: t('discover.flow'),
        value: DaoStatsTopics.FLOW,
      },
      {
        label: t('discover.tvl'),
        value: DaoStatsTopics.TVL,
      },
      {
        label: t('discover.tokens'),
        value: DaoStatsTopics.TOKENS,
      },
    ];

    return [overview, financial];
  }, [t]);

  const handleToggle = useCallback(
    (filter: string, initialValue: string) => {
      setActiveFilter(filter);
      router.replace(
        {
          pathname: '',
          query: {
            ...router.query,
            topic: initialValue,
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    },
    [router]
  );

  return (
    <div className={styles.root}>
      <div className={styles.toggle}>
        <Button
          variant="tertiary"
          size="block"
          className={cn(styles.button, {
            [styles.active]: activeFilter === 'overview',
          })}
          onClick={() => handleToggle('overview', DaoStatsTopics.GENERAL_INFO)}
        >
          {t('discover.daoActivity')}
        </Button>
        <Button
          variant="tertiary"
          size="block"
          className={cn(styles.button, {
            [styles.active]: activeFilter === 'financial',
          })}
          onClick={() => handleToggle('financial', DaoStatsTopics.FLOW)}
        >
          {t('discover.financial')}
        </Button>
      </div>
      {(!isMobile || activeFilter === 'overview') && (
        <SideFilter
          shallowUpdate
          hideAllOption
          markerOffset={-100}
          queryName="topic"
          list={overviewOptions}
          title={t('discover.daoActivity')}
          titleClassName={styles.sideFilterTitle}
          className={styles.sideFilter}
          itemClassName={styles.filterItem}
        />
      )}
      {(!isMobile || activeFilter === 'financial') && (
        <SideFilter
          shallowUpdate
          hideAllOption
          markerOffset={-100}
          queryName="topic"
          list={financialOptions}
          title={t('discover.financial')}
          titleClassName={styles.sideFilterTitle}
          className={cn(styles.sideFilter, styles.financialFilter)}
          itemClassName={styles.filterItem}
        />
      )}
    </div>
  );
};

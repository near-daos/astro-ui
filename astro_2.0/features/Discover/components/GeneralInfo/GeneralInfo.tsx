import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';
import { Loader } from 'components/loader';

import { TControlTab } from 'astro_2.0/features/Discover/types';

import styles from './GeneralInfo.module.scss';

// todo - fetch data from api
const chartData = [
  {
    x: new Date('2022-01-12'),
    y: 30,
  },
  {
    x: new Date('2022-04-23'),
    y: 45,
  },
];

export const GeneralInfo: FC = () => {
  const loading = false;
  const { t } = useTranslation();

  const items = useMemo<TControlTab[]>(() => {
    return [
      {
        id: 'activeDaos',
        label: t('discover.activeDaos'),
        value: '94',
        trend: 10,
      },
      {
        id: 'numberOfDaos',
        label: t('discover.numberOfDaos'),
        value: '1316',
        trend: 10,
      },
      {
        id: 'groups',
        label: t('discover.groups'),
        value: '45',
        trend: 15,
      },
      {
        id: 'avgGroupDaos',
        label: t('discover.avgGroupDaos'),
        value: '1.12',
        trend: -56,
      },
    ];
  }, [t]);
  const [activeView, setActiveView] = useState<string>(items[0].id);

  function renderChart() {
    if (chartData) {
      return (
        <DashboardChart
          key={activeView}
          activeView={activeView}
          data={chartData}
        />
      );
    }

    if (loading) {
      return <Loader />;
    }

    return <NoResultsView title="No data available" />;
  }

  return (
    <>
      <ControlTabs
        className={styles.header}
        items={items}
        onSelect={setActiveView}
        activeView={activeView}
      />
      <div className={styles.body}>
        {renderChart()}
        <DaosTopList />
      </div>
    </>
  );
};

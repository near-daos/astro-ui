import React, { FC } from 'react';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { useDiscoverPageRange } from 'astro_2.0/features/Discover/components/DiscoverPageContext/DiscoverPageContext';
import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';

import styles from './ChartRenderer.module.scss';

interface ChartRendererProps {
  data: ChartDataElement[] | null;
  loading: boolean;
  activeView: string;
}

const RANGE_SET = [
  {
    label: '1M',
    type: DOMAIN_RANGES.MONTH,
  },
  {
    label: '1Y',
    type: DOMAIN_RANGES.YEAR,
  },
  {
    label: 'All',
    type: DOMAIN_RANGES.ALL,
  },
];

export const ChartRenderer: FC<ChartRendererProps> = ({
  data,
  loading,
  activeView,
}) => {
  const { range, setRange } = useDiscoverPageRange();

  if (loading) {
    return <Loader className={styles.loader} />;
  }

  if (data) {
    return (
      <DashboardChart
        key={activeView}
        activeView={activeView}
        data={data}
        timeRanges={RANGE_SET}
        initialRange={range}
        onRangeChange={setRange}
      />
    );
  }

  return <NoResultsView title="No data available" className={styles.loader} />;
};

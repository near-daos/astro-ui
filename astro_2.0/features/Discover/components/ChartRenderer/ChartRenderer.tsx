import React, { FC } from 'react';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

import styles from './ChartRenderer.module.scss';

interface ChartRendererProps {
  data: ChartDataElement[] | null;
  loading: boolean;
  activeView: string;
}

export const ChartRenderer: FC<ChartRendererProps> = ({
  data,
  loading,
  activeView,
}) => {
  if (loading) {
    return <Loader className={styles.loader} />;
  }

  if (data) {
    return (
      <DashboardChart key={activeView} activeView={activeView} data={data} />
    );
  }

  return <NoResultsView title="No data available" className={styles.loader} />;
};

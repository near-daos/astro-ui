import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { useDiscoverPageRange } from 'astro_2.0/features/Discover/components/DiscoverPageContext/DiscoverPageContext';
import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';
import { UnitPosition } from 'types/stats';

import styles from './ChartRenderer.module.scss';

interface ChartRendererProps {
  data: ChartDataElement[] | null;
  loading: boolean;
  activeView: string;
  unit?: string | ReactNode;
  unitPosition?: UnitPosition;
}

export const ChartRenderer: FC<ChartRendererProps> = ({
  data,
  loading,
  activeView,
  unit = '',
  unitPosition = 'left',
}) => {
  const { t } = useTranslation();

  const RANGE_SET = [
    {
      label: t('chart.month'),
      type: DOMAIN_RANGES.MONTH,
    },
    {
      label: t('chart.threeMonths'),
      type: DOMAIN_RANGES.THREE_MONTHS,
    },
    {
      label: t('chart.sixMonths'),
      type: DOMAIN_RANGES.SIX_MONTHS,
    },
    {
      label: t('chart.year'),
      type: DOMAIN_RANGES.YEAR,
    },
    {
      label: t('chart.all'),
      type: DOMAIN_RANGES.ALL,
    },
  ];

  const { range, setRange } = useDiscoverPageRange();

  if (loading) {
    return <Loader className={styles.loader} />;
  }

  if (data) {
    return (
      <DashboardChart
        unit={unit}
        unitPosition={unitPosition}
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

import React, { FC, useState } from 'react';
import Measure from 'react-measure';
import { motion, AnimatePresence } from 'framer-motion';

import { useDomainControl } from 'components/AreaChartRenderer/hooks';
import RangeToggle from 'components/AreaChartRenderer/components/range-toggle/RangeToggle';
import { Chart } from 'components/AreaChartRenderer/components/Chart';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { useTranslation } from 'next-i18next';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { ChartLegend } from 'astro_2.0/features/DaoDashboard/components/DashboardChart/components/ChartLegend';

import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';
import { getChartTitles } from 'astro_2.0/features/DaoDashboard/components/DashboardChart/helpers';

import styles from './DashboardChart.module.scss';

interface DashboardChartProps {
  data: ChartDataElement[];
  activeView?: string;
}

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

export const DashboardChart: FC<DashboardChartProps> = ({
  data,
  activeView,
}) => {
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);
  const { data: chartData, toggleDomain, activeRange } = useDomainControl(
    data || [],
    DOMAIN_RANGES.ALL
  );

  const lines = [
    {
      name: 'activity',
      color: '#6038d0',
      dataKey: 'y',
      gradient: 'colorUv',
    },
  ];

  if (activeView === 'PROPOSALS') {
    lines.push({
      name: 'total',
      color: '#19D992',
      dataKey: 'y2',
      gradient: 'colorPv',
    });
  }

  const [firstDataSet, secondDataSet] = getChartTitles(activeView, t);

  if (!chartData) {
    return null;
  }

  return (
    <Measure
      onResize={contentRect => {
        const newWidth = contentRect?.entry?.width - 24;

        if (
          (newWidth && width === 0) ||
          (newWidth && width && newWidth !== width)
        ) {
          setWidth(newWidth);
        }
      }}
    >
      {({ measureRef }) => (
        <div className={styles.root} ref={measureRef}>
          <div className={styles.header}>
            <div className={styles.title}>
              <ChartLegend
                label={firstDataSet}
                className={styles.firstDataSet}
              />
              {activeView === 'PROPOSALS' && (
                <ChartLegend
                  label={secondDataSet}
                  className={styles.secondDataSet}
                />
              )}
            </div>
            <RangeToggle
              onClick={toggleDomain}
              activeRange={activeRange}
              className={styles.range}
            />
          </div>
          <div className={styles.chartWrapper}>
            <AnimatePresence>
              {chartData.length ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  transition={{
                    duration: 0.7,
                  }}
                >
                  <Chart
                    width={width}
                    data={chartData}
                    period={activeRange}
                    lines={lines}
                    isIntegerDataset={activeView !== 'DAO_FUNDS'}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  transition={{
                    duration: 0.7,
                  }}
                >
                  <NoResultsView
                    title={t('noResultsFound')}
                    className={styles.noResults}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Measure>
  );
};

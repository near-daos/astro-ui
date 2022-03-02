import React, { FC, useState } from 'react';
import Measure from 'react-measure';
import cn from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

import { useDomainControl } from 'components/AreaChartRenderer/hooks';
import RangeToggle from 'components/AreaChartRenderer/components/range-toggle/RangeToggle';
import { Chart } from 'components/AreaChartRenderer/components/Chart';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { TFunction, useTranslation } from 'next-i18next';
import { Button } from 'components/button/Button';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { ChartLegend } from 'astro_2.0/features/DaoDashboard/components/DashboardChart/components/ChartLegend';

import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';

import styles from './DashboardChart.module.scss';

interface DashboardChartProps {
  data: ChartDataElement[];
  activeView?: string;
}

enum DATASET {
  NUMBER_OF_VOTES,
  NUMBER_OF_TRANSACTIONS,
}

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

function getChartTitles(activeView: string | undefined, t: TFunction) {
  switch (activeView) {
    case 'BOUNTIES': {
      return [t('daoDashboard.bounties')];
    }
    case 'DAO_FUNDS': {
      return [t('daoDashboard.daoFunds')];
    }
    case 'NFTS': {
      return [t('daoDashboard.nfts')];
    }
    case 'PROPOSALS': {
      return [
        t('daoDashboard.activeProposals'),
        t('daoDashboard.proposalsInTotal'),
      ];
    }
    case 'activeDaos': {
      return [t('discover.activeDaos')];
    }
    case 'numberOfDaos': {
      return [t('discover.numberOfDaos')];
    }
    case 'groups': {
      return [t('discover.groups')];
    }
    case 'avgGroupsDao': {
      return [t('discover.avgGroupsDao')];
    }
    default: {
      return [t('activity')];
    }
  }
}

export const DashboardChart: FC<DashboardChartProps> = ({
  data,
  activeView,
}) => {
  const { t } = useTranslation();
  const [activeDataSet, setActiveDataSet] = useState(
    DATASET.NUMBER_OF_TRANSACTIONS
  );
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
            <Button
              onClick={() => setActiveDataSet(DATASET.NUMBER_OF_VOTES)}
              variant="transparent"
              size="block"
              className={cn(styles.dataSetButton, styles.votes, {
                [styles.active]: activeDataSet === DATASET.NUMBER_OF_VOTES,
              })}
            >
              {t('numberOfVotes')}
            </Button>
            <Button
              onClick={() => setActiveDataSet(DATASET.NUMBER_OF_TRANSACTIONS)}
              size="block"
              variant="transparent"
              className={cn(styles.dataSetButton, styles.transactions, {
                [styles.active]:
                  activeDataSet === DATASET.NUMBER_OF_TRANSACTIONS,
              })}
            >
              {t('numberOfTransactions')}
            </Button>
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

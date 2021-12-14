import React, { FC, useState } from 'react';
import Measure from 'react-measure';
import cn from 'classnames';

import { useDomainControl } from 'components/AreaChartRenderer/hooks';
import RangeToggle from 'components/AreaChartRenderer/components/range-toggle/RangeToggle';
import { Chart } from 'components/AreaChartRenderer/components/Chart';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { useTranslation } from 'next-i18next';
import { Button } from 'components/button/Button';

import styles from './DashboardChart.module.scss';

interface DashboardChartProps {
  data: ChartDataElement[];
}

enum DATASET {
  NUMBER_OF_VOTES,
  NUMBER_OF_TRANSACTIONS,
}

export const DashboardChart: FC<DashboardChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const [activeDataSet, setActiveDataSet] = useState(
    DATASET.NUMBER_OF_TRANSACTIONS
  );
  const [width, setWidth] = useState(0);
  const { data: chartData, toggleDomain, activeRange } = useDomainControl(
    data || []
  );

  if (!data.length) {
    return null;
  }

  return (
    <Measure
      onResize={contentRect => {
        const newWidth = contentRect?.entry?.width;

        if (width !== newWidth) {
          setWidth(newWidth);
        }
      }}
    >
      {({ measureRef }) => (
        <div className={styles.root} ref={measureRef}>
          <div className={styles.header}>
            <div className={styles.title}>{t('activity')}</div>
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
            <Chart
              tokenName=""
              width={width}
              data={chartData}
              period={activeRange}
              lines={[
                {
                  name: 'activity',
                  color: '#6038d0',
                  dataKey: 'y',
                },
              ]}
            />
          </div>
        </div>
      )}
    </Measure>
  );
};

import cn from 'classnames';
import React, { FC } from 'react';

import { ChartCaptionInterface } from 'components/AreaChartRenderer/types';

import styles from './chart-caption.module.scss';

interface InfoSectionProps {
  className?: string;
  captions: ChartCaptionInterface[];
}

export const ChartCaption: FC<InfoSectionProps> = ({ captions, className }) => {
  function renderInfoBlocks() {
    return captions.map(({ label, value, currency }) => {
      return (
        <div className={styles.infoBlock} key={label}>
          <div className={styles.label}>{label}</div>
          <div className={styles.valueHolder}>
            <div className={styles.value}>{value}</div>
            <div className={styles.currency}>{currency}</div>
          </div>
        </div>
      );
    });
  }

  return <div className={cn(styles.root, className)}>{renderInfoBlocks()}</div>;
};

import React, { FC } from 'react';
import { Icon } from 'components/Icon';
import cn from 'classnames';

import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import { kFormatter } from 'utils/format';

import styles from './AmointBalance.module.scss';

interface AmountBalanceCardProps {
  value: number;
  suffix: string;
  className?: string;
}

export const AmountBalanceCard: FC<AmountBalanceCardProps> = ({
  value,
  suffix,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.label}>Amount Balance</div>
      <div className={styles.row}>
        <Icon name="chartTrend" className={styles.icon} />
        <Tooltip
          overlay={<FormattedNumericValue value={value} suffix={suffix} />}
        >
          <FormattedNumericValue
            value={kFormatter(value)}
            suffix={suffix}
            valueClassName={styles.value}
            suffixClassName={styles.value}
          />
        </Tooltip>
      </div>
    </div>
  );
};

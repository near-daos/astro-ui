import React, { FC } from 'react';
import cn from 'classnames';

import { TokenBalance } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/TokenBalance';

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
      <TokenBalance value={value} suffix={suffix} />
    </div>
  );
};

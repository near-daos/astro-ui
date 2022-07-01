import React, { FC } from 'react';
import cn from 'classnames';
import ContentLoader from 'react-content-loader';

import { TokenBalance } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/TokenBalance';

import styles from './AmointBalance.module.scss';

interface AmountBalanceCardProps {
  value: number | undefined;
  suffix?: string;
  className?: string;
  loading?: boolean;
  label?: string;
}

export const AmountBalanceCard: FC<AmountBalanceCardProps> = ({
  value,
  suffix,
  className,
  loading,
  label = 'Amount Balance',
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.label}>{label}</div>
      {loading ? (
        <div>
          <ContentLoader height={28}>
            <rect x="0" y="0" width="180" height="28" />
          </ContentLoader>
        </div>
      ) : (
        <TokenBalance value={value} suffix={suffix} />
      )}
    </div>
  );
};

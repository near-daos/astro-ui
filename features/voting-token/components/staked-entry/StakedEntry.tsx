import React, { FC, ReactNode } from 'react';

import styles from './staked-entry.module.scss';

export interface StakedEntryProps {
  amount: number;
  name: string;
  delegatedTo?: string;
  children: ReactNode;
}

export const StakedEntry: FC<StakedEntryProps> = ({
  amount,
  name,
  delegatedTo,
  children
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.amount}>
        <span className={styles.value}>
          <strong>{amount}</strong>
        </span>
        <span className={styles.sub}>{name}</span>
      </div>
      <div className={styles.delegated}>{delegatedTo}</div>
      <div className={styles.control}>{children}</div>
    </div>
  );
};

import React, { FC } from 'react';

import { StakedEntry } from 'features/voting-token/components/staked-entry';
import { Button } from 'components/button/Button';

import styles from './recently-unstaked.module.scss';

export type Stake = {
  id: string;
  amount: number;
  name: string;
  delegatedTo?: string;
};

export interface RecentlyUnstakedProps {
  stakes: Stake[];
}

export const RecentlyUnstaked: FC<RecentlyUnstakedProps> = ({ stakes }) => {
  return (
    <div className={styles.root}>
      <h2>Recently unstaked tokens</h2>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.amount}>Amount</div>
        </div>
        {stakes.map(({ id, ...rest }) => (
          <StakedEntry key={id} {...rest}>
            <Button variant="secondary">Withdraw</Button>
          </StakedEntry>
        ))}
      </div>
    </div>
  );
};

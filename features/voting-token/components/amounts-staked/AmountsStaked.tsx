import React, { FC } from 'react';

import { StakedEntry } from 'features/voting-token/components/staked-entry';
import { Button } from 'components/button/Button';

import styles from './amounts-staked.module.scss';

type Stake = {
  id: string;
  amount: number;
  name: string;
  delegatedTo?: string;
};

export interface AmountsStakedProps {
  stakes: Stake[];
}

export const AmountsStaked: FC<AmountsStakedProps> = ({ stakes }) => {
  return (
    <div className={styles.root}>
      <h2>Amounts you&apos;ve staked</h2>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.amount}>Amount</div>
          <div className={styles.delegated}>Delegated to</div>
        </div>
        {stakes.map(({ id, ...rest }) => (
          <StakedEntry key={id} {...rest}>
            <Button variant="secondary">Change</Button>
          </StakedEntry>
        ))}
      </div>
    </div>
  );
};

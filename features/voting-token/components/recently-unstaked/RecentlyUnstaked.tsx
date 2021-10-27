import React, { FC, useCallback } from 'react';

import { useModal } from 'components/modal';

import { StakeTokensPopup } from 'features/voting-token/components/stake-tokens-popup';
import { StakedEntry } from 'features/voting-token/components/staked-entry';
import { Button } from 'components/button/Button';

import styles from './recently-unstaked.module.scss';

export type Stake = {
  id: string;
  amount?: number | string;
  name: string;
  delegatedTo?: string;
};

export interface RecentlyUnstakedProps {
  stakes: Stake[];
}

export const RecentlyUnstaked: FC<RecentlyUnstakedProps> = ({ stakes }) => {
  const [showModal] = useModal(StakeTokensPopup);

  const handleWithdraw = useCallback(
    async data => {
      await showModal(data);
    },
    [showModal]
  );

  return (
    <div className={styles.root}>
      <h2>Recently unstaked tokens</h2>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.amount}>Amount</div>
        </div>
        {stakes.map(({ id, ...rest }) => (
          <StakedEntry key={id} {...rest}>
            <Button
              size="block"
              variant="secondary"
              onClick={() =>
                handleWithdraw({
                  token: {
                    id,
                    tokenName: rest.name,
                    balance: rest.amount,
                  },
                  rate: 18,
                  variant: 'Withdraw',
                })
              }
            >
              Withdraw
            </Button>
          </StakedEntry>
        ))}
      </div>
    </div>
  );
};

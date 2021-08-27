import React, { FC, useCallback } from 'react';

import { StakedEntry } from 'features/voting-token/components/staked-entry';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { StakeTokensPopup } from 'features/voting-token/components/stake-tokens-popup';

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
  const [showModal] = useModal(StakeTokensPopup);

  const handleChange = useCallback(
    async data => {
      await showModal(data);
    },
    [showModal]
  );

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
            <Button
              size="block"
              variant="secondary"
              onClick={() =>
                handleChange({
                  token: {
                    id,
                    tokenName: rest.name,
                    balance: rest.amount
                  },
                  rate: 18,
                  variant: 'Stake'
                })
              }
            >
              Change
            </Button>
          </StakedEntry>
        ))}
      </div>
    </div>
  );
};

import React, { FC, useCallback } from 'react';

import { StakedEntry } from 'features/voting-token/components/staked-entry';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { StakeTokensPopup } from 'features/voting-token/components/stake-tokens-popup';

import styles from './amounts-staked.module.scss';

type Stake = {
  id: string;
  amount?: number | string;
  name: string;
  delegatedTo?: string;
};

export interface AmountsStakedProps {
  stakes: Stake[];
  onChangeStakes: (stakes: Stake[]) => void;
  onUnstakeTokens: (stakes: Stake[], unstaked: Stake[]) => void;
}

export const AmountsStaked: FC<AmountsStakedProps> = ({
  stakes,
  onChangeStakes,
  onUnstakeTokens,
}) => {
  const [showModal] = useModal(StakeTokensPopup);

  const handleUnstake = useCallback(
    id => {
      const {
        newStakes,
        unstaked,
      }: { newStakes: Stake[]; unstaked: Stake[] } = stakes.reduce(
        (res, item) => {
          if (item.id === id) {
            res.unstaked.push(item);
          } else {
            res.newStakes.push(item);
          }

          return res;
        },
        { newStakes: [] as Stake[], unstaked: [] as Stake[] }
      );

      onUnstakeTokens(newStakes, unstaked);
    },
    [onUnstakeTokens, stakes]
  );

  const handleChange = useCallback(
    async (id, data) => {
      const response = await showModal(data);

      if (response.length) {
        const updated = response[0];

        onChangeStakes(
          stakes.map(stake => {
            if (stake.id === id) {
              return {
                ...stake,
                amount: updated.value,
                delegatedTo: updated.delegateTo,
              };
            }

            return stake;
          })
        );
      }
    },
    [onChangeStakes, showModal, stakes]
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
                handleChange(id, {
                  token: {
                    id,
                    tokenName: rest.name,
                    balance: rest.amount,
                  },
                  rate: 18,
                  amount: rest.amount,
                  delegatedTo: rest.delegatedTo,
                  variant: 'Change',
                  onUnstake: handleUnstake,
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

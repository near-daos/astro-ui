import React, { FC } from 'react';

import { Icon, IconName } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './voting-token.module.scss';

type Token = {
  icon?: IconName;
  name: string;
  symbol: string;
};

export interface VotingTokenProps {
  token: Token;
  totalStaked: number;
}

export const VotingToken: FC<VotingTokenProps> = ({ token, totalStaked }) => {
  return (
    <div className={styles.root}>
      <div className={styles.token}>
        <div className={styles.label}>Your voting token</div>
        <div className={styles.value}>
          <div className={styles.icon}>
            {token.icon && <Icon name={token.icon} />}
          </div>
          {token.name}
        </div>
      </div>
      <div className={styles.symbol}>
        <div className={styles.label}>&nbsp;</div>
        {token.symbol}
      </div>
      <div className={styles.total}>
        <div className={styles.label}>Total staked</div>
        <div className={styles.value}>
          <strong>{totalStaked}</strong>
          &nbsp;
          {token.name}
        </div>
      </div>
      <div className={styles.control}>
        <Button variant="secondary">Stake tokens</Button>
      </div>
    </div>
  );
};

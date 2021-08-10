import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value';
import { Icon } from 'components/Icon';
import styles from './token-card.module.scss';

export interface TokenCardProps {
  id: string;
  tokenName: TokenName;
  tokensBalance: number;
  totalValue: number;
  voteWeight: number;
}

export enum TokenName {
  NEAR = 'NEAR'
}

export const TokenCard: React.FC<TokenCardProps> = ({
  tokenName,
  tokensBalance,
  totalValue,
  voteWeight
}) => {
  return (
    <div className={classNames(styles.root, styles.container)}>
      <div className={styles['token-container']}>
        <div className={styles.icon}>
          <Icon name="iconNear" />
        </div>
        <div className={classNames('subtitle3', styles.name)}> {tokenName}</div>
      </div>
      <div className={styles['tokens-balance']}>{tokensBalance}</div>
      <FormattedNumericValue
        value={totalValue}
        suffix="usd"
        className={styles['total-value']}
      />
      <div className={styles['vote-weight']}>
        <div className={styles['total-weight']}>
          <div
            className={styles['current-weight']}
            style={{ '--currentWeight': `${voteWeight}px` } as CSSProperties}
          />
        </div>
      </div>
    </div>
  );
};

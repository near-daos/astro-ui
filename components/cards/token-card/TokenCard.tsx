import React from 'react';
import classNames from 'classnames';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value';
import { Icon } from 'components/Icon';
import styles from './token-card.module.scss';

export interface TokenCardProps {
  symbol: string;
  icon: string;
  balance: number;
  totalValue: string | null;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  symbol,
  icon,
  balance,
  totalValue,
}) => {
  function getTokenIconName(iconName: string) {
    switch (iconName) {
      case 'NEAR':
        return 'tokenNear';
      default:
        return '';
    }
  }

  const tokenIconName = getTokenIconName(icon);

  return (
    <div className={classNames(styles.root, styles.grid)}>
      <div className={styles.iconContainer}>
        <div className={styles.iconWrapper}>
          {tokenIconName !== '' ? (
            <Icon name={tokenIconName} width={32} />
          ) : (
            <div
              className={styles.icon}
              style={{ backgroundImage: `url(${icon})` }}
            />
          )}
        </div>
      </div>
      <div className={styles.tokenBalance}>
        {balance} <span className={styles.tokenName}>{symbol}</span>
      </div>
      <div className={styles.totalValue}>
        {totalValue && (
          <FormattedNumericValue value={totalValue} suffix="usd" />
        )}
      </div>
    </div>
  );
};

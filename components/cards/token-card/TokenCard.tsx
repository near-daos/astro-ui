import React from 'react';
import classNames from 'classnames';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import styles from './token-card.module.scss';

export interface TokenCardProps {
  symbol: string;
  icon: string;
  balance: number;
  totalValue: string | null;
  onClick: () => void;
  isActive: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  symbol,
  icon,
  balance,
  totalValue,
  onClick,
  isActive,
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
    <Button
      variant="transparent"
      className={classNames(styles.root, styles.grid, {
        [styles.active]: isActive,
      })}
      onClick={onClick}
    >
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
    </Button>
  );
};

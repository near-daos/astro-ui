import React from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { useIsValidImage } from 'hooks/useIsValidImage';

import styles from './TokenCard.module.scss';

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
  const isValid = useIsValidImage(symbol !== 'NEAR' ? icon : '');

  function renderIcon() {
    if (symbol === 'NEAR') {
      return <Icon name="tokenNearBig" />;
    }

    if (isValid) {
      return (
        <div
          style={{
            backgroundImage: `url(${icon})`,
          }}
          className={styles.icon}
        />
      );
    }

    return <div className={styles.icon} />;
  }

  return (
    <Button
      variant="transparent"
      className={cn(styles.root, {
        [styles.active]: isActive,
      })}
      onClick={onClick}
    >
      <div className={styles.grid}>
        <div className={styles.iconContainer}>
          <div className={styles.iconWrapper}>{renderIcon()}</div>
        </div>
        <div className={styles.token}>
          <div className={styles.tokenBalance}>
            {balance} <span className={styles.tokenName}>{symbol}</span>
          </div>
          <div className={styles.totalValue}>
            {totalValue && (
              <FormattedNumericValue value={totalValue} suffix="usd" />
            )}
          </div>
        </div>
      </div>
    </Button>
  );
};

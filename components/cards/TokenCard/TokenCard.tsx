import React from 'react';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { TokenIcon } from 'astro_2.0/components/TokenIcon';

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
  return (
    <Button
      variant="transparent"
      className={cn(styles.root, {
        [styles.active]: isActive,
      })}
      onClick={onClick}
    >
      <div className={styles.grid}>
        <TokenIcon symbol={symbol} icon={icon} />
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

import React from 'react';
import { Icon } from 'components/Icon';
import styles from 'astro_2.0/components/TokenWidget/TokenWidget.module.scss';
import { formatYoktoValue } from 'helpers/format';

interface TokenWidgetProps {
  amount: string;
  icon: string;
  symbol: string;
  decimals: number;
}

export const TokenWidget: React.FC<TokenWidgetProps> = ({
  amount,
  icon,
  symbol,
  decimals,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.amount}>{formatYoktoValue(amount, decimals)}</div>
      {symbol === 'NEAR' ? (
        <div className={styles.icon}>
          <Icon name="iconNear" width={24} />
        </div>
      ) : (
        <div
          style={{ backgroundImage: `url(${icon})` }}
          className={styles.icon}
        />
      )}
      <div className={styles.symbol}>{symbol}</div>
    </div>
  );
};

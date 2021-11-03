import React from 'react';
import { Icon } from 'components/Icon';
import styles from 'astro_2.0/components/TokenWidget/TokenWidget.module.scss';

interface TokenWidgetProps {
  amount: string;
  icon: string;
  symbol: string;
}

export const TokenWidget: React.FC<TokenWidgetProps> = ({
  amount,
  icon,
  symbol,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.amount}>{amount}</div>
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

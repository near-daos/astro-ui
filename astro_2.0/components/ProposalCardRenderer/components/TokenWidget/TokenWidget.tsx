import React from 'react';
import { Icon } from 'components/Icon';
import styles from './TokenWidget.module.scss';

interface TokenWidgetProps {
  icon: string;
  symbol: string;
}

export const TokenWidget: React.FC<TokenWidgetProps> = ({ icon, symbol }) => {
  return (
    <div className={styles.root}>
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

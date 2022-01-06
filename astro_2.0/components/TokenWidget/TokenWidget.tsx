import React from 'react';
import { Icon } from 'components/Icon';
import { formatYoktoValue } from 'utils/format';
import { useIsValidImage } from 'hooks/useIsValidImage';

import styles from './TokenWidget.module.scss';

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
  const isValid = useIsValidImage(icon);

  function renderIcon() {
    if (symbol === 'NEAR') {
      return (
        <div className={styles.icon}>
          <Icon name="iconNear" width={24} />
        </div>
      );
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
    <div className={styles.root}>
      <div className={styles.amount}>{formatYoktoValue(amount, decimals)}</div>
      {renderIcon()}
      <div className={styles.symbol}>{symbol}</div>
    </div>
  );
};

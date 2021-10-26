import React from 'react';
import { Token } from 'types/token';
import { Icon } from 'components/Icon';
import { formatYoktoValue } from 'helpers/format';
import styles from './token-widget.module.scss';

interface TokenWidgetProps {
  token: Token;
  amount: string;
}

export const TokenWidget: React.FC<TokenWidgetProps> = ({ token, amount }) => {
  const { icon, symbol } = token;

  const amountValue = formatYoktoValue(amount, token.decimals);

  return (
    <div className={styles.root}>
      <div className={styles.amount}>{amountValue}</div>
      <div className={styles.label}>{symbol}</div>
      {token.symbol === 'NEAR' ? (
        <Icon name="iconNear" />
      ) : (
        <div
          style={{ backgroundImage: `url(${icon})` }}
          className={styles.icon}
        />
      )}
    </div>
  );
};

import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import { Tokens } from 'context/CustomTokensContext';
import { formatYoktoValue } from 'utils/format';

import styles from './AmountContent.module.scss';

interface AmountContentProps {
  amount: string;
  token: string;
  commentsCount: number;
  tokens: Tokens;
}

export const AmountContent: FC<AmountContentProps> = ({
  amount,
  token,
  commentsCount,
  tokens,
}) => {
  const tokenData = token ? tokens[token] : tokens.NEAR;

  return (
    <div className={styles.root}>
      <span className={styles.item}>
        {tokenData ? (
          <>
            <span className={styles.value}>
              {formatYoktoValue(amount, tokenData.decimals)}
            </span>
            <span className={styles.label}>{token || 'NEAR'}</span>
          </>
        ) : (
          <div className={styles.value}>
            <LoadingIndicator />
          </div>
        )}
      </span>
      <span className={styles.item}>
        <Icon name="chat" className={styles.icon} />
        <span className={styles.value}>{commentsCount}</span>
      </span>
    </div>
  );
};

import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import { Tokens } from 'context/CustomTokensContext';
import { formatYoktoValue } from 'utils/format';
import { useIsValidImage } from 'hooks/useIsValidImage';

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

  const isValid = useIsValidImage(tokenData?.icon);

  function renderIcon() {
    if (tokenData?.symbol === 'NEAR') {
      return <Icon name="tokenNearBig" />;
    }

    if (isValid) {
      return (
        <div
          style={{
            backgroundImage: `url(${tokenData.icon})`,
          }}
          className={styles.icon}
        />
      );
    }

    return <div className={styles.icon} />;
  }

  return (
    <div className={styles.root}>
      <span className={styles.item}>
        {tokenData ? (
          <>
            <span className={styles.value}>
              {formatYoktoValue(amount, tokenData.decimals)}
            </span>
            <span className={styles.iconWrapper}>{renderIcon()}</span>
            <span className={styles.label}>{token || 'NEAR'}</span>
          </>
        ) : (
          <div className={styles.value}>
            <LoadingIndicator />
          </div>
        )}
      </span>
      <span className={cn(styles.item, styles.desktopOnly)}>
        <Icon name="chat" className={styles.icon} />
        <span className={styles.value}>{commentsCount}</span>
      </span>
    </div>
  );
};

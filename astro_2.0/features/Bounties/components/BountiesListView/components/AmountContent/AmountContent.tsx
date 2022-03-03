import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import { Tokens } from 'context/CustomTokensContext';
import { formatYoktoValue, kFormatter } from 'utils/format';
import { useIsValidImage } from 'hooks/useIsValidImage';

import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './AmountContent.module.scss';

interface AmountContentProps {
  amount: string;
  token: string;
  commentsCount?: number;
  tokens: Tokens;
}

export const AmountContent: FC<AmountContentProps> = ({
  amount,
  token,
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
            <Tooltip
              overlay={<span>{tokenData.symbol || 'NEAR'}</span>}
              className={styles.label}
            >
              <div className={styles.value}>
                {kFormatter(
                  Number(formatYoktoValue(amount, tokenData.decimals)),
                  2
                )}
              </div>
            </Tooltip>
            <div className={styles.iconWrapper}>{renderIcon()}</div>
            <Tooltip
              overlay={<span>{tokenData.symbol || 'NEAR'}</span>}
              className={styles.label}
            >
              <div className={styles.ellipse}>{tokenData.symbol || 'NEAR'}</div>
            </Tooltip>
          </>
        ) : (
          <div className={cn(styles.value, styles.loader)}>
            <LoadingIndicator />
          </div>
        )}
      </span>
    </div>
  );
};

import React, { FC } from 'react';
import cn from 'classnames';

import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import { Tokens } from 'types/token';
import { formatYoktoValue, kFormatter } from 'utils/format';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { TokenIcon } from 'astro_2.0/components/TokenIcon';

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
            <TokenIcon
              symbol={tokenData?.symbol}
              icon={tokenData?.icon}
              className={styles.iconWrapper}
            />
            <Tooltip
              overlay={<span>{tokenData.tokenId || ''}</span>}
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

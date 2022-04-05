import React, { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { Icon } from 'components/Icon';

import { Token } from 'types/token';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { Tokens } from 'context/CustomTokensContext';

import styles from './styles.module.scss';

export function useTokenOptions(
  fieldName = 'token'
): {
  tokens: Tokens;
  tokenOptions: {
    label: string;
    component: ReactElement;
  }[];
  selectedTokenData: Token;
} {
  const { getValues, watch } = useFormContext();
  const { tokens } = useCustomTokensContext();

  watch(fieldName);

  const selectedTokenData = tokens[getValues().selectedToken];

  const tokenOptions = Object.values(tokens)
    .map(token => ({
      label: token.symbol,
      component: (
        <div className={styles.row}>
          <div className={styles.iconWrapper}>
            {token.symbol === 'NEAR' ? (
              <Icon name="tokenNearBig" />
            ) : (
              <div
                style={{
                  background: 'black',
                  backgroundImage: `url(${token.icon})`,
                }}
                className={styles.icon}
              />
            )}
          </div>
          <div className={styles.symbol}>{token.symbol}</div>
          <div className={styles.balance} data-hidden-value>
            {token.balance}
          </div>
        </div>
      ),
    }))
    .filter(token => token.label === 'NEAR');

  return {
    tokens,
    tokenOptions,
    selectedTokenData,
  };
}

export function useDepositWidth(
  fieldName = 'deposit',
  defaultWidth = 5
): number {
  const { watch } = useFormContext();

  const deposit = watch(fieldName);

  let depositWidth;

  if (!deposit) {
    return defaultWidth;
  }

  if (deposit.length <= 4) {
    depositWidth = defaultWidth;
  } else if (deposit.length >= 15) {
    depositWidth = 15;
  } else {
    depositWidth = deposit.length;
  }

  return depositWidth;
}

import React, { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { Icon } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import { Token } from 'types/token';

import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { useAllCustomTokens } from 'context/AllTokensContext';

import styles from './styles.module.scss';

export function useAllTokenOptions(fieldName = 'token'): {
  tokens: Record<string, Token>;
  tokenOptions: {
    value: string;
    label: ReactElement;
  }[];
  selectedTokenData: Token;
} {
  const { getValues, watch } = useFormContext();
  const { tokens } = useAllCustomTokens();

  watch(fieldName);

  const selectedTokenData = tokens[getValues().selectedToken];

  const tokenOptions = Object.values(tokens)
    .map(token => ({
      value: token.tokenId,
      label: (
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
    .filter(token => token.value === 'NEAR');

  return {
    tokens,
    tokenOptions,
    selectedTokenData,
  };
}

export function useTokenOptions(fieldName = 'token'): {
  tokens: Record<string, Token>;
  tokenOptions: {
    value: string;
    label: ReactElement;
  }[];
  selectedTokenData: Token;
} {
  const { getValues, watch } = useFormContext();
  const { tokens } = useDaoCustomTokens();

  watch(fieldName);

  const selectedTokenData = tokens[getValues().selectedToken];

  const tokenOptions = Object.values(tokens)
    .map(token => ({
      value: token.tokenId || token.symbol,
      label: (
        <Tooltip
          className={styles.row}
          overlay={<span>{token.tokenId || token.symbol}</span>}
        >
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
            <div className={styles.symbol}>
              <div>{token.symbol}</div>
              <div className={styles.sub}>{token.tokenId}</div>
            </div>
            <div className={styles.balance} data-hidden-value>
              {token.balance}
            </div>
          </div>
        </Tooltip>
      ),
    }))
    .filter(token => token.value === 'NEAR');

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

  const deposit = watch(fieldName).toString();

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

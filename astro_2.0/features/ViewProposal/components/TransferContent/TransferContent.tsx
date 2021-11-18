import React, { FC } from 'react';
import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { formatYoktoValue } from 'helpers/format';

import styles from './TransferContent.module.scss';

interface TransferContentProps {
  amount: string;
  target: string;
  token: string;
}

export const TransferContent: FC<TransferContentProps> = ({
  amount,
  target,
  token,
}) => {
  const { tokens } = useCustomTokensContext();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  return (
    <div className={styles.root}>
      <FieldWrapper label="Amount">
        {tokenData ? (
          <FieldValue value={formatYoktoValue(amount, tokenData.decimals)} />
        ) : (
          <div className={styles.loaderWrapper}>
            <LoadingIndicator />
          </div>
        )}
      </FieldWrapper>
      <FieldWrapper label="">
        <div className={styles.row}>
          {tokenData && (
            <>
              <div className={styles.iconWrapper}>
                {tokenData.symbol === 'NEAR' ? (
                  <Icon name="tokenNearBig" />
                ) : (
                  <div
                    style={{
                      backgroundImage: `url(${tokenData.icon})`,
                    }}
                    className={styles.icon}
                  />
                )}
              </div>
              <div className={styles.symbol}>{tokenData.symbol}</div>
            </>
          )}
        </div>
      </FieldWrapper>
      <FieldWrapper label="Target">
        <FieldValue value={target} />
      </FieldWrapper>
    </div>
  );
};

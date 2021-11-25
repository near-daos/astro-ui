import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { formatYoktoValue } from 'helpers/format';

import styles from './AddBountyContent.module.scss';

interface AddBountyContentProps {
  amount: string;
  slots: number;
  deadlineThreshold: string;
  token: string;
}

export const AddBountyContent: FC<AddBountyContentProps> = ({
  amount,
  slots,
  deadlineThreshold,
  token,
}) => {
  const { tokens } = useCustomTokensContext();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  return (
    <div className={styles.root}>
      <div className={styles.inline}>
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
      </div>
      <div className={styles.divider} />
      <div className={styles.inline}>
        <FieldWrapper label="Available Claims">
          <FieldValue value={slots} />
        </FieldWrapper>
        <div className={styles.divider} />
        <FieldWrapper label="Days to Complete">
          <FieldValue value={deadlineThreshold} />
        </FieldWrapper>
      </div>
    </div>
  );
};

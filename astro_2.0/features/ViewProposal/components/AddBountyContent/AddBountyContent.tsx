import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import { useCustomTokensContext } from 'context/CustomTokensContext';

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
      <FieldWrapper label="Amount">
        <FieldValue value={amount} />
      </FieldWrapper>
      {tokenData && (
        <FieldWrapper label="">
          <div className={styles.row}>
            <div className={styles.iconWrapper}>
              {tokenData.symbol === 'NEAR' ? (
                <Icon name="tokenNearBig" />
              ) : (
                <div
                  style={{
                    background: 'black',
                    backgroundImage: `url(${tokenData.icon})`,
                  }}
                  className={styles.icon}
                />
              )}
            </div>
            <div className={styles.symbol}>{tokenData.symbol}</div>
          </div>
        </FieldWrapper>
      )}

      <div className={styles.divider} />
      <FieldWrapper label="Available Claims">
        <FieldValue value={slots} />
      </FieldWrapper>
      <div className={styles.divider} />
      <FieldWrapper label="Days to Complete">
        <FieldValue value={deadlineThreshold} />
      </FieldWrapper>
    </div>
  );
};

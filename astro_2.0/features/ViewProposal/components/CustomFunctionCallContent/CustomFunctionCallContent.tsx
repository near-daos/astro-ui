import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { Icon } from 'components/Icon';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { formatYoktoValue } from 'utils/format';

import styles from './CustomFunctionCallContent.module.scss';

interface CustomFunctionCallContentProps {
  token: string;
  smartContractAddress: string;
  methodName: string;
  json: string;
  deposit: string;
}

export const CustomFunctionCallContent: FC<CustomFunctionCallContentProps> = ({
  token,
  smartContractAddress,
  methodName,
  json,
  deposit,
}) => {
  const { tokens } = useCustomTokensContext();
  const { t } = useTranslation();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  return (
    <div className={styles.root}>
      <div className={styles.address}>
        <FieldWrapper label={t('proposalCard.smartContractAddress')}>
          <FieldValue value={smartContractAddress} />
        </FieldWrapper>
      </div>

      <div className={styles.method}>
        <FieldWrapper label={t('proposalCard.methodName')}>
          <FieldValue value={methodName} />
        </FieldWrapper>
      </div>

      <div className={styles.editor}>
        <FieldWrapper label={t('proposalCard.json')}>
          <pre>{json}</pre>
        </FieldWrapper>
      </div>

      <div className={styles.deposit}>
        <div className={styles.row}>
          <FieldWrapper label={t('proposalCard.deposit')}>
            <FieldValue
              value={
                tokenData
                  ? formatYoktoValue(deposit, tokenData.decimals)
                  : deposit
              }
            />
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
        </div>
      </div>
    </div>
  );
};

import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { formatYoktoValue } from 'helpers/format';

import styles from './CustomFunctionCallContent.module.scss';

interface CustomFunctionCallContentProps {
  token: string;
  smartContractAddress: string;
  methodName: string;
  json: string;
  deposit: string;
}

const CustomFunctionCallContent: FC<CustomFunctionCallContentProps> = ({
  token,
  smartContractAddress,
  methodName,
  json,
  deposit,
}) => {
  const { tokens } = useCustomTokensContext();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  return (
    <div className={styles.root}>
      <div className={styles.address}>
        <FieldWrapper label="Smart Contract Address">
          <FieldValue value={smartContractAddress} />
        </FieldWrapper>
      </div>

      <div className={styles.method}>
        <FieldWrapper label="Method Name">
          <FieldValue value={methodName} />
        </FieldWrapper>
      </div>

      <div className={styles.editor}>
        <FieldWrapper label="JSON">
          <pre>{json}</pre>
        </FieldWrapper>
      </div>

      <div className={styles.deposit}>
        <div className={styles.row}>
          <FieldWrapper label="Deposit">
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

export default CustomFunctionCallContent;

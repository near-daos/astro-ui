import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { Icon } from 'components/Icon';
import { DiffRenderer } from 'astro_2.0/features/ViewProposal/components/DiffRenderer';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import { logger } from 'utils/logger';
import { formatYoktoValue } from 'utils/format';

import { CommonContent } from './components/CommonContent';
import { ViewVoteInOtherDao } from './components/ViewVoteInOtherDao';

import styles from './CustomFunctionCallContent.module.scss';

interface CustomFunctionCallContentProps {
  token: string;
  smartContractAddress: string;
  methodName: string;
  json: string;
  deposit: string;
  compareOptions?: {
    token: string;
    smartContractAddress: string;
    methodName: string;
    json: string;
    deposit: string;
  };
}

export const CustomFunctionCallContent: FC<CustomFunctionCallContentProps> = ({
  token,
  smartContractAddress,
  methodName,
  json,
  deposit,
  compareOptions,
}) => {
  const { tokens } = useCustomTokensContext();
  const { t } = useTranslation();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  function isVoteAction(action: string) {
    return ['VoteApprove', 'VoteReject', 'VoteRemove'].includes(action);
  }

  function getContent() {
    try {
      const data = JSON.parse(json);
      const { action } = data;

      if (isVoteAction(action)) {
        const { id } = data;

        return (
          <ViewVoteInOtherDao
            action={action}
            proposalId={id}
            daoId={smartContractAddress}
          />
        );
      }
    } catch (e) {
      logger.error('Could not parse JSON to Object', e);
    }

    return (
      <CommonContent
        json={json}
        methodName={methodName}
        smartContractAddress={smartContractAddress}
        compareOptions={compareOptions}
      />
    );
  }

  function renderDeposit() {
    const val = tokenData
      ? formatYoktoValue(deposit, tokenData.decimals)
      : deposit;

    if (compareOptions) {
      const cTokenData = compareOptions.token
        ? tokens[compareOptions.token]
        : tokens.NEAR;
      const compareVal = cTokenData
        ? formatYoktoValue(compareOptions.deposit, cTokenData.decimals)
        : compareOptions.deposit;

      return <DiffRenderer oldValue={compareVal} newValue={val} />;
    }

    return tokenData ? formatYoktoValue(deposit, tokenData.decimals) : deposit;
  }

  return (
    <div className={styles.root}>
      {getContent()}

      <div className={styles.deposit}>
        <div className={styles.row}>
          <FieldWrapper label={t('proposalCard.deposit')}>
            <FieldValue value={renderDeposit()} />
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

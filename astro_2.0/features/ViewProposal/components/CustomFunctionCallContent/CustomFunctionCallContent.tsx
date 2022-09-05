import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { Icon } from 'components/Icon';

import { useAllCustomTokens } from 'context/AllTokensContext';

import { formatYoktoValue } from 'utils/format';

import { CommonContent } from './components/CommonContent';

import { useRoketoStreamCheck } from './components/helpers';
import { CreateStreamContent } from './components/Stream/CreateStreamContent';

import styles from './CustomFunctionCallContent.module.scss';

interface CustomFunctionCallContentProps {
  token: string;
  smartContractAddress: string;
  methodName: string;
  json: string;
  deposit: string;
  isLastItem: boolean;
}

export const CustomFunctionCallContent: FC<CustomFunctionCallContentProps> = ({
  token,
  smartContractAddress,
  methodName,
  json,
  deposit,
  isLastItem,
}) => {
  const { tokens } = useAllCustomTokens();
  const { t } = useTranslation();
  const isStream = useRoketoStreamCheck(json);

  const tokenData = token ? tokens[token] : tokens.NEAR;

  function renderDeposit() {
    return tokenData ? formatYoktoValue(deposit, tokenData.decimals) : deposit;
  }

  function renderContent() {
    switch (true) {
      // There will be .pause .stop .resume
      case isStream.create:
        return <CreateStreamContent stream={isStream.stream} />;

      default:
        return (
          <CommonContent
            json={json}
            methodName={methodName}
            smartContractAddress={smartContractAddress}
          />
        );
    }
  }

  return (
    <div className={cn(styles.root, { [styles.withSeparator]: !isLastItem })}>
      {renderContent()}
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

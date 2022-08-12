import React, { FC } from 'react';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { useAllCustomTokens } from 'context/AllTokensContext';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { formatYoktoValue } from 'utils/format';
import { useTranslation } from 'next-i18next';

import { TokenIcon } from 'astro_2.0/components/TokenIcon';

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
  const { t } = useTranslation();

  const { tokens } = useAllCustomTokens();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  function renderAmount() {
    return tokenData ? formatYoktoValue(amount, tokenData.decimals) : amount;
  }

  return (
    <div className={styles.root}>
      <FieldWrapper label={t('proposalCard.proposalAmount')}>
        {tokenData ? (
          <FieldValue value={renderAmount()} noWrap />
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
              <TokenIcon
                symbol={tokenData?.symbol}
                icon={tokenData?.icon}
                className={styles.iconWrapper}
              />
              <div className={styles.symbol}>{tokenData.symbol}</div>
            </>
          )}
        </div>
      </FieldWrapper>
      <FieldWrapper label={t('proposalCard.proposalTarget')}>
        <FieldValue value={target} noWrap />
      </FieldWrapper>
    </div>
  );
};

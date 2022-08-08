import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { formatYoktoValue } from 'utils/format';
import { useIsValidImage } from 'hooks/useIsValidImage';
import { useTranslation } from 'next-i18next';
import { useAllCustomTokens } from 'context/AllTokensContext';

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
  const { t } = useTranslation();

  const { tokens } = useAllCustomTokens();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  const isValid = useIsValidImage(tokenData?.icon);

  function renderIcon() {
    if (tokenData?.symbol === 'NEAR') {
      return <Icon name="tokenNearBig" />;
    }

    if (isValid) {
      return (
        <div
          style={{
            backgroundImage: `url(${tokenData.icon})`,
          }}
          className={styles.icon}
        />
      );
    }

    return <div className={styles.icon} />;
  }

  function renderAmount() {
    return tokenData ? formatYoktoValue(amount, tokenData.decimals) : amount;
  }

  return (
    <div className={styles.root}>
      <div className={styles.inline}>
        <FieldWrapper
          label={t('proposalCard.proposalAmount')}
          labelClassName={styles.label}
        >
          {tokenData ? (
            <FieldValue
              value={
                <>
                  {renderAmount()}
                  <div className={styles.iconWrapper}>{renderIcon()}</div>
                  <div className={styles.symbol}>{tokenData.symbol}</div>
                </>
              }
            />
          ) : (
            <div className={styles.loaderWrapper}>
              <LoadingIndicator />
            </div>
          )}
        </FieldWrapper>
      </div>
      <div className={styles.divider} />
      <div className={cn(styles.inline, styles.flex1)}>
        <FieldWrapper
          fullWidth
          label={t('proposalCard.bountyAvailableClaims')}
          labelClassName={styles.label}
        >
          <FieldValue value={slots} />
        </FieldWrapper>
        <div className={styles.divider} />
        <FieldWrapper
          fullWidth
          label={t('proposalCard.bountyTimeToComplete')}
          labelClassName={styles.label}
        >
          <FieldValue value={deadlineThreshold} />
        </FieldWrapper>
      </div>
    </div>
  );
};

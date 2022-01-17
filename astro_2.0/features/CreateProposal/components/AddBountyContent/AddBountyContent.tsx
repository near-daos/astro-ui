import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Input } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './AddBountyContent.module.scss';

export const AddBountyContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue, getValues, watch } = useFormContext();
  const { tokens } = useCustomTokensContext();
  const amount = watch('amount');
  let amountWidth;

  if (amount.length <= 6) {
    amountWidth = 7;
  } else if (amount.length >= 15) {
    amountWidth = 15;
  } else {
    amountWidth = amount.length ?? 5;
  }

  const tokenOptions = Object.values(tokens).map(token => ({
    label: token.symbol,
    component: (
      <div className={styles.row}>
        <div className={styles.iconWrapper}>
          {token.symbol === 'NEAR' ? (
            <Icon name="tokenNearBig" />
          ) : (
            <div
              style={{ backgroundImage: `url(${token.icon})` }}
              className={styles.icon}
            />
          )}
        </div>
        <div className={styles.symbol}>{token.symbol}</div>
        <div className={styles.balance}>{token.balance}</div>
      </div>
    ),
  }));

  const selectedTokenData = tokens[getValues().selectedToken];

  return (
    <div className={styles.root}>
      <div className={styles.inline}>
        <InputWrapper
          fieldName="amount"
          label={t('proposalCard.proposalAmount')}
        >
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="number"
            inputStyles={{ width: `${amountWidth}ch`, paddingRight: 4 }}
            placeholder="00.0000"
            min={0}
            isBorderless
            size="block"
            {...register('amount')}
          />
        </InputWrapper>
        {Object.values(tokens).length ? (
          <DropdownSelect
            className={styles.select}
            options={tokenOptions}
            label="&nbsp;"
            {...register('token')}
            onChange={v => {
              setValue('token', v, {
                shouldDirty: true,
              });
            }}
            defaultValue={selectedTokenData?.symbol ?? 'NEAR'}
          />
        ) : (
          <div className={styles.loaderWrapper}>
            <LoadingIndicator />
          </div>
        )}
      </div>
      <div className={styles.divider} />
      <div className={styles.inline}>
        <InputWrapper
          fieldName="slots"
          label={t('proposalCard.bountyAvailableClaims')}
        >
          <Input
            type="number"
            className={styles.inputWrapper}
            placeholder="0"
            min={1}
            isBorderless
            size="small"
            {...register('slots')}
          />
        </InputWrapper>
        <div className={styles.divider} />
        <InputWrapper
          fieldName="deadlineThreshold"
          label={t('proposalCard.bountyDaysToComplete')}
        >
          <Input
            type="number"
            className={styles.inputWrapper}
            placeholder="0"
            min={1}
            isBorderless
            size="small"
            {...register('deadlineThreshold')}
          />
        </InputWrapper>
      </div>
    </div>
  );
};

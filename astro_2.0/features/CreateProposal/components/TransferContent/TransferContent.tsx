import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Input } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Icon } from 'components/Icon';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { formatCurrency } from 'utils/formatCurrency';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import { getProposalAmountWidth } from './utils';

import styles from './TransferContent.module.scss';

export const TransferContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue, getValues, watch } = useFormContext();
  const { tokens } = useCustomTokensContext();
  const amount = watch('amount');
  const amountWidth = getProposalAmountWidth(amount);

  const nearToUsd = (tokenBalance: string) => {
    const nearPrice = tokens?.NEAR?.price;

    if (nearPrice) {
      return formatCurrency(parseFloat(tokenBalance) * parseFloat(nearPrice));
    }

    return '';
  };

  const tokenOptions = Object.values(tokens).map(token => ({
    label: token.symbol,
    component: (
      <div className={styles.row}>
        <div className={styles.iconWrapper}>
          {token.symbol === 'NEAR' ? (
            <Icon name="tokenNearBig" />
          ) : (
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${token.icon})`,
              }}
            />
          )}
        </div>
        <div className={styles.symbol}>{token.symbol}</div>
        <div className={styles.balance}>
          <span
            className={cn({
              [styles.balanceNear]: token.symbol === 'NEAR',
            })}
          >
            {token.balance}
          </span>
          {token.symbol === 'NEAR' && (
            <span className={styles.balanceUsd}>
              &#8776;&nbsp;{nearToUsd(token.balance)}&nbsp;USD
            </span>
          )}
        </div>
      </div>
    ),
  }));

  const selectedTokenData = tokens[getValues().selectedToken];

  return (
    <div className={styles.root}>
      <InputWrapper fieldName="amount" label={t('proposalCard.proposalAmount')}>
        <Input
          className={cn(styles.inputWrapper, styles.narrow)}
          inputStyles={{ width: `${amountWidth}ch`, paddingRight: 4 }}
          type="number"
          min={0}
          placeholder="00.0000"
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
      <InputWrapper
        fieldName="target"
        label={t('proposalCard.proposalTarget')}
        flex
      >
        <Input
          className={cn(styles.inputWrapper, styles.wide)}
          placeholder={t('proposalCard.proposalTargetPlaceholder')}
          isBorderless
          size="block"
          {...register('target')}
        />
      </InputWrapper>
    </div>
  );
};

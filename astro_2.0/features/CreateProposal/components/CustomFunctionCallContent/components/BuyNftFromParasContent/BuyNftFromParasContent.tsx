import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import {
  useDepositWidth,
  useTokenOptions,
} from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { DebouncedInput, Input } from 'components/inputs/Input';
import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import styles from './BuyNftFromParasContent.module.scss';

export const BuyNftFromParasContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();
  const { tokenOptions, selectedTokenData } = useTokenOptions();

  const depositWidth = useDepositWidth();

  return (
    <div className={styles.root}>
      <div className={styles.tokenKey}>
        <InputWrapper fieldName="tokenKey" label="Token Id" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="0000"
            isBorderless
            size="block"
            {...register('tokenKey')}
          />
        </InputWrapper>
      </div>
      <div className={styles.address}>
        <InputWrapper
          fieldName="smartContractAddress"
          label="Smart contract address"
          fullWidth
        >
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="0000"
            isBorderless
            size="block"
            disabled
            value="x.paras.near"
          />
        </InputWrapper>
      </div>
      <div className={styles.gas}>
        <InputWrapper fieldName="actionsGas" label="TGas">
          <div className={styles.row}>
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              min={MIN_GAS}
              step={1}
              max={MAX_GAS}
              placeholder={`${DEFAULT_PROPOSAL_GAS}`}
              isBorderless
              size="block"
              {...register('actionsGas')}
            />
          </div>
        </InputWrapper>
      </div>
      <div className={styles.deposit}>
        <div className={styles.row}>
          <InputWrapper fieldName="deposit" label="Deposit">
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              inputStyles={{ width: `${depositWidth}ch`, paddingRight: 4 }}
              type="number"
              min={0}
              placeholder="00.0"
              isBorderless
              size="block"
              {...register('deposit')}
            />
          </InputWrapper>
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
        </div>
      </div>
      <div className={styles.target}>
        <InputWrapper
          fieldName="target"
          label={t('proposalCard.proposalTarget')}
          flex
        >
          <DebouncedInput
            className={cn(styles.inputWrapper, styles.wide)}
            placeholder={t('proposalCard.proposalTargetPlaceholder')}
            isBorderless
            size="block"
            {...register('target')}
            onValueChange={val =>
              setValue('target', val, { shouldValidate: true })
            }
          />
        </InputWrapper>
      </div>
    </div>
  );
};

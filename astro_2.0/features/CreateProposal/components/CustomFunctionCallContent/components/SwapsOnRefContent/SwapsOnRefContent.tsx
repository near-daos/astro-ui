import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import {
  useDepositWidth,
  useTokenOptions,
} from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import styles from './SwapsOnRefContent.module.scss';

export const SwapsOnRefContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();
  const { tokenOptions, selectedTokenData } = useTokenOptions('amountInToken');
  const {
    tokenOptions: amountOutTokenOptions,
    selectedTokenData: amountOutSelectedTokenData,
  } = useTokenOptions('amountOutToken');
  const amountInWidth = useDepositWidth('amountIn', 5);
  const amountOutWidth = useDepositWidth('amountOut', 5);

  return (
    <div className={styles.root}>
      <div className={styles.address}>
        <InputWrapper fieldName="pullId" label="Pull" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="number"
            min={0}
            placeholder="0000"
            isBorderless
            size="block"
            {...register('pullId')}
          />
        </InputWrapper>
      </div>

      <div className={styles.tokenIn}>
        <InputWrapper fieldName="tokenIn" label="Token in" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="abr.a11bd.near"
            isBorderless
            size="block"
            {...register('tokenIn')}
          />
        </InputWrapper>
      </div>

      <div className={styles.amountIn}>
        <div className={styles.row}>
          <InputWrapper
            fieldName="amountIn"
            label="Amount in"
            labelClassName={styles.inputLabel}
          >
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              inputStyles={{ width: `${amountInWidth}ch`, paddingRight: 4 }}
              type="number"
              min={0}
              placeholder="00.00"
              isBorderless
              size="block"
              {...register('amountIn')}
            />
          </InputWrapper>
          <DropdownSelect
            className={styles.select}
            options={tokenOptions}
            label="&nbsp;"
            {...register('amountInToken')}
            onChange={v => {
              setValue('amountInToken', v, {
                shouldDirty: true,
              });
            }}
            defaultValue={selectedTokenData?.symbol ?? 'NEAR'}
          />
        </div>
      </div>

      <div className={styles.tokenOut}>
        <InputWrapper fieldName="tokenOut" label="Token out" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="abr.a11bd.near"
            isBorderless
            size="block"
            {...register('tokenOut')}
          />
        </InputWrapper>
      </div>

      <div className={styles.amountOut}>
        <div className={styles.row}>
          <InputWrapper
            fieldName="amountOut"
            label="Min amount out"
            labelClassName={styles.inputLabel}
          >
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              inputStyles={{ width: `${amountOutWidth}ch`, paddingRight: 4 }}
              type="number"
              min={0}
              placeholder="00.00"
              isBorderless
              size="block"
              {...register('amountOut')}
            />
          </InputWrapper>
          <DropdownSelect
            className={styles.select}
            options={amountOutTokenOptions}
            label="&nbsp;"
            {...register('amountOutToken')}
            onChange={v => {
              setValue('amountOutToken', v, {
                shouldDirty: true,
              });
            }}
            defaultValue={amountOutSelectedTokenData?.symbol ?? 'NEAR'}
          />
        </div>
      </div>

      <div className={styles.target}>
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
    </div>
  );
};

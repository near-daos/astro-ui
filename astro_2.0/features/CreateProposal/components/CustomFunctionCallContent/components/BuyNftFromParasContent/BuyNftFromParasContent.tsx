import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';
import {
  useDepositWidth,
  useTokenOptions,
} from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';

import styles from './BuyNftFromParasContent.module.scss';

export const BuyNftFromParasContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();
  const { tokenOptions, selectedTokenData } = useTokenOptions();
  const timeoutOptions = useMemo(
    () => [
      {
        label: '24',
        component: (
          <div className={styles.timeoutValueWrapper}>
            <span className={styles.timeoutValue}>24</span>
            <span className={styles.timeoutSuffix}>hours</span>
          </div>
        ),
      },
    ],
    []
  );
  const priceWidth = useDepositWidth('price');

  return (
    <div className={styles.root}>
      <div className={styles.address}>
        <InputWrapper
          fieldName="smartContractAddress"
          label="Smart Contract Address"
          fullWidth
        >
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            min={0}
            placeholder="x.paras.near"
            isBorderless
            size="block"
            {...register('smartContractAddress')}
          />
        </InputWrapper>
      </div>

      <div className={styles.method}>
        <InputWrapper fieldName="methodName" label="Method Name" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            min={0}
            placeholder="nft_buy"
            isBorderless
            size="block"
            {...register('methodName')}
          />
        </InputWrapper>
      </div>

      <div className={styles.tokenKey}>
        <InputWrapper fieldName="tokenKey" label="Token Key" fullWidth>
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="text"
            placeholder="5971:gambiarra.mintbase1.near"
            isBorderless
            size="block"
            {...register('tokenKey')}
          />
        </InputWrapper>
      </div>

      <div className={styles.timeout}>
        <DropdownSelect
          isBorderless
          className={styles.select}
          options={timeoutOptions}
          label="Timeout"
          {...register('timout')}
          onChange={v => {
            setValue('timout', v, {
              shouldDirty: true,
            });
          }}
          defaultValue={timeoutOptions[0].label}
        />
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

      <div className={styles.price}>
        <div className={styles.row}>
          <InputWrapper fieldName="price" label="Price">
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              inputStyles={{ width: `${priceWidth}ch`, paddingRight: 4 }}
              type="number"
              min={0}
              placeholder="00.0000"
              isBorderless
              size="block"
              {...register('price')}
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
          <Input
            className={cn(styles.inputWrapper, styles.wide)}
            placeholder={t('proposalCard.proposalTargetPlaceholder')}
            isBorderless
            size="block"
            {...register('target')}
          />
        </InputWrapper>
      </div>
    </div>
  );
};

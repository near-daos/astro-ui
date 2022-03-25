import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Icon } from 'components/Icon';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import {
  useDepositWidth,
  useTokenOptions,
} from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';

import styles from './BuyNftFromMintbaseContent.module.scss';

export const BuyNftFromMintbaseContent: FC = () => {
  const { register, setValue } = useFormContext();
  const { tokenOptions, selectedTokenData } = useTokenOptions();
  const timeoutOptions = useMemo(
    () => [
      {
        label: 'Minutes',
        component: (
          <div className={styles.timeoutValueWrapper}>
            <span className={styles.timeoutSuffix}>minutes</span>
          </div>
        ),
      },
      {
        label: 'Hours',
        component: (
          <div className={styles.timeoutValueWrapper}>
            <span className={styles.timeoutSuffix}>hours</span>
          </div>
        ),
      },
      {
        label: 'Days',
        component: (
          <div className={styles.timeoutValueWrapper}>
            <span className={styles.timeoutSuffix}>days</span>
          </div>
        ),
      },
    ],
    []
  );
  const depositWidth = useDepositWidth();
  const priceWidth = useDepositWidth('price');

  return (
    <div className={styles.root}>
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

      <div className={styles.price}>
        <InputWrapper fieldName="price" label="Price">
          <div className={styles.row}>
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              inputStyles={{ width: `${priceWidth}ch`, paddingRight: 4 }}
              type="text"
              placeholder="00.0"
              isBorderless
              size="block"
              {...register('price')}
            />
            <div className={styles.iconWrapper}>
              <Icon name="tokenNearBig" />
            </div>
            <div className={styles.symbol}>NEAR</div>
          </div>
        </InputWrapper>
      </div>

      <div className={styles.timout}>
        <div className={styles.row}>
          <InputWrapper
            fieldName="timeout"
            label="Time out"
            labelClassName={styles.inputLabel}
          >
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              inputStyles={{ width: `4ch`, paddingRight: 4 }}
              type="number"
              min={0}
              placeholder="00"
              isBorderless
              size="block"
              {...register('timeout')}
            />
          </InputWrapper>
          <DropdownSelect
            isBorderless
            className={cn(styles.select, styles.timeoutSelect)}
            options={timeoutOptions}
            label="&nbsp;"
            {...register('timeoutGranularity')}
            onChange={v => {
              setValue('timeoutGranularity', v, {
                shouldDirty: true,
              });
            }}
            defaultValue={timeoutOptions[1].label}
          />
        </div>
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
    </div>
  );
};

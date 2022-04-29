import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { DebouncedInput, Input } from 'components/inputs/Input';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import styles from './TransferNftFromMintbaseContent.module.scss';

export const TransferNftFromMintbaseContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();

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

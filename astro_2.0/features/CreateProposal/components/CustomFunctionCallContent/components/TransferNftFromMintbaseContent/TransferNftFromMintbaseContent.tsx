import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Input } from 'components/inputs/Input';

import styles from './TransferNftFromMintbaseContent.module.scss';

export const TransferNftFromMintbaseContent: FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

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

import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/Input';
import { Group } from 'features/vote-policy/components/Group';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { useTranslation } from 'next-i18next';

import styles from './ChangePolicyContent.module.scss';

interface ChangePolicyContentProps {
  amount?: number;
}

export const ChangePolicyContent: FC<ChangePolicyContentProps> = ({
  amount,
}) => {
  const { register } = useFormContext();

  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="group" label={t('proposalCard.daoGroup')}>
          <div className={styles.value}>
            <Group name="All groups" />
          </div>
        </InputWrapper>
        <InputWrapper fieldName="group" label={t('proposalCard.whoVotes')}>
          <div className={styles.value}>{t('proposalCard.person')}</div>
        </InputWrapper>
        <InputWrapper
          fieldName="amount"
          label={t('proposalCard.consensus')}
          alignRight
        >
          <Input
            {...register('amount')}
            placeholder={`${amount ?? 0}`}
            isBorderless
            textAlign="left"
            type="number"
            size="small"
            className={styles.amount}
          />
        </InputWrapper>
        <div className={styles.percent}>%</div>
      </div>
    </div>
  );
};

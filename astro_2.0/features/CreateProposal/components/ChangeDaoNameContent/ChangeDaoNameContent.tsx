import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import { Input } from 'components/inputs/Input';
import { useTranslation } from 'next-i18next';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './ChangeDaoNameContent.module.scss';

interface ChangeDaoNameContentProps {
  daoId: string;
}

export const ChangeDaoNameContent: FC<ChangeDaoNameContentProps> = ({
  daoId,
}) => {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();

  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper
          fieldName="displayName"
          label={t('proposalCard.newDAOName')}
          fullWidth
        >
          <Input
            {...register('displayName')}
            isValid={touchedFields.displayName && !errors.displayName?.message}
            size="block"
            className={styles.inputWrapper}
            isBorderless
            placeholder="Sample DAO New Name"
            maxLength={500}
            textAlign="left"
          />
        </InputWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget
          label={t('proposalCard.proposalTarget')}
          value={daoId}
          valueFontSize="S"
        />
      </div>
    </div>
  );
};

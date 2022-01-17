import cn from 'classnames';
import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Input } from 'components/inputs/Input';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './ChangeDaoLegalInfoContent.module.scss';

interface ChangeDaoLegalInfoProps {
  daoId: string;
}

export const ChangeDaoLegalInfoContent: VFC<ChangeDaoLegalInfoProps> = ({
  daoId,
}) => {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();

  const { t } = useTranslation();

  function fieldValid(key: string) {
    return touchedFields[key] && !errors?.[key]?.message;
  }

  return (
    <div className={styles.root}>
      <div className={styles.inputsHolder}>
        <InputWrapper
          fieldName="legalStatus"
          label={t('proposalCard.newDAOLegalStatus')}
        >
          <Input
            {...register('legalStatus')}
            isValid={fieldValid('legalStatus')}
            size="block"
            inputClassName={styles.input}
            isBorderless
            placeholder={t('proposalCard.newDAOLegalStatusHint')}
            textAlign="left"
          />
        </InputWrapper>

        <InputWrapper
          fieldName="legalLink"
          label={t('proposalCard.newDAOLegalDoc')}
        >
          <Input
            {...register('legalLink')}
            isValid={fieldValid('legalLink')}
            size="block"
            inputClassName={styles.input}
            isBorderless
            placeholder={t('proposalCard.newDAOLegalDocHint')}
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

import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Input } from 'components/inputs/Input';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import styles from './DaoLegalStatus.module.scss';

export const DaoLegalStatus: VFC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {t('createDAO.daoLegalStatus.daoKYC')}
      </div>
      <p className={styles.description}>
        {t('createDAO.daoLegalStatus.daoKYCDescription')}
      </p>
      <InputFormWrapper
        errors={errors}
        component={
          <Input
            size="block"
            className={styles.inputWrapper}
            inputClassName={styles.inputEl}
            placeholder={t(
              'createDAO.daoLegalStatus.daoKYCDescriptionPlaceholder'
            )}
            {...register('legalStatus')}
          />
        }
      />

      <p className={styles.description}>
        {t('createDAO.daoLegalStatus.daoKYCLink')}
      </p>
      <InputFormWrapper
        errors={errors}
        component={
          <Input
            size="block"
            className={styles.inputWrapper}
            inputClassName={styles.inputEl}
            placeholder={t('createDAO.daoLegalStatus.daoKYCLinkPlaceholder')}
            {...register('legalLink')}
          />
        }
      />
    </div>
  );
};

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
      <div className={styles.header}>{t('createDAONew.daoKYC.daoKYC')}</div>
      <p className={styles.description}>
        {t('createDAONew.daoKYC.daoKYCLegalStatus')}
      </p>
      <InputFormWrapper
        errors={errors}
        component={
          <Input
            size="block"
            className={styles.inputWrapper}
            inputClassName={styles.inputEl}
            placeholder={t('createDAONew.daoKYC.daoKYCLegalPlaceholder')}
            {...register('legalStatus')}
          />
        }
      />

      <p className={styles.description}>
        {t('createDAONew.daoKYC.daoKYCLink')}
      </p>
      <InputFormWrapper
        errors={errors}
        component={
          <Input
            size="block"
            className={styles.inputWrapper}
            inputClassName={styles.inputEl}
            placeholder={t('createDAONew.daoKYC.daoKYCLinkPlaceholder')}
            {...register('legalLink')}
          />
        }
      />
    </div>
  );
};

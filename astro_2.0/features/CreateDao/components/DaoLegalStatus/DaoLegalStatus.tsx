import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/Input';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import styles from './DaoLegalStatus.module.scss';

export const DaoLegalStatus: VFC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.header}>KYC</div>
      <p className={styles.description}>
        Please explain your DAO`s Legal Status and Jurisdiction. (if known)
      </p>
      <InputFormWrapper
        errors={errors}
        component={
          <Input
            size="block"
            className={styles.inputWrapper}
            inputClassName={styles.inputEl}
            placeholder="Legal Status"
            {...register('legalStatus')}
          />
        }
      />

      <p className={styles.description}>
        Please attach a link to the relevant document as proof of legal status.
      </p>
      <InputFormWrapper
        errors={errors}
        component={
          <Input
            size="block"
            className={styles.inputWrapper}
            inputClassName={styles.inputEl}
            placeholder="https://Legal_Document"
            {...register('legalLink')}
          />
        }
      />
    </div>
  );
};

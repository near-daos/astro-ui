import React, { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/Input';
import { useTranslation } from 'next-i18next';

import { DaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/components/DaoAddress';
import { DaoNameInputSection } from 'astro_2.0/features/CreateDao/components/DaoNameForm/components/DaoNameInputSection';

import styles from './CreateDaoContent.module.scss';

interface Props {
  daoId: string;
}

export const CreateDaoContent: FC<Props> = () => {
  const {
    setError,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const { t } = useTranslation();

  const displayName = watch('displayName');

  const handleAddressChange = useCallback(
    val => {
      setValue('address', val, { shouldValidate: true });
    },
    [setValue]
  );

  const handleAddressError = useCallback(
    address => {
      setValue('address', address);
      setError('address', {
        type: 'manual',
        message: t('createDAO.daoExists'),
      });
    },
    [setError, setValue, t]
  );

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <DaoNameInputSection
          errors={errors}
          className={styles.nameInput}
          label="New DAO name"
          component={
            <Input
              placeholder={t('createDAO.daoNameForm.daoSampleName')}
              size="block"
              isBorderless
              {...register('displayName')}
            />
          }
        />
      </div>

      <div className={styles.row}>
        <DaoNameInputSection
          errors={errors}
          className={styles.address}
          label={
            <div>
              DAO Address <span className={styles.info}>(auto filled)</span>
            </div>
          }
          labelClassName={styles.addressLabel}
          component={
            <DaoAddress
              displayName={displayName}
              name="address"
              onChange={handleAddressChange}
              onError={handleAddressError}
            />
          }
        />
      </div>
    </div>
  );
};

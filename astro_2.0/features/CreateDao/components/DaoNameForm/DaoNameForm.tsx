import React, { VFC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Input } from 'components/inputs/Input';
import { TextArea } from 'components/inputs/TextArea';

import { DaoAddress } from './components/DaoAddress';
import { DaoNameInputSection } from './components/DaoNameInputSection';

import styles from './DaoNameForm.module.scss';

export const DaoNameForm: VFC = () => {
  const { watch, register } = useFormContext();
  const { t } = useTranslation();
  const displayName = watch('displayName');

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>{t('createDAONew.daoNameForm.daoNameAndPurpose')}</h2>
        <p>{t('createDAONew.daoNameForm.daoFieldsDescription')}</p>
      </div>

      <div className={styles.card}>
        <DaoNameInputSection
          className={styles.nameInput}
          label={t('createDAONew.daoNameForm.daoName')}
          component={
            <Input
              placeholder={t('createDAONew.daoNameForm.daoSampleName')}
              size="block"
              isBorderless
              {...register('displayName')}
            />
          }
        />

        <DaoNameInputSection
          className={styles.address}
          label={
            <div>
              DAO Address <span className={styles.warning}>(auto filled)</span>
            </div>
          }
          labelClassName={styles.addressLabel}
          component={
            <Controller
              name="address"
              render={renderProps => {
                const {
                  field: { onChange },
                } = renderProps;

                return (
                  <DaoAddress displayName={displayName} onChange={onChange} />
                );
              }}
            />
          }
        />

        <DaoNameInputSection
          className={styles.purpose}
          label={t('createDAONew.daoNameForm.daoPurpose')}
          component={
            <TextArea
              className={styles.purposeInput}
              size="block"
              minRows={1}
              maxRows={5}
              placeholder={t('createDAONew.daoNameForm.daoSampleText')}
              maxLength={500}
              isBorderless
              {...register('purpose')}
            />
          }
        />
      </div>
    </div>
  );
};

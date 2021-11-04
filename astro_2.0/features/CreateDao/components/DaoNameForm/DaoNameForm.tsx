import React, { VFC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/input/Input';
import { TextArea } from 'components/inputs/textarea/TextArea';

import { DaoAddress } from './components/DaoAddress';
import { DaoNameInputSection } from './components/DaoNameInputSection';

import styles from './DaoNameForm.module.scss';

export const DaoNameForm: VFC = () => {
  const { watch, register } = useFormContext();

  const displayName = watch('displayName');

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>DAO name and purpose</h2>
        <p>All fields bellow, unless otherwise noted are required.</p>
      </div>

      <div className={styles.card}>
        <DaoNameInputSection
          className={styles.nameInput}
          label="DAO Name"
          component={
            <Input
              placeholder="Sample DAO Name"
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
          label="Purpose"
          component={
            <TextArea
              className={styles.purposeInput}
              size="block"
              minRows={1}
              maxRows={5}
              placeholder="Sample text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient."
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

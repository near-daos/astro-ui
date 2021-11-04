import React, { useEffect, VFC } from 'react';
import { useFormContext } from 'react-hook-form';

import { nearConfig } from 'config';

import { Input } from 'components/inputs/input/Input';
import { TextArea } from 'components/inputs/textarea/TextArea';
import { InputFormWrapper } from 'components/inputs/input-form-wrapper/InputFormWrapper';

import { formatDaoAddress } from './helpers';

import styles from './DaoNameForm.module.scss';

export const DaoNameForm: VFC = () => {
  const {
    watch,
    register,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext();

  const displayName = watch('displayName');

  useEffect(() => {
    setValue('address', formatDaoAddress(displayName));
  }, [setValue, displayName]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>DAO name and purpose</h2>
        <p>All fields bellow, unless otherwise noted are required.</p>
      </div>

      <div className={styles.card}>
        <section className={styles.name}>
          <div className={styles.label}>DAO Name</div>

          <InputFormWrapper
            errors={errors}
            className={styles.nameInput}
            component={
              <Input
                isValid={
                  touchedFields.displayName && !errors.displayName?.message
                }
                placeholder="Sample DAO Name"
                size="block"
                isBorderless
                {...register('displayName')}
              />
            }
          />
        </section>

        <section className={styles.address}>
          <div className={styles.label}>
            DAO Address <span className={styles.warning}>(auto filled)</span>
          </div>
          <div className={styles.addressText}>
            {displayName ? (
              formatDaoAddress(displayName)
            ) : (
              <span className={styles.addressPlaceholder}>sampledaoname</span>
            )}
            .{nearConfig.contractName}
          </div>
        </section>

        <section className={styles.purpose}>
          <div className={styles.label}>Puprose</div>
          <InputFormWrapper
            errors={errors}
            className={styles.purposeText}
            component={
              <TextArea
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
        </section>
      </div>
    </div>
  );
};

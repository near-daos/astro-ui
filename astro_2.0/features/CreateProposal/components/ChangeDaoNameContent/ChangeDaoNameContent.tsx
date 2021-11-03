import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/input/Input';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import styles from './ChangeDaoNameContent.module.scss';

interface ChangeDaoNameContentProps {
  daoId: string;
}

export const ChangeDaoNameContent: FC<ChangeDaoNameContentProps> = ({
  daoId,
}) => {
  const {
    register,
    // setValue,
    // getValues,
    formState: { errors, touchedFields },
  } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <Input
          label="New DAO name"
          {...register('displayName')}
          isValid={touchedFields.displayName && !errors.displayName?.message}
          size="block"
          isBorderless
          placeholder="Sample DAO New Name"
          maxLength={500}
          textAlign="left"
        />
      </div>
      <div className={styles.row}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};

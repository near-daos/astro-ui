import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { PermissionsSelector } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/PermissionsSelector';

import styles from './ChangeVotingPermissionsContent.module.scss';

export const ChangeVotingPermissionsContent: FC = () => {
  const { watch, setValue } = useFormContext();

  const data = watch('policy');
  const allowPolicyChange = watch('allowPolicyChange');

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <PermissionsSelector
          disableNewProposal={!allowPolicyChange}
          initialData={data}
          className={styles.selector}
          onChange={val => {
            setValue('policy', val, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      </div>
    </div>
  );
};

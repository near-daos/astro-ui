import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { PermissionsSelector } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/PermissionsSelector';

import styles from './ChangeVotingPermissionsContent.module.scss';

export const ChangeVotingPermissionsContent: FC = () => {
  const { watch } = useFormContext();

  const data = watch('policy');

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <PermissionsSelector
          disableNewProposal
          initialData={data}
          className={styles.selector}
        />
      </div>
    </div>
  );
};

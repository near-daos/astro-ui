import React, { FC } from 'react';

import { PermissionsSelector } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/PermissionsSelector';
import { SelectorRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';

import styles from './ChangePermissionsContent.module.scss';

interface ChangePermissionsContentProps {
  initialData: SelectorRow[];
}

export const ChangePermissionsContent: FC<ChangePermissionsContentProps> = ({
  initialData,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <PermissionsSelector
          disableNewProposal
          initialData={initialData}
          className={styles.selector}
        />
      </div>
    </div>
  );
};

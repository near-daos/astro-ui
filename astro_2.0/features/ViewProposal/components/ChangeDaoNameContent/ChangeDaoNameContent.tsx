import React, { FC } from 'react';
import cn from 'classnames';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './ChangeDaoNameContent.module.scss';

interface ChangeDaoNameContentProps {
  daoId: string;
  displayName: string;
}

export const ChangeDaoNameContent: FC<ChangeDaoNameContentProps> = ({
  daoId,
  displayName,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label="New DAO name">
          <FieldValue value={displayName} />
        </FieldWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};

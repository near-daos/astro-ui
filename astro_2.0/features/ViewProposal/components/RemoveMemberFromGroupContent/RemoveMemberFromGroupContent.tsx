import React, { FC } from 'react';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './RemoveMemberFromGroupContent.module.scss';

interface ChangeDaoNameContentProps {
  group: string;
  memberName: string;
}

export const RemoveMemberFromGroupContent: FC<ChangeDaoNameContentProps> = ({
  group,
  memberName,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label="Group">
          <FieldValue value={group} />
        </FieldWrapper>
      </div>
      <div className={styles.row}>
        <FieldWrapper label="Target">
          <FieldValue value={memberName} />
        </FieldWrapper>
      </div>
    </div>
  );
};

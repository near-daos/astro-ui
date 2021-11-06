import React, { FC } from 'react';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './CreateGroupContent.module.scss';

interface CreateGroupContentProps {
  daoId: string;
  group: string;
  memberName: string;
}

export const CreateGroupContent: FC<CreateGroupContentProps> = ({
  daoId,
  group,
  memberName,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label="New Group Name">
          <FieldValue value={group} />
        </FieldWrapper>

        <FieldWrapper label="Initial Member Name">
          <FieldValue value={memberName} />
        </FieldWrapper>
      </div>

      <div className={styles.row}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};

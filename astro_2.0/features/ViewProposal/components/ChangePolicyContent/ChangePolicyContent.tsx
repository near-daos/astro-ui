import React, { FC } from 'react';
import { Group } from 'features/vote-policy/components/group';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './ChangePolicyContent.module.scss';

interface ChangePolicyContentProps {
  amount?: number;
}

export const ChangePolicyContent: FC<ChangePolicyContentProps> = ({
  amount,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label="Group">
          <FieldValue value={<Group name="All groups" />} />
        </FieldWrapper>
        <FieldWrapper label="Who votes">
          <FieldValue value="Person" />
        </FieldWrapper>
        <FieldWrapper label="Consensus" alignRight>
          <FieldValue value={`${amount}%`} />
        </FieldWrapper>
      </div>
    </div>
  );
};

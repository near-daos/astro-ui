import React, { FC } from 'react';
import cn from 'classnames';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './ChangeDaoPurposeContent.module.scss';

interface ChangeDaoPurposeContentProps {
  daoId: string;
  purpose: string;
}

export const ChangeDaoPurposeContent: FC<ChangeDaoPurposeContentProps> = ({
  daoId,
  purpose,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label="New Purpose">
          <FieldValue value={purpose} normal />
        </FieldWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './AddMemberToGroupContent.module.scss';

interface AddMemberToGroupContentProps {
  group: string;
  memberName: string;
}

export const AddMemberToGroupContent: FC<AddMemberToGroupContentProps> = ({
  group,
  memberName,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.group')}>
          <FieldValue value={group} />
        </FieldWrapper>
      </div>
      <div className={styles.row}>
        <FieldWrapper
          label={t('proposalCard.proposalTarget')}
          className={styles.wrapperRoot}
        >
          <FieldValue value={memberName} noWrap />
        </FieldWrapper>
      </div>
    </div>
  );
};

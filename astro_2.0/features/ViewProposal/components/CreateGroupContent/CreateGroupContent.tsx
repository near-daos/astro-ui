import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.newGroupName')}>
          <FieldValue value={group} />
        </FieldWrapper>

        <FieldWrapper label={t('proposalCard.initialMemberName')}>
          <FieldValue value={memberName} noWrap />
        </FieldWrapper>
      </div>

      <div className={styles.row}>
        <InfoBlockWidget
          label={t('proposalCard.proposalTarget')}
          value={daoId}
          valueFontSize="S"
        />
      </div>
    </div>
  );
};

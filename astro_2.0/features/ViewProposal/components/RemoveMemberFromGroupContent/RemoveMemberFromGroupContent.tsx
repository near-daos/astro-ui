import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { DiffRenderer } from 'astro_2.0/features/ViewProposal/components/DiffRenderer';

import styles from './RemoveMemberFromGroupContent.module.scss';

interface ChangeDaoNameContentProps {
  group: string;
  memberName: string;
  compareOptions?: {
    group: string;
    memberName: string;
  };
}

export const RemoveMemberFromGroupContent: FC<ChangeDaoNameContentProps> = ({
  group,
  memberName,
  compareOptions,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.group')}>
          <FieldValue
            value={
              compareOptions ? (
                <DiffRenderer
                  oldValue={compareOptions.group}
                  newValue={group}
                />
              ) : (
                group
              )
            }
          />
        </FieldWrapper>
      </div>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.proposalTarget')}>
          <FieldValue
            value={
              compareOptions ? (
                <DiffRenderer
                  oldValue={compareOptions.memberName}
                  newValue={memberName}
                />
              ) : (
                memberName
              )
            }
          />
        </FieldWrapper>
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './CreateDaoContent.module.scss';

interface ChangeDaoNameContentProps {
  displayName: string;
}

export const CreateDaoContent: FC<ChangeDaoNameContentProps> = ({
  displayName,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.newDAOName')}>
          <FieldValue value={displayName} />
        </FieldWrapper>
      </div>
    </div>
  );
};

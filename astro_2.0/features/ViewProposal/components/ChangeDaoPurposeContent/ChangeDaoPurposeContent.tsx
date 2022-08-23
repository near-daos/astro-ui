import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.newDAOPurpose')}>
          <FieldValue value={purpose} normal autoHeight />
        </FieldWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget
          label={t('proposalCard.proposalTarget')}
          value={daoId}
          valueFontSize="S"
        />
      </div>
    </div>
  );
};

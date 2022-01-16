import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { Group } from 'features/vote-policy/components/Group';
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
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.daoGroup')}>
          <FieldValue value={<Group name="All groups" />} />
        </FieldWrapper>
        <FieldWrapper label={t('proposalCard.whoVotes')}>
          <FieldValue value={t('proposalCard.person')} />
        </FieldWrapper>
        <FieldWrapper label={t('proposalCard.consensus')} alignRight>
          <FieldValue value={`${amount}%`} />
        </FieldWrapper>
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './ChangeBondsContent.module.scss';

interface ChangeBondsContentProps {
  daoId: string;
  createProposalBond: number;
  proposalExpireTime: number;
  claimBountyBond: number;
  unclaimBountyTime: number;
}

export const ChangeBondsContent: FC<ChangeBondsContentProps> = ({
  daoId,
  createProposalBond,
  proposalExpireTime,
  claimBountyBond,
  unclaimBountyTime,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.title}>{t('proposalCard.proposals')}</div>
        <div className={styles.inline}>
          <FieldWrapper label={t('proposalCard.proposalBonds')}>
            <FieldValue value={createProposalBond} />
          </FieldWrapper>

          <FieldWrapper label={t('proposalCard.proposalBondExpirationTime')}>
            <FieldValue value={proposalExpireTime} />
          </FieldWrapper>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>{t('proposalCard.proposalBounties')}</div>
        <div className={styles.inline}>
          <FieldWrapper label={t('proposalCard.proposalClaimBounty')}>
            <FieldValue value={claimBountyBond} />
          </FieldWrapper>

          <FieldWrapper label={t('proposalCard.proposalBountyUnclaimTime')}>
            <FieldValue value={unclaimBountyTime} />
          </FieldWrapper>
        </div>
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

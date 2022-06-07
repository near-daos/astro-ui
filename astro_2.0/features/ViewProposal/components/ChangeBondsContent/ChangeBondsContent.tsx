import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { DiffRenderer } from 'astro_2.0/features/ViewProposal/components/DiffRenderer';

import styles from './ChangeBondsContent.module.scss';

interface ChangeBondsContentProps {
  daoId: string;
  createProposalBond: number;
  proposalExpireTime: number;
  claimBountyBond: number;
  unclaimBountyTime: number;
  compareOptions?: {
    createProposalBond: number;
    proposalExpireTime: number;
    claimBountyBond: number;
    unclaimBountyTime: number;
  };
}

export const ChangeBondsContent: FC<ChangeBondsContentProps> = ({
  daoId,
  createProposalBond,
  proposalExpireTime,
  claimBountyBond,
  unclaimBountyTime,
  compareOptions,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.title}>{t('proposalCard.proposals')}</div>
        <div className={styles.inline}>
          <FieldWrapper label={t('proposalCard.proposalBonds')}>
            <FieldValue
              value={
                compareOptions ? (
                  <DiffRenderer
                    oldValue={compareOptions.createProposalBond}
                    newValue={createProposalBond}
                  />
                ) : (
                  createProposalBond
                )
              }
            />
          </FieldWrapper>

          <FieldWrapper label={t('proposalCard.proposalBondExpirationTime')}>
            <FieldValue
              value={
                compareOptions ? (
                  <DiffRenderer
                    oldValue={compareOptions.proposalExpireTime}
                    newValue={proposalExpireTime}
                  />
                ) : (
                  proposalExpireTime
                )
              }
            />
          </FieldWrapper>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>{t('proposalCard.proposalBounties')}</div>
        <div className={styles.inline}>
          <FieldWrapper label={t('proposalCard.proposalClaimBounty')}>
            <FieldValue
              value={
                compareOptions ? (
                  <DiffRenderer
                    oldValue={compareOptions.claimBountyBond}
                    newValue={claimBountyBond}
                  />
                ) : (
                  claimBountyBond
                )
              }
            />
          </FieldWrapper>

          <FieldWrapper label={t('proposalCard.proposalBountyUnclaimTime')}>
            <FieldValue
              value={
                compareOptions ? (
                  <DiffRenderer
                    oldValue={compareOptions.unclaimBountyTime}
                    newValue={unclaimBountyTime}
                  />
                ) : (
                  unclaimBountyTime
                )
              }
            />
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

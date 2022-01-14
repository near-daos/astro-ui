import cn from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import * as Typography from 'components/Typography';

import styles from './ProposalTrackerCard.module.scss';

export interface ProposalTrackerProps {
  activeVotes: number;
  totalProposals: number;
  preview?: boolean;
}

export const ProposalTrackerCard: FC<ProposalTrackerProps> = ({
  activeVotes,
  totalProposals,
  preview,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Typography.Subtitle
          className={cn(styles.title, styles.active)}
          size={2}
        >
          <span>{activeVotes}</span>{' '}
          {activeVotes === 1
            ? t('components.daoDetails.proposalTrackerCard.active')
            : t('components.daoDetails.proposalTrackerCard.activePlural')}{' '}
          {activeVotes === 1
            ? t('components.daoDetails.proposalTrackerCard.proposal')
            : t('components.daoDetails.proposalTrackerCard.proposals')}
        </Typography.Subtitle>
        <Typography.Subtitle className={styles.subtitle} size={6}>
          {`${totalProposals} ${t(
            'components.daoDetails.proposalTrackerCard.proposalsInTotal'
          )}`}
        </Typography.Subtitle>
      </div>
      {preview && (
        <div className={styles.action}>
          {t('components.daoDetails.proposalTrackerCard.createProposal')}
        </div>
      )}
    </div>
  );
};

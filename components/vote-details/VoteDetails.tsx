import React from 'react';
import cn from 'classnames';
import { Bond } from 'components/bond';
import { BondDetail, VoteDetail, VoterDetail } from 'features/types';
import { VotersList } from './components/voters-list/VotersList';
import { ProgressBar } from './components/progress-bar/ProgressBar';
import styles from './vote-details.module.scss';

export interface VoteDetailsProps {
  voteDetails: VoteDetail[];
  bondDetail: BondDetail;
  votersList?: VoterDetail[];
  showProgress?: boolean;
  className?: string;
}

export const VoteDetails: React.FC<VoteDetailsProps> = ({
  voteDetails,
  bondDetail,
  votersList,
  showProgress,
  className = ''
}) => {
  const renderDetail = (detail: VoteDetail, index: number) => (
    <div className={styles.detail} key={detail.label}>
      {index > 0 && <div className={styles.or}>OR</div>}
      <div className={styles.row}>
        <span className={styles.limit}>{detail.limit}</span>
        <span className={styles.separator}>&nbsp;of&nbsp;</span>
        <span className={styles.label}>{detail.label}</span>
      </div>
      {showProgress && <ProgressBar detail={detail} />}
    </div>
  );

  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.details, styles.item)}>
        <div className={styles.description}>Minimum votes needed</div>
        {voteDetails.map((detail, index) => renderDetail(detail, index))}
      </div>
      <div className={styles.item}>
        {showProgress && votersList ? (
          <VotersList votersList={votersList} />
        ) : (
          <Bond {...bondDetail} className={styles.item} />
        )}
      </div>
    </div>
  );
};

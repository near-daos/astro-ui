import React from 'react';
import { Bond } from 'components/bond';
import classNames from 'classnames';
import { BondDetail, VoteDetail } from 'features/types';
import styles from './vote-details.module.scss';

export interface VoteDetailsProps {
  voteDetails: VoteDetail[];
  bondDetail: BondDetail;
  className?: string;
}

export const VoteDetails: React.FC<VoteDetailsProps> = ({
  voteDetails,
  bondDetail,
  className = ''
}) => {
  const renderDetail = ({ label, value }: VoteDetail, index: number) => (
    <div className={styles.detail} key={label}>
      {index > 0 ? <div className={styles.or}>OR</div> : null}
      <div className={styles.row}>
        <div className={styles.value}>{value}</div>
        <div className={styles.separator}>&nbsp;of&nbsp;</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className={classNames(styles.root, className)}>
      <div className={classNames(styles.details, styles.item)}>
        <div className={styles.description}>Minimum votes needed</div>
        {voteDetails.map((detail, index) => renderDetail(detail, index))}
      </div>
      <Bond {...bondDetail} className={styles.item} />
    </div>
  );
};

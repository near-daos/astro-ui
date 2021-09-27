import cn from 'classnames';
import { Bond } from 'components/bond';
import { VoteDetail } from 'features/types';
import { getVoteDetails, Scope } from 'features/vote-policy/helpers';
import { formatYoktoValue } from 'helpers/format';
import { useDao } from 'hooks/useDao';
import { useProposal } from 'hooks/useProposal';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { ProgressBar } from './components/progress-bar/ProgressBar';

import { VotersList } from './components/voters-list/VotersList';

import styles from './vote-details.module.scss';

export interface VoteDetailsProps {
  showProgress?: boolean;
  scope: Scope;
  className?: string;
  proposalId?: number;
}

export const VoteDetails: React.FC<VoteDetailsProps> = ({
  scope,
  showProgress,
  className = '',
  proposalId
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);
  const daoProposal = useProposal(currentDao?.id, proposalId);

  const { details, votersList } = useMemo(
    () => getVoteDetails(currentDao, scope, daoProposal),
    [daoProposal, scope, currentDao]
  );

  // console.log(details, currentDao);

  const bond = formatYoktoValue(currentDao?.policy.proposalBond ?? '0');

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
        {details.map((detail, index) => renderDetail(detail, index))}
      </div>
      <div className={styles.item}>
        {showProgress && votersList ? (
          <VotersList votersList={votersList} />
        ) : (
          <Bond value={bond} token="NEAR" className={styles.item} />
        )}
      </div>
    </div>
  );
};

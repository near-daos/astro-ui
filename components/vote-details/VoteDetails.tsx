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
  proposalDaoId?: string;
  showProgress?: boolean;
  scope: Scope;
  className?: string;
  proposalId?: number;
}

export const VoteDetails: React.FC<VoteDetailsProps> = ({
  proposalDaoId,
  scope,
  showProgress,
  className = '',
  proposalId
}) => {
  const router = useRouter();
  const daoId = proposalDaoId || (router.query.dao as string);
  const currentDao = useDao(daoId);
  const daoProposal = useProposal(currentDao?.id, proposalId);

  const { details, votersList } = useMemo(
    () => getVoteDetails(currentDao, scope, daoProposal),
    [daoProposal, scope, currentDao]
  );

  const bond = formatYoktoValue(currentDao?.policy.proposalBond ?? '0');

  const renderDetail = (detail: VoteDetail) => (
    <div className={styles.detail} key={detail.label}>
      <div className={styles.row}>
        <span className={styles.limit}>{detail.limit}</span>
        <span className={styles.separator}>&nbsp;of</span>
        <span className={styles.label}>group</span>
      </div>
      {showProgress && <ProgressBar detail={detail} />}
    </div>
  );

  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.details, styles.item)}>
        <div className={styles.description}>Minimum votes needed</div>
        {renderDetail(details)}
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

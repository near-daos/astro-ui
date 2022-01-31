import React, { FC } from 'react';
import { format } from 'date-fns';
import cn from 'classnames';

import { BountyProposal } from 'types/bounties';

import styles from './CompleteProposalRow.module.scss';

const FORMAT = 'dd MMM, yyyy';

interface CompleteProposalRowProps {
  data: BountyProposal;
}

export const CompleteProposalRow: FC<CompleteProposalRowProps> = ({ data }) => {
  const { proposer, status: proposalStatus } = data;

  let status;
  let statusLabel;

  switch (proposalStatus) {
    case 'Approved': {
      statusLabel = 'Successfully approved';
      status = 'Approved';
      break;
    }
    case 'InProgress': {
      statusLabel = 'Pending Approval';
      status = 'Pending';
      break;
    }
    default: {
      statusLabel = 'Not approved';
      status = 'Rejected';
    }
  }

  return (
    <div
      className={cn(styles.root, {
        [styles.inProgress]: status === 'InProgress',
        [styles.approved]: status === 'Approved',
        [styles.pending]: status === 'Pending',
        [styles.rejected]: status === 'Rejected',
      })}
    >
      <div className={styles.legend} />
      <div className={styles.person}>
        <div className={styles.label}>Claimed by</div>
        <div className={styles.value}>{proposer}</div>
      </div>
      <div className={styles.details}>
        <div className={styles.progress}>
          <div className={styles.bar} style={{ width: '100%' }} />
        </div>
        <div className={styles.dates}>
          <span>{format(new Date(data.createdAt), FORMAT)}</span>
          <span>{format(new Date(data.updatedAt), FORMAT)}</span>
        </div>
      </div>
      <div className={styles.status}>{statusLabel}</div>
    </div>
  );
};

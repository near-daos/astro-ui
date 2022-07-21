import React, { FC } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import cn from 'classnames';

import { BountyClaim, BountyProposal } from 'types/bounties';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { Icon } from 'components/Icon';

import { toMillis } from 'utils/format';
import { getClaimProgress } from 'astro_2.0/features/Bounties/helpers';

import styles from './ClaimCard.module.scss';

interface ClaimCardProps {
  data: BountyClaim;
  doneProposals: BountyProposal[];
  maxDeadline: string;
  className?: string;
}

const FORMAT = 'dd MMM, yyyy';

export const ClaimCard: FC<ClaimCardProps> = ({
  data,
  doneProposals,
  maxDeadline,
  className,
}) => {
  const { startTime, id } = data;

  const proposal = doneProposals.find(item => item.bountyClaimId === id);

  const claimStartTime = toMillis(startTime);
  const deadline = toMillis(maxDeadline);
  const claimStart = new Date(claimStartTime);
  const claimEnd = new Date(claimStartTime + deadline);

  let status;
  let statusLabel;
  let link;

  if (!proposal) {
    statusLabel = 'In progress';
    status = 'InProgress';
  } else {
    const proposalStatus = proposal.status;

    switch (proposalStatus) {
      case 'Approved': {
        statusLabel = 'Successfully approved';
        status = 'Approved';
        break;
      }
      case 'InProgress': {
        statusLabel = 'Pending Approval';
        status = 'Pending';
        link = {
          pathname: SINGLE_PROPOSAL_PAGE_URL,
          query: {
            dao: proposal.daoId,
            proposal: proposal.id,
          },
        };
        break;
      }
      default: {
        statusLabel = 'Not approved';
        status = 'Rejected';
      }
    }
  }

  const claimProgress = getClaimProgress(claimStart, claimEnd, status);

  return (
    <div
      className={cn(
        styles.root,
        {
          [styles.inProgress]: status === 'InProgress',
          [styles.approved]: status === 'Approved',
          [styles.pending]: status === 'Pending',
          [styles.rejected]: status === 'Rejected',
        },
        className
      )}
    >
      <div className={styles.legend} />
      <div className={styles.person}>
        <div className={styles.label}>Claimed by</div>
        <div className={styles.value}>{data.accountId}</div>
      </div>
      <div className={styles.details}>
        <div className={styles.status}>
          {statusLabel}
          {link && (
            <Link href={link} passHref>
              <a className={styles.proposalLink}>
                <Icon name="buttonExternal" className={styles.icon} />
              </a>
            </Link>
          )}
        </div>
        <div className={styles.progress}>
          <div className={styles.bar} style={{ width: `${claimProgress}%` }} />
        </div>
        <div className={styles.dates}>
          <span>{format(claimStart, FORMAT)}</span>
          <span>{format(claimEnd, FORMAT)}</span>
        </div>
      </div>
    </div>
  );
};

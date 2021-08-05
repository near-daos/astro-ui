import React, { FC } from 'react';
import TextTruncate from 'react-text-truncate';

import { StatusPanel } from 'components/cards/bounty-card/components/status-panel/StatusPanel';
import {
  OpenCells,
  InProgressCells,
  CompletedCells
} from 'components/cards/bounty-card/components/cells';

import { Bounty } from 'components/cards/bounty-card/types';

import styles from './bounty-card.module.scss';

export interface BountyCardProps {
  data: Bounty;
  onClaim: () => void;
  onUnclaim: () => void;
  onComplete: () => void;
}

export const BountyCard: FC<BountyCardProps> = ({
  data: {
    type,
    status,
    token,
    amount,
    group,
    slots,
    claimed,
    claimedBy,
    claimedByMe,
    deadlineThreshold,
    deadlineUnit
  },
  onClaim,
  onUnclaim,
  onComplete
}) => {
  return (
    <div className={styles.root}>
      <StatusPanel type={type} />
      <div className={styles.content}>
        <div className={styles.group}>
          <TextTruncate
            line={3}
            element="span"
            truncateText="…"
            text={group}
            textTruncateChild={null}
          />
        </div>
        <div className={styles.reward}>
          <span className={styles.value}>{amount}</span>
          &nbsp;
          <span className={styles['value-desc']}>{token}</span>
        </div>
        {status === 'Open' && (
          <OpenCells claimed={claimed} slots={slots} onClaim={onClaim} />
        )}
        {status === 'In progress' && (
          <InProgressCells
            claimedBy={claimedBy}
            claimedByMe={claimedByMe}
            deadlineThreshold={deadlineThreshold}
            deadlineUnit={deadlineUnit}
            onUnclaim={onUnclaim}
            onComplete={onComplete}
          />
        )}
        {status === 'Completed' && (
          <CompletedCells
            claimedBy={claimedBy}
            deadlineThreshold={deadlineThreshold}
            deadlineUnit={deadlineUnit}
          />
        )}
      </div>
    </div>
  );
};

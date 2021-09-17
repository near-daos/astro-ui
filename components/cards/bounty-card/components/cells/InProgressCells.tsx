import React, { FC } from 'react';

import { ClaimedBy } from 'components/cards/bounty-card/types';
import { Button } from 'components/button/Button';

import styles from 'components/cards/bounty-card/bounty-card.module.scss';
import { SputnikService } from 'services/SputnikService';
import {
  addHours,
  format,
  millisecondsToMinutes,
  minutesToHours
} from 'date-fns';

interface InProgressCellsProps {
  claimedBy: ClaimedBy[];
  claimedByMe: boolean;
  deadlineThreshold: string;
  onUnclaim?: () => void;
  onComplete?: () => void;
}

export const InProgressCells: FC<InProgressCellsProps> = ({
  claimedBy,
  claimedByMe,
  onComplete,
  onUnclaim
}) => {
  const myClaim = claimedBy.find(
    claim => claim.accountId === SputnikService.getAccountId()
  );

  const calculateDueDate = (claim: ClaimedBy) => {
    const millis = Number(claim.deadline) / 1000000;
    const minutes = millisecondsToMinutes(millis);
    const hours = minutesToHours(minutes);

    const startDateInMillis = Number(claim.starTime) / 1000000;
    const dueDate = addHours(new Date(startDateInMillis), hours);

    return format(dueDate, 'LL.dd.yyyy');
  };

  const due = myClaim ? calculateDueDate(myClaim) : undefined;

  return (
    <>
      <div className={styles.slots}>
        {claimedByMe && (
          <>
            <Button
              variant="secondary"
              size="block"
              className={styles.button}
              onClick={onUnclaim}
            >
              <span className={styles.nowrap}>Unclaim</span>
            </Button>
            <Button
              variant="primary"
              size="block"
              className={styles.button}
              onClick={onComplete}
            >
              <span className={styles.nowrap}>Complete</span>
            </Button>
            <div className={styles.control}>
              <span className={styles.secondaryLabel}>due {due}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

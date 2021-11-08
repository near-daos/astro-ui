import React, { FC } from 'react';

import { ClaimedBy } from 'components/cards/bounty-card/types';
import { Button } from 'components/button/Button';

import styles from 'components/cards/bounty-card/bounty-card.module.scss';
import { SputnikNearService } from 'services/sputnik';
import {
  addHours,
  format,
  millisecondsToMinutes,
  minutesToHours,
} from 'date-fns';
import cn from 'classnames';

interface InProgressCellsProps {
  claimedBy: ClaimedBy[];
  onUnclaim?: () => void;
  onComplete?: () => void;
}

export const InProgressCells: FC<InProgressCellsProps> = ({
  claimedBy,
  onComplete,
  onUnclaim,
}) => {
  const myClaim = claimedBy.find(
    claim => claim.accountId === SputnikNearService.getAccountId()
  );

  const calculateDueDate = (claim: ClaimedBy) => {
    const millis = Number(claim.deadline) / 1000000;
    const minutes = millisecondsToMinutes(millis);
    const hours = minutesToHours(minutes);

    const startDateInMillis = Number(claim.startTime) / 1000000;
    const dueDate = addHours(new Date(startDateInMillis), hours);

    return format(dueDate, 'LL.dd.yyyy');
  };

  const due = myClaim ? calculateDueDate(myClaim) : undefined;

  return (
    <>
      <div className={cn(styles.slots, styles.inprogress)}>
        <>
          <Button
            variant="secondary"
            size="block"
            className={cn(styles.button, styles.unclaim)}
            onClick={onUnclaim}
          >
            <span className={styles.nowrap}>Unclaim</span>
          </Button>
          <Button
            variant="primary"
            size="block"
            className={cn(styles.button, styles.complete)}
            onClick={onComplete}
          >
            <span className={styles.nowrap}>Complete</span>
          </Button>
          <div className={styles.control}>
            <span className={styles.secondaryLabel}>due {due}</span>
          </div>
        </>
      </div>
    </>
  );
};

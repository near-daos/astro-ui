import React, { FC } from 'react';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';

import { ClaimedBy, DeadlineUnit } from 'components/cards/bounty-card/types';
import { Button } from 'components/button/Button';

import { getDeadlineDate } from 'components/cards/bounty-card/helpers';

import styles from 'components/cards/bounty-card/bounty-card.module.scss';

interface InProgressCellsProps {
  claimedBy: ClaimedBy[];
  claimedByMe: boolean;
  deadlineThreshold: number;
  deadlineUnit: DeadlineUnit;
  onUnclaim: () => void;
  onComplete: () => void;
}

export const InProgressCells: FC<InProgressCellsProps> = ({
  claimedBy,
  claimedByMe,
  deadlineThreshold,
  deadlineUnit,
  onComplete,
  onUnclaim
}) => {
  const startDate = parseISO(claimedBy[0]?.datetime);
  const deadline = getDeadlineDate(startDate, deadlineThreshold, deadlineUnit);

  return (
    <>
      <div className={styles.slots}>
        {claimedByMe ? (
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
          </>
        ) : (
          <span className={cn(styles['primary-label'], styles['align-left'])}>
            claimed by <b>{claimedBy[0].name}</b>
          </span>
        )}
      </div>
      <div className={styles.control}>
        <span className={styles['secondary-label']}>
          due {format(deadline, 'LL.dd.yyyy')}
        </span>
      </div>
    </>
  );
};

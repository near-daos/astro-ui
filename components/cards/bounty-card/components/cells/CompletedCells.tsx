import React, { FC } from 'react';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';

import { ClaimedBy, DeadlineUnit } from 'components/cards/bounty-card/types';

import { getDeadlineDate } from 'components/cards/bounty-card/helpers';

import styles from 'components/cards/bounty-card/bounty-card.module.scss';

interface CompletedCellsProps {
  claimedBy: ClaimedBy[];
  deadlineThreshold: number;
  deadlineUnit: DeadlineUnit;
}

export const CompletedCells: FC<CompletedCellsProps> = ({
  claimedBy,
  deadlineThreshold,
  deadlineUnit
}) => {
  const startDate = parseISO(claimedBy[0]?.datetime);
  const deadline = getDeadlineDate(startDate, deadlineThreshold, deadlineUnit);

  return (
    <>
      <div className={styles.slots}>
        <span className={cn(styles['primary-label'], styles['align-left'])}>
          claimed by <b>{claimedBy[0].name}</b>
        </span>
      </div>
      <div className={styles.control}>
        <span className={styles['secondary-label']}>
          due {format(deadline, 'LL.dd.yyyy')}
        </span>
      </div>
    </>
  );
};

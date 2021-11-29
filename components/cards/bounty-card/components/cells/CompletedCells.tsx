import React, { FC } from 'react';
import cn from 'classnames';

import styles from 'components/cards/bounty-card/bounty-card.module.scss';
import { ClaimedBy } from 'types/bounties';

interface CompletedCellsProps {
  claimedBy: ClaimedBy[];
}

export const CompletedCells: FC<CompletedCellsProps> = () => {
  return (
    <>
      <div className={styles.slots}>
        <span className={cn(styles.primaryLabel, styles.alignLeft)}>
          claimed by <b />
        </span>
      </div>
    </>
  );
};

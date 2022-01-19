import { BountiesPhase } from 'types/bounties';
import cn from 'classnames';
import { Icon, IconName } from 'components/Icon';
import React, { FC } from 'react';

import styles from './PhaseCell.module.scss';

interface PhaseCellProps {
  phase: BountiesPhase;
}

export const PhaseCell: FC<PhaseCellProps> = ({ phase }) => {
  let icon: IconName;
  let cellClass;

  switch (phase) {
    case BountiesPhase.Completed: {
      icon = 'check';
      cellClass = styles.completed;

      break;
    }
    case BountiesPhase.Available: {
      icon = 'clock';
      cellClass = styles.available;

      break;
    }
    case BountiesPhase.InProgress: {
      icon = 'clock';
      cellClass = styles.inProgress;

      break;
    }
    default: {
      icon = 'clock';
      cellClass = null;
    }
  }

  return (
    <div className={cn(styles.root, cellClass)}>
      <Icon name={icon} className={styles.phaseIcon} />
    </div>
  );
};

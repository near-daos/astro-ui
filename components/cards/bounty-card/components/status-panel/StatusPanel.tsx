import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import { BountyType } from 'components/cards/bounty-card/types';

import styles from './status-panel.module.scss';

interface StatusPanelProps {
  type: BountyType;
}

export const StatusPanel: FC<StatusPanelProps> = ({ type }) => {
  const statusClassName = cn({
    [styles.passed]: type === 'Passed',
    [styles.expired]: type === 'Expired'
  });

  return (
    <div className={cn(styles.root, statusClassName)}>
      <Icon name="proposalBounty" className={styles.icon} />
    </div>
  );
};

import React, { FC } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';
import styles from 'components/cards/bounty-card/bounty-card.module.scss';
import { BountyType } from 'types/bounties';

interface StatusPanelProps {
  type: BountyType;
}

export const StatusPanel: FC<StatusPanelProps> = ({ type }) => {
  const typeClassName = cn({
    [styles.passed]: type === 'Passed',
    [styles.expired]: type === 'Expired',
  });

  return (
    <div className={cn(styles.type, typeClassName)}>
      <Icon name="proposalBounty" className={styles.icon} />
    </div>
  );
};

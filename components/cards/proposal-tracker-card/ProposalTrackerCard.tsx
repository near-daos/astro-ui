import { Button } from 'components/button/Button';
import * as Typography from 'components/Typography';
import React, { FC } from 'react';
import styles from './proposal-tracker.module.scss';

export interface ProposalTrackerProps {
  activeVotes: number;
  totalProposals: number;
  action: JSX.Element;
  onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

export const ProposalTrackerCard: FC<ProposalTrackerProps> = ({
  activeVotes,
  totalProposals,
  action,
  onClick
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Typography.Title className={styles.title} size={3}>
          {`${activeVotes} active votes`}
        </Typography.Title>
        <Typography.Subtitle className={styles.subtitle} size={6}>
          {`${totalProposals} proposals in total`}
        </Typography.Subtitle>
      </div>
      <Button onClick={onClick} className={styles.action} variant="tertiary">
        {action}
      </Button>
    </div>
  );
};

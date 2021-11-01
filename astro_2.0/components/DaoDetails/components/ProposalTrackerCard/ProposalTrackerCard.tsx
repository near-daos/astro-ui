import { Button } from 'components/button/Button';
import * as Typography from 'components/Typography';
import React, { FC } from 'react';
import cn from 'classnames';
import styles from './ProposalTracker.module.scss';

export interface ProposalTrackerProps {
  activeVotes: number;
  totalProposals: number;
  action: JSX.Element | null;
  onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  preview?: boolean;
}

export const ProposalTrackerCard: FC<ProposalTrackerProps> = ({
  activeVotes,
  totalProposals,
  action,
  onClick,
  preview,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Typography.Subtitle
          className={cn(styles.title, styles.active)}
          size={2}
        >
          <span>{activeVotes}</span> active{' '}
          {activeVotes === 1 ? 'proposal' : 'proposals'}
        </Typography.Subtitle>
        <Typography.Subtitle className={styles.subtitle} size={6}>
          {`${totalProposals} proposals in total`}
        </Typography.Subtitle>
      </div>
      {action && (
        <Button onClick={onClick} className={styles.action} variant="tertiary">
          {action}
        </Button>
      )}
      {preview && <div className={styles.action}>Create proposal</div>}
    </div>
  );
};

import { Button } from 'components/button/Button';
import * as Typography from 'components/Typography';
import React, { FC } from 'react';

import styles from './proposal-tracker.module.scss';

export interface ProposalTrackerProps {
  title: string;
  subtitle: string;
  action: JSX.Element;
}

export const ProposalTrackerCard: FC<ProposalTrackerProps> = ({
  title,
  subtitle,
  action
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Typography.Title className={styles.title} size={3}>
          {title}
        </Typography.Title>
        <Typography.Subtitle className={styles.subtitle} size={6}>
          {subtitle}
        </Typography.Subtitle>
      </div>
      <Button className={styles.action} variant="tertiary">
        {action}
      </Button>
    </div>
  );
};

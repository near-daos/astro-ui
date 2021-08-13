import React, { FC } from 'react';

import { Button } from 'components/button/Button';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';

import styles from './dao-setting-banner.module.scss';

export interface DaoSettingsBannerProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export const DaoSettingsBanner: FC<DaoSettingsBannerProps> = () => {
  return (
    <div className={styles.root}>
      <div className={styles.name}>You are making changes to DAO settings</div>
      <div className={styles.control}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Propose</Button>
      </div>
      <div className={styles.desc}>
        <ExpandableDetails label="Add description and links">
          Placeholder
        </ExpandableDetails>
      </div>
      <div className={styles.details}>
        <ExpandableDetails label="Vote details">Placeholder</ExpandableDetails>
      </div>
    </div>
  );
};

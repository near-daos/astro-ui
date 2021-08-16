import React, { FC } from 'react';

import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/textarea/TextArea';

import styles from './dao-setting-banner.module.scss';

export interface DaoSettingsBannerProps {
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (name: string, value: string) => void;
}

export const DaoSettingsBanner: FC<DaoSettingsBannerProps> = ({
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.name}>You are making changes to DAO settings</div>
      <div className={styles.control}>
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="primary">
          Propose
        </Button>
      </div>
      <div className={styles.desc}>
        <ExpandableDetails label="Add description and links">
          <TextArea
            label="Details"
            size="large"
            textAlign="left"
            resize="none"
            maxLength={500}
            onChange={e => {
              onChange('details', (e.target as HTMLTextAreaElement).value);
            }}
          />
          <Input
            label="External link"
            size="large"
            placeholder="add link"
            textAlign="left"
            onChange={e => {
              onChange('externalLink', (e.target as HTMLInputElement).value);
            }}
          />
        </ExpandableDetails>
      </div>
      <div className={styles.details}>
        <ExpandableDetails label="Vote details">Placeholder</ExpandableDetails>
      </div>
    </div>
  );
};

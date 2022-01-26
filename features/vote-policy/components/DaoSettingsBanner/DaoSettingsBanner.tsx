import React, { FC } from 'react';

import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/inputs/TextArea';
import { ExpandableDetails } from 'astro_2.0/components/ExpandableDetails';

import { DaoSettingsProps, Scope } from 'features/vote-policy/helpers';

import styles from './DaoSettingsBanner.module.scss';

export interface DaoSettingsBannerProps {
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (name: string, value: DaoSettings) => void;
  viewMode: boolean;
  scope: Scope;
  data: DaoSettingsProps;
}

type DaoSettings = {
  externalLink?: string | null;
  details: string;
};

export const DaoSettingsBanner: FC<DaoSettingsBannerProps> = ({
  onChange,
  onSubmit,
  onCancel,
  viewMode = true,
  data,
}) => {
  if (viewMode) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.name}>You are making changes to DAO settings</div>
      <div className={styles.control}>
        <Button onClick={onCancel} variant="secondary" size="small">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="primary" size="small">
          Propose
        </Button>
      </div>
      <div className={styles.desc}>
        <ExpandableDetails
          label="Add description and links"
          className={styles.wrapper}
        >
          <div className={styles.content}>
            <TextArea
              label="Details"
              size="large"
              textAlign="left"
              resize="none"
              value={data.details}
              maxLength={500}
              onChange={e => {
                onChange('daoSettings', {
                  ...data,
                  details: (e.target as HTMLTextAreaElement).value,
                });
              }}
            />
            <Input
              label="External link"
              size="large"
              value={data.externalLink}
              placeholder="add link"
              textAlign="left"
              onChange={e => {
                onChange('daoSettings', {
                  ...data,
                  externalLink: (e.target as HTMLTextAreaElement).value,
                });
              }}
            />
          </div>
        </ExpandableDetails>
      </div>
      <div className={styles.details} />
    </div>
  );
};

import React, { FC } from 'react';

import { VoteDetails } from 'components/vote-details';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/textarea/TextArea';

import { DaoSettingsProps, Scope } from 'features/vote-policy/helpers';

import styles from './dao-setting-banner.module.scss';

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
  scope,
  data
}) => {
  if (viewMode) return null;

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
                  details: (e.target as HTMLTextAreaElement).value
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
                  externalLink: (e.target as HTMLTextAreaElement).value
                });
              }}
            />
          </div>
        </ExpandableDetails>
      </div>
      <div className={styles.details}>
        <ExpandableDetails label="Vote details" className={styles.wrapper}>
          <VoteDetails className={styles.expanded} scope={scope} />
        </ExpandableDetails>
      </div>
    </div>
  );
};

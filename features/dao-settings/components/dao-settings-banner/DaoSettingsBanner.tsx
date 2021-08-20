import React, { FC } from 'react';

import { VoteDetails, VoteDetailsProps } from 'components/vote-details';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/textarea/TextArea';

import styles from './dao-setting-banner.module.scss';

export interface DaoSettingsBannerProps {
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (name: string, value: string) => void;
  viewMode: boolean;
  details?: string;
  externalLink?: string;
  voteDetails: VoteDetailsProps;
}

export const DaoSettingsBanner: FC<DaoSettingsBannerProps> = ({
  onChange,
  onSubmit,
  onCancel,
  viewMode = true,
  details = '',
  externalLink,
  voteDetails
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
        <ExpandableDetails label="Add description and links">
          <div className={styles.content}>
            <TextArea
              label="Details"
              size="large"
              textAlign="left"
              resize="none"
              value={details}
              maxLength={500}
              onChange={e => {
                onChange('details', (e.target as HTMLTextAreaElement).value);
              }}
            />
            <Input
              label="External link"
              size="large"
              value={externalLink}
              placeholder="add link"
              textAlign="left"
              onChange={e => {
                onChange('externalLink', (e.target as HTMLInputElement).value);
              }}
            />
          </div>
        </ExpandableDetails>
      </div>
      <div className={styles.details}>
        <ExpandableDetails label="Vote details" className={styles.wrapper}>
          <VoteDetails
            className={styles.expanded}
            voteDetails={voteDetails.voteDetails}
            bondDetail={voteDetails.bondDetail}
          />
        </ExpandableDetails>
      </div>
    </div>
  );
};

import React, { FC } from 'react';

import { Input } from 'components/input/Input';
import { TextArea } from 'components/textarea/TextArea';

import styles from './name-and-purpose-tab.module.scss';

export interface NameAndPurposeTabProps {
  onChange: (name: string, value: string) => void;
  accountName: string;
  viewMode: boolean;
  name: string;
  purpose: string;
}

export const NameAndPurposeTab: FC<NameAndPurposeTabProps> = ({
  onChange,
  accountName,
  viewMode = true,
  name,
  purpose
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.label}>Account name (cannot be changed)</div>
        <p>{accountName}</p>
      </div>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Name</div>
          {viewMode ? (
            <span>{name}</span>
          ) : (
            <Input
              size="large"
              maxLength={500}
              textAlign="left"
              onChange={e => {
                onChange('name', (e.target as HTMLInputElement).value);
              }}
            />
          )}
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Purpose</div>
          {viewMode ? (
            <span>{purpose}</span>
          ) : (
            <TextArea
              size="large"
              textAlign="left"
              resize="none"
              maxLength={500}
              onChange={e => {
                onChange('purpose', (e.target as HTMLTextAreaElement).value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

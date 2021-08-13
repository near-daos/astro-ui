import React, { FC } from 'react';

import { Input } from 'components/input/Input';
import { TextArea } from 'components/textarea/TextArea';

import styles from './name-and-purpose-tab.module.scss';

export interface NameAndPurposeTabProps {
  onChange: (name: string, value: string) => void;
  accountName: string;
}

export const NameAndPurposeTab: FC<NameAndPurposeTabProps> = ({
  onChange,
  accountName
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.label}>Account name (cannot be changed)</div>
        <p>{accountName}</p>
      </div>
      <div className={styles.row}>
        <Input
          label="Name"
          size="large"
          maxLength={500}
          textAlign="left"
          onChange={e => {
            onChange('name', (e.target as HTMLInputElement).value);
          }}
        />
      </div>
      <div className={styles.row}>
        <TextArea
          label="Description"
          size="large"
          textAlign="left"
          resize="none"
          maxLength={500}
          onChange={e => {
            onChange('description', (e.target as HTMLTextAreaElement).value);
          }}
        />
      </div>
    </div>
  );
};

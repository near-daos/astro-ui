import React, { FC } from 'react';

import { Input } from 'components/input/Input';

import styles from './bonds-and-deadlines-tab.module.scss';

export interface BondsAndDeadlinesTabProps {
  onChange: (name: string, value: string) => void;
}

export const BondsAndDeadlines: FC<BondsAndDeadlinesTabProps> = ({
  onChange
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <Input
          className={styles.input}
          label="Bond to create proposal"
          size="small"
          textAlign="left"
          onChange={e => {
            onChange(
              'createProposalBond',
              (e.target as HTMLInputElement).value
            );
          }}
        />
        <span>NEAR</span>
      </div>
      <div className={styles.row}>
        <Input
          className={styles.input}
          label="Time before proposal expire"
          size="small"
          textAlign="left"
          onChange={e => {
            onChange(
              'proposalExpireTime',
              (e.target as HTMLInputElement).value
            );
          }}
        />
        <span>days</span>
      </div>
      <br />
      <div className={styles.row}>
        <Input
          className={styles.input}
          label="Bond to claim bounty"
          size="small"
          textAlign="left"
          onChange={e => {
            onChange('claimBountyBond', (e.target as HTMLInputElement).value);
          }}
        />
        <span>NEAR</span>
      </div>
      <div className={styles.row}>
        <Input
          className={styles.input}
          label="Time to unclaim a bounty without penalty"
          size="small"
          textAlign="left"
          onChange={e => {
            onChange('unclaimBountyTime', (e.target as HTMLInputElement).value);
          }}
        />
        <span>days</span>
      </div>
    </div>
  );
};

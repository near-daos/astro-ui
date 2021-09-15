import React, { FC } from 'react';

import { Input } from 'components/input/Input';

import styles from './bonds-and-deadlines-tab.module.scss';

export interface BondsAndDeadlinesTabProps {
  onChange: (name: string, value: string) => void;
  viewMode: boolean;
  createProposalBond: string;
  proposalExpireTime: string;
  claimBountyBond: string;
  unclaimBountyTime: string;
}

export const BondsAndDeadlines: FC<BondsAndDeadlinesTabProps> = ({
  onChange,
  viewMode = true,
  createProposalBond,
  proposalExpireTime,
  claimBountyBond,
  unclaimBountyTime
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Bond to create proposal</div>
          <>
            {viewMode ? (
              <span className={styles.title}>{createProposalBond}</span>
            ) : (
              <Input
                className={styles.input}
                size="small"
                value={createProposalBond}
                textAlign="left"
                onChange={e => {
                  onChange(
                    'createProposalBond',
                    (e.target as HTMLInputElement).value
                  );
                }}
              />
            )}
            <span className={styles.ml8}>NEAR</span>
          </>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Time before proposal expire</div>
          <>
            {viewMode ? (
              <span>{proposalExpireTime}</span>
            ) : (
              <Input
                className={styles.input}
                size="small"
                textAlign="left"
                value={proposalExpireTime}
                onChange={e => {
                  onChange(
                    'proposalExpireTime',
                    (e.target as HTMLInputElement).value
                  );
                }}
              />
            )}
            <span className={styles.ml8}>days</span>
          </>
        </div>
      </div>
      <br />
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Bond to claim a bounty</div>
          <>
            {viewMode ? (
              <span className={styles.title}>{claimBountyBond}</span>
            ) : (
              <Input
                className={styles.input}
                size="small"
                textAlign="left"
                value={claimBountyBond}
                onChange={e => {
                  onChange(
                    'claimBountyBond',
                    (e.target as HTMLInputElement).value
                  );
                }}
              />
            )}
            <span className={styles.ml8}>NEAR</span>
          </>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>
            Time to unclaim a bounty without penalty
          </div>
          <>
            {viewMode ? (
              <span>{unclaimBountyTime}</span>
            ) : (
              <Input
                className={styles.input}
                size="small"
                textAlign="left"
                value={unclaimBountyTime}
                onChange={e => {
                  onChange(
                    'unclaimBountyTime',
                    (e.target as HTMLInputElement).value
                  );
                }}
              />
            )}
            <span className={styles.ml8}>days</span>
          </>
        </div>
      </div>
    </div>
  );
};

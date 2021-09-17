import React, { FC } from 'react';

import { AccordeonContent } from 'features/vote-policy/components/accordeon-content';
import { AccordeonRow } from 'features/vote-policy/components/accordeon-row';

import { DaoVotePolicy, TGroup } from 'types/dao';
import {
  getPoliciesList,
  getProposersList,
  PolicyProps,
  VotingPolicyPageInitialData
} from 'features/vote-policy/helpers';

import styles from './treasury-tab-view.module.scss';

export interface TreasuryTabViewProps {
  viewMode?: boolean;
  defaultVotePolicy: DaoVotePolicy;
  groups: TGroup[];
  onChange?: (name: string, value: PolicyProps) => void;
  data: VotingPolicyPageInitialData;
  showTitle?: boolean;
}

export const TreasuryTabView: FC<TreasuryTabViewProps> = ({
  viewMode = true,
  defaultVotePolicy,
  groups,
  data,
  onChange,
  showTitle
}) => {
  const items = [
    {
      id: '1',
      label: 'Request payout',
      content: (
        <AccordeonContent
          onChange={v => onChange?.('transfer', v)}
          data={data.transfer as PolicyProps}
          action="Request payout"
          viewMode={viewMode}
          proposers={getProposersList(groups, 'transfer', 'AddProposal')}
          policies={getPoliciesList(
            groups,
            'transfer',
            ['VoteApprove', 'VoteReject', 'VoteRemove'],
            defaultVotePolicy
          )}
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      {showTitle && <p>Create and vote on request payout proposals.</p>}
      <div className={styles.content}>
        <AccordeonRow items={items} />
      </div>
    </div>
  );
};

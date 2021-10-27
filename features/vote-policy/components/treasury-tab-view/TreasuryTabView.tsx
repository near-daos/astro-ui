import React, { FC } from 'react';

import { PolicyRowContent } from 'features/vote-policy/components/policy-row-content';
import { Header } from 'features/vote-policy/components/policy-row-header';
import { Collapsable } from 'components/collapsable/Collapsable';

import { DaoVotePolicy, TGroup } from 'types/dao';
import {
  getPoliciesList,
  getProposersList,
  PolicyProps,
  VotingPolicyPageInitialData,
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
  showTitle = true,
}) => {
  return (
    <div className={styles.root}>
      {showTitle && <p>Create and vote on request payout proposals.</p>}
      <div className={styles.content}>
        <Collapsable
          initialOpenState
          renderHeading={(toggle, isOpen) => (
            <Header label="Request payout" isOpen={isOpen} toggle={toggle} />
          )}
        >
          <PolicyRowContent
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
            groups={groups}
          />
        </Collapsable>
      </div>
    </div>
  );
};

import React, { FC } from 'react';

import { PolicyRowContent } from 'features/vote-policy/components/policy-row-content';
import { Header } from 'features/vote-policy/components/policy-row-header';
import { Collapsable } from 'components/collapsable/Collapsable';
import { DaoVotePolicy, TGroup } from 'types/dao';
import {
  getPoliciesList,
  getProposersList,
  PolicyProps,
  VotingPolicyPageInitialData
} from 'features/vote-policy/helpers';

import styles from './governance-tab-view.module.scss';

export interface GovernanceTabViewProps {
  viewMode?: boolean;
  defaultVotePolicy: DaoVotePolicy;
  groups: TGroup[];
  onChange?: (name: string, value: PolicyProps) => void;
  data: VotingPolicyPageInitialData;
  showTitle?: boolean;
}

export const GovernanceTabView: FC<GovernanceTabViewProps> = ({
  viewMode = true,
  defaultVotePolicy,
  groups,
  data,
  onChange,
  showTitle = true
}) => {
  return (
    <div className={styles.root}>
      {showTitle && <p>Create and vote on update configuration proposals.</p>}
      <div className={styles.content}>
        <Collapsable
          initialOpenState
          renderHeading={(toggle, isOpen) => (
            <Header label="Config" isOpen={isOpen} toggle={toggle} />
          )}
        >
          <PolicyRowContent
            onChange={v => onChange?.('config', v)}
            data={data.config as PolicyProps}
            action="Config"
            viewMode={viewMode}
            proposers={getProposersList(groups, 'config', 'AddProposal')}
            policies={getPoliciesList(
              groups,
              'config',
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

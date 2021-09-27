import React, { FC } from 'react';

import { Header } from 'features/vote-policy/components/policy-row-header';
import { PolicyRowContent } from 'features/vote-policy/components/policy-row-content';
import { Collapsable } from 'components/collapsable/Collapsable';

import { DaoVotePolicy, TGroup } from 'types/dao';

import {
  getPoliciesList,
  getProposersList,
  PolicyProps,
  VotingPolicyPageInitialData
} from 'features/vote-policy/helpers';

import styles from './tasks-tab-view.module.scss';

export interface TasksTabViewProps {
  viewMode?: boolean;
  defaultVotePolicy: DaoVotePolicy;
  groups: TGroup[];
  onChange?: (name: string, value: PolicyProps) => void;
  data: VotingPolicyPageInitialData;
  showTitle?: boolean;
}

export const TasksTabView: FC<TasksTabViewProps> = ({
  viewMode = true,
  defaultVotePolicy,
  groups,
  onChange,
  data,
  showTitle = true
}) => {
  return (
    <div className={styles.root}>
      {showTitle && <p>Create and vote on bounties and resolutions.</p>}
      <div className={styles.content}>
        <Collapsable
          initialOpenState
          renderHeading={(toggle, isOpen) => (
            <Header label="Create bounty" isOpen={isOpen} toggle={toggle} />
          )}
        >
          <PolicyRowContent
            action="Create bounty"
            viewMode={viewMode}
            onChange={v => onChange?.('addBounty', v)}
            data={data.addBounty as PolicyProps}
            proposers={getProposersList(groups, 'addBounty', 'AddProposal')}
            policies={getPoliciesList(
              groups,
              'addBounty',
              ['VoteApprove', 'VoteReject', 'VoteRemove'],
              defaultVotePolicy
            )}
            groups={groups}
          />
        </Collapsable>
        <Collapsable
          initialOpenState
          renderHeading={(toggle, isOpen) => (
            <Header label="Close bounty" isOpen={isOpen} toggle={toggle} />
          )}
        >
          <PolicyRowContent
            action="Close bounty"
            onChange={v => onChange?.('bountyDone', v)}
            data={data.bountyDone as PolicyProps}
            viewMode={viewMode}
            proposers={getProposersList(groups, 'bountyDone', 'AddProposal')}
            policies={getPoliciesList(
              groups,
              'bountyDone',
              ['VoteApprove', 'VoteReject', 'VoteRemove'],
              defaultVotePolicy
            )}
            groups={groups}
          />
        </Collapsable>
        <Collapsable
          initialOpenState
          renderHeading={(toggle, isOpen) => (
            <Header label="Create poll" isOpen={isOpen} toggle={toggle} />
          )}
        >
          <PolicyRowContent
            action="Create poll"
            onChange={v => onChange?.('setVoteToken', v)}
            data={data.setVoteToken as PolicyProps}
            viewMode={viewMode}
            proposers={getProposersList(groups, 'setVoteToken', 'AddProposal')}
            policies={getPoliciesList(
              groups,
              'setVoteToken',
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

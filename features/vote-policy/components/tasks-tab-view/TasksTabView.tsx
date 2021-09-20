import React, { FC } from 'react';

import { AccordeonRow } from 'features/vote-policy/components/accordeon-row';
import { AccordeonContent } from 'features/vote-policy/components/accordeon-content';

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
  const items = [
    {
      id: '1',
      label: 'Create bounty',
      content: (
        <AccordeonContent
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
        />
      )
    },
    {
      id: '2',
      label: 'Close bounty',
      content: (
        <AccordeonContent
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
        />
      )
    },
    {
      id: '3',
      label: 'Create poll',
      content: (
        <AccordeonContent
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
        />
      )
    },
    {
      id: '4',
      label: 'NEAR function',
      content: (
        <AccordeonContent
          action="NEAR function"
          viewMode={viewMode}
          onChange={v => onChange?.('call', v)}
          data={data.call as PolicyProps}
          proposers={getProposersList(groups, 'call', 'AddProposal')}
          policies={getPoliciesList(
            groups,
            'call',
            ['VoteApprove', 'VoteReject', 'VoteRemove'],
            defaultVotePolicy
          )}
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      {showTitle && (
        <p>
          Create and vote on bounties, resolutions, and calling NEAR functions.
        </p>
      )}
      <div className={styles.content}>
        <AccordeonRow items={items} />
      </div>
    </div>
  );
};

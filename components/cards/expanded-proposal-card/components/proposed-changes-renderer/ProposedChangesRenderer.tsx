import React, { FC, useState } from 'react';
import { Proposal } from 'types/proposal';
import Tabs from 'components/tabs/Tabs';
import { TasksTabView } from 'features/vote-policy/components/tasks-tab-view';
import { GroupsTabView } from 'features/vote-policy/components/groups-tab-view';
import { TreasuryTabView } from 'features/vote-policy/components/treasury-tab-view';
import { GovernanceTabView } from 'features/vote-policy/components/governance-tab-view';
import { DAO } from 'types/dao';
import { getInitialData } from 'features/vote-policy/helpers';

import styles from './proposed-changes-renderer.module.scss';

interface ProposedChangesRendererProps {
  dao: DAO;
  proposal: Proposal;
}

export const ProposedChangesRenderer: FC<ProposedChangesRendererProps> = ({
  dao,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  proposal
}) => {
  const { defaultVotePolicy } = dao.policy;
  const { groups } = dao;
  const [data] = useState(dao ? getInitialData(dao) : undefined);

  if (!data) return null;

  const tabs = [
    {
      id: 1,
      label: 'Tasks',
      content: (
        <TasksTabView
          viewMode
          showTitle={false}
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          data={data}
        />
      )
    },
    {
      id: 2,
      label: 'Groups',
      content: (
        <GroupsTabView
          viewMode
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          data={data}
        />
      )
    },
    {
      id: 3,
      label: 'Treasury',
      content: (
        <TreasuryTabView
          viewMode
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          data={data}
        />
      )
    },
    {
      id: 4,
      label: 'Governance',
      content: (
        <GovernanceTabView
          viewMode
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          data={data}
        />
      )
    }
  ];

  return (
    <div>
      <div className={styles.title}>Proposed changes:</div>
      <Tabs tabs={tabs} />
    </div>
  );
};

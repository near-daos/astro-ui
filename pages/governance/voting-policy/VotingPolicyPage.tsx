import React, { FC, useCallback, useState } from 'react';

import { DaoSettingsBanner } from 'features/dao-settings/components/dao-settings-banner';
import { Button } from 'components/button/Button';
import Tabs from 'components/tabs/Tabs';
import { TasksTabView } from 'features/vote-policy/components/tasks-tab-view';
import { GroupsTabView } from 'features/vote-policy/components/groups-tab-view';
import { TreasuryTabView } from 'features/vote-policy/components/treasury-tab-view';
import { GovernanceTabView } from 'features/vote-policy/components/governance-tab-view';

import styles from './voting-policy-page.module.scss';

import { voteDetails, mockData } from './mockData';

const VotingPolicyPage: FC = () => {
  const [data, setData] = useState(mockData);
  const [viewMode, setViewMode] = useState(true);

  const handleChange = useCallback(
    (name, value) => {
      setData({ ...data, [name]: value });
    },
    [data]
  );

  const handleSubmit = useCallback(() => {
    setViewMode(true);
  }, []);

  const tabs = [
    {
      id: 1,
      label: 'Tasks',
      content: <TasksTabView viewMode={viewMode} />
    },
    {
      id: 2,
      label: 'Groups',
      content: <GroupsTabView viewMode={viewMode} />
    },
    {
      id: 3,
      label: 'Treasury',
      content: <TreasuryTabView viewMode={viewMode} />
    },
    {
      id: 4,
      label: 'Governance',
      content: <GovernanceTabView viewMode={viewMode} />
    }
  ];

  return (
    <div className={styles.root}>
      <DaoSettingsBanner
        onCancel={() => setViewMode(true)}
        onSubmit={handleSubmit}
        onChange={handleChange}
        viewMode={viewMode}
        details={data.details}
        externalLink={data.externalLink}
        voteDetails={voteDetails}
      />
      <div className={styles.header}>
        <h1>Voting policy</h1>
        {viewMode && (
          <Button
            className={styles.changeButton}
            size="small"
            variant="secondary"
            onClick={() => setViewMode(false)}
          >
            Change
          </Button>
        )}
      </div>
      <div className={styles.content}>
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default VotingPolicyPage;

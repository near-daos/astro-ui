import { useSelectedDAO } from 'hooks/useSelectedDao';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { DaoSettingsBanner } from 'features/dao-settings/components/dao-settings-banner';
import { Button } from 'components/button/Button';
import Tabs from 'components/tabs/Tabs';
import { TasksTabView } from 'features/vote-policy/components/tasks-tab-view';
import { GroupsTabView } from 'features/vote-policy/components/groups-tab-view';
import { TreasuryTabView } from 'features/vote-policy/components/treasury-tab-view';
import { GovernanceTabView } from 'features/vote-policy/components/governance-tab-view';
import { voteDetails } from 'lib/mocks/governance/voting-policy';
import {
  getInitialData,
  getNewProposalObject
} from 'features/vote-policy/helpers';
import { SputnikService } from 'services/SputnikService';
import styles from './voting-policy-page.module.scss';

const VotingPolicyPage: FC = () => {
  const dao = useSelectedDAO();

  const [data, setData] = useState(dao ? getInitialData(dao) : undefined);

  useEffect(() => {
    if (dao) setData(getInitialData(dao));
  }, [dao]);

  const [viewMode, setViewMode] = useState(true);

  const handleChange = useCallback(
    (name, value) => {
      if (data) {
        setData({ ...data, [name]: value });
      }
    },
    [data]
  );

  const handleSubmit = useCallback(() => {
    setViewMode(true);

    if (data && dao) {
      const proposal = getNewProposalObject(dao, data);

      SputnikService.createProposal(proposal);
    }
  }, [dao, data]);

  if (!data || !dao) {
    return null;
  }

  const { defaultVotePolicy } = dao.policy;
  const { groups } = dao;

  const tabs = [
    {
      id: 1,
      label: 'Tasks',
      content: (
        <TasksTabView
          viewMode={viewMode}
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          onChange={handleChange}
          data={data}
        />
      )
    },
    {
      id: 2,
      label: 'Groups',
      content: (
        <GroupsTabView
          viewMode={viewMode}
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          onChange={handleChange}
          data={data}
        />
      )
    },
    {
      id: 3,
      label: 'Treasury',
      content: (
        <TreasuryTabView
          viewMode={viewMode}
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          onChange={handleChange}
          data={data}
        />
      )
    },
    {
      id: 4,
      label: 'Governance',
      content: (
        <GovernanceTabView
          viewMode={viewMode}
          defaultVotePolicy={defaultVotePolicy}
          groups={groups}
          onChange={handleChange}
          data={data}
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      <DaoSettingsBanner
        onCancel={() => {
          setViewMode(true);
          setData(getInitialData(dao));
        }}
        onSubmit={handleSubmit}
        onChange={handleChange}
        viewMode={viewMode}
        data={data.daoSettings}
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

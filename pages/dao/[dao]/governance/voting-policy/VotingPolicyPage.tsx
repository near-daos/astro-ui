import { Button } from 'components/button/Button';
import Tabs from 'components/tabs/Tabs';
import { DaoSettingsBanner } from 'features/vote-policy/components/banner';
import { GovernanceTabView } from 'features/vote-policy/components/governance-tab-view';
import { GroupsTabView } from 'features/vote-policy/components/groups-tab-view';
import { TasksTabView } from 'features/vote-policy/components/tasks-tab-view';
import { TreasuryTabView } from 'features/vote-policy/components/treasury-tab-view';
import {
  getInitialData,
  getNewProposalObject
} from 'features/vote-policy/helpers';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { SputnikService } from 'services/SputnikService';
import styles from './voting-policy-page.module.scss';

const VotingPolicyPage: FC = () => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const dao = useDao(daoId);

  const [data, setData] = useState(dao ? getInitialData(dao) : undefined);

  useEffect(() => {
    if (dao) setData(getInitialData(dao));
  }, [dao]);

  const [viewMode, setViewMode] = useState(true);

  const handleChange = useCallback(
    (name, value) => {
      if (data) {
        setData({
          ...data,
          [name]: value
        });
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
        scope="policy"
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

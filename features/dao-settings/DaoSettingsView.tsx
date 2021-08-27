import React, { FC, useCallback, useState } from 'react';

import { Button } from 'components/button/Button';
import Tabs from 'components/tabs/Tabs';
import { NameAndPurposeTab } from 'features/dao-settings/components/name-and-pupropse-tab';
import { DaoSettingsBanner } from 'features/dao-settings/components/dao-settings-banner';
import { BondsAndDeadlines } from 'features/dao-settings/components/bond-and-deadlines-tab';
import LinksTab from 'features/dao-settings/components/links-tab/LinksTab';

import styles from './dao-settings-view.module.scss';

import { mockData, voteDetails } from './mockData';

export const DaoSettingsView: FC = () => {
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
      label: 'Name & Purpose',
      content: (
        <NameAndPurposeTab
          onChange={handleChange}
          accountName={data.accountName}
          viewMode={viewMode}
          name={data.name}
          purpose={data.purpose}
        />
      )
    },
    {
      id: 2,
      label: 'Links',
      content: (
        <LinksTab
          links={data.links}
          onChange={handleChange}
          viewMode={viewMode}
        />
      )
    },
    {
      id: 3,
      label: 'Bond & Deadlines',
      content: (
        <BondsAndDeadlines
          onChange={handleChange}
          viewMode={viewMode}
          createProposalBond={data.createProposalBond}
          proposalExpireTime={data.proposalExpireTime}
          claimBountyBond={data.claimBountyBond}
          unclaimBountyTime={data.unclaimBountyTime}
        />
      )
    },
    {
      id: 4,
      label: 'Flag',
      content: <div>Placeholder</div>
    }
  ];

  return (
    <>
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
        <h1>DAO settings</h1>
        {viewMode && (
          <Button
            size="small"
            variant="secondary"
            className={styles.changeButton}
            onClick={() => setViewMode(false)}
          >
            Edit
          </Button>
        )}
      </div>
      <div className={styles.content}>
        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

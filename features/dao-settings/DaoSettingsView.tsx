import Decimal from 'decimal.js';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import React, { FC, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { Button } from 'components/button/Button';
import Tabs from 'components/tabs/Tabs';
import { NameAndPurposeTab } from 'features/dao-settings/components/name-and-pupropse-tab';
import { DaoSettingsBanner } from 'features/dao-settings/components/dao-settings-banner';
import { BondsAndDeadlines } from 'features/dao-settings/components/bond-and-deadlines-tab';
import LinksTab from 'features/dao-settings/components/links-tab/LinksTab';
import { yoktoNear } from 'services/SputnikService';
import { DAO } from 'types/dao';

import styles from './dao-settings-view.module.scss';

import { mockData } from './mockData';

const FlagTab = dynamic(import('features/dao-settings/components/flag-tab'), {
  ssr: false
});

export const DaoSettingsView: FC = () => {
  const dao = useSelectedDAO();
  const [data, setData] = useState<DAO | null>(dao);
  const [viewMode, setViewMode] = useState(true);

  useEffect(() => {
    if (dao != null) {
      setData(dao);
    }
  }, [dao]);

  // TODO This is hack and this whole thing should be done as form
  const handleChange = useCallback(
    (name, value) => {
      if (data != null) {
        setData({ ...data, [name]: value });
      }
    },
    [data]
  );

  const handleSubmit = useCallback(() => {
    setViewMode(true);
  }, []);

  if (data == null) return null;

  const tabs = [
    {
      id: 1,
      label: 'Name & Purpose',
      content: (
        <NameAndPurposeTab
          onChange={handleChange}
          accountName={data.id}
          viewMode={viewMode}
          name={data.name}
          purpose={data.description}
        />
      )
    },
    {
      id: 2,
      label: 'Links',
      content: (
        <LinksTab
          // links={data.links} // TODO Where are links
          links={[]}
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
          createProposalBond={new Decimal(data.policy.proposalBond)
            .div(yoktoNear)
            .toFixed()}
          claimBountyBond={new Decimal(data.policy.bountyBond)
            .div(yoktoNear)
            .toFixed()}
          proposalExpireTime={new Decimal(data.policy.proposalPeriod)
            .div('3.6e12')
            .toFixed()}
          unclaimBountyTime={new Decimal(data.policy.proposalPeriod)
            .div('3.6e12')
            .toFixed()}
        />
      )
    },
    {
      id: 4,
      label: 'Flag',
      content: (
        <FlagTab
          onChange={handleChange}
          viewMode={viewMode}
          daoFlag={data.logo}
        />
      )
    }
  ];

  return (
    <>
      <DaoSettingsBanner
        onCancel={() => setViewMode(true)}
        onSubmit={handleSubmit}
        onChange={handleChange}
        viewMode={viewMode}
        data={{
          details: mockData.details,
          externalLink: mockData.externalLink
        }}
        scope="config"
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

import Tabs from 'components/tabs/Tabs';
import Decimal from 'decimal.js';
import { NameAndPurposeTab } from 'features/dao-settings/components/name-and-pupropse-tab';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import dynamic from 'next/dynamic';
import React, { FC, useEffect, useState } from 'react';
import { yoktoNear } from 'services/SputnikService';
import { DAO } from 'types/dao';
import { BondsAndDeadlines } from './components/bond-and-deadlines-tab';
import LinksTab from './components/links-tab/LinksTab';

import styles from './dao-settings-view.module.scss';

const FlagTab = dynamic(import('features/dao-settings/components/flag-tab'), {
  ssr: false
});

export const DaoSettingsView: FC = () => {
  const dao = useSelectedDAO();
  const [data, setData] = useState<DAO | null>(dao);

  useEffect(() => {
    if (dao != null) {
      setData(dao);
    }
  }, [dao]);

  if (data == null) return null;

  const tabs = [
    {
      id: 1,
      label: 'Name & Purpose',
      content: (
        <NameAndPurposeTab
          accountName={data.id}
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
          accountName={data.id}
          links={[]} // TODO Where are links
        />
      )
    },
    {
      id: 3,
      label: 'Bond & Deadlines',
      content: (
        <BondsAndDeadlines
          accountName={data.id}
          createProposalBond={new Decimal(data.policy.proposalBond)
            .div(yoktoNear)
            .toNumber()}
          claimBountyBond={new Decimal(data.policy.bountyBond)
            .div(yoktoNear)
            .toNumber()}
          proposalExpireTime={new Decimal(data.policy.proposalPeriod)
            .div('3.6e12')
            .toNumber()}
          unclaimBountyTime={new Decimal(data.policy.proposalPeriod)
            .div('3.6e12')
            .toNumber()}
        />
      )
    },
    {
      id: 4,
      label: 'Flag',
      content: <FlagTab daoFlag={data.logo} />
    }
  ];

  return (
    <>
      <div className={styles.header}>
        <h1>DAO settings</h1>
      </div>
      <div className={styles.content}>
        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

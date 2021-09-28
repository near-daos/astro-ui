import Tabs from 'components/tabs/Tabs';
import Decimal from 'decimal.js';
import { NameAndPurposeTab } from 'features/dao-settings/components/name-and-pupropse-tab';
import { DAO } from 'types/dao';
import dynamic from 'next/dynamic';
import React, { FC } from 'react';
import { yoktoNear } from 'services/SputnikService';
import { BondsAndDeadlines } from './components/bond-and-deadlines-tab';
import LinksTab from './components/links-tab/LinksTab';

import styles from './dao-settings-view.module.scss';

const FlagTab = dynamic(import('features/dao-settings/components/flag-tab'), {
  ssr: false
});

interface DaoSettingsPageProps {
  data: DAO;
}

export const DaoSettingsView: FC<DaoSettingsPageProps> = ({ data: dao }) => {
  if (!dao) {
    return null;
  }

  const tabs = [
    {
      id: 1,
      label: 'Name & Purpose',
      content: (
        <NameAndPurposeTab
          accountName={dao.id}
          name={dao.name}
          purpose={dao.description}
          currentDaoMetadata={{ links: dao.links, flag: dao.logo }}
          proposalBond={dao.policy.proposalBond}
        />
      )
    },
    {
      id: 2,
      label: 'Links',
      content: (
        <LinksTab
          accountName={dao.id}
          links={dao.links}
          currentDaoSettings={{
            name: dao.name,
            purpose: dao.description,
            flag: dao.logo
          }}
          proposalBond={dao.policy.proposalBond}
        />
      )
    },
    {
      id: 3,
      label: 'Bond & Deadlines',
      content: (
        <BondsAndDeadlines
          accountName={dao.id}
          createProposalBond={new Decimal(dao.policy.proposalBond)
            .div(yoktoNear)
            .toNumber()}
          claimBountyBond={new Decimal(dao.policy.bountyBond)
            .div(yoktoNear)
            .toNumber()}
          proposalExpireTime={new Decimal(dao.policy.proposalPeriod)
            .div('3.6e12')
            .toNumber()}
          unclaimBountyTime={new Decimal(dao.policy.proposalPeriod)
            .div('3.6e12')
            .toNumber()}
          proposalBond={dao.policy.proposalBond}
        />
      )
    },
    {
      id: 4,
      label: 'Flag',
      content: (
        <FlagTab
          daoFlag={dao.logo}
          daoId={dao.id}
          currentDaoSettings={{
            links: dao.links,
            name: dao.name,
            purpose: dao.description
          }}
          proposalBond={dao.policy.proposalBond}
        />
      )
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

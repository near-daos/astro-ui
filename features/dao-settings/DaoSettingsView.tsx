import Tabs from 'components/tabs/Tabs';
import Decimal from 'decimal.js';
import { NameAndPurposeTab } from 'features/dao-settings/components/name-and-pupropse-tab';
import { DAO } from 'types/dao';
import dynamic from 'next/dynamic';
import React, { FC } from 'react';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import { BondsAndDeadlines } from './components/bond-and-deadlines-tab';
import LinksTab from './components/links-tab/LinksTab';

import styles from './dao-settings-view.module.scss';

const FlagTab = dynamic(import('features/dao-settings/components/flag-tab'), {
  ssr: false,
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
          daoId={dao.id}
          name={dao.name}
          purpose={dao.description}
          currentDaoMetadata={{
            links: dao.links,
            flag: dao.logo,
            displayName: dao.displayName,
          }}
          proposalBond={dao.policy.proposalBond}
        />
      ),
    },
    {
      id: 2,
      label: 'Links',
      content: (
        <LinksTab
          daoId={dao.id}
          name={dao.name}
          purpose={dao.description}
          currentDaoMetadata={{
            links: dao.links,
            flag: dao.logo,
            displayName: dao.displayName,
          }}
          proposalBond={dao.policy.proposalBond}
        />
      ),
    },
    {
      id: 3,
      label: 'Bond & Deadlines',
      content: (
        <BondsAndDeadlines
          accountName={dao.id}
          createProposalBond={new Decimal(dao.policy.proposalBond)
            .div(YOKTO_NEAR)
            .toNumber()}
          claimBountyBond={new Decimal(dao.policy.bountyBond)
            .div(YOKTO_NEAR)
            .toNumber()}
          proposalExpireTime={new Decimal(dao.policy.proposalPeriod)
            .div('3.6e12')
            .toNumber()}
          unclaimBountyTime={new Decimal(dao.policy.bountyForgivenessPeriod)
            .div('3.6e12')
            .toNumber()}
          proposalBond={dao.policy.proposalBond}
        />
      ),
    },
    {
      id: 4,
      label: 'Flag',
      content: (
        <FlagTab
          daoId={dao.id}
          name={dao.name}
          purpose={dao.description}
          currentDaoMetadata={{
            links: dao.links,
            flag: dao.logo,
            displayName: dao.displayName,
          }}
          proposalBond={dao.policy.proposalBond}
        />
      ),
    },
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

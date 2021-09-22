import Tabs from 'components/tabs/Tabs';
import Decimal from 'decimal.js';
import { NameAndPurposeTab } from 'features/dao-settings/components/name-and-pupropse-tab';
import { useDao } from 'hooks/useDao';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { yoktoNear } from 'services/SputnikService';
import { BondsAndDeadlines } from './components/bond-and-deadlines-tab';
import LinksTab from './components/links-tab/LinksTab';

import styles from './dao-settings-view.module.scss';

const FlagTab = dynamic(import('features/dao-settings/components/flag-tab'), {
  ssr: false
});

export const DaoSettingsView: FC = () => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const dao = useDao(daoId);

  if (dao == null) return null;

  const tabs = [
    {
      id: 1,
      label: 'Name & Purpose',
      content: (
        <NameAndPurposeTab
          accountName={dao.id}
          name={dao.name}
          purpose={dao.description}
        />
      )
    },
    {
      id: 2,
      label: 'Links',
      content: (
        <LinksTab
          accountName={dao.id}
          links={[]} // TODO Where are links
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
        />
      )
    },
    {
      id: 4,
      label: 'Flag',
      content: <FlagTab daoFlag={dao.logo} />
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

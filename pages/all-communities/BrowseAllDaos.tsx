import React, { FC, useState } from 'react';
import get from 'lodash.get';

import { Dropdown } from 'components/dropdown/Dropdown';
import DaoCard from 'components/cards/dao-card';

import { daos } from 'lib/mocks/all-communities';
import styles from './browse-all-daos.module.scss';

const sortOptions = [
  {
    label: 'Most active',
    value: 'Most active'
  },
  {
    label: 'Newest',
    value: 'Newest'
  },
  {
    label: 'Oldest',
    value: 'Oldest'
  },
  {
    label: 'Biggest funds',
    value: 'Biggest funds'
  },
  {
    label: 'Number of members',
    value: 'Number of members'
  }
];

const BrowseAllDaos: FC = () => {
  const [activeSort, setActiveSort] = useState<string>(sortOptions[0].value);

  // Todo - we will fetch and select daos dynamically
  const data = daos.sort((a, b) => {
    let sortField = '';

    if (activeSort === 'Most active') {
      sortField = 'votes';
    } else if (activeSort === 'Newest') {
      sortField = 'date';
    } else if (activeSort === 'Number of members') {
      sortField = 'members';
    } else if (activeSort === 'Biggest funds') {
      sortField = 'funds';
    }

    if (get(a, sortField) > get(b, sortField)) {
      return -1;
    }

    if (get(a, sortField) < get(b, sortField)) {
      return 1;
    }

    return 0;
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Browse all DAOs</h1>
      </div>
      <div className={styles.filter}>
        <Dropdown
          options={sortOptions}
          value={activeSort}
          defaultValue={activeSort}
          onChange={value => setActiveSort(value ?? sortOptions[0].value)}
        />
      </div>
      <div className={styles.content}>
        {data.map(item => (
          <DaoCard
            title={item.name}
            daoAccountName={item.account}
            description={item.description}
            activeProposals={item.activeProposals}
            funds={item.funds}
            members={item.members}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowseAllDaos;

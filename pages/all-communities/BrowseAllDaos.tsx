import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { Dropdown } from 'components/dropdown/Dropdown';
import DaoCard from 'components/cards/dao-card';

import { SputnikService } from 'services/SputnikService';
import { DaoItem } from 'types/dao';

import styles from './browse-all-daos.module.scss';

const sortOptions = [
  {
    label: 'Most active',
    value: 'updatedAt'
  },
  {
    label: 'Newest',
    value: 'createdAt'
  },
  {
    label: 'Oldest',
    value: '-createdAt'
  },
  {
    label: 'Biggest funds',
    value: 'amount'
  },
  {
    label: 'Number of members',
    value: 'totalSupply'
  }
];

interface BrowseAllDaosProps {
  data: DaoItem[];
}

const BrowseAllDaos: FC<BrowseAllDaosProps> = ({ data: initialData = [] }) => {
  const router = useRouter();
  const activeSort = (router.query.sort as string) ?? sortOptions[0].value;

  const [data, setData] = useState(initialData);

  const handleSort = useCallback(
    value => {
      router.push(`?sort=${value}`, undefined, { shallow: true });
      SputnikService.getDaoList({ sort: value })
        .then(res => setData(res))
        .catch(e => console.error(e));
    },
    [router]
  );

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
          onChange={handleSort}
        />
      </div>
      <div className={styles.content}>
        {data.map(item => (
          <DaoCard
            key={item.id}
            title={item.name}
            daoAccountName={item.id}
            description={item.purpose}
            activeProposals={18}
            funds={180}
            members={item?.policy.roles.length}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowseAllDaos;

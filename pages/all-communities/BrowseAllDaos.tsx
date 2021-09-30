import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { Dropdown } from 'components/dropdown/Dropdown';
import DaoCard from 'components/cards/dao-card';

import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';
import {
  getActiveProposalsCountByDao,
  useAllProposals
} from 'hooks/useAllProposals';

import { useMount } from 'react-use';
import axios from 'axios';
import get from 'lodash/get';
import { formatCurrency } from 'utils/formatCurrency';

import styles from './browse-all-daos.module.scss';

const sortOptions = [
  {
    label: 'Most active',
    value: 'lastProposalId,DESC'
  },
  {
    label: 'Newest',
    value: 'createdAt,DESC'
  },
  {
    label: 'Oldest',
    value: 'createdAt,ASC'
  },
  {
    label: 'Biggest funds',
    value: 'amount,DESC'
  },
  {
    label: 'Number of members',
    value: 'numberOfAssociates,DESC'
  }
];

interface BrowseAllDaosProps {
  data: DAO[];
}

const BrowseAllDaos: FC<BrowseAllDaosProps> = ({ data: initialData = [] }) => {
  const router = useRouter();
  const activeSort = (router.query.sort as string) ?? sortOptions[1].value;

  const proposals = useAllProposals();
  const activeProposalsByDao = getActiveProposalsCountByDao(proposals);

  const [data, setData] = useState(initialData);
  const [nearPrice, setNearPrice] = useState(0);

  const handleSort = useCallback(
    value => {
      router.push(`?sort=${value}`, undefined, { shallow: true });

      if (value === 'lastProposalId,DESC') {
        const sorted = data.sort((a, b) => {
          if (a.proposals > b.proposals) return -1;

          if (a.proposals < b.proposals) return 1;

          return 0;
        });

        setData(sorted);
      } else {
        SputnikService.getDaoList({ sort: `${value}` })
          .then(res => {
            const sorted = res.map(item => ({
              ...item,
              proposals: activeProposalsByDao[item.id] ?? 0
            }));

            setData(sorted);
          })
          .catch(e => console.error(e));
      }
    },
    [activeProposalsByDao, data, router]
  );

  useMount(async () => {
    const nearPriceData = await axios.get('/api/nearPrice');
    const price = get(nearPriceData, 'data.near.usd');

    setNearPrice(price);
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
          onChange={handleSort}
        />
      </div>
      <div className={styles.content}>
        {data.map(item => {
          return (
            <DaoCard
              key={item.id}
              flag={item.logo}
              title={item.name}
              daoAccountName={item.id}
              description={item.description}
              activeProposals={item.proposals ?? 0}
              funds={formatCurrency(parseFloat(item.funds) * nearPrice)}
              members={item.members}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BrowseAllDaos;

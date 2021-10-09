import { useRouter } from 'next/router';
import React, { FC, useCallback, useState } from 'react';

import { DAO } from 'types/dao';

import DaoCard from 'components/cards/dao-card';
import { Dropdown } from 'components/dropdown/Dropdown';

import { SputnikService } from 'services/SputnikService';
import {
  useAllProposals,
  getActiveProposalsCountByDao
} from 'hooks/useAllProposals';

import { useNearPrice } from 'hooks/useNearPrice';

import { formatCurrency } from 'utils/formatCurrency';

import styles from './AllDaosPage.module.scss';

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
    value: 'numberOfMembers,DESC'
  }
];

interface BrowseAllDaosProps {
  data: DAO[];
}

const AllDaosPage: FC<BrowseAllDaosProps> = ({ data: initialData = [] }) => {
  const router = useRouter();
  const nearPrice = useNearPrice();

  const activeSort = (router.query.sort as string) ?? sortOptions[1].value;

  const proposals = useAllProposals();
  const activeProposalsByDao = getActiveProposalsCountByDao(proposals);

  const [data, setData] = useState(initialData);

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

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>All Communities</h1>
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

export default AllDaosPage;

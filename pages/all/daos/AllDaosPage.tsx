import React, { FC, useCallback, useState } from 'react';

import { DAO } from 'types/dao';

import DaoCard from 'components/cards/dao-card';
import { Button } from 'components/button/Button';
import { CREATE_DAO_URL } from 'constants/routing';
import { Dropdown } from 'components/dropdown/Dropdown';

import { SputnikService } from 'services/SputnikService';
import {
  useAllProposals,
  getActiveProposalsCountByDao
} from 'hooks/useAllProposals';

import { useRouter } from 'next/router';
import { useAuthContext } from 'context/AuthContext';

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
  const { accountId, login } = useAuthContext();

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

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>All Communities</h1>
        <Button variant="black" size="small" onClick={handleCreateDao}>
          Create new DAO
        </Button>
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
              dao={item}
              key={item.id}
              flag={item.logo}
              title={item.name}
              daoAccountName={item.id}
              description={item.description}
              activeProposals={item.proposals ?? 0}
              members={item.members}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AllDaosPage;

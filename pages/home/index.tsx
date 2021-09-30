import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { VOTE_BY_PERIOD } from 'constants/votingConstants';

import Tabs from 'components/tabs/Tabs';
import { Button } from 'components/button/Button';
import { Dropdown } from 'components/dropdown/Dropdown';

import {
  ProposalsByDaoRenderer,
  daoOptions,
  useFilteredMemberHomeData,
  useUserHasProposals
} from 'features/member-home';

import styles from './home.module.scss';

const Home: NextPage = () => {
  const router = useRouter();

  const {
    filter,
    filteredProposalsData,
    onFilterChange,
    selectedDaoFlag
  } = useFilteredMemberHomeData();

  const hasProposals = useUserHasProposals();

  useEffect(() => {
    if (!router.query.tab && hasProposals) {
      router.push({
        query: {
          tab: 2
        }
      });
      onFilterChange('proposalFilter', 'My proposals');
    }
  }, [router, hasProposals, onFilterChange]);

  const tabContent = VOTE_BY_PERIOD.map(period => (
    <ProposalsByDaoRenderer
      filter={filter}
      onFilterChange={onFilterChange}
      key={period.key}
      title={period.title}
      periodKey={period.key}
      data={filteredProposalsData[period.key]}
    />
  ));

  const tabs = [
    {
      id: 1,
      label: 'Active proposals',
      content: <>{tabContent}</>
    },
    {
      id: 2,
      label: 'Recent proposals',
      content: <>{tabContent}</>
    },
    {
      id: 3,
      label: 'My proposals',
      content: <>{tabContent}</>
    }
  ];

  return (
    <div className={styles.root}>
      <div className={styles.filters}>
        {filter.daoViewFilter ? (
          <div className={styles.row}>
            <div
              className={styles.flag}
              style={{ backgroundImage: `url(${selectedDaoFlag})` }}
            />
            <h1>{filter.daoViewFilter}</h1>
            <Button
              variant="secondary"
              size="small"
              onClick={() => onFilterChange('daoViewFilter', null)}
            >
              Remove filter
            </Button>
          </div>
        ) : (
          <Dropdown
            value={filter.daoFilter}
            onChange={val => onFilterChange('daoFilter', val ?? '')}
            options={daoOptions}
            defaultValue="All DAOs"
            className={styles.primaryFilter}
          />
        )}
      </div>
      <div className={styles.content}>
        <Tabs
          tabs={tabs}
          onTabSelect={name => onFilterChange('proposalFilter', name ?? '')}
        />
      </div>
    </div>
  );
};

export default Home;

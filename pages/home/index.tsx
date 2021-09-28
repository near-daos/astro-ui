import React from 'react';
import Tabs from 'components/tabs/Tabs';
import { NextPage } from 'next';

import { VOTE_BY_PERIOD } from 'constants/votingConstants';

import { Dropdown } from 'components/dropdown/Dropdown';
import { Button } from 'components/button/Button';

import {
  ProposalsByDaoRenderer,
  daoOptions,
  useFilteredMemberHomeData
} from 'features/member-home';

import styles from './home.module.scss';

const Home: NextPage = () => {
  const {
    filter,
    filteredProposalsData,
    onFilterChange,
    selectedDaoFlag
  } = useFilteredMemberHomeData();

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

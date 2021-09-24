import React from 'react';
import { NextPage } from 'next';

import { VOTE_BY_PERIOD } from 'constants/votingConstants';

import { Dropdown } from 'components/dropdown/Dropdown';
import { Button } from 'components/button/Button';

import {
  ProposalsByDaoRenderer,
  proposalOptions,
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

        <Dropdown
          value={filter.proposalFilter}
          onChange={val => onFilterChange('proposalFilter', val ?? '')}
          options={proposalOptions}
          defaultValue="Active proposals"
        />
      </div>
      <div className={styles.content}>
        {VOTE_BY_PERIOD.map(period => (
          <ProposalsByDaoRenderer
            filter={filter}
            onFilterChange={onFilterChange}
            key={period.key}
            title={period.title}
            periodKey={period.key}
            data={filteredProposalsData[period.key]}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

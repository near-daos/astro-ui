import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

import { VOTE_BY_PERIOD } from 'constants/votingConstants';

import Tabs from 'components/tabs/Tabs';
import { Button } from 'components/button/Button';
import { Dropdown } from 'components/dropdown/Dropdown';

import {
  daoOptions,
  useUserHasProposals,
  ProposalsByDaoRenderer,
  useFilteredMemberHomeData
} from 'features/member-home';
import {
  DaoFilterValues,
  ProposalFilterValues
} from 'features/member-home/types';

import styles from './home.module.scss';

type TabLabels =
  | 'My proposals'
  | 'All Active proposals'
  | 'All Finalized proposals';

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
          tab: 0
        }
      });
    }
  }, [router, hasProposals]);

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

  const tabs: { id: number; label: TabLabels; content: JSX.Element }[] = [
    {
      id: 1,
      label: 'My proposals',
      content: <>{tabContent}</>
    },
    {
      id: 2,
      label: 'All Active proposals',
      content: <>{tabContent}</>
    },
    {
      id: 3,
      label: 'All Finalized proposals',
      content: <>{tabContent}</>
    }
  ];

  const handleTabSelect = useCallback(
    (name: TabLabels) => {
      const tabLabelToFIlterName: {
        [key in TabLabels]: ProposalFilterValues;
      } = {
        'My proposals': 'My proposals',
        'All Active proposals': 'Active proposals',
        'All Finalized proposals': 'Recent proposals'
      };

      const proposalFilter: ProposalFilterValues = tabLabelToFIlterName[name];

      return onFilterChange({ proposalFilter });
    },
    // eslint-disable-next-line
    []
  );

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
              onClick={() => onFilterChange({ daoViewFilter: null })}
            >
              Remove filter
            </Button>
          </div>
        ) : (
          <Dropdown<DaoFilterValues>
            value={filter.daoFilter}
            onChange={val => onFilterChange({ daoFilter: val })}
            options={daoOptions}
            className={styles.primaryFilter}
          />
        )}
      </div>
      <div className={styles.content}>
        <Tabs<TabLabels> tabs={tabs} onTabSelect={handleTabSelect} />
      </div>
    </div>
  );
};

export default Home;

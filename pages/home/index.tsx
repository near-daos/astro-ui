import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { VOTE_BY_PERIOD } from 'constants/votingConstants';

import Tabs from 'components/tabs/Tabs';
import { Button } from 'components/button/Button';
import { Dropdown } from 'components/dropdown/Dropdown';

import {
  daoOptions,
  useFilteredMemberHomeData,
  getProposalFilter,
  ProposalsByDaoRenderer
} from 'features/member-home';
import { DaoFilterValues } from 'features/member-home/types';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';
import { CookieService } from 'services/CookieService';

import styles from './home.module.scss';

interface HomeProps {
  proposals: Proposal[];
}
type TabLabels =
  | 'My proposals'
  | 'All Active proposals'
  | 'All Finalized proposals';

const Home: NextPage<HomeProps> = ({ proposals }) => {
  const {
    filter,
    filteredProposalsData,
    onFilterChange,
    selectedDaoFlag
  } = useFilteredMemberHomeData(proposals);

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
            value={filter.daoFilter ?? ''}
            onChange={val => onFilterChange({ daoFilter: val })}
            options={daoOptions}
            className={styles.primaryFilter}
          />
        )}
      </div>
      <div className={styles.content}>
        <Tabs tabs={tabs} skipShallow />
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { tab, daoFilter, daoViewFilter } = query;
  const accountId = CookieService.get('account');

  let accountDaos;

  if (accountId) {
    accountDaos = await SputnikService.getAccountDaos(accountId);
  }

  if (!accountDaos || !accountDaos.length) {
    return {
      redirect: {
        destination: '/all-communities',
        permanent: false
      }
    };
  }

  const filter = {
    daoFilter: daoFilter ? (daoFilter as DaoFilterValues) : 'All DAOs',
    proposalFilter: getProposalFilter(tab),
    daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null
  };

  let proposals = [] as Proposal[];

  if (accountId) {
    proposals = await SputnikService.getFilteredProposals(filter, accountId);
  }

  return {
    props: {
      proposals
    }
  };
};

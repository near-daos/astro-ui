import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Proposal } from 'types/proposal';

import { VOTE_BY_PERIOD } from 'constants/votingConstants';

import {
  ProposalsByDaoRenderer,
  useFilteredMemberHomeData
} from 'features/member-home';
import { AllFinalizedProposals } from 'features/member-home/components/all-finalized-proposals';

import Tabs from 'components/tabs/Tabs';
import { Button } from 'components/button/Button';

import styles from './AllFeedPage.module.scss';

interface HomeProps {
  proposals: Proposal[];
}

type TabLabels =
  | 'My proposals'
  | 'All Active proposals'
  | 'All Finalized proposals';

const AllFeedPage: NextPage<HomeProps> = ({ proposals }) => {
  const router = useRouter();
  const { proposal: proposalId } = router.query;
  const {
    filter,
    filteredProposalsData,
    onFilterChange,
    selectedDaoFlag
  } = useFilteredMemberHomeData(proposals);

  const tabContent = VOTE_BY_PERIOD.map(period => {
    return (
      <ProposalsByDaoRenderer
        filter={filter}
        onFilterChange={onFilterChange}
        key={period.key}
        title={period.title}
        periodKey={period.key}
        data={filteredProposalsData[period.key]}
        expandedProposalId={(proposalId ?? '') as string}
      />
    );
  });

  const tabs: {
    id: number;
    label: TabLabels;
    content: JSX.Element | JSX.Element[];
  }[] = [
    {
      id: 2,
      label: 'All Active proposals',
      content: tabContent
    },
    {
      id: 3,
      label: 'All Finalized proposals',
      content: (
        <AllFinalizedProposals
          changeFilter={onFilterChange}
          selectedDao={filter.daoViewFilter}
          data={filteredProposalsData.otherProposals}
          expandedProposalId={(proposalId ?? '') as string}
        />
      )
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
          <h1>Astro Feed</h1>
        )}
      </div>
      <div className={styles.content}>
        <Tabs tabs={tabs} skipShallow />
      </div>
    </div>
  );
};

export default AllFeedPage;

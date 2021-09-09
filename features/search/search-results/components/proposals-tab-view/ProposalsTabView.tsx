import React, { FC } from 'react';
import classNames from 'classnames';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useFilteredProposalsData } from 'features/search/search-results/components/proposals-tab-view/helpers';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { SearchFilters } from 'features/search/search-filters';
import { NoResultsView } from 'features/search/search-results/components/no-results-view';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import ProposalCardRenderer from 'features/search/search-results/components/proposals-tab-view/ProposalCardRenderer';

import tempFlag from 'stories/dao-home/assets/flag.png';

import styles from './proposals-tab-view.module.scss';

const voteByPeriod = [
  {
    title: 'less then 1 hour',
    dataKey: 'lessThanHourProposals'
  },
  {
    title: 'less than a day',
    dataKey: 'lessThanDayProposals'
  },
  {
    title: 'less than a week',
    dataKey: 'lessThanWeekProposals'
  },
  {
    title: 'more than a week',
    dataKey: 'otherProposals'
  }
];

export const ProposalsTabView: FC = () => {
  const {
    filteredProposalsData,
    filter,
    onFilterChange
  } = useFilteredProposalsData();
  const { searchResults } = useSearchResults();

  const renderProposalsByVotePeriod = ({
    title,
    dataKey
  }: {
    title: string;
    dataKey: string;
  }) => {
    const data = filteredProposalsData[dataKey];

    if (!data.length) return null;

    const flag = (tempFlag as StaticImageData).src;

    return (
      <Collapsable
        key={title}
        initialOpenState
        renderHeading={(toggleHeading, isHeadingOpen) => (
          <Button
            variant="tertiary"
            className={styles.votingEnds}
            onClick={() => toggleHeading()}
          >
            Voting ends in &nbsp;
            <div className={styles.bold}>{title}</div>
            <Icon
              name="buttonArrowRight"
              width={24}
              className={classNames(styles.icon, {
                [styles.rotate]: isHeadingOpen
              })}
            />
          </Button>
        )}
      >
        <>
          <div className={styles.daoDivider}>
            <div
              className={styles.flag}
              style={{ backgroundImage: `url(${flag})` }}
            />
            <h3>Dao title</h3>
            <div className={styles.divider} />
          </div>
          {data.map(item => {
            return (
              <div className={styles.cardWrapper} key={item.id}>
                <ProposalCardRenderer proposal={item} />
              </div>
            );
          })}
        </>
      </Collapsable>
    );
  };

  if (!searchResults?.proposals.length)
    return <NoResultsView query={searchResults?.query} />;

  return (
    <div className={styles.root}>
      <SearchFilters
        showFilter={filter.show}
        searchFilter={filter.search}
        includeTasks={filter.tasks}
        includeGroups={filter.groups}
        includeTreasury={filter.treasury}
        includeGovernance={filter.governance}
        onChange={onFilterChange}
      />
      <Highlighter>
        <div className={styles.proposalList}>
          {voteByPeriod.map(period => renderProposalsByVotePeriod(period))}
        </div>
      </Highlighter>
    </div>
  );
};

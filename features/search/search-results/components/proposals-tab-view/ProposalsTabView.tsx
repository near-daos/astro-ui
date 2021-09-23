import React, { FC } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import {
  VOTE_BY_PERIOD,
  VoteByPeriodInterface
} from 'constants/votingConstants';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useFilteredProposalsData } from 'features/search/search-results/components/proposals-tab-view/helpers';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { SearchFilters } from 'features/search/search-filters';
import { NoResultsView } from 'features/search/search-results/components/no-results-view';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { ProposalCardRenderer } from 'components/cards/proposal-card';

import styles from './proposals-tab-view.module.scss';

export const ProposalsTabView: FC = () => {
  const {
    filteredProposalsData,
    filter,
    onFilterChange
  } = useFilteredProposalsData();
  const { searchResults } = useSearchResults();

  const renderProposalsByVotePeriod = (votePeriod: VoteByPeriodInterface) => {
    const { key, title } = votePeriod;
    const data = filteredProposalsData[key];

    if (isEmpty(data)) return null;

    function getHeader() {
      if (key === 'otherProposals') {
        return (
          <>
            Voting &nbsp;
            <span className={styles.bold}>ended</span>
          </>
        );
      }

      return (
        <>
          Voting ends in &nbsp;
          <span className={styles.bold}>{title}</span>
        </>
      );
    }

    return (
      <Collapsable
        key={key}
        initialOpenState
        renderHeading={(toggleHeading, isHeadingOpen) => (
          <Button
            variant="tertiary"
            className={styles.votingEnds}
            onClick={() => toggleHeading()}
          >
            {getHeader()}
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
        {Object.keys(data).map(daoName => {
          const daoProposalData = data[daoName];
          const flag = daoProposalData.dao.logo;
          const { proposals } = daoProposalData;

          return (
            <React.Fragment key={daoName}>
              <div className={styles.daoDivider}>
                <div
                  className={styles.flag}
                  style={{ backgroundImage: `url(${flag})` }}
                />
                <h3>{daoName}</h3>
                <div className={styles.divider} />
              </div>
              {proposals.map(item => {
                return (
                  <div className={styles.cardWrapper} key={item.id}>
                    <ProposalCardRenderer proposal={item} />
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
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
          {VOTE_BY_PERIOD.map(period => renderProposalsByVotePeriod(period))}
        </div>
      </Highlighter>
    </div>
  );
};

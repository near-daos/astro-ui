import React, { FC } from 'react';
import isEmpty from 'lodash/isEmpty';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useFilteredProposalsData } from 'features/search/search-results/components/proposals-tab-view/helpers';
import { statusFilterOptions } from 'features/search/search-filters/helpers';
import { NoResultsView } from 'features/no-results-view';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import ProposalStatusFilters from 'astro_2.0/components/Feed/StatusFilters';
import Checkbox from 'astro_2.0/components/inputs/Checkbox';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';

import styles from './proposals-tab-view.module.scss';

export const ProposalsTabView: FC = () => {
  const { searchResults } = useSearchResults();
  const { query, proposals } = searchResults || {};

  const {
    filteredProposals,
    filter,
    onFilterChange,
  } = useFilteredProposalsData(proposals || []);

  if (isEmpty(proposals)) {
    return (
      <NoResultsView
        title={query ? `No results for ${query}` : 'No results'}
        subTitle="We couldn't find anything matching your search. Try again with a
        different term."
      />
    );
  }

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.typeRoot}>
          <p className={styles.typeLabel}>Type:</p>

          {([
            {
              label: 'Tasks',
              field: 'tasks',
            },
            {
              label: 'Groups',
              field: 'groups',
            },
            {
              label: 'Treasury',
              field: 'treasury',
            },
            {
              label: 'Governance',
              field: 'governance',
            },
          ] as const).map(item => (
            <Checkbox
              key={item.field}
              input={{
                name: item.field,
                checked: filter[item.field],
                onChange: () => onFilterChange(item.field, !filter[item.field]),
              }}
              label={item.label}
              classes={{
                root: styles.checkboxRoot,
              }}
            />
          ))}
        </div>

        <ProposalStatusFilters
          proposal={filter.show}
          onChange={value => () => {
            onFilterChange('show', value || statusFilterOptions[0].value);
          }}
          list={[
            {
              value: statusFilterOptions[0].value,
              name: statusFilterOptions[0].value,
              label: 'All',
            },
            {
              value: statusFilterOptions[1].value,
              name: statusFilterOptions[1].value,
              label: 'Active',
            },
            {
              value: statusFilterOptions[2].value,
              name: statusFilterOptions[2].value,
              label: 'Approved',
              classes: {
                inputWrapperChecked:
                  styles.categoriesListApprovedInputWrapperChecked,
              },
            },
            {
              value: statusFilterOptions[3].value,
              name: statusFilterOptions[3].value,
              label: 'Inactive',
              classes: {
                inputWrapperChecked:
                  styles.categoriesListFailedInputWrapperChecked,
              },
            },
            {
              value: statusFilterOptions[4].value,
              name: statusFilterOptions[4].value,
              label: 'Rejected',
              classes: {
                inputWrapperChecked:
                  styles.categoriesListFailedInputWrapperChecked,
              },
            },
            {
              value: statusFilterOptions[5].value,
              name: statusFilterOptions[5].value,
              label: 'Dismissed',
              classes: {
                inputWrapperChecked:
                  styles.categoriesListFailedInputWrapperChecked,
              },
            },
          ]}
          className={styles.statusFilterRoot}
        />
      </div>

      <Highlighter>
        {filteredProposals.map(item => {
          return (
            <div className={styles.cardWrapper} key={item.id}>
              <ViewProposal dao={item.dao} proposal={item} showFlag />
            </div>
          );
        })}
      </Highlighter>
    </div>
  );
};

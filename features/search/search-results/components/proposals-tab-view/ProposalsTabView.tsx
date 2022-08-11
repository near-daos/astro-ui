import React from 'react';
import { useRouter } from 'next/router';
import { useUpdateEffect } from 'react-use';
import { useTranslation } from 'next-i18next';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useFilteredProposalsData } from 'features/search/search-results/components/proposals-tab-view/helpers';
import { statusFilterOptions } from 'features/search/search-results/components/proposals-tab-view/constants';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { ProposalFilter } from 'astro_2.0/features/Proposals/components/ProposalFilter';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';

import styles from './ProposalsTabView.module.scss';

const FILTER_DEFAULT_STATE = {
  show: 'All',
  search: 'In all DAOs',
  tasks: false,
  groups: false,
  treasury: false,
  governance: false,
} as const;

export const ProposalsTabView: React.FC = () => {
  const { query: queries } = useRouter();
  const { t } = useTranslation();

  const { searchResults } = useSearchResults();
  const { query, proposals } = searchResults || {};

  const {
    filteredProposals,
    filter,
    setFilter,
    onFilterChange,
  } = useFilteredProposalsData(
    proposals || [],
    queries.category
      ? {
          ...FILTER_DEFAULT_STATE,
          [queries.category as keyof typeof FILTER_DEFAULT_STATE]: true,
        }
      : undefined
  );

  useUpdateEffect(() => {
    window.scroll(0, 0);

    if (queries.category) {
      setFilter?.({
        ...filter,
        tasks: false,
        governance: false,
        groups: false,
        treasury: false,
        [queries.category as keyof typeof filter]: true,
      });

      return;
    }

    setFilter?.({
      ...filter,
      tasks: true,
      governance: true,
      groups: true,
      treasury: true,
    });
  }, [queries.category]);

  return (
    <div className={styles.root}>
      <div className={styles.statusFilterWrapper}>
        <ProposalFilter
          title={`${t('filterByProposalStatus')}:`}
          shortTitle={`${t('filterByStatus')}:`}
          value={filter.show}
          onChange={value => {
            window.scroll(0, 0);
            onFilterChange('show', value || statusFilterOptions[0].value);
          }}
          list={[
            {
              value: statusFilterOptions[0].value,
              label: 'All',
            },
            {
              value: statusFilterOptions[1].value,
              label: 'Active',
            },
            {
              value: statusFilterOptions[2].value,
              label: 'Approved',
              className: styles.statusFilterRadioRootSuccess,
            },
            {
              value: statusFilterOptions[3].value,
              label: 'Failed',
              className: styles.statusFilterRadioRootError,
            },
          ]}
        />
      </div>

      <div className={styles.listWrapper}>
        <SideFilter
          queryName="category"
          list={[
            {
              label: 'Tasks',
              value: 'tasks',
            },
            {
              label: 'Groups',
              value: 'groups',
            },
            {
              label: 'Treasury',
              value: 'treasury',
            },
            {
              label: 'Governance',
              value: 'governance',
            },
          ]}
          title="Choose a type"
        />

        {filteredProposals?.length ? (
          <Highlighter className={styles.highlighterRoot}>
            {filteredProposals.map(item => {
              return (
                <div className={styles.cardWrapper} key={item.id}>
                  <ViewProposal proposal={item} showFlag />
                </div>
              );
            })}
          </Highlighter>
        ) : (
          <NoResultsView
            title={query ? `No results for ${query}` : 'No results'}
            subTitle="We couldn't find anything matching your search. Try again with a
        different term."
          />
        )}
      </div>
    </div>
  );
};

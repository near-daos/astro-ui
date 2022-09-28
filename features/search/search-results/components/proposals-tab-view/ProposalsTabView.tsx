import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAsyncFn, useMountedState, useUpdateEffect } from 'react-use';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { useFilteredProposalsData } from 'features/search/search-results/components/proposals-tab-view/helpers';
import { statusFilterOptions } from 'features/search/search-results/components/proposals-tab-view/constants';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { ProposalFilter } from 'astro_2.0/features/Proposals/components/ProposalFilter';
import { SideFilter } from 'astro_2.0/components/SideFilter';

import { useWalletContext } from 'context/WalletContext';
import { ProposalFeedItem } from 'types/proposal';

import { SearchResponseIndex } from 'services/SearchService/types';
import { isOpenSearchResponse } from 'services/SearchService/helpers';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';

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
  const { useOpenSearch } = useFlags();

  const { searchResults, searchServiceInstance } = useSearchResults();
  const { accountId } = useWalletContext();
  const isMounted = useMountedState();
  const [data, setData] = useState<ProposalFeedItem[]>([]);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [{ loading }, search] = useAsyncFn(
    async (initialData?: typeof data) => {
      const accumulatedListData = initialData || [];
      const opts = searchResults?.opts;

      if (!opts) {
        return accumulatedListData;
      }

      if (cancelTokenRef.current) {
        cancelTokenRef.current?.cancel('Cancelled by new req');
      }

      const { CancelToken } = axios;
      const source = CancelToken.source();

      cancelTokenRef.current = source;

      const res = await searchServiceInstance.searchPaginated({
        query: opts.query,
        size: 20,
        field: opts.field,
        accountId: accountId ?? '',
        index: SearchResponseIndex.PROPOSAL,
        cancelToken: source.token,
        from: accumulatedListData.length || 0,
      });

      if (isOpenSearchResponse(res)) {
        const newData = mapOpenSearchResponseToSearchResult(
          opts.query,
          SearchResponseIndex.PROPOSAL,
          res.data
        );

        return [...accumulatedListData, ...newData.data];
      }

      return accumulatedListData;
    },
    [searchResults, accountId]
  );

  useEffect(() => {
    (async () => {
      const opts = searchResults?.opts;

      if (!useOpenSearch) {
        setData(searchResults?.proposals as ProposalFeedItem[]);

        return;
      }

      if (opts?.query) {
        const newData = await search();

        if (isMounted()) {
          setData(newData as ProposalFeedItem[]);
        }
      } else if (isMounted()) {
        setData([]);
      }
    })();
  }, [
    isMounted,
    search,
    searchResults?.opts,
    searchResults?.proposals,
    useOpenSearch,
  ]);

  const loadMore = async () => {
    if (loading) {
      return;
    }

    const newData = await search(data);

    if (isMounted()) {
      setData(newData as ProposalFeedItem[]);
    }
  };

  const { filteredProposals, filter, setFilter, onFilterChange } =
    useFilteredProposalsData(
      data || [],
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

  if (!data) {
    return (
      <NoResultsView
        title={
          searchResults?.query
            ? `No results for ${searchResults?.query}`
            : 'No results'
        }
        subTitle="We couldn't find anything matching your search. Try again with a
        different term."
      />
    );
  }

  return (
    <div className={styles.root}>
      <>
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

          <InfiniteScroll
            className={styles.scrollContainer}
            dataLength={data.length}
            next={loadMore}
            hasMore={data.length < (searchResults?.totals?.proposals ?? 0)}
            loader={<h4 className={styles.loading}>Loading...</h4>}
            style={{ overflow: 'initial', width: '100%' }}
            endMessage={<div />}
          >
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
                title={
                  searchResults?.query
                    ? `No results for ${searchResults?.query}`
                    : 'No results'
                }
                subTitle="We couldn't find anything matching your search. Try again with a
        different term."
              />
            )}
          </InfiniteScroll>
        </div>
      </>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { Highlighter } from 'features/search/search-results/components/highlighter';
import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails';

import { useAsyncFn, useMountedState } from 'react-use';
import { SearchResponseIndex } from 'services/SearchService/types';
import axios, { CancelTokenSource } from 'axios';
import { useWalletContext } from 'context/WalletContext';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { isOpenSearchResponse } from 'services/SearchService/helpers';
import { DaoFeedItem } from 'types/dao';

import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './dao-tab-view.module.scss';

export const DaosTabView = (): JSX.Element => {
  const { t } = useTranslation();
  const { useOpenSearch } = useFlags();
  const { searchResults, searchServiceInstance } = useSearchResults();
  const { accountId } = useWalletContext();
  const isMounted = useMountedState();
  const [data, setData] = useState<DaoFeedItem[]>([]);

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
        index: SearchResponseIndex.DAO,
        cancelToken: source.token,
        from: accumulatedListData.length || 0,
      });

      if (isOpenSearchResponse(res)) {
        const newData = mapOpenSearchResponseToSearchResult(
          opts.query,
          SearchResponseIndex.DAO,
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
        setData(searchResults?.daos as DaoFeedItem[]);

        return;
      }

      if (opts?.query) {
        const newData = await search();

        if (isMounted()) {
          setData(newData as DaoFeedItem[]);
        }
      } else if (isMounted()) {
        setData([]);
      }
    })();
  }, [isMounted, search, searchResults, searchResults?.opts, useOpenSearch]);

  const loadMore = async () => {
    if (loading) {
      return;
    }

    const newData = await search(data);

    if (isMounted()) {
      setData(newData as DaoFeedItem[]);
    }
  };

  if (!data?.length && !loading) {
    return (
      <NoResultsView
        title={
          searchResults?.query
            ? `No results for ${searchResults.query}`
            : 'No results'
        }
        subTitle="We couldn't find anything matching your search. Try again with a
        different term."
      />
    );
  }

  return (
    <div className={styles.root}>
      <Highlighter>
        <InfiniteScroll
          dataLength={data.length}
          next={loadMore}
          hasMore={data.length < (searchResults?.totals?.daos ?? 0)}
          loader={<h4 className={styles.loading}>Loading...</h4>}
          style={{ overflow: 'initial' }}
          endMessage={
            <p className={styles.loading}>
              <b>{t('youHaveSeenItAll')}</b>
            </p>
          }
        >
          <div className={styles.content}>
            {data.map(item => (
              <React.Fragment key={item.id}>
                <DaoDetailsGrid
                  key={item.id}
                  dao={item}
                  activeProposals={item.activeProposalCount}
                  totalProposals={item.totalProposalCount}
                />
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      </Highlighter>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';

import { useWalletContext } from 'context/WalletContext';
import { useAsyncFn, useMountedState } from 'react-use';
import { ProposalComment } from 'types/proposal';
import axios, { CancelTokenSource } from 'axios';
import { SearchResponseIndex } from 'services/SearchService/types';
import { isOpenSearchResponse } from 'services/SearchService/helpers';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';

import styles from './CommentsTabView.module.scss';

export const CommentsTabView: React.FC = () => {
  const { t } = useTranslation();
  const { useOpenSearch } = useFlags();
  const { searchResults, searchServiceInstance } = useSearchResults();
  const { accountId } = useWalletContext();
  const isMounted = useMountedState();
  const [data, setData] = useState<ProposalComment[]>([]);

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
        index: SearchResponseIndex.COMMENT,
        cancelToken: source.token,
        from: accumulatedListData.length || 0,
      });

      if (isOpenSearchResponse(res)) {
        const newData = mapOpenSearchResponseToSearchResult(
          opts.query,
          SearchResponseIndex.COMMENT,
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
        return;
      }

      if (opts?.query) {
        const newData = await search();

        if (isMounted()) {
          setData(newData as ProposalComment[]);
        }
      } else if (isMounted()) {
        setData([]);
      }
    })();
  }, [isMounted, search, searchResults?.opts, useOpenSearch]);

  const loadMore = async () => {
    if (loading) {
      return;
    }

    const newData = await search(data);

    if (isMounted()) {
      setData(newData as ProposalComment[]);
    }
  };

  return (
    <div className={styles.root}>
      <InfiniteScroll
        dataLength={data.length}
        next={loadMore}
        hasMore={data.length < (searchResults?.totals?.comments ?? 0)}
        loader={<h4 className={styles.loading}>Loading...</h4>}
        style={{ overflow: 'initial' }}
        endMessage={
          <p className={styles.loading}>
            <b>{t('youHaveSeenItAll')}</b>
          </p>
        }
      >
        <div className={styles.listWrapper}>
          {data?.length ? (
            <Highlighter className={styles.highlighterRoot}>
              {data.map(item => {
                return (
                  <div className={styles.cardWrapper} key={item.id}>
                    <div>{item.message}</div>
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
        </div>
      </InfiniteScroll>
    </div>
  );
};

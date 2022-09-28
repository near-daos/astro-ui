import React, { useEffect, useRef, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Highlighter } from 'features/search/search-results/components/highlighter';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider';

import { DraftProposalFeedItem } from 'types/draftProposal';
import { DraftCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard';

import { useTranslation } from 'next-i18next';
import { useWalletContext } from 'context/WalletContext';
import { useAsyncFn, useMountedState } from 'react-use';
import axios, { CancelTokenSource } from 'axios';
import { SearchResponseIndex } from 'services/SearchService/types';
import { isOpenSearchResponse } from 'services/SearchService/helpers';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './DraftsTabView.module.scss';

export const DraftsTabView: React.FC = () => {
  const { t } = useTranslation();
  const { useOpenSearch } = useFlags();
  const { searchResults, searchServiceInstance } = useSearchResults();
  const { accountId } = useWalletContext();
  const isMounted = useMountedState();
  const [data, setData] = useState<DraftProposalFeedItem[]>([]);

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
        index: SearchResponseIndex.DRAFT_PROPOSAL,
        cancelToken: source.token,
        from: accumulatedListData.length || 0,
      });

      if (isOpenSearchResponse(res)) {
        const newData = mapOpenSearchResponseToSearchResult(
          opts.query,
          SearchResponseIndex.DRAFT_PROPOSAL,
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
          setData(newData as DraftProposalFeedItem[]);
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
      setData(newData as DraftProposalFeedItem[]);
    }
  };

  const renderItem = (item: DraftProposalFeedItem) => {
    return (
      <DraftCard
        key={item.id}
        data={item}
        flag=""
        daoId={item.daoId}
        disableEdit
      />
    );
  };

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
      <InfiniteScroll
        dataLength={data.length}
        next={loadMore}
        hasMore={data.length < (searchResults?.totals?.drafts ?? 0)}
        loader={<h4 className={styles.loading}>Loading...</h4>}
        style={{ overflow: 'initial' }}
        endMessage={
          <p className={styles.loading}>
            <b>{t('youHaveSeenItAll')}</b>
          </p>
        }
      >
        <div className={styles.listWrapper}>
          <DraftsDataProvider>
            {data?.length ? (
              <Highlighter className={styles.highlighterRoot}>
                {data.map(item => renderItem(item))}
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
          </DraftsDataProvider>
        </div>
      </InfiniteScroll>
    </div>
  );
};

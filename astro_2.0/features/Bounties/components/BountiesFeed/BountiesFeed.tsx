import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { useAsyncFn, useMountedState } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { useBountySearch } from 'astro_2.0/features/Bounties/components/hooks';

import { BountyContext } from 'types/bounties';
import { DAO } from 'types/dao';
import { PaginationResponse } from 'types/api';

import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';
import { ViewBounty } from 'astro_2.0/features/ViewBounty';
import { BountiesSearchInput } from 'astro_2.0/features/Bounties/components/BountiesSearchInput';

import { Tokens } from 'context/CustomTokensContext';
import { useAuthContext } from 'context/AuthContext';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import styles from './BountiesFeed.module.scss';

interface BountiesFeedProps {
  initialData: PaginationResponse<BountyContext[]> | null;
  dao?: DAO;
  tokens?: Tokens;
}

const FEED_OPTIONS = [
  {
    label: 'Proposal Phase',
    value: 'proposalPhase',
  },
  {
    label: 'Available Bounty',
    value: 'availableBounty',
  },
  {
    label: 'In Progress',
    value: 'inProgress',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
];

export const BountiesFeed: FC<BountiesFeedProps> = ({
  initialData,
  dao,
  tokens,
}) => {
  const { accountId } = useAuthContext();
  const { t } = useTranslation();
  const isMounted = useMountedState();
  const { query } = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const { handleSearch, loading: searching } = useBountySearch();

  const [{ loading: dataIsLoading }, fetchData] = useAsyncFn(
    async (initData?: typeof data) => {
      let accumulatedListData = initData || null;

      const res = await SputnikHttpService.getBountiesContext(
        query.dao as string,
        accountId,
        {
          offset: accumulatedListData?.data.length || 0,
          limit: LIST_LIMIT_DEFAULT,
          bountySort: query.bountySort as string,
          bountyFilter: query.bountyFilter as string,
          bountyPhase: query.bountyPhase as string,
        }
      );

      if (!res) {
        return null;
      }

      accumulatedListData = {
        ...res,
        data: [...(accumulatedListData?.data || []), ...(res.data || [])],
      };

      // Reset custom loading state
      if (isMounted()) {
        setLoading(false);
      }

      return accumulatedListData;
    },
    [data?.data?.length, query, accountId]
  );

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      const newProposalsData = await fetchData();

      if (isMounted()) {
        setData(newProposalsData);
      }

      window.scroll(0, 0);
    },
    1000,
    [query.bountyPhase, query.bountySort, query.bountyFilter]
  );

  const loadMore = async () => {
    if (dataIsLoading) {
      return;
    }

    const newProposalsData = await fetchData(data);

    if (isMounted()) {
      setData(newProposalsData);
    }
  };

  const handleBountyInoutSearch = useCallback(
    async val => {
      if (!val || !val.trim()) {
        return;
      }

      const res = await handleSearch(val);

      if (isMounted()) {
        setData(res);
      }
    },
    [handleSearch, isMounted]
  );

  const handleBountyInputClose = useCallback(async () => {
    const newProposalsData = await fetchData();

    if (isMounted()) {
      setData(newProposalsData);
    }
  }, [fetchData, isMounted]);

  return (
    <div className={styles.root}>
      <div className={cn(styles.row, styles.additionalFilters)}>
        <BountiesSearchInput
          onSubmit={handleBountyInoutSearch}
          loading={searching}
          onClose={handleBountyInputClose}
        />
      </div>
      <div className={cn(styles.row, styles.content)}>
        <SideFilter
          shallowUpdate
          hideAllOption
          queryName="bountyPhase"
          list={FEED_OPTIONS}
          title={t('feed.filters.chooseAFilter')}
          className={styles.filter}
        />
        <div className={styles.container}>
          {loading ? (
            <Loader className={styles.loader} />
          ) : (
            data && (
              <FeedList
                data={data}
                loadMore={loadMore}
                loader={<p className={styles.loading}>{t('loading')}...</p>}
                noResults={
                  <div className={styles.loading}>
                    <NoResultsView
                      title={
                        isEmpty(data?.data)
                          ? 'No data found'
                          : t('noMoreResults')
                      }
                    />
                  </div>
                }
                renderItem={bountyContext => (
                  <div
                    key={bountyContext.id}
                    className={styles.bountyCardWrapper}
                  >
                    {dao && tokens && (
                      <ViewBounty
                        contextId={bountyContext.id}
                        commentsCount={bountyContext.commentsCount}
                        dao={dao}
                        bounty={bountyContext.bounty}
                        tokens={tokens}
                        proposal={bountyContext.proposal}
                        initialInfoPanelView={null}
                      />
                    )}
                  </div>
                )}
                className={styles.listWrapper}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

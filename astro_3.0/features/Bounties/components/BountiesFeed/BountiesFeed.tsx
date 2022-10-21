import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { useAsyncFn, useMount, useMountedState } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import uniqBy from 'lodash/uniqBy';

import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';

import { BountyContext } from 'types/bounties';
import { DAO } from 'types/dao';
import { PaginationResponse } from 'types/api';

import { MainLayout } from 'astro_3.0/features/MainLayout';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Loader } from 'components/loader';
import { ViewBounty } from 'astro_2.0/features/ViewBounty';

import { Tokens } from 'types/token';
import { useWalletContext } from 'context/WalletContext';
import { HideBountyContextProvider } from 'astro_2.0/features/Bounties/components/HideBountyContext';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { FeedControlsLayout } from 'astro_3.0/features/FeedLayout';
import { BountiesFeedFilters } from 'astro_3.0/features/Bounties/components/BountiesFeedFilters';

import styles from './BountiesFeed.module.scss';

interface BountiesFeedProps {
  initialData: PaginationResponse<BountyContext[]> | null;
  dao?: DAO;
  tokens?: Tokens;
}

export const BountiesFeed: FC<BountiesFeedProps> = ({ initialData, dao }) => {
  const { accountId } = useWalletContext();
  const { t } = useTranslation();
  const isMounted = useMountedState();
  const { query } = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const [{ loading: dataIsLoading }, fetchData] = useAsyncFn(
    async (initData?: typeof data) => {
      let accumulatedListData = initData || null;

      const res = await SputnikHttpService.getBountiesContext('', accountId, {
        offset: accumulatedListData?.data.length || 0,
        limit: LIST_LIMIT_DEFAULT,
        bountySort: query.bountySort as string,
        bountyFilter: query.bountyFilter as string,
        bountyPhase: query.bountyPhase as string,
      });

      if (!res) {
        return null;
      }

      accumulatedListData = {
        ...res,
        data: uniqBy(
          [...(accumulatedListData?.data || []), ...(res.data || [])],
          item => item.id
        ),
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

  useMount(() => {
    loadMore();
  });

  return (
    <div className={styles.root}>
      <FeedControlsLayout>
        <h1>Bounties</h1>
      </FeedControlsLayout>
      <FeedControlsLayout>
        <BountiesFeedFilters />
      </FeedControlsLayout>
      <HideBountyContextProvider>
        <MainLayout>
          <div className={cn(styles.row, styles.content)}>
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
                              ? t('noDataFound')
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
                        {bountyContext.proposal && (
                          <ViewBounty
                            contextId={bountyContext.id}
                            commentsCount={bountyContext.commentsCount}
                            dao={dao}
                            daoId={bountyContext.daoId}
                            bounty={bountyContext.bounty}
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
        </MainLayout>
      </HideBountyContextProvider>
    </div>
  );
};

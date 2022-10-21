import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { useBountiesFeed } from 'astro_3.0/features/Bounties/components/BountiesFeedNext/hooks';
import { Loader } from 'components/loader';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { ViewBounty } from 'astro_2.0/features/ViewBounty';
import { BountiesFeedFilters } from 'astro_3.0/features/Bounties/components/BountiesFeedFilters';

import { DAO } from 'types/dao';

import styles from 'astro_3.0/features/Bounties/components/BountiesFeedNext/BountiesFeedNext.module.scss';

interface Props {
  dao: DAO;
}

export const DaoBounties: FC<Props> = ({ dao }) => {
  const { t } = useTranslation();
  const { handleLoadMore, bountiesData, isValidating, hasMore, dataLength } =
    useBountiesFeed();

  return (
    <main className={cn(styles.root)}>
      <BountiesFeedFilters />
      {isValidating && !bountiesData.data.length && <Loader />}
      <FeedList
        data={bountiesData}
        dataLength={dataLength}
        hasMore={hasMore}
        loadMore={handleLoadMore}
        loader={<Loader className={styles.loading}>{t('loading')}...</Loader>}
        noResults={
          !isValidating ? (
            <div className={styles.loading}>
              <NoResultsView
                title={
                  isEmpty(bountiesData?.data)
                    ? t('noDataFound')
                    : t('noMoreResults')
                }
              />
            </div>
          ) : (
            <div />
          )
        }
        renderItem={bountyContext => (
          <div key={bountyContext.id} className={styles.bountyCardWrapper}>
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
    </main>
  );
};

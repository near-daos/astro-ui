import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useQuery from 'hooks/useQuery';
import InfiniteScroll from 'react-infinite-scroll-component';

import { DaoContext } from 'types/context';
import { DraftProposalFeedItem } from 'types/draftProposal';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { FEED_CATEGORIES } from 'constants/proposals';

import { Button } from 'components/button/Button';
import { StateFilter } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/StateFilter';
import { DraftCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { useDraftsPageData } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/hooks';
import { useWalletContext } from 'context/WalletContext';

import { CREATE_DRAFT_PAGE_URL } from 'constants/routing';

import { DraftsPageHeader } from './components/DraftsPageHeader';
import { DraftMobileFilters } from './components/DraftMobileFilters';

import styles from './DraftsPageContent.module.scss';

export interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const DraftsPageContent: FC<Props> = ({ daoContext }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { dao } = daoContext;
  const { accountId } = useWalletContext();
  const { query } = useQuery<{ category: string; view: string }>();
  const { view, category } = query;

  const {
    data,
    handleSearch,
    loading,
    loadMore,
    handleReset,
  } = useDraftsPageData(dao.id);

  const feedCategoriesOptions = useMemo(
    () =>
      FEED_CATEGORIES.map(item => ({
        ...item,
        label: t(item.label.toLowerCase()),
      })),
    [t]
  );

  const { unreadDrafts, readDrafts } = useMemo(() => {
    const unread: DraftProposalFeedItem[] = [];
    const read: DraftProposalFeedItem[] = [];

    data?.data.forEach(draft => {
      if (draft.isRead) {
        read.push(draft);
      } else {
        unread.push(draft);
      }
    });

    return { unreadDrafts: unread, readDrafts: read };
  }, [data?.data]);

  const renderItem = (item: DraftProposalFeedItem) => {
    return (
      <DraftCard
        key={item.id}
        data={item}
        flag={dao.flagCover ?? ''}
        daoId={dao.id}
      />
    );
  };

  const renderList = (title: string, list: DraftProposalFeedItem[]) => {
    if (!list.length) {
      return null;
    }

    return (
      <>
        <div className={styles.listTitleWrapper}>
          <span className={styles.title}>{title}:</span>{' '}
          <span className={styles.count}>{list.length}</span>
        </div>
        {list.map(item => renderItem(item))}
      </>
    );
  };

  return (
    <div className={styles.root}>
      <Head>
        <title>
          Astro - Drafts {view ? `- ${view}` : ''}{' '}
          {category ? `- ${category}` : ''}
        </title>
        <meta name="viewport" content="width=device-width, minimum-scale=1" />
      </Head>
      <DraftsPageHeader
        className={styles.header}
        loading={loading}
        onSearch={handleSearch}
        handleReset={handleReset}
      />
      <DraftMobileFilters />
      <div className={styles.content}>
        <div className={styles.sideFilters}>
          <SideFilter
            className={styles.categories}
            queryName="category"
            list={feedCategoriesOptions}
            title={t('feed.filters.chooseAFilter')}
            disabled={loading}
            titleClassName={styles.categoriesListTitle}
          />
          <StateFilter />
        </div>
        {loading ? (
          <Loader className={styles.loader} />
        ) : (
          <div className={styles.listWrapper}>
            {data ? (
              <InfiniteScroll
                dataLength={data.data.length}
                next={loadMore}
                hasMore={data.data.length < data.total}
                loader={<p className={styles.loading}>{t('loading')}...</p>}
                style={{ overflow: 'initial' }}
                endMessage={
                  <div className={styles.loading}>
                    <NoResultsView
                      className={styles.noResults}
                      title={
                        isEmpty(data?.data)
                          ? t('drafts.noDrafts')
                          : t('noMoreResults')
                      }
                    >
                      {data?.total === 0 &&
                        dao.daoMembersList.includes(accountId) && (
                          <Button
                            capitalize
                            size="small"
                            onClick={() => {
                              router.push({
                                pathname: CREATE_DRAFT_PAGE_URL,
                                query: {
                                  dao: dao.id,
                                },
                              });
                            }}
                          >
                            Create Draft
                          </Button>
                        )}
                    </NoResultsView>
                  </div>
                }
              >
                {renderList('Unread drafts', unreadDrafts)}
                {renderList('All drafts', readDrafts)}
              </InfiniteScroll>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

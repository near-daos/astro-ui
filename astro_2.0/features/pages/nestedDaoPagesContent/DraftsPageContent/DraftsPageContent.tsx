import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useQuery from 'hooks/useQuery';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence, motion } from 'framer-motion';

import { DaoContext } from 'types/context';
import { DraftProposalFeedItem } from 'types/draftProposal';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

import { Button } from 'components/button/Button';
import { DraftCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard';
import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import { useModal } from 'components/modal';
import { ConfirmModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/ConfirmModal';

import {
  useDraftsPageData,
  useMultiDraftActions,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/hooks';
import { useWalletContext } from 'context/WalletContext';

import { CREATE_DRAFT_PAGE_URL } from 'constants/routing';

import { DraftsPageHeader } from './components/DraftsPageHeader';
import { DraftsMobileFilters } from './components/DraftsMobileFilters';
import { DraftsFiltersContainer } from './components/DraftsFiltersContainer';

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
  const isCouncil = isCouncilUser(dao, accountId);

  const [showModal] = useModal(ConfirmModal);

  const { data, handleSearch, loading, loadMore, handleReset } =
    useDraftsPageData(dao.id);

  const {
    handleDelete,
    handleDismiss,
    handleSelect,
    list: selectedList,
  } = useMultiDraftActions();

  const handleDeleteSelectedDrafts = useCallback(async () => {
    const res = await showModal({
      title: t('drafts.editDraftPage.modalDeleteTitle'),
      message: `Do you want to delete ${selectedList.length} selected draft${
        selectedList.length > 1 ? 's' : ''
      }?`,
    });

    if (res[0]) {
      await handleDelete();
    }
  }, [handleDelete, selectedList.length, showModal, t]);

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
        onSelect={handleSelect}
        selectedList={selectedList}
        disableEdit={
          item.state === 'closed' || !(isCouncil || item.proposer === accountId)
        }
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
          Astro - {t('drafts.feed.headTitle')} {view ? `- ${view}` : ''}{' '}
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
      <DraftsFiltersContainer />
      <DraftsMobileFilters />
      <div className={styles.content}>
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
                          ? t('drafts.feed.noDrafts.title')
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
                            {t('drafts.feed.noDrafts.createDraftButton')}
                          </Button>
                        )}
                    </NoResultsView>
                  </div>
                }
              >
                {renderList(t('drafts.feed.unreadDrafts'), unreadDrafts)}
                {renderList(t('drafts.feed.allDrafts'), readDrafts)}
              </InfiniteScroll>
            ) : null}
            <div className={styles.selection}>
              <AnimatePresence>
                {!!selectedList.length && (
                  <motion.div
                    initial={{ opacity: 0, transform: 'translateY(60px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    exit={{ opacity: 0, transform: 'translateY(60px)' }}
                  >
                    <div className={styles.panel}>
                      <span className={styles.details}>
                        <span className={styles.value}>
                          {selectedList.length}
                        </span>
                        <span className={styles.label}>
                          Draft{selectedList.length > 1 ? 's' : ''} selected
                        </span>
                      </span>

                      <span className={styles.controls}>
                        <Button
                          capitalize
                          size="small"
                          variant="primary"
                          onClick={handleDeleteSelectedDrafts}
                        >
                          Delete
                        </Button>
                        <Button
                          capitalize
                          size="small"
                          variant="tertiary"
                          className={styles.dismiss}
                          onClick={handleDismiss}
                        >
                          Dismiss
                        </Button>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

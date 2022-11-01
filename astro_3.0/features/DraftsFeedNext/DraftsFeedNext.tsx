import React, { FC, useCallback, useMemo } from 'react';
import { useDraftsFeed } from 'astro_3.0/features/DraftsFeedNext/hooks';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';

import { CREATE_DRAFT_PAGE_URL } from 'constants/routing';

import { DraftProposalFeedItem } from 'types/draftProposal';
import { DaoContext } from 'types/context';

import { useWalletContext } from 'context/WalletContext';

import { DraftsPageHeader } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftsPageHeader';
import { DraftsFeedFilters } from 'astro_3.0/features/DraftsFeedNext/components/DraftsFeedFilters';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { Button } from 'components/button/Button';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { DraftCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard';
import { useMultiDraftActions } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/hooks';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import { ConfirmModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/ConfirmModal';
import { useModal } from 'components/modal';

import styles from './DraftsFeedNext.module.scss';

export interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const DraftsFeedNext: FC<Props> = ({ daoContext }) => {
  const router = useRouter();
  const { dao } = daoContext;
  const { t } = useTranslation();
  const { accountId } = useWalletContext();
  const isCouncil = isCouncilUser(dao, accountId);
  const {
    draftsData,
    handleLoadMore,
    hasMore,
    dataLength,
    isValidating,
    handleSearch,
    handleReset,
  } = useDraftsFeed();

  const {
    handleDelete,
    handleDismiss,
    handleSelect,
    list: selectedList,
  } = useMultiDraftActions();

  const [showModal] = useModal(ConfirmModal);

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

    draftsData?.data.forEach(draft => {
      if (draft.viewAccounts?.includes(accountId)) {
        read.push(draft);
      } else {
        unread.push(draft);
      }
    });

    return { unreadDrafts: unread, readDrafts: read };
  }, [accountId, draftsData?.data]);

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
        <title>Astro - {t('drafts.feed.headTitle')}</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1" />
      </Head>
      <DraftsPageHeader
        className={styles.header}
        loading={isValidating}
        onSearch={handleSearch}
        handleReset={handleReset}
      />
      <DraftsFeedFilters />
      <div className={styles.content}>
        <div className={styles.listWrapper}>
          {draftsData ? (
            <InfiniteScroll
              dataLength={dataLength}
              next={handleLoadMore}
              hasMore={hasMore}
              loader={<p className={styles.loading}>{t('loading')}...</p>}
              style={{ overflow: 'initial' }}
              endMessage={
                <div className={styles.loading}>
                  <NoResultsView
                    className={styles.noResults}
                    title={
                      isEmpty(draftsData?.data)
                        ? t('drafts.feed.noDrafts.title')
                        : t('noMoreResults')
                    }
                  >
                    {draftsData?.total === 0 &&
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
      </div>
    </div>
  );
};

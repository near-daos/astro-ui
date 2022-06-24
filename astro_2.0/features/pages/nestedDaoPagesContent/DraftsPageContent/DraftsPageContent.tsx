import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';

import { DaoContext } from 'types/context';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { FEED_CATEGORIES } from 'constants/proposals';

import { Button } from 'components/button/Button';
import { DraftsListHeader } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftsListHeader';
import { StateFilter } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/StateFilter';
import { DraftCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { useDraftsPageData } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/hooks';

import { CREATE_DRAFT_PAGE_URL } from 'constants/routing';

import { DraftsPageHeader } from './components/DraftsPageHeader';

import styles from './DraftsPageContent.module.scss';

export interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const DraftsPageContent: FC<Props> = ({ daoContext }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { dao } = daoContext;

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

  return (
    <div className={styles.root}>
      <DraftsPageHeader
        className={styles.header}
        loading={loading}
        onSearch={handleSearch}
        handleReset={handleReset}
      />
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
          <>
            {data ? (
              <div className={styles.listWrapper}>
                <DraftsListHeader />
                <FeedList
                  data={data}
                  loadMore={loadMore}
                  loader={<p className={styles.loading}>{t('loading')}...</p>}
                  noResults={
                    <div className={styles.loading}>
                      <NoResultsView
                        className={styles.noResults}
                        title={
                          isEmpty(data?.data)
                            ? t('drafts.noDrafts')
                            : t('noMoreResults')
                        }
                      >
                        {data?.total === 0 && (
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
                  renderItem={item => (
                    <div key={item.id} className={styles.cardWrapper}>
                      <DraftCard
                        data={item}
                        flag={dao.flagCover ?? ''}
                        daoId={dao.id}
                      />
                    </div>
                  )}
                  className={styles.listWrapper}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

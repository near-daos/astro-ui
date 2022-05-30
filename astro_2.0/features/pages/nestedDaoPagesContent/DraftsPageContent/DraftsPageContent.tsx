import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';
import { useAsyncFn, useMountedState } from 'react-use';
import { useRouter } from 'next/router';

import { DaoContext } from 'types/context';
import { PaginationResponse } from 'types/api';
import { DraftProposal } from 'types/draftProposal';

import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { useDraftsSearch } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftsPageHeader/hooks';
import { useWalletContext } from 'context/WalletContext';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { FEED_CATEGORIES } from 'constants/proposals';

import { StateFilter } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/StateFilter';
import { DraftCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DraftsPageHeader } from './components/DraftsPageHeader';

import styles from './DraftsPageContent.module.scss';

export interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  initialData: PaginationResponse<DraftProposal[]> | null;
}

export const DraftsPageContent: FC<Props> = ({
  initialData = null,
  daoContext,
}) => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const { accountId } = useWalletContext();

  const { dao } = daoContext;
  const { query } = router;

  const [draftsData, setDraftsData] = useState(initialData);

  const feedCategoriesOptions = useMemo(
    () =>
      FEED_CATEGORIES.map(item => ({
        ...item,
        label: t(item.label.toLowerCase()),
      })),
    [t]
  );

  const { handleSearch } = useDraftsSearch();

  const [{ loading }, fetchData] = useAsyncFn(
    async (_initialData?: typeof draftsData) => {
      let accumulatedListData = _initialData || null;

      const res = await SputnikHttpService.getDraftProposalsList({
        offset: accumulatedListData?.data.length || 0,
        limit: LIST_LIMIT_DEFAULT,
        daoId: dao?.id,
        category: query.category as string,
        accountId,
      });

      if (!res) {
        return null;
      }

      accumulatedListData = {
        ...res,
        data: [...(accumulatedListData?.data || []), ...(res.data || [])],
      };

      return accumulatedListData;
    },
    [draftsData?.data?.length, query.category, accountId, dao]
  );

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      const newDraftsData = await fetchData();

      if (isMounted()) {
        setDraftsData(newDraftsData);
      }

      window.scroll(0, 0);
    },
    1000,
    [query.category]
  );

  const loadMore = async () => {
    if (loading) {
      return;
    }

    const newDraftsData = await fetchData(draftsData);

    if (isMounted()) {
      setDraftsData(newDraftsData);
    }
  };

  return (
    <div className={styles.root}>
      <DraftsPageHeader
        className={styles.header}
        loading={loading}
        onSearch={handleSearch}
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
            {draftsData ? (
              <FeedList
                data={draftsData}
                loadMore={loadMore}
                loader={<p className={styles.loading}>{t('loading')}...</p>}
                noResults={
                  <div className={styles.loading}>
                    <NoResultsView
                      title={
                        isEmpty(draftsData?.data)
                          ? t('noResultsFound')
                          : t('noMoreResults')
                      }
                    />
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
            ) : (
              <NoResultsView title="No data found" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

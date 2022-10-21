import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import { useAsyncFn, useMountedState } from 'react-use';
import { useRouter } from 'next/router';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import Head from 'next/head';

// Types
import { DAO, DaoFeedItem } from 'types/dao';
import { PaginationResponse } from 'types/api';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import {
  ProposalCategories,
  ProposalFeedItem,
  ProposalsFeedStatuses,
} from 'types/proposal';

// Components
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { HeaderWithFilter } from 'astro_2.0/features/dao/HeaderWithFilter';
import { ProposalFilter } from 'astro_2.0/features/Proposals/components/ProposalFilter';
import { ListItem, SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';
import { SearchInput } from 'astro_2.0/components/SearchInput';
import { Chip } from 'astro_2.0/components/Chip';

// Hooks
import { useWalletContext } from 'context/WalletContext';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { getStatusFilterOptions } from 'astro_2.0/features/Proposals/helpers/getStatusFilterOptions';

// Services
import { SputnikHttpService } from 'services/sputnik';

// Constants
import { FEED_CATEGORIES } from 'constants/proposals';

import { getProposalsList } from 'features/proposal/helpers';

import styles from './FeedProposals.module.scss';

interface FeedProposalsProps {
  dao?: DAO;
  showFlag?: boolean;
  className?: string;
  title?: ReactNode | string;
  category?: ProposalCategories;
  headerClassName?: string;
  initialProposals: PaginationResponse<ProposalFeedItem[]> | null;
  initialProposalsStatusFilterValue: ProposalsFeedStatuses;
}

export const FeedProposals = ({
  dao,
  title,
  category,
  className,
  showFlag = true,
  headerClassName,
  initialProposals,
  initialProposalsStatusFilterValue,
}: FeedProposalsProps): JSX.Element => {
  const [chips, setChips] = useState<string[]>([]);
  const neighbourRef = useRef(null);
  const { query, replace, pathname } = useRouter();
  const { t } = useTranslation();
  const isMounted = useMountedState();

  const queries = query as ProposalsQueries;

  const status =
    (query.status as ProposalsFeedStatuses) ||
    initialProposalsStatusFilterValue ||
    ProposalsFeedStatuses.All;

  const isMyFeed = pathname.startsWith('/my');

  const { accountId } = useWalletContext();

  const [proposalsData, setProposalsData] = useState(initialProposals);

  const [loading, setLoading] = useState(false);

  const statusFilterOptions = useMemo(() => {
    const statuses = getStatusFilterOptions(isMyFeed, t);

    statuses.shift();

    return statuses;
  }, [isMyFeed, t]);

  const feedCategoriesOptions = useMemo(() => {
    const categories = FEED_CATEGORIES.map(item => ({
      ...item,
      label: t(item.label.toLowerCase()),
    }));

    categories.unshift({ label: t('all'), value: ProposalCategories.All });

    return categories;
  }, [t]);

  const [{ loading: proposalsSearchLoading }, fetchSearchProposals] =
    useAsyncFn(
      async (value: string) => {
        return SputnikHttpService.getProposalsByProposer({
          daoId: dao?.id,
          accountId,
          proposers: value,
        });
      },
      [dao, accountId]
    );

  const [{ loading: proposalsDataIsLoading }, fetchProposalsData] = useAsyncFn(
    async (initialData?: typeof proposalsData) => {
      let accumulatedListData = initialData || null;
      const proposers = chips.join(',');

      const res = await getProposalsList(
        accumulatedListData,
        status,
        category || queries.category,
        accountId,
        dao?.id ?? '',
        isMyFeed,
        proposers
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
    [
      proposalsData?.data?.length,
      status,
      queries.category,
      accountId,
      isMyFeed,
      chips,
    ]
  );

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      const newProposalsData = await fetchProposalsData();

      if (isMounted()) {
        setProposalsData(newProposalsData);
      }

      window.scroll(0, 0);
    },
    1000,
    [queries.category, status, chips]
  );

  const loadMore = async () => {
    if (proposalsDataIsLoading) {
      return;
    }

    const newProposalsData = await fetchProposalsData(proposalsData);

    if (isMounted()) {
      setProposalsData(newProposalsData);
    }
  };

  const onProposalFilterChange = async (key: string, value: string) => {
    const nextQuery = {
      ...queries,
      [key]: value as ProposalsFeedStatuses,
    } as ProposalsQueries;

    // We use custom loading flag here and not the existing proposalsDataIsLoading because
    // we want loader to be visible immediately once we click on radio button
    // which is not possible using existing proposalsDataIsLoading flag
    if (isMounted()) {
      setLoading(true);
    }

    await replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  function renderTitle() {
    if (isString(title)) {
      return <h1 className={styles.title}>{title}</h1>;
    }

    return title;
  }

  function renderResultItem(item: DaoFeedItem) {
    return (
      <button
        type="button"
        className={styles.resultItem}
        key={item as string}
        onClick={() => {
          const newChips = new Set(chips);

          newChips.add(item as string);
          setChips(Array.from(newChips));
        }}
      >
        {item}
      </button>
    );
  }

  return (
    <main className={cn(styles.root, className)}>
      <Head>
        <title>
          DAO Proposals - {status} - {queries.category}
        </title>
      </Head>
      <HeaderWithFilter
        classNameContainer={styles.headerWithFilterContainer}
        title={renderTitle()}
        titleRef={neighbourRef}
        className={cn(styles.statusFilterWrapper, headerClassName)}
      >
        <ProposalFilter
          labelClassName={styles.categoryLabel}
          className={styles.proposalFilter}
          neighbourRef={neighbourRef}
          value={queries.category || ProposalCategories.All}
          onChange={(value: string) =>
            onProposalFilterChange('category', value)
          }
          disabled={proposalsDataIsLoading}
          list={feedCategoriesOptions}
        />
      </HeaderWithFilter>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <SideFilter
            className={styles.sideFilter}
            queryName="status"
            list={statusFilterOptions as ListItem[]}
            title={t('feed.filters.chooseAFilter')}
            disabled={proposalsDataIsLoading}
            titleClassName={styles.statusFilterTitle}
            shallowUpdate
          />
          <div className={styles.filterByProposer}>
            <p className={styles.filterByProposerTitle}>
              {t('filterByProposer')}
            </p>
            <SearchInput
              offset={[0, 2]}
              inputClassName={styles.searchInput}
              placeholder="proposer.near"
              key={chips.length}
              showLoader={false}
              className={styles.searchInputWrapper}
              resultHintClassName={styles.resultHint}
              onSubmit={fetchSearchProposals}
              loading={proposalsSearchLoading}
              showResults
              renderResult={item => renderResultItem(item)}
            />
          </div>
        </div>
        <div className={styles.feedContainer}>
          {chips.length ? (
            <div className={styles.chips}>
              <span className={styles.chipsTitle}>
                <Trans
                  i18nKey="selectedProposals"
                  values={{
                    length: proposalsData?.total || 0,
                    plural: (proposalsData?.total || 0) > 1 ? 's' : '',
                  }}
                />
              </span>
              {chips.map(chip => (
                <Chip
                  key={chip}
                  className={styles.chip}
                  name={chip}
                  onRemove={() => {
                    setChips(chips.filter(ch => ch !== chip));
                  }}
                />
              ))}
            </div>
          ) : null}
          {loading ? (
            <Loader className={styles.loader} />
          ) : (
            <>
              {proposalsData && (
                <FeedList
                  data={proposalsData}
                  loadMore={loadMore}
                  loader={<p className={styles.loading}>{t('loading')}...</p>}
                  noResults={
                    <div className={styles.loading}>
                      <NoResultsView
                        title={
                          isEmpty(proposalsData?.data)
                            ? t('noProposalsHere')
                            : t('noMoreResults')
                        }
                      />
                    </div>
                  }
                  renderItem={(proposal, onSelect, selectedList) => (
                    <div
                      key={`${proposal.id}_${proposal.updatedAt}`}
                      className={styles.proposalCardWrapper}
                    >
                      <ViewProposal
                        proposal={proposal}
                        showFlag={showFlag}
                        onSelect={onSelect}
                        selectedList={selectedList}
                      />
                    </div>
                  )}
                  className={styles.listWrapper}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

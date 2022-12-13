import React, { VFC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DebouncedInput } from 'components/inputs/Input';
import { OpenSearchQuery } from 'services/SearchService/types';

import { Icon } from 'components/Icon';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Loader } from 'components/loader';
import { BountyContext } from 'types/bounties';
import { useBountiesInfiniteV2 } from 'services/ApiService/hooks/useBounties';
import { BountiesList } from './BountiesList';

import styles from './BountiesV2.module.scss';

const STATUS_LIST = {
  'In Progress': 'InProgress',
  Approved: 'Approved',
  Rejected: 'Rejected',
};

export type Filter = {
  daoId: string;
  tags: string[];
  statuses: {
    InProgress: boolean;
    Approved: boolean;
    Rejected: boolean;
  };
};

export const buildQuery = (filter: Filter): OpenSearchQuery => {
  const tagsQueries =
    filter.tags?.map(tag => ({
      match: {
        tags: tag,
      },
    })) ?? ([] as Record<string, unknown>[]);

  const statusQueries =
    Object.entries(filter.statuses)
      .filter(([, value]) => value)
      .map(([key]) => ({
        match: {
          proposalStatus: key,
        },
      })) ?? ([] as Record<string, unknown>[]);

  const query: OpenSearchQuery = {
    bool: {
      must: [
        {
          bool: {
            should: tagsQueries,
          },
        },
        {
          bool: {
            should: statusQueries,
          },
        },
      ],
    },
  };

  if (filter.daoId) {
    query.bool?.must?.push({
      match: {
        daoId: filter.daoId,
      },
    });
  }

  return query;
};

export const BountiesV2: VFC = () => {
  const [filter, setFilter] = useState<Filter>({
    daoId: '',
    tags: [],
    statuses: {
      InProgress: false,
      Approved: false,
      Rejected: true,
    },
  });

  const { size, setSize, data } = useBountiesInfiniteV2(buildQuery(filter));

  const handleLoadMore = () => setSize(size + 1);

  const bountiesContext =
    data?.reduce<BountyContext[]>((acc, item) => {
      acc.push(...item.data);

      return acc;
    }, []) ?? ([] as BountyContext[]);

  const hasMore = data ? bountiesContext.length < data[0].total : false;

  const dataLength = bountiesContext.length ?? 0;

  const renderContent = () => {
    if (!bountiesContext?.length) {
      return <NoResultsView title="no results" />;
    }

    return <BountiesList bountiesContext={bountiesContext} />;
  };

  return (
    <main className={styles.root}>
      <div className={styles.filter}>
        <h3>FILTERS</h3>
        <div className={styles.label}>DAO ID</div>
        <div className={styles.input}>
          <DebouncedInput
            onValueChange={val => {
              setFilter({ ...filter, daoId: val as string });
            }}
            size="block"
          />
        </div>

        <div className={styles.label}>Tags</div>
        <div className={styles.input}>
          <DebouncedInput
            onValueChange={val => {
              const tags = (val as string).trim();

              setFilter({ ...filter, tags: tags ? tags.split(',') : [] });
            }}
            size="block"
          />
        </div>
      </div>
      <h1 className={styles.title}>Bounties</h1>
      <div className={styles.quickFilter}>
        {Object.entries(STATUS_LIST).map(([key, value]) => {
          const status = value as keyof typeof filter.statuses;

          return (
            <button
              type="button"
              className={styles.item}
              onClick={() => {
                const { statuses } = filter;

                statuses[status] = !statuses[status];

                setFilter({ ...filter, statuses });
              }}
            >
              {filter.statuses[status] ? (
                <Icon name="check" className={styles.icon} />
              ) : (
                ''
              )}
              {key}
            </button>
          );
        })}
      </div>

      <div className={styles.bounties}>
        <InfiniteScroll
          dataLength={dataLength}
          next={handleLoadMore}
          hasMore={hasMore}
          loader={<Loader />}
          style={{ overflow: 'initial' }}
          endMessage=""
        >
          {renderContent()}
        </InfiniteScroll>
      </div>
    </main>
  );
};

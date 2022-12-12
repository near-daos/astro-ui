import React, { VFC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DebouncedInput } from 'components/inputs/Input';

import { useUpdateEffect } from 'react-use';

import axios from 'axios';
import { Icon } from 'components/Icon';
import { appConfig } from 'config';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Loader } from 'components/loader';
import {
  BountyIndex,
  OpenSearchQuery,
  OpenSearchResponse,
} from 'services/SearchService/types';
import { BountiesList } from './BountiesList';

import styles from './BountiesV2.module.scss';

const PAGING_SIZE = 50;

export type BountiesData = { total: number; bounties: BountyIndex[] };

export const fetchBounties = async (
  filter: Filter,
  from = 0
): Promise<BountiesData> => {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

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

  const res = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/bounty/_search`,
    {
      from,
      size: PAGING_SIZE,
      query,
      sort: {
        creatingTimeStamp: {
          order: 'desc',
        },
      },
    }
  );

  const bountyIndexes =
    res.data?.hits?.hits?.map(hit => {
      const { _source: rawBounty } = hit;

      return rawBounty;
    }) ?? [];

  return {
    total: res.data?.hits?.total.value,
    bounties: bountyIndexes as BountyIndex[],
  };
};

type Filter = {
  daoId: string;
  tags: string[];
  statuses: {
    InProgress: boolean;
    Approved: boolean;
    Rejected: boolean;
  };
};

const STATUS_LIST = {
  'In Progress': 'InProgress',
  Approved: 'Approved',
  Rejected: 'Rejected',
};

interface Props {
  initialData: BountiesData | null;
}

export const BountiesV2: VFC<Props> = ({ initialData }) => {
  const [bounties, setBounties] = useState<BountyIndex[]>(
    initialData?.bounties ?? []
  );

  const [error, setError] = useState();
  const [paginationTotal, setPaginationTotal] = useState(
    initialData?.total ?? 0
  );
  const [filter, setFilter] = useState<Filter>({
    daoId: '',
    tags: [],
    statuses: {
      InProgress: false,
      Approved: false,
      Rejected: false,
    },
  });

  useUpdateEffect(() => {
    fetchBounties(filter)
      .then(bountiesData => {
        setBounties(bountiesData.bounties);
        setPaginationTotal(bountiesData.total);
        setError(undefined);
      })
      .catch(err => {
        setError(err);
      });
  }, [filter]);

  const renderContent = () => {
    if (!bounties?.length) {
      return <NoResultsView title="no results" />;
    }

    if (error) {
      return <div>{JSON.stringify(error)}</div>;
    }

    return <BountiesList bounties={bounties} />;
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
          dataLength={bounties.length}
          next={async () => {
            const bountiesData = await fetchBounties(filter, bounties.length);

            setBounties(bounties.concat(bountiesData.bounties));
            setPaginationTotal(bountiesData.total);
            setError(undefined);
          }}
          hasMore={bounties.length < paginationTotal}
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

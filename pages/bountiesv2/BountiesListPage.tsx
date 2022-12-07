import React, { VFC, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import axios from 'axios';
import { appConfig } from 'config';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { BountiesList } from 'astro_3.0/features/Bounties/components/BountiesList';
import { Loader } from 'components/loader';
import { BountyIndex, OpenSearchResponse } from 'services/SearchService/types';

import { Icon } from 'components/Icon';

import styles from './BountiesListPage.module.scss';

const PAGING_SIZE = 50;

const fetch = (filter: Filter, from = 0) => {
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

  const query = {
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

  if (tagsQueries.length) {
    query.bool.must.push({
      bool: {
        should: tagsQueries,
      },
    });
  }

  return axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/bounty/_search`,
    {
      from,
      size: PAGING_SIZE,
      query,
    }
  );
};

type Filter = {
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

const BountiesListPage: VFC = () => {
  const [bounties, setBounties] = useState<BountyIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [filter, setFilter] = useState<Filter>({
    // tags: ['edwardtest'],
    tags: [],
    statuses: {
      InProgress: false,
      Approved: false,
      Rejected: false,
    },
  });

  useEffect(() => {
    fetch(filter)
      .then(res => {
        const bountyIndexes =
          res.data?.hits?.hits?.map(hit => {
            const { _source: rawBounty } = hit;

            return rawBounty;
          }) ?? ([] as BountyIndex[]);

        setBounties(bountyIndexes as BountyIndex[]);
        setPaginationTotal(res.data.hits.total.value);
        setLoading(false);
        setError(undefined);
      })
      .catch(err => {
        setError(err);
      });
  }, [filter]);

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

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
      <h1>Bounties</h1>
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

      <InfiniteScroll
        dataLength={bounties.length}
        next={async () => {
          const res = await fetch(filter, bounties.length);
          const bountyIndexes =
            res.data?.hits?.hits?.map(hit => {
              const { _source: rawBounty } = hit;

              return rawBounty;
            }) ?? ([] as BountyIndex[]);

          setBounties(bounties.concat(bountyIndexes as BountyIndex[]));
          setPaginationTotal(res.data.hits.total.value);
          setError(undefined);
        }}
        hasMore={bounties.length < paginationTotal}
        loader={<div>loading....</div>}
        style={{ overflow: 'initial' }}
        endMessage={<div>No more results</div>}
      >
        {renderContent()}
      </InfiniteScroll>
    </main>
  );
};

export default BountiesListPage;

import React, { VFC, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import axios from 'axios';
import { appConfig } from 'config';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { BountiesList } from 'astro_3.0/features/Bounties/components/BountiesList';
import { Loader } from 'components/loader';
import { BountyIndex, OpenSearchResponse } from 'services/SearchService/types';

import styles from './BountiesListPage.module.scss';

const PAGING_SIZE = 30;

const fetch = (filter: { tags: string[] }, from = 0) => {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const query = {
    bool: {
      should: filter.tags.map(tag => ({
        match: {
          tags: tag,
        },
      })) as Record<string, unknown>[],
    },
  };

  return axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/bounty/_search`,
    {
      from,
      size: PAGING_SIZE,
      query,
    }
  );
};

const filter = {
  tags: ['edwardtest', 'tag111'],
};

const BountiesListPage: VFC = () => {
  const [bounties, setBounties] = useState<BountyIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [paginationTotal, setPaginationTotal] = useState(0);

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
  }, []);

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
      <div>filter</div>

      <InfiniteScroll
        dataLength={bounties.length}
        next={async () => {
          setLoading(true);

          const res = await fetch(filter, bounties.length);
          const bountyIndexes =
            res.data?.hits?.hits?.map(hit => {
              const { _source: rawBounty } = hit;

              return rawBounty;
            }) ?? ([] as BountyIndex[]);

          setBounties(bounties.concat(bountyIndexes as BountyIndex[]));
          setPaginationTotal(res.data.hits.total.value);
          setLoading(false);
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

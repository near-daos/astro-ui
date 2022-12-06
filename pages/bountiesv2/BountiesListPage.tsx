import React, { VFC, useState, useEffect } from 'react';

import clsx from 'classnames';

import axios from 'axios';
import { appConfig } from 'config';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { BountiesList } from 'astro_3.0/features/Bounties/components/BountiesList';
import { Loader } from 'components/loader';
import { BountyIndex, OpenSearchResponse } from 'services/SearchService/types';

import styles from './BountiesListPage.module.scss';

function useBounties() {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const [bounties, setBounties] = useState<BountyIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const query = {
      bool: {
        should: [
          {
            match: {
              tags: 'edwardtest',
            },
          },
          // {
          //   match: {
          //     tags: 'tag22',
          //   },
          // },
        ] as Record<string, unknown>[],
      },
    };

    axios
      .post<unknown, { data: OpenSearchResponse }>(
        `${baseUrl}/bounty/_search`,
        {
          query,
        }
      )
      .then(res => {
        const bountyIndexes =
          res.data?.hits?.hits?.map(hit => {
            const { _source: rawBounty } = hit;

            return rawBounty;
          }) ?? ([] as BountyIndex[]);

        setBounties(bountyIndexes as BountyIndex[]);
        setLoading(false);
        setError(undefined);
      })
      .catch(err => {
        setError(err);
      });
  }, [baseUrl]);

  return { bounties, loading, error };
}

const BountiesListPage: VFC = () => {
  const { bounties, loading, error } = useBounties();

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
    <main className={clsx(styles.root)}>
      <h1>Bounties</h1>
      <div>filter</div>

      {renderContent()}
    </main>
  );
};

export default BountiesListPage;

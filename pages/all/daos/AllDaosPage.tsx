import React, { FC, useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';

import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import { Button } from 'components/button/Button';
import { CREATE_DAO_URL } from 'constants/routing';
import { Dropdown } from 'components/dropdown/Dropdown';
import { getDaosList } from 'features/daos/helpers';
import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails';

import { useAuthContext } from 'context/AuthContext';
import { useRouterLoading } from 'hooks/useRouterLoading';
import { useNearPrice } from 'hooks/useNearPrice';
import { Loader } from 'components/loader';

import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import styles from './AllDaosPage.module.scss';

const sortOptions = [
  {
    label: 'Most active',
    value: 'lastProposalId,DESC',
  },
  {
    label: 'Newest',
    value: 'createdAt,DESC',
  },
  {
    label: 'Oldest',
    value: 'createdAt,ASC',
  },
  {
    label: 'Biggest funds',
    value: 'amount,DESC',
  },
  {
    label: 'Number of members',
    value: 'numberOfMembers,DESC',
  },
];

interface BrowseAllDaosProps {
  data: DAO[];
  total: number;
}

const AllDaosPage: FC<BrowseAllDaosProps> = ({
  data: initialData = [],
  total: totalItemsAvailable,
}) => {
  const router = useRouter();
  const { accountId, login } = useAuthContext();
  const [createProposalForDao, setCreateProposalForDao] = useState<DAO | null>(
    null
  );

  const nearPrice = useNearPrice();

  const activeSort = (router.query.sort as string) ?? sortOptions[1].value;

  const [data, setData] = useState(initialData);
  const [hasMore, setHasMore] = useState(
    initialData.length !== totalItemsAvailable
  );

  const getMoreDaos = async () => {
    const { daos: newData, total } = await getDaosList({
      offset: data.length,
      limit: 20,
      sort: (router.query.sort as string) ?? '',
    });

    if (data.length + newData.length === total) {
      setHasMore(false);
    }

    setData(existingData => [...existingData, ...newData]);
  };

  const handleSort = useCallback(
    async value => {
      router.push(`?sort=${value}`, undefined, { shallow: true });

      if (value === 'lastProposalId,DESC') {
        // todo - this is not working , we have to decide how to get most active
        const sorted = data.sort((a, b) => {
          if (a.proposals > b.proposals) return -1;

          if (a.proposals < b.proposals) return 1;

          return 0;
        });

        setData(sorted);
      } else {
        const res = await getDaosList({
          sort: `${value}`,
          offset: 0,
          limit: 20,
        });

        setHasMore(res.daos.length !== res.total);
        setData(res.daos);
      }
    },
    [data, router]
  );

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  const isLoading = useRouterLoading();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>All DAOs</h1>
        <Button variant="black" size="small" onClick={handleCreateDao}>
          Create new DAO
        </Button>
      </div>

      {createProposalForDao && (
        <CreateProposal
          key={createProposalForDao?.id}
          dao={createProposalForDao}
          proposalVariant={ProposalVariant.ProposeTransfer}
          onCreate={isSuccess => {
            if (isSuccess) {
              setCreateProposalForDao(null);
            }
          }}
          onClose={() => {
            setCreateProposalForDao(null);
          }}
        />
      )}

      <div className={styles.filter}>
        <Dropdown
          options={sortOptions}
          value={activeSort}
          defaultValue={activeSort}
          onChange={handleSort}
        />
      </div>
      <InfiniteScroll
        dataLength={data.length}
        next={getMoreDaos}
        hasMore={hasMore}
        loader={<h4 className={styles.loading}>Loading...</h4>}
        style={{ overflow: 'initial' }}
        endMessage={
          <p className={styles.loading}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className={styles.content}>
          {data.map(item => {
            return (
              <DaoDetailsGrid
                key={item.id}
                dao={item}
                activeProposals={item.activeProposalsCount}
                totalProposals={item.totalProposalsCount}
                nearPrice={nearPrice}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AllDaosPage;

import React, { FC, useCallback, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import { TFunction, useTranslation } from 'next-i18next';

import { DaoFeedItem } from 'types/dao';

import { DaosList } from 'astro_2.0/components/DaosList';
import { Dropdown } from 'components/Dropdown';
import { Checkbox } from 'components/inputs/Checkbox';
import { getDaosList } from 'features/daos/helpers';
import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails';
import { FiltersPanel } from 'astro_2.0/components/FiltersPanel';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';

import { useRouterLoading } from 'hooks/useRouterLoading';

import styles from './AllDaosPage.module.scss';

function getSortOptions(t: TFunction) {
  return [
    {
      label: t('allDAOsFilter.mostActive'),
      value: 'totalProposalCount,DESC',
    },
    {
      label: t('allDAOsFilter.newest'),
      value: 'createdAt,DESC',
    },
    {
      label: t('allDAOsFilter.oldest'),
      value: 'createdAt,ASC',
    },
    {
      label: t('allDAOsFilter.biggestFunds'),
      value: 'totalDaoFunds,DESC',
    },
    {
      label: t('allDAOsFilter.numberOfMembers'),
      value: 'numberOfMembers,DESC',
    },
  ];
}

interface BrowseAllDaosProps {
  data: DaoFeedItem[];
  total: number;
}

const AllDaosPage: FC<BrowseAllDaosProps> = ({
  data: initialData = [],
  total: totalItemsAvailable,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const sortOptions = useMemo(() => getSortOptions(t), [t]);

  const activeSort = (router.query.sort as string) ?? sortOptions[1].value;
  const daosView = (router.query.daosView as string) ?? 'active';

  const [data, setData] = useState(initialData);
  const [hasMore, setHasMore] = useState(
    initialData.length !== totalItemsAvailable
  );

  const getMoreDaos = async () => {
    const { daos: newData, total } = await getDaosList({
      offset: data.length,
      limit: 20,
      sort: (router.query.sort as string) ?? '',
      filter:
        daosView === 'active'
          ? 'status||$eq||Active'
          : 'status||$in||Active,Inactive',
    });

    if (data.length + newData.length === total) {
      setHasMore(false);
    }

    setData(existingData => [...existingData, ...newData]);
  };

  const handleSort = useCallback(
    async value => {
      router.push(`?sort=${value}`);

      const res = await getDaosList({
        sort: `${value}`,
        offset: 0,
        limit: 20,
      });

      setHasMore(res.daos.length !== res.total);
      setData(res.daos);
    },
    [router]
  );

  const onDaosViewChange = async (value: string) => {
    const nextQuery = {
      ...router.query,
      daosView: value,
    };

    await router.replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: false, scroll: false }
    );
  };

  const isLoading = useRouterLoading();

  return (
    <DaosList label="allDaos">
      <div className={styles.filter}>
        <Dropdown
          options={sortOptions}
          value={activeSort}
          defaultValue={activeSort}
          onChange={handleSort}
        />
        <FiltersPanel>
          <div className={styles.filtersWrapper}>
            <Checkbox
              onClick={() =>
                onDaosViewChange(daosView === 'active' ? 'all' : 'active')
              }
              label="Show active DAOs only"
              className={styles.checkbox}
              checked={daosView === 'active'}
            />
            <Tooltip
              placement="top"
              className={styles.iconWrapper}
              popupClassName={styles.popupWrapper}
              overlay={
                <div className={styles.tooltip}>
                  What are the rules for an &lsquo;active DAO&rsquo;?
                  <br />
                  <ul>
                    <li>More than one member</li>
                    <li>More than one proposal in the last month</li>
                    <li>
                      More than one transfer into the DAO wallet (FT or NFT) in
                      the last month
                    </li>
                  </ul>
                </div>
              }
            >
              <Icon name="info" className={styles.icon} />
            </Tooltip>
          </div>
        </FiltersPanel>
      </div>
      <InfiniteScroll
        dataLength={data.length}
        next={getMoreDaos}
        hasMore={hasMore}
        loader={<h4 className={styles.loading}>{t('loading')}...</h4>}
        style={{ overflow: 'initial' }}
        endMessage={
          <p className={styles.loading}>
            <b>{t('youHaveSeenItAll')}</b>
          </p>
        }
      >
        <div className={styles.daosList}>
          {data.map(item => {
            return (
              <DaoDetailsGrid
                loading={isLoading}
                key={item.id}
                dao={item}
                activeProposals={item.activeProposalCount}
                totalProposals={item.totalProposalCount}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </DaosList>
  );
};

export default AllDaosPage;

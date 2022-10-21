import React, { FC, useCallback, useMemo, useState } from 'react';
import styles from 'pages/all/daos/AllDaosPage.module.scss';
import { Dropdown } from 'components/Dropdown';
import { FiltersPanel } from 'astro_2.0/components/FiltersPanel';
import { Checkbox } from 'components/inputs/Checkbox';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails';
import { TFunction, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { DaoFeedItem } from 'types/dao';
import { getDaosList, getFilterValue } from 'features/daos/helpers';
import { useRouterLoading } from 'hooks/useRouterLoading';

function getSortOptions(t: TFunction) {
  return [
    {
      label: t('allDAOsFilter.mostActive'),
      value: 'totalProposalCount,DESC',
    },
    {
      label: t('allDAOsFilter.newest'),
      value: 'createTimestamp,DESC',
    },
    {
      label: t('allDAOsFilter.oldest'),
      value: 'createTimestamp,ASC',
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

interface Props {
  data: DaoFeedItem[];
  total: number;
}

export const Daos: FC<Props> = ({
  data: initialData = [],
  total: totalItemsAvailable,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const sortOptions = useMemo(() => getSortOptions(t), [t]);

  const activeSort = (router.query.sort as string) ?? sortOptions[1].value;
  const daosView = (router.query.daosView as string) ?? 'active';

  const [data, setData] = useState({
    data: initialData,
    total: totalItemsAvailable,
  });

  const [{ loading }, fetchData] = useAsyncFn(
    async (
      view: string,
      sort: string,
      initData?: { data: DaoFeedItem[]; total: number }
    ) => {
      let accumulatedListData = initData || null;

      const { daos, total } = await getDaosList({
        offset: initData ? initData.data.length : 0,
        limit: 20,
        sort,
        filter: getFilterValue(false, view),
      });

      accumulatedListData = {
        total,
        data: [...(accumulatedListData?.data || []), ...(daos || [])],
      };

      return accumulatedListData;
    },
    []
  );

  const getMoreDaos = async () => {
    const newData = await fetchData(daosView, activeSort, data);

    setData(newData);
  };

  const handleSort = useCallback(
    async value => {
      const nextQuery = {
        ...router.query,
        sort: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      );

      const newData = await fetchData(daosView, nextQuery.sort);

      setData(newData);
    },
    [daosView, fetchData, router]
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
      { shallow: true, scroll: false }
    );

    const newData = await fetchData(nextQuery.daosView, activeSort);

    setData(newData);
  };

  const isLoading = useRouterLoading() || loading;

  return (
    <>
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
        dataLength={data.data.length}
        next={getMoreDaos}
        hasMore={data.data.length < data.total}
        loader={<h4 className={styles.loading}>{t('loading')}...</h4>}
        style={{ overflow: 'initial' }}
        endMessage={
          <p className={styles.loading}>
            <b>{t('youHaveSeenItAll')}</b>
          </p>
        }
      >
        <div className={styles.daosList}>
          {data.data.map(item => {
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
    </>
  );
};

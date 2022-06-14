import React, { useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import useQuery from 'hooks/useQuery';
import { useCfcLibraryData } from 'astro_2.0/features/pages/cfcLibrary/hooks';

import { TemplatesList } from 'astro_2.0/features/pages/cfcLibrary/components/TemplatesList';
import { SearchInput } from 'astro_2.0/components/SearchInput';
import { Dropdown } from 'components/Dropdown';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import styles from './CfcLibraryPage.module.scss';

function getSortOptions(t: TFunction) {
  return [
    {
      label: t('allDAOsFilter.newest'),
      value: 'createdAt,DESC',
    },
    {
      label: t('allDAOsFilter.oldest'),
      value: 'createdAt,ASC',
    },
  ];
}

const CfcLibraryPage: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const sortOptions = useMemo(() => getSortOptions(t), [t]);

  const { query } = useQuery<{ sort: string; view: string }>();
  const { sort } = query;

  const handleSort = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        sort: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: false, scroll: false }
      );
    },
    [query, router]
  );

  const {
    data,
    handleSearch,
    loading,
    loadMore,
    handleReset,
  } = useCfcLibraryData();

  return (
    <div className={styles.root}>
      <Head>
        <title>DAO Custom FC Templates</title>
      </Head>
      <div className={styles.header}>
        <h1>{t('cfcLibrary')}</h1>
        <p className={styles.description}>{t('cfcLibraryDesc')}</p>
        <SearchInput
          onSubmit={handleSearch}
          onClose={handleReset}
          loading={loading}
          placeholder="Search by template name"
          showResults={false}
          className={styles.search}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.filters}>
          <div className={styles.sorting}>
            <span className={styles.label}>Sorting by:</span>
            <Dropdown
              disabled={!data?.data?.length}
              controlClassName={styles.dropdown}
              menuClassName={styles.menu}
              options={sortOptions}
              value={sort ?? sortOptions[0].value}
              defaultValue={sort ?? sortOptions[0].value}
              onChange={handleSort}
            />
          </div>
        </div>
        <div className={styles.content}>
          {data && data.data.length > 0 ? (
            <TemplatesList
              total={data.total}
              data={data.data}
              next={loadMore}
            />
          ) : (
            <NoResultsView title="No data found" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CfcLibraryPage;

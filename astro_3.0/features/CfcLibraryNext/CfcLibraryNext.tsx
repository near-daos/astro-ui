import React, { FC, useMemo } from 'react';
import Head from 'next/head';
import { TFunction, useTranslation } from 'next-i18next';

import { useWalletContext } from 'context/WalletContext';

import { CfcLibraryContext } from 'astro_2.0/features/pages/cfcLibrary';

import { Loader } from 'components/loader';
import { TemplatesList } from 'astro_2.0/features/pages/cfcLibrary/components/TemplatesList';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Dropdown } from 'components/Dropdown';
import { SearchInput } from 'astro_2.0/components/SearchInput';

import { useAccountDaos } from 'services/ApiService/hooks/useAccountDaos';
import { useCfcFeed } from 'astro_3.0/features/CfcLibraryNext/hooks';

import useQuery from 'hooks/useQuery';

import styles from './CfcLibraryNext.module.scss';

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

export const CfcLibraryNext: FC = () => {
  const { t } = useTranslation();
  const { data: accountDaos } = useAccountDaos();
  const { accountId } = useWalletContext();
  const sortOptions = useMemo(() => getSortOptions(t), [t]);
  const { query } = useQuery<{ sort: string; view: string }>();
  const { sort } = query;

  const {
    isValidating: loading,
    templatesData: data,
    dataLength,
    handleLoadMore,
    hasMore,
    // handleFilterChange,
    mutate,
    handleSearch,
    handleReset,
    handleSort,
  } = useCfcFeed();

  const contextValue = useMemo(() => {
    return {
      accountDaos: accountDaos?.filter(item => item.isCouncil) ?? [],
      accountId,
      onUpdate: () => mutate(),
    };
  }, [accountDaos, accountId, mutate]);

  function renderContent() {
    if (loading && !dataLength) {
      return <Loader />;
    }

    if (data && dataLength > 0) {
      return (
        <TemplatesList
          total={data.total}
          data={data.data}
          next={handleLoadMore}
          hasMore={hasMore}
          dataLength={dataLength}
        />
      );
    }

    return <NoResultsView title={t('noDataFound')} />;
  }

  return (
    <div className={styles.root}>
      <Head>
        <title>DAO Custom FC Templates</title>
      </Head>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('actionsLibrary')}</h1>
        <SearchInput
          onSubmit={handleSearch}
          onClose={handleReset}
          loading={loading}
          placeholder={t('actions.searchByTemplate')}
          showResults={false}
          className={styles.search}
        />
      </div>
      <p className={styles.description}>{t('actions.libraryDesc')}</p>

      <div className={styles.body}>
        <div className={styles.filters}>
          <div className={styles.sorting}>
            <span className={styles.label}>{t('actions.sorting')}:</span>
            <Dropdown
              disabled={!dataLength}
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
          <CfcLibraryContext.Provider value={contextValue}>
            {renderContent()}
          </CfcLibraryContext.Provider>
        </div>
      </div>
    </div>
  );
};

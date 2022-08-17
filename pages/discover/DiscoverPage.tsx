import React, { ReactNode, useCallback, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Button } from 'components/button/Button';
import { SearchInput } from 'astro_2.0/components/SearchInput';
import { ContentPanel } from 'astro_2.0/features/Discover/components/ContentPanel';
import { GeneralInfo } from 'astro_2.0/features/Discover/components/GeneralInfo';
import { UsersAndActivity } from 'astro_2.0/features/Discover/components/UsersAndActivity';
import { Governance } from 'astro_2.0/features/Discover/components/Governance';
import { Flow } from 'astro_2.0/features/Discover/components/Flow';
import { Tvl } from 'astro_2.0/features/Discover/components/Tvl';
import { Tokens } from 'astro_2.0/features/Discover/components/Tokens';
import { SelectedDaoDetails } from 'astro_2.0/features/Discover/components/SelectedDaoDetails';
import { TopicsFilter } from 'astro_2.0/features/Discover/components/TopicsFilter';
import { DiscoverPageProvider } from 'astro_2.0/features/Discover/components/DiscoverPageContext/DiscoverPageContext';
import { DaoStatsDataProvider } from 'astro_2.0/features/Discover/DaoStatsDataProvider';
import { useDaoSearch } from 'astro_2.0/features/Discover/hooks';

import { CREATE_DAO_URL } from 'constants/routing';

import { DaoStatsTopics } from 'astro_2.0/features/Discover/constants';
import useQuery from 'hooks/useQuery';

import { WalletType } from 'types/config';
import { useWalletContext } from 'context/WalletContext';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { Page } from 'pages/_app';

import styles from './DiscoverPage.module.scss';

const DiscoverPage: Page = () => {
  const { t } = useTranslation();
  const { accountId, login } = useWalletContext();
  const router = useRouter();
  const { query } = router;
  const topic = query.topic as string;

  const { loading, handleSearch } = useDaoSearch();

  const { query: searchQuery, updateQuery } = useQuery<{
    dao: string;
  }>({ shallow: true });

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login(WalletType.NEAR)),
    [login, router, accountId]
  );

  useEffect(() => {
    if (!topic) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...query,
            topic: DaoStatsTopics.GENERAL_INFO,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [query, router, topic]);

  function renderContent() {
    switch (topic) {
      case DaoStatsTopics.GENERAL_INFO: {
        return <GeneralInfo />;
      }
      case DaoStatsTopics.USERS_AND_ACTIVITY: {
        return <UsersAndActivity />;
      }
      case DaoStatsTopics.GOVERNANCE: {
        return <Governance />;
      }
      case DaoStatsTopics.FLOW: {
        return <Flow />;
      }
      case DaoStatsTopics.TVL: {
        return <Tvl />;
      }
      case DaoStatsTopics.TOKENS: {
        return <Tokens />;
      }
      default: {
        return null;
      }
    }
  }

  if (!topic) {
    return null;
  }

  return (
    <DaoStatsDataProvider>
      <Head>
        <title>Discovery</title>
      </Head>

      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.row}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>{t('daosAndUsers')}</h1>

              <Button variant="black" size="small" onClick={handleCreateDao}>
                {t('createNewDao')}
              </Button>
            </div>

            <SearchInput
              key={searchQuery.dao}
              placeholder={t('discover.searchDaoName')}
              className={styles.search}
              onSubmit={handleSearch}
              showResults
              loading={loading}
              renderResult={res => {
                return (
                  <Button
                    key={res.id}
                    variant="transparent"
                    size="block"
                    onClick={() => updateQuery('dao', res.id)}
                  >
                    <div className={styles.searchResult}>
                      {res.name ?? res.id}
                    </div>
                  </Button>
                );
              }}
            />
          </div>

          <SelectedDaoDetails />
        </div>

        <div className={styles.sidebar}>
          <TopicsFilter />
        </div>

        <div className={styles.body}>
          <ContentPanel title={t(`discover.${topic}`)}>
            <DiscoverPageProvider>{renderContent()}</DiscoverPageProvider>
          </ContentPanel>
        </div>
      </div>
    </DaoStatsDataProvider>
  );
};

DiscoverPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default DiscoverPage;

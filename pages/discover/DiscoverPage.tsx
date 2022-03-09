import { NextPage } from 'next';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useMedia } from 'react-use';

import { Button } from 'components/button/Button';
import { SearchInput } from 'astro_2.0/components/SearchInput';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { ContentPanel } from 'astro_2.0/features/Discover/components/ContentPanel';
import { GeneralInfo } from 'astro_2.0/features/Discover/components/GeneralInfo';

import { useDaoSearch } from 'astro_2.0/features/Discover/hooks';
import { useAuthContext } from 'context/AuthContext';

import { CREATE_DAO_URL } from 'constants/routing';

import styles from './DiscoverPage.module.scss';

const DiscoverPage: NextPage = () => {
  const { t } = useTranslation();
  const { accountId, login } = useAuthContext();
  const router = useRouter();
  const { query } = router;
  const topic = query.topic as string;
  const isMobile = useMedia('(max-width: 1280px)');

  const { loading, handleSearch } = useDaoSearch();

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  const [overviewOptions, financialOptions] = useMemo(() => {
    let overview = [
      {
        label: t('discover.generalInfo'),
        value: 'generalInfo',
      },
      {
        label: t('discover.usersAndActivity'),
        value: 'usersAndActivity',
      },
      {
        label: t('discover.governance'),
        value: 'governance',
      },
    ];

    let financial = [
      {
        label: t('discover.flow'),
        value: 'flow',
      },
      {
        label: t('discover.tvl'),
        value: 'tvl',
      },
      {
        label: t('discover.tokens'),
        value: 'tokens',
      },
    ];

    if (isMobile) {
      overview = [...overview, ...financial];
      financial = [];
    }

    return [overview, financial];
  }, [isMobile, t]);

  useEffect(() => {
    if (!topic) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...query,
            topic: 'generalInfo',
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
      case 'generalInfo': {
        return <GeneralInfo />;
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
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{t('discover.title')}</h1>
          <Button variant="black" size="small" onClick={handleCreateDao}>
            {t('createNewDao')}
          </Button>
        </div>

        <SearchInput
          placeholder="Search DAO name"
          className={styles.search}
          onSubmit={handleSearch}
          showResults
          loading={loading}
        />
      </div>
      <div className={styles.sidebar}>
        <SideFilter
          shallowUpdate
          hideAllOption
          queryName="topic"
          list={overviewOptions}
          title={t('discover.overview')}
          titleClassName={styles.sideFilterTitle}
          className={styles.sideFilter}
        />
        {financialOptions.length > 0 && (
          <SideFilter
            shallowUpdate
            hideAllOption
            queryName="topic"
            list={financialOptions}
            title={t('discover.financial')}
            titleClassName={styles.sideFilterTitle}
            className={cn(styles.sideFilter, styles.financialFilter)}
          />
        )}
      </div>
      <div className={styles.body}>
        <ContentPanel title={t(`discover.${topic}`)}>
          {renderContent()}
        </ContentPanel>
      </div>
    </div>
  );
};

export default DiscoverPage;

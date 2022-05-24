import React, { FC, useCallback, useMemo } from 'react';
import { TFunction, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { Dropdown } from 'components/Dropdown';
import { SearchInput } from 'astro_2.0/components/SearchInput';

import useQuery from 'hooks/useQuery';

import { PaginationResponse } from 'types/api';

import styles from './DraftsPageHeader.module.scss';

interface Props {
  className?: string;
  onSearch: (val: string) => Promise<PaginationResponse<unknown[]> | null>;
  loading: boolean;
}

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

export const DraftsPageHeader: FC<Props> = ({
  className,
  onSearch,
  loading,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const sortOptions = useMemo(() => getSortOptions(t), [t]);

  const { query } = useQuery<{ sort: string; view: string }>();
  const { sort, view } = query;

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

      // trigger on sort
    },
    [query, router]
  );

  const handleView = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        view: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: false, scroll: false }
      );

      // trigger on sort
    },
    [query, router]
  );

  function renderTabButton(label: string, value: string) {
    return (
      <Button
        variant="transparent"
        size="small"
        onClick={() => handleView(value)}
        className={cn(styles.tabBtn, {
          [styles.active]: view ? view === value : value === 'all',
        })}
      >
        {label}
      </Button>
    );
  }

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.title}>Drafts</div>
      <div className={styles.search}>
        <SearchInput
          onSubmit={onSearch}
          loading={loading}
          placeholder="Search by name or hashtags"
        />
      </div>
      <div className={styles.tabs}>
        {renderTabButton('All', 'all')}
        {renderTabButton('Unread', 'unread')}
        {renderTabButton('Saved', 'saved')}
      </div>
      <div className={styles.sorting}>
        <Dropdown
          options={sortOptions}
          value={sort}
          defaultValue={sort ?? sortOptions[0].value}
          onChange={handleSort}
        />
      </div>
    </div>
  );
};

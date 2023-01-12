import React, { FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useQuery from 'hooks/useQuery';

import { Dropdown } from 'components/Dropdown';

import styles from './FeedSort.module.scss';

interface Props {
  field?: string;
}

export const FeedSort: FC<Props> = ({ field = 'creatingTimeStamp' }) => {
  const router = useRouter();

  const { t } = useTranslation();
  const { query } = useQuery<{ sort: string }>();
  const { sort } = query;

  const sortOptions = useMemo(() => {
    return [
      {
        label: t('allDAOsFilter.newest'),
        value: `${field},DESC`,
      },
      {
        label: t('allDAOsFilter.oldest'),
        value: `${field},ASC`,
      },
    ];
  }, [field, t]);

  const handleSort = useCallback(
    async (value: string) => {
      const nextQuery = {
        ...query,
        sort: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      );
    },
    [query, router]
  );

  return (
    <div className={styles.root}>
      <Dropdown
        disabled={false}
        className={styles.dropdownWrapper}
        controlIcon="sort"
        controlIconClassName={styles.controlIcon}
        controlClassName={styles.dropdown}
        menuClassName={styles.menu}
        selectedClassName={styles.selectedItem}
        options={sortOptions}
        value={sort ?? sortOptions[0].value}
        defaultValue={sort ?? sortOptions[0].value}
        onChange={handleSort}
      />
    </div>
  );
};

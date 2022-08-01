import React, { FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useQuery from 'hooks/useQuery';

import { Dropdown } from 'components/Dropdown';

import styles from './ProposalsFeedSort.module.scss';

export const ProposalsFeedSort: FC = () => {
  const router = useRouter();

  const { t } = useTranslation();
  const { query } = useQuery<{ sort: string }>();
  const { sort } = query;

  const sortOptions = useMemo(() => {
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
  }, [t]);

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
        options={sortOptions}
        value={sort ?? sortOptions[0].value}
        defaultValue={sort ?? sortOptions[0].value}
        onChange={handleSort}
      />
    </div>
  );
};

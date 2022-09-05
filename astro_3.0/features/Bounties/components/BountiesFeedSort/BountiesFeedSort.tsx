import React, { FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import useQuery from 'hooks/useQuery';

import { Dropdown } from 'components/Dropdown';

import styles from './BountiesFeedSort.module.scss';

export const BountiesFeedSort: FC = () => {
  const router = useRouter();

  const { query } = useQuery<{ bountySort: string }>();
  const { bountySort } = query;

  const sortOptions = useMemo(() => {
    return [
      {
        label: 'Newest',
        value: 'createdAt,DESC',
      },
      {
        label: 'Oldest',
        value: 'createdAt,ASC',
      },
    ];
  }, []);

  const handleSort = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        bountySort: value,
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
        value={bountySort ?? sortOptions[0].value}
        defaultValue={bountySort ?? sortOptions[0].value}
        onChange={handleSort}
      />
    </div>
  );
};

import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import useQuery from 'hooks/useQuery';

import { Dropdown } from 'components/Dropdown';

import styles from './SortMenu.module.scss';

interface Props {
  sortFieldName: string;
  sortOptions: {
    label: string;
    value: string;
  }[];
}

export const SortMenu: FC<Props> = ({ sortOptions, sortFieldName }) => {
  const router = useRouter();
  const { query } = useQuery<Record<string, string>>();
  const { [sortFieldName]: sort } = query;

  const handleSort = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        [sortFieldName]: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      );
    },
    [query, router, sortFieldName]
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

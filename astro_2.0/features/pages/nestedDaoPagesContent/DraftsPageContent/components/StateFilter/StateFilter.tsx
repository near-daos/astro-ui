import React, { FC, useCallback } from 'react';
import useQuery from 'hooks/useQuery';
import { useRouter } from 'next/router';

import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';

import styles from './StateFilter.module.scss';

const options = [
  {
    label: 'All',
    component: <span className={styles.option}>All</span>,
  },
  {
    label: 'Open',
    component: <span className={styles.option}>Open</span>,
  },
  {
    label: 'Closed',
    component: <span className={styles.option}>Closed</span>,
  },
];

export const StateFilter: FC = () => {
  const router = useRouter();
  const { query } = useQuery<{ state: string }>();
  const { state } = query;

  const handleChange = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        state: value,
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

  return (
    <div className={styles.root}>
      <div className={styles.title}>Filter by accessibility</div>
      <div>
        <DropdownSelect
          options={options}
          onChange={handleChange}
          defaultValue={state || 'All'}
        />
      </div>
    </div>
  );
};

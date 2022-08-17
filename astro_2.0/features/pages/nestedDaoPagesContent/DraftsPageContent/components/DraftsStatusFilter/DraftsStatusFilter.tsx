import React, { FC, useCallback, useMemo } from 'react';
import useQuery from 'hooks/useQuery';
import { useRouter } from 'next/router';
import { Dropdown } from 'components/Dropdown';

import styles from './DraftsStatusFilter.module.scss';

export const DraftsStatusFilter: FC = () => {
  const router = useRouter();
  const { query } = useQuery<{ state: string }>();
  const { state } = query;

  const options = useMemo(
    () => [
      {
        value: 'all',
        label: 'All',
      },
      {
        value: 'open',
        label: 'On discussion',
      },
      {
        value: 'closed',
        label: 'Converted to proposal',
      },
    ],
    []
  );

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
      <Dropdown
        disabled={false}
        selectedClassName={styles.selectedClassName}
        className={styles.dropdownWrapper}
        controlIcon="listFilter"
        controlIconClassName={styles.controlIcon}
        controlClassName={styles.dropdown}
        menuClassName={styles.menu}
        options={options}
        value={state ?? options[0].value}
        defaultValue={state ?? options[0].value}
        onChange={handleChange}
      />
    </div>
  );
};

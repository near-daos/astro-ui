import React, { useCallback, VFC } from 'react';
import { useRouter } from 'next/router';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Icon } from 'components/Icon';

import styles from './type-filter.module.scss';

const TypeFilter: VFC = () => {
  const router = useRouter();
  const FILTER_OPTIONS = [
    {
      label: 'All proposals',
      component: <div className={styles.all}>All Proposals</div>
    },
    {
      label: 'Governance',
      component: <div className={styles.all}>Governance</div>
    },
    {
      label: 'Financial',
      component: <div className={styles.all}>Financial</div>
    },
    {
      label: 'Bounties',
      component: <div className={styles.all}>Bounties</div>
    },
    {
      label: 'Polls',
      component: <div className={styles.all}>Polls</div>
    },
    {
      label: 'Groups',
      component: <div className={styles.all}>Groups</div>
    }
  ];

  const handleFilterChange = useCallback(
    ({ type }) => {
      router.push({
        pathname: '',
        query: {
          ...router.query,
          type
        }
      });
    },
    [router]
  );

  return (
    <DropdownSelect
      placeholder="Filter by"
      controlIcon={<Icon name="filter" className={styles.icon} />}
      defaultValue={(router.query.type as string) || 'All proposals'}
      options={FILTER_OPTIONS}
      onChange={value => handleFilterChange({ type: value })}
    />
  );
};

export default TypeFilter;

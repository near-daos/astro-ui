import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import React, { useCallback, VFC } from 'react';

import { Icon } from 'components/Icon';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';

import styles from './status-filter.module.scss';

const StatusFilter: VFC = () => {
  const DEFAULT_FILTER = 'Active proposals';

  const router = useRouter();
  const FILTER_OPTIONS = [
    {
      label: 'All',
      component: <div className={styles.all}>All</div>
    },
    {
      label: DEFAULT_FILTER,
      component: <div className={styles.activeProposals}>Active proposals</div>
    },
    {
      label: 'Approved',
      component: <div className={styles.approvedProposals}>Approved</div>
    },
    {
      label: 'Failed',
      component: <div className={styles.failedProposals}>Failed</div>
    }
  ];

  const handleFilterChange = useCallback(
    ({ status }) => {
      router.push({
        pathname: '',
        query: {
          ...router.query,
          status
        }
      });
    },
    [router]
  );

  useMount(() => {
    if (!router.query.status) {
      handleFilterChange({ status: DEFAULT_FILTER });
    }
  });

  return (
    <DropdownSelect
      placeholder="Filter by"
      controlIcon={<Icon name="filter" className={styles.icon} />}
      defaultValue={(router.query.status as string) || DEFAULT_FILTER}
      options={FILTER_OPTIONS}
      onChange={value => handleFilterChange({ status: value })}
    />
  );
};

export default StatusFilter;

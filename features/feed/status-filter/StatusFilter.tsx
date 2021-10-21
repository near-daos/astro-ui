import React, { useCallback, VFC } from 'react';
import { useRouter } from 'next/router';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Icon } from 'components/Icon';

import styles from './status-filter.module.scss';

const StatusFilter: VFC = () => {
  const router = useRouter();
  const FILTER_OPTIONS = [
    {
      label: 'All',
      component: <div className={styles.all}>All</div>
    },
    {
      label: 'Active proposals',
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

  return (
    <DropdownSelect
      placeholder="Filter by"
      controlIcon={<Icon name="filter" className={styles.icon} />}
      defaultValue={(router.query.status as string) || 'All'}
      options={FILTER_OPTIONS}
      onChange={value => handleFilterChange({ status: value })}
    />
  );
};

export default StatusFilter;

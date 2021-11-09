import React from 'react';
import cn from 'classnames';

import { Radio } from 'astro_2.0/components/inputs/Radio';

import { ProposalStatuses } from 'types/proposal';

import { FeedFilter } from 'astro_2.0/features/Feed';
import useQuery from 'hooks/useQuery';
import styles from './ProposalStatusFilter.module.scss';

type ProposalStatusFilterProps = {
  className?: string;
};

export const ProposalStatusFilter: React.FC<ProposalStatusFilterProps> = ({
  className,
}) => {
  const { query, updateQuery } = useQuery<{
    proposalStatus: ProposalStatuses;
  }>();

  return (
    <FeedFilter
      className={cn(styles.root, className)}
      title="Filter by proposal status:"
      shortTitle="Filter by status:"
      value={query.proposalStatus}
      onChange={val => updateQuery('proposalStatus', val)}
    >
      <Radio className={styles.all} value="" label="All" />
      <Radio value={ProposalStatuses.Active} label="Active" />
      <Radio
        className={styles.approved}
        value={ProposalStatuses.Approved}
        label="Approved"
      />
      <Radio
        className={styles.failed}
        value={ProposalStatuses.Failed}
        label="Failed"
      />
    </FeedFilter>
  );
};

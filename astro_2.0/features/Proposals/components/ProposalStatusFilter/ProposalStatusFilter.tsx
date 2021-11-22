import React from 'react';
import classNames from 'classnames';

import { ProposalStatuses } from 'types/proposal';
import { FeedFilter } from 'astro_2.0/components/Feed';
import { Radio } from 'astro_2.0/components/inputs/Radio';

import styles from './ProposalStatusFilter.module.scss';

type ProposalStatusFilterProps = {
  className?: string;
  feedFilterHeaderClassName?: string;
  disabled?: boolean;
  title?: string;
  shortTitle?: string;
  onChange: (value: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
  list: {
    label: React.ReactNode;
    value: string;
    className?: string;
  }[];
  value: string;
};

export const ProposalStatusFilter: React.FC<ProposalStatusFilterProps> = ({
  className,
  feedFilterHeaderClassName,
  onChange,
  value,
  list,
  disabled,
  title,
  shortTitle,
}) => {
  return (
    <FeedFilter
      className={classNames(styles.root, className)}
      headerClassName={feedFilterHeaderClassName}
      title={title || 'Filter by proposal status:'}
      shortTitle={shortTitle || 'Filter by status:'}
      value={value}
      onChange={onChange}
    >
      {list.map(item => (
        <Radio
          key={item.value}
          value={item.value}
          label={item.label}
          disabled={disabled}
          className={classNames(item.className, {
            [styles.all]: item.value === '',
            [styles.approved]: item.value === ProposalStatuses.Approved,
            [styles.failed]: item.value === ProposalStatuses.Failed,
          })}
        />
      ))}
    </FeedFilter>
  );
};

import cn from 'classnames';
import React, { MutableRefObject } from 'react';

import { ProposalStatuses } from 'types/proposal';
import { FeedFilter } from 'astro_2.0/components/Feed';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';

import styles from './ProposalFilter.module.scss';

type ProposalFilterProps = {
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
  neighbourRef?: MutableRefObject<HTMLElement | null>;
  labelClassName?: string;
};

export const ProposalFilter: React.FC<ProposalFilterProps> = ({
  className,
  feedFilterHeaderClassName,
  onChange,
  value,
  list,
  disabled,
  title = '',
  shortTitle = '',
  neighbourRef,
  labelClassName,
}) => {
  return (
    <FeedFilter
      neighbourRef={neighbourRef}
      className={cn(styles.root, className)}
      headerClassName={feedFilterHeaderClassName}
      title={title}
      shortTitle={shortTitle}
      value={value}
      selectedLabel={list.find(item => item.value === value)?.label ?? ''}
      onChange={onChange}
    >
      {list.map(item => (
        <Radio
          key={item.value}
          value={item.value}
          label={item.label}
          disabled={disabled}
          labelClassName={labelClassName}
          className={cn(item.className, {
            [styles.all]: item.value === '',
            [styles.approved]: item.value === ProposalStatuses.Approved,
            [styles.failed]: item.value === ProposalStatuses.Failed,
          })}
        />
      ))}
    </FeedFilter>
  );
};

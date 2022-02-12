import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import React, { MutableRefObject } from 'react';

import { ProposalStatuses } from 'types/proposal';
import { FeedFilter } from 'astro_2.0/components/Feed';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';

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
  neighbourRef?: MutableRefObject<HTMLElement | null>;
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
  neighbourRef,
}) => {
  const { t } = useTranslation();

  return (
    <FeedFilter
      neighbourRef={neighbourRef}
      className={cn(styles.root, className)}
      headerClassName={feedFilterHeaderClassName}
      title={title || `${t('filterByProposalStatus')}:`}
      shortTitle={shortTitle || `${t('filterByStatus')}:`}
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

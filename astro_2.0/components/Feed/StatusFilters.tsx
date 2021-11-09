import React from 'react';
import cn from 'classnames';

import Checkbox from 'astro_2.0/components/inputs/Checkbox';

import styles from './StatusFilters.module.scss';

type StatusFiltersProps = {
  className?: string;
  proposal?: string;
  disabled?: boolean;
  onChange: (proposal?: string) => React.ChangeEventHandler<HTMLInputElement>;
  list: {
    label: React.ReactNode;
    value?: string;
    name: string;
    classes?: React.ComponentProps<typeof Checkbox>['classes'];
  }[];
};

const StatusFilters: React.FC<StatusFiltersProps> = ({
  proposal,
  disabled = false,
  onChange,
  list,
  className,
}) => {
  return (
    <div className={cn(styles.statusFilter, className)}>
      <p className={styles.filterStatusText}>Filter by proposal status:</p>

      {list.map(item => (
        <Checkbox
          key={item.name}
          input={{
            name: item.name,
            checked: proposal === item.value,
            onChange: onChange(item.value),
            disabled,
          }}
          checkedIcon={<div className={styles.checkboxIconChecked} />}
          label={item.label}
          classes={{
            ...item.classes,
            root: cn(styles.checkboxRoot, item.classes?.root),
            inputWrapper: cn(
              styles.checkboxInputWrapper,
              item.classes?.inputWrapper
            ),
          }}
        />
      ))}
    </div>
  );
};

export default StatusFilters;

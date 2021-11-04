import React from 'react';
import classNames from 'classnames';

import Checkbox from 'astro_2.0/components/inputs/Checkbox';

import styles from './StatusFilters.module.scss';

const StatusFilters = ({
  proposal,
  disabled,
  onChange,
  list,
  className,
}: Props): JSX.Element => {
  return (
    <div className={classNames(styles.statusFilter, className)}>
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
            root: styles.checkboxRoot,
            inputWrapper: styles.checkboxInputWrapper,
          }}
        />
      ))}
    </div>
  );
};

type Props = {
  proposal?: string;
  disabled?: boolean;
  onChange: (proposal?: string) => React.ChangeEventHandler<HTMLInputElement>;
  list: { label: React.ReactNode; value?: string; name: string }[];
  className?: string;
};

StatusFilters.defaultProps = {
  disabled: false,
  proposal: undefined,
  className: undefined,
};

export default StatusFilters;

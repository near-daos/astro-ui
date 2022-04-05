import React from 'react';
import cn from 'classnames';

import { useRadioContext } from './hooks';

import styles from './Radio.module.scss';

export type RadioProps = {
  className?: string;
  id?: string;
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  type?: string;
  labelClassName?: string;
};

export const Radio: React.FC<RadioProps> = ({
  className,
  value,
  label,
  disabled = false,
  id,
  type,
  labelClassName,
}: RadioProps) => {
  const {
    itemClassName,
    activeItemClassName = '',
    state,
    onChange,
  } = useRadioContext();

  const checked = value === state;
  const idExt = id || `input-radio-${value}`;

  return (
    <label
      htmlFor={idExt}
      className={cn(styles.root, className, itemClassName, {
        [styles.disabled]: disabled,
        [activeItemClassName]: checked,
        [styles.notifications]: type === 'notifications',
      })}
    >
      <input
        id={idExt}
        value={value}
        checked={checked}
        type="radio"
        className={cn(styles.input, { [styles.checked]: checked })}
        disabled={disabled}
        onChange={e => onChange(e.target.value, e)}
      />
      <span className={styles.checkmark} />
      <span className={cn(styles.label, labelClassName)}>{label}</span>
    </label>
  );
};

import React from 'react';
import cn from 'classnames';

import { useRadioContext } from './hooks';

import styles from './Radio.module.scss';

export type RadioProps = {
  className?: string;
  value: string;
  label: string;
  disabled?: boolean;
};

const Radio: React.FC<RadioProps> = ({
  className,
  value,
  label,
  disabled = false,
}: RadioProps) => {
  const {
    itemClassName,
    activeItemCalssName = '',
    state,
    onChange,
  } = useRadioContext();
  const checked = value === state;
  const id = `input-radio-${value}`;

  return (
    <label
      htmlFor={id}
      className={cn(styles.root, className, itemClassName, {
        [styles.disabled]: disabled,
        [activeItemCalssName]: checked,
      })}
    >
      <input
        id={id}
        value={value}
        checked={checked}
        type="radio"
        className={cn(styles.input, { [styles.checked]: checked })}
        disabled={disabled}
        onChange={({ target }): void => onChange(target.value)}
      />
      <span className={styles.checkmark} />
      <span className={cn(styles.label)}>{label}</span>
    </label>
  );
};

export default Radio;

import React, { useState } from 'react';
import cn from 'classnames';

import { useId } from '@reach/auto-id';
import { ToggleDisplay } from './ToggleDisplay';

import styles from './toggle.module.scss';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
  mobileListView?: boolean;
  groupSwitch?: boolean;
}

export const Toggle = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, mobileListView, groupSwitch, className, onChange, ...props },
    externalRef
  ) => {
    const id = useId(props.id);
    const [checked, setChecked] = useState(props.defaultChecked);

    const value = props.checked != null ? props.checked : checked;

    const rootClassName = cn(styles.root, {
      [styles.mobileList]: mobileListView,
      [styles.groupSwitch]: groupSwitch,
      className,
    });

    return (
      <label htmlFor={id} className={rootClassName}>
        <input
          id={id}
          {...props}
          ref={externalRef}
          type="checkbox"
          onChange={e => {
            setChecked(e.target.checked);

            if (onChange) {
              onChange(e);
            }
          }}
        />
        <ToggleDisplay value={value} />
        <span
          className={cn(styles.labelText, {
            [styles.on]: value,
          })}
        >
          {groupSwitch ? 'On' : label}
        </span>
      </label>
    );
  }
);

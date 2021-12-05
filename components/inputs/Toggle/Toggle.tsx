import cn from 'classnames';
import React, { useState } from 'react';

import { useId } from '@reach/auto-id';
import { ToggleDisplay } from './components/ToggleDisplay';

import styles from './Toggle.module.scss';

interface ToggleProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className, onChange, ...props }, externalRef) => {
    const id = useId(props.id);
    const [checked, setChecked] = useState(props.defaultChecked);

    const value = props.checked != null ? props.checked : checked;

    return (
      <label htmlFor={id} className={cn(styles.root, className)}>
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
        {label}
      </label>
    );
  }
);

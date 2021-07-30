import React, { useState } from 'react';
import './toggle.module.scss';
import { useId } from '@reach/auto-id';
import { ToggleDisplay } from './ToggleDisplay';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
}

export const Toggle = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, externalRef) => {
    const id = useId(props.id);
    const [checked, setChecked] = useState(props.defaultChecked);

    const value = props.checked != null ? props.checked : checked;

    return (
      <label htmlFor={id}>
        <input
          id={id}
          {...props}
          ref={externalRef}
          type="checkbox"
          onChange={e => {
            setChecked(e.target.checked);
          }}
        />
        <ToggleDisplay value={value} />
        {label}
      </label>
    );
  }
);

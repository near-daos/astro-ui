import React, { useRef, useState } from 'react';
import './toggle.module.scss';
import uniqueId from 'lodash.uniqueid';
import { ToggleDisplay } from './ToggleDisplay';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
}

export const Toggle = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, externalRef) => {
    const idRef = useRef(uniqueId('toggle-'));
    const [checked, setChecked] = useState(props.defaultChecked);

    const value = props.checked || checked;

    return (
      <label htmlFor={props.id || idRef.current}>
        <input
          id={idRef.current}
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

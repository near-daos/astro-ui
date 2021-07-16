import React, { useRef, useState } from 'react';
import './checkbox.module.scss';
import uniqueId from 'lodash.uniqueid';

import CheckedIcon from './assets/checked.svg';
import UncheckedIcon from './assets/unchecked.svg';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, externalRef) => {
    const idRef = useRef(uniqueId('checkbox-'));
    const [checked, setChecked] = useState(props.defaultChecked);

    const value = props.checked || checked;
    const IconComponent = value ? CheckedIcon : UncheckedIcon;

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
        <IconComponent width="16px" height="16px" />
        {label}
      </label>
    );
  }
);

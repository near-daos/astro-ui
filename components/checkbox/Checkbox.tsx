import React, { useRef, useState } from 'react';
import uniqueId from 'lodash.uniqueid';
import { Icon } from 'components/Icon';
import classNames from 'classnames';
import styles from './checkbox.module.scss';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className: classNameProp, ...props }, externalRef) => {
    const idRef = useRef(uniqueId('checkbox-'));
    const [checked, setChecked] = useState(props.defaultChecked);

    const className = classNames(styles.checkbox, classNameProp);

    const value = props.checked != null ? props.checked : checked;

    return (
      <label className={className} htmlFor={props.id || idRef.current}>
        <input
          id={idRef.current}
          {...props}
          ref={externalRef}
          type="checkbox"
          onChange={e => setChecked(e.target.checked)}
        />
        <Icon
          name={value ? 'checkboxChecked' : 'checkboxUnchecked'}
          width="16px"
          height="16px"
        />
        {label}
      </label>
    );
  }
);

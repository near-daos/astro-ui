import React, { useState } from 'react';
import { Icon } from 'components/Icon';
import classNames from 'classnames';
import { useId } from '@reach/auto-id';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className: classNameProp, ...props }, externalRef) => {
    const id = useId(props.id);
    const [checked, setChecked] = useState(props.defaultChecked);

    const className = classNames(styles.checkbox, classNameProp, {
      [styles.disabled]: props.disabled,
    });

    const value = props.checked != null ? props.checked : checked;

    return (
      <label className={className} htmlFor={id}>
        <input
          id={id}
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

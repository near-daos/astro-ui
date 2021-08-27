import React, { ReactNode } from 'react';
import { useId } from '@reach/auto-id';
import classNames from 'classnames';
import { Property } from 'csstype';

import styles from './input.module.scss';

export interface InputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'size' | 'label'> {
  label?: string | ReactNode;
  description?: string | undefined;
  isValid?: boolean | undefined;
  inputSize?: number | undefined;
  size?: 'small' | 'medium' | 'large' | 'block' | 'content';
  textAlign?: Property.TextAlign;
}

function getStateClass(isValid: boolean | undefined) {
  if (isValid === undefined) return undefined;

  return isValid ? styles.success : styles.error;
}

const sizeClasses = {
  content: styles.sizeContent,
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
  block: styles.sizeBlock
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      className: classNameProp,
      description,
      isValid,
      size = 'small',
      inputSize,
      textAlign = 'left',
      ...props
    },
    externalRef
  ) => {
    const id = useId(props.id);

    const className = classNames(
      styles.input,
      sizeClasses[size],
      classNameProp
    );

    return (
      <label className={className} htmlFor={id}>
        {label && <span className={styles.label}>{label}</span>}
        <input
          className={getStateClass(isValid)}
          id={id}
          {...props}
          size={inputSize}
          ref={externalRef}
          style={{ textAlign }}
          type={props.type ?? 'text'}
        />
        {description && description.length > 0 && (
          <span className={styles.description}>{description}</span>
        )}
      </label>
    );
  }
);

import { useId } from '@reach/auto-id';
import cn from 'classnames';
import { Property } from 'csstype';
import React, { ReactNode } from 'react';

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
      type = 'text',
      ...props
    },
    externalRef
  ) => {
    const id = useId(props.id);
    const className = cn(styles.input, sizeClasses[size], classNameProp);

    return (
      <label className={className} htmlFor={id}>
        {label && <span className={styles.label}>{label}</span>}
        <input
          className={getStateClass(isValid)}
          {...props}
          id={id}
          ref={externalRef}
          type={type}
          size={inputSize}
          style={{ textAlign }}
        />
        {description && description.length > 0 && (
          <span className={styles.description}>{description}</span>
        )}
      </label>
    );
  }
);

import cn from 'classnames';
import { useId } from '@reach/auto-id';
import React from 'react';

import { InputProps } from 'components/inputs/Input/types';

import styles from './Input.module.scss';

function getStateClass(isValid: boolean | undefined) {
  if (isValid === undefined) {
    return undefined;
  }

  return isValid ? styles.success : styles.error;
}

const sizeClasses = {
  content: styles.sizeContent,
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
  block: styles.sizeBlock,
  auto: styles.sizeAuto,
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      className: classNameProp,
      description,
      isValid,
      size = 'small',
      isBorderless,
      inputSize,
      inputStyles = {},
      textAlign = 'left',
      type = 'text',
      inputClassName,
      rightContent,
      ...props
    },
    externalRef
  ) => {
    const id = useId(props.id);
    const className = cn(
      styles.input,
      sizeClasses[size],
      { [styles.borderless]: isBorderless },
      classNameProp
    );

    return (
      <label className={className} htmlFor={id}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.inputHolder}>
          <input
            className={cn(getStateClass(isValid), inputClassName)}
            {...props}
            id={id}
            ref={externalRef}
            type={type}
            size={inputSize}
            style={{ textAlign, ...inputStyles }}
          />
          {rightContent}
        </div>
        {description && description.length > 0 && (
          <span className={styles.description}>{description}</span>
        )}
      </label>
    );
  }
);

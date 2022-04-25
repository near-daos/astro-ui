import { useId } from '@reach/auto-id';
import classNames from 'classnames';
import inputStyles from 'components/inputs/Input/Input.module.scss';
import { Property } from 'csstype';
import React, { useState, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Textarea.module.scss';

interface TextAreaProps extends React.ComponentProps<typeof TextareaAutosize> {
  label?: string | undefined;
  size?: 'medium' | 'large' | 'block';
  isBorderless?: boolean;
  textAlign?: Property.TextAlign;
  resize?: Property.Resize;
  isValid?: boolean | undefined;
}

function getStateClass(isValid: boolean | undefined) {
  if (isValid === undefined) {
    return undefined;
  }

  return isValid ? styles.valid : styles.notValid;
}

const sizeClasses = {
  small: inputStyles.sizeSmall,
  medium: inputStyles.sizeMedium,
  large: inputStyles.sizeLarge,
  block: inputStyles.sizeBlock,
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      className: classNameProp,
      isValid,
      maxLength,
      size = 'medium',
      isBorderless,
      resize = 'none',
      minRows = 8,
      maxRows = 8,
      textAlign,
      onChange,
      ...props
    },
    externalRef
  ) => {
    const id = useId(props.id);
    const className = classNames(styles.textarea, sizeClasses[size], {
      [styles.borderless]: isBorderless,
    });
    const [currentLength, setCurrentLength] = useState(0);

    const onChangeCallback = useCallback(
      e => {
        onChange?.(e);
        setCurrentLength(e.currentTarget.value?.length);
      },
      [onChange]
    );

    return (
      <label className={className} htmlFor={id}>
        {label && label.length > 0 && (
          <span className={inputStyles.label}>{label}</span>
        )}
        <TextareaAutosize
          {...props}
          id={id}
          minRows={minRows}
          maxRows={maxRows}
          onChange={onChangeCallback}
          className={classNames(classNameProp, getStateClass(isValid))}
          ref={externalRef}
          style={{
            textAlign,
            resize,
          }}
          data-testid="ata-textarea"
        />
        {maxLength != null && !isBorderless && (
          <span
            className={classNames(styles.length, {
              [styles.error]: currentLength > maxLength,
              [styles.success]: currentLength > 0 && currentLength < maxLength,
            })}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </label>
    );
  }
);

import React, { useEffect, useRef, useState } from 'react';
import uniqueId from 'lodash.uniqueid';
import classNames from 'classnames';
import inputStyles from 'components/input/input.module.scss';
import { useCombobox } from 'downshift';
import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import styles from './select.module.scss';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLProps<HTMLSelectElement>, 'size'> {
  label?: string | undefined;
  description?: string | undefined;
  isValid?: boolean | undefined;
  inputSize?: number | undefined;
  size: 'medium' | 'large' | 'block' | 'content';
  options: Option[];
  isSearchable: boolean;
}

function getStateClass(isValid: boolean | undefined) {
  if (isValid === undefined) return undefined;

  return isValid ? inputStyles.success : inputStyles.error;
}

const sizeClasses = {
  content: inputStyles['size-content'],
  small: inputStyles['size-small'],
  medium: inputStyles['size-medium'],
  large: inputStyles['size-large'],
  block: inputStyles['size-block']
};

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      options,
      label,
      className: classNameProp,
      description,
      isValid,
      size,
      inputSize,
      isSearchable,
      ...props
    },
    externalRef
  ) => {
    const [inputItems, setInputItems] = useState(options ?? []);

    useEffect(() => {
      setInputItems(options ?? []);
    }, [options]);

    const idRef = useRef(uniqueId('input-'));
    const {
      isOpen,
      getComboboxProps,
      getToggleButtonProps,
      getInputProps,
      getMenuProps,
      highlightedIndex,
      getItemProps
    } = useCombobox({
      items: inputItems,

      itemToString: item => (item != null ? item.label : ''),
      onInputValueChange: isSearchable
        ? ({ inputValue }) => {
            if (inputValue == null || inputValue.length === 0) {
              setInputItems(options);

              return;
            }

            const lowerCaseInput = inputValue.toLowerCase();

            setInputItems(
              options.filter(
                item =>
                  item.label.toLowerCase().startsWith(lowerCaseInput) ||
                  item.value.toLowerCase().startsWith(lowerCaseInput)
              )
            );
          }
        : undefined
    });

    const className = classNames(
      inputStyles.input,
      sizeClasses[size],
      styles.select,
      classNameProp
    );

    const inputClassName = classNames(getStateClass(isValid));

    return (
      <div {...getComboboxProps()} className={className}>
        <label {...getToggleButtonProps()} htmlFor={props.id || idRef.current}>
          {label && label.length > 0 && (
            <span className={inputStyles.label}>{label}</span>
          )}
          <input
            aria-readonly={!isSearchable}
            {...getInputProps({
              id: idRef.current,
              ref: externalRef,
              readOnly: !isSearchable,
              placeholder: 'Select item...'
            })}
            className={inputClassName}
            size={inputSize}
            type="text"
          />
          {description && description.length > 0 && (
            <span className={inputStyles.description}>{description}</span>
          )}
          <IconButton className={styles.icon}>
            <Icon width={24} name="buttonArrowDown" />
          </IconButton>
        </label>
        <ul className={classNames(styles.menu)} {...getMenuProps()}>
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                className={classNames(
                  styles.item,
                  highlightedIndex === index ? styles.active : undefined
                )}
                key={item.value}
                {...getItemProps({
                  disabled: item.disabled,
                  item,
                  index
                })}
              >
                {item.label}
              </li>
            ))}
        </ul>
      </div>
    );
  }
);

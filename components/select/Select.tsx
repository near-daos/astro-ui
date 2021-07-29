import React, { useEffect, useRef, useState } from 'react';
import uniqueId from 'lodash.uniqueid';
import classNames from 'classnames';
import inputStyles from 'components/input/input.module.scss';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import styles from './select.module.scss';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  className?: string | undefined;
  defaultValue?: string | undefined;
  description?: string | undefined;
  id?: string | undefined;
  inputSize?: number | undefined;
  isSearchable?: boolean | undefined;
  isValid?: boolean | undefined;
  label?: string | undefined;
  onChange?: (value?: string) => void;
  options: Option[];
  placeholder?: string | undefined;
  size?: 'medium' | 'large' | 'block' | 'content';
  value?: string | undefined;
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
      value,
      defaultValue,
      onChange,
      placeholder = 'Select item...',
      ...props
    },
    externalRef
  ) => {
    const [inputItems, setInputItems] = useState(options ?? []);

    useEffect(() => {
      setInputItems(options ?? []);
    }, [options]);

    const idRef = useRef(uniqueId('input-'));

    const handleInputChange: (
      changes: UseComboboxStateChange<Option>
    ) => void = ({ inputValue }) => {
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
    };

    const {
      isOpen,
      getComboboxProps,
      getToggleButtonProps,
      getInputProps,
      getMenuProps,
      highlightedIndex,
      selectedItem,
      getItemProps,
      selectItem
    } = useCombobox({
      items: inputItems,
      itemToString: item => (item != null ? item.label : ''),
      onInputValueChange: isSearchable ? handleInputChange : undefined,
      selectedItem: value
        ? options.find(option => option.value === value)
        : undefined,

      onSelectedItemChange(changes) {
        onChange?.(changes.selectedItem?.value);
      }
    });

    /* Making sure that default value would cause onChange call */
    useEffect(() => {
      if (!value && defaultValue && !selectedItem) {
        const defaultOption = options.find(
          option => option.value === defaultValue
        );

        if (defaultOption != null) {
          selectItem(defaultOption);
        }
      }
    }, [selectedItem, options, value, selectItem, defaultValue]);

    const className = classNames(
      inputStyles.input,
      size ? sizeClasses[size] : undefined,
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
              placeholder
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

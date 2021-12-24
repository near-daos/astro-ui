import { useId } from '@reach/auto-id';
import classNames from 'classnames';
import { IconButton } from 'components/button/IconButton';
import inputStyles from 'components/inputs/Input/Input.module.scss';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import React, { useEffect, useState } from 'react';
import styles from './Select.module.scss';

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
  inputClassName?: string;
  isValid?: boolean | undefined;
  label?: string | undefined;
  onChange?: (value?: string) => void;
  options: Option[];
  placeholder?: string | undefined;
  size?: 'small' | 'medium' | 'large' | 'block' | 'content';
  value?: string | undefined;
  disabled?: boolean;
}

function getStateClass(isValid: boolean | undefined) {
  if (isValid === undefined) {
    return undefined;
  }

  return isValid ? inputStyles.success : inputStyles.error;
}

const sizeClasses = {
  content: inputStyles.sizeContent,
  small: inputStyles.sizeSmall,
  medium: inputStyles.sizeMedium,
  large: inputStyles.sizeLarge,
  block: inputStyles.sizeBlock,
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
      inputClassName,
      isSearchable,
      value,
      defaultValue,
      onChange,
      placeholder = 'Select item...',
      disabled,
      ...props
    },
    externalRef
  ) => {
    const [inputItems, setInputItems] = useState(options ?? []);

    useEffect(() => {
      setInputItems(options ?? []);
    }, [options]);

    const id = useId(props.id);
    const downshiftId = useId();

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
      selectItem,
    } = useCombobox({
      id: `downshift-${downshiftId}`,
      items: inputItems,
      itemToString: item => (item != null ? item.label : ''),
      onInputValueChange: isSearchable ? handleInputChange : undefined,
      selectedItem: value
        ? options.find(option => option.value === value)
        : undefined,

      onSelectedItemChange(changes) {
        onChange?.(changes.selectedItem?.value);
      },
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
      classNameProp,
      {
        [styles.disabled]: disabled,
      }
    );

    return (
      <div {...getComboboxProps()} className={className}>
        {label && label.length > 0 && (
          <span className={inputStyles.label}>{label}</span>
        )}
        <label {...getToggleButtonProps()} htmlFor={id}>
          <input
            aria-readonly={!isSearchable}
            {...getInputProps({
              id,
              ref: externalRef,
              readOnly: !isSearchable,
              placeholder,
            })}
            className={classNames(getStateClass(isValid), inputClassName)}
            size={inputSize}
            type="text"
          />
          {description && description.length > 0 && (
            <span className={inputStyles.description}>{description}</span>
          )}
          <IconButton icon="buttonArrowDown" className={styles.icon} />
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
                  index,
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

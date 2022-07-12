import cn from 'classnames';
import { useSelect } from 'downshift';
import React, { PropsWithChildren, useEffect } from 'react';

import { IconButton } from 'components/button/IconButton';
import { Title } from 'components/Typography';

import styles from './Dropdown.module.scss';

export interface Option<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps<T> {
  value: T;
  className?: string;
  controlClassName?: string;
  menuClassName?: string;
  onChange: (value: T) => void;
  options: Option<T>[];
  defaultValue?: T;
  placeholder?: string;
  disabled?: boolean;
}

export const Dropdown = <T,>(
  props: PropsWithChildren<DropdownProps<T>>
): JSX.Element => {
  const {
    options,
    className: classNameProp,
    onChange,
    value,
    defaultValue,
    placeholder,
    controlClassName,
    menuClassName,
    disabled: isDisabled,
  } = props;

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    selectedItem,
    selectItem,
    getItemProps,
  } = useSelect({
    id: 'Dropdown',
    items: options,
    itemToString: item => (item != null ? item.label : ''),
    selectedItem: value
      ? options.find(option => option.value === value)
      : undefined,
    onSelectedItemChange(changes) {
      const val = changes.selectedItem?.value;

      if (val) {
        onChange(val);
      }
    },
    defaultSelectedItem: defaultValue
      ? options.find(option => option.value === defaultValue)
      : undefined,
  });

  const className = cn(styles.dropdown, classNameProp);

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

  function renderList() {
    if (isOpen) {
      return options.map((item, index) => {
        const { value: iValue, label, disabled } = item;

        const itemProps = getItemProps({ item, index, disabled });

        const itemClassName = cn(styles.item, {
          [styles.selected]: selectedItem?.value === iValue,
        });

        return (
          <li key={iValue} className={itemClassName} {...itemProps}>
            {label}
          </li>
        );
      });
    }

    return null;
  }

  return (
    <div className={className}>
      <Title
        size={3}
        {...getToggleButtonProps({
          disabled: isDisabled,
          readOnly: isDisabled,
        })}
        className={cn(styles.control, controlClassName, {
          [styles.disabled]: isDisabled,
        })}
      >
        <span className={styles.selected}>
          {selectedItem?.label || placeholder}
        </span>
        <IconButton
          icon="buttonArrowDown"
          className={cn(styles.controlIcon, {
            [styles.open]: isOpen,
          })}
        />
      </Title>
      <ul
        className={cn(styles.menu, menuClassName, { [styles.open]: isOpen })}
        {...getMenuProps({ readOnly: isDisabled })}
      >
        {renderList()}
      </ul>
    </div>
  );
};

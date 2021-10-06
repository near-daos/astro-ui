import classNames from 'classnames';
import { useSelect } from 'downshift';
import React, { PropsWithChildren, useEffect } from 'react';

import { IconButton } from 'components/button/IconButton';
import { Title } from 'components/Typography';

import styles from './dropdown.module.scss';

interface Option<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps<T> {
  value: T;
  className?: string;
  onChange: (value: T) => void;
  options: Option<T>[];
  defaultValue?: T;
  placeholder?: string;
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
    placeholder
  } = props;

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    selectedItem,
    selectItem,
    highlightedIndex,
    getItemProps
  } = useSelect({
    id: 'dropdown',
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
      : undefined
  });

  const className = classNames(styles.dropdown, classNameProp);

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

  return (
    <div className={className}>
      <Title size={3} {...getToggleButtonProps()}>
        {selectedItem?.label || placeholder}
        <IconButton size="medium" icon="buttonArrowDown" />
      </Title>
      <ul className={styles.menu} {...getMenuProps()}>
        {isOpen &&
          options.map((item, index) => (
            <li
              key={item.value}
              className={classNames(
                styles.item,
                highlightedIndex === index ? styles.active : undefined
              )}
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
};

import classNames from 'classnames';
import { IconButton } from 'components/button/IconButton';
import { Title } from 'components/Typography';
import { useSelect } from 'downshift';
import React, { useEffect } from 'react';
import styles from './dropdown.module.scss';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  value?: string;
  className?: string;
  onChange?: (value?: string) => void;
  options: Option[];
  defaultValue?: string | undefined;
  placeholder?: string;
}

export const Dropdown: React.VFC<DropdownProps> = ({
  options,
  className: classNameProp,
  onChange,
  value,
  defaultValue,
  placeholder
}) => {
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
      onChange?.(changes.selectedItem?.value);
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

import cn from 'classnames';
import { useSelect } from 'downshift';
import React, { ReactNode, useEffect } from 'react';

import { Icon } from 'components/Icon';

import styles from './DropdownSelect.module.scss';

interface Option {
  label: string;
  component: JSX.Element;
  disabled?: boolean;
}

export interface DropdownSelectProps {
  options: Option[];
  className?: string;
  label?: string;
  defaultValue?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  controlIcon?: ReactNode;
  disabled?: boolean;
  isBorderless?: boolean;
  reverseMenu?: boolean;
}

export const DropdownSelect = React.forwardRef<
  HTMLInputElement,
  DropdownSelectProps
>(
  (
    {
      options,
      className,
      label,
      defaultValue,
      onChange,
      placeholder,
      controlIcon,
      disabled = false,
      isBorderless = false,
      reverseMenu = false,
    },
    externalRef
  ) => {
    const {
      isOpen,
      selectedItem,
      getToggleButtonProps,
      selectItem,
      getLabelProps,
      getMenuProps,
      getItemProps,
    } = useSelect({
      items: options,
      itemToString: item => (item != null ? item.label : ''),
      onSelectedItemChange(changes) {
        if (changes.selectedItem?.label !== defaultValue) {
          onChange?.(changes.selectedItem?.label);
        }
      },
    });

    useEffect(() => {
      if (defaultValue && !selectedItem) {
        const defaultOption = options.find(
          option => option.label === defaultValue
        );

        if (defaultOption != null) {
          selectItem(defaultOption);
        }
      }
    }, [defaultValue, options, selectItem, selectedItem]);

    return (
      <div className={cn(styles.root, className)}>
        {label && (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className={styles.label} {...getLabelProps}>
            {label}
          </label>
        )}
        <div className={styles.dropdown}>
          <button
            disabled={disabled}
            type="button"
            ref={externalRef}
            className={cn(styles.select, { [styles.borderless]: isBorderless })}
            {...getToggleButtonProps()}
          >
            <div className={styles.container}>
              <div className={styles.selected}>
                {selectedItem?.component ?? (
                  <div className={styles.placeholder}>
                    {placeholder || 'Choose group'}
                  </div>
                )}
              </div>
              {controlIcon || (
                <Icon
                  name="buttonArrowDown"
                  className={cn(styles.icon, { [styles.rotate]: isOpen })}
                />
              )}
            </div>
          </button>
          <ul
            className={cn(styles.menu, { [styles.reverse]: reverseMenu })}
            {...getMenuProps()}
          >
            {isOpen &&
              options.map((item, index) => {
                const props = !item.disabled
                  ? { ...getItemProps({ item, index }) }
                  : {};

                return (
                  <li
                    className={cn(styles.item, {
                      [styles.disabled]: item.disabled,
                    })}
                    {...props}
                    key={item.label}
                  >
                    {item.component}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
);

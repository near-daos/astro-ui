import { useSelect } from 'downshift';
import cn from 'classnames';
import React, { useEffect } from 'react';
import { Icon } from 'components/Icon';
import styles from './dropdown-select.module.scss';

interface Option {
  label: string;
  component: JSX.Element;
  disabled?: boolean;
}

interface DropdownSelectProps {
  options: Option[];
  className?: string;
  label?: string;
  defaultValue?: string;
  onChange: (value?: string) => void;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  className,
  label,
  defaultValue,
  onChange
}) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    selectItem,
    getLabelProps,
    getMenuProps,
    getItemProps
  } = useSelect({
    items: options,
    itemToString: item => (item != null ? item.label : ''),
    onSelectedItemChange(changes) {
      onChange?.(changes.selectedItem?.label);
    }
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
          type="button"
          className={styles.select}
          {...getToggleButtonProps()}
        >
          <div className={styles.container}>
            <div className={styles.selected}>
              {selectedItem?.component ?? (
                <div className={styles.placeholder}>Choose group</div>
              )}
            </div>
            <Icon
              name="buttonArrowDown"
              className={cn(styles.icon, { [styles.rotate]: isOpen })}
            />
          </div>
        </button>
        <ul className={styles.menu} {...getMenuProps()}>
          {isOpen &&
            options.map((item, index) => {
              const props = !item.disabled
                ? { ...getItemProps({ item, index }) }
                : {};

              return (
                <li
                  className={cn(styles.item, {
                    [styles.disabled]: item.disabled
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
};

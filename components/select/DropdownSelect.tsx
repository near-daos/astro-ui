import { useSelect } from 'downshift';
import React, { useEffect } from 'react';
import { Icon } from 'components/Icon';
import classNames from 'classnames';
import styles from './dropdown-select.module.scss';

interface Option {
  label: string;
  component: JSX.Element;
}

interface DropdownSelectProps {
  options: Option[];
  className?: string;
  label?: string;
  defaultValue?: string;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  className,
  label,
  defaultValue
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
    itemToString: item => (item != null ? item.label : '')
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
    <div className={classNames(styles.root, className)}>
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
              className={classNames(styles.icon, { [styles.rotate]: isOpen })}
            />
          </div>
        </button>
        <ul className={styles.menu} {...getMenuProps()}>
          {isOpen &&
            options.map((item, index) => (
              <li
                className={styles.item}
                {...getItemProps({ item, index })}
                key={item.label}
              >
                {item.component}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

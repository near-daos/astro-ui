import React, { useCallback, useLayoutEffect, useState } from 'react';
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift';
import cn from 'classnames';
import { useMeasure } from 'react-use';

import { Checkbox } from 'components/inputs/checkbox/Checkbox';
import { Icon } from 'components/Icon';
import { Badge } from 'components/badge/Badge';

import styles from './dropdown-select.module.scss';

interface Option {
  label: string;
  component: JSX.Element;
  disabled?: boolean;
}

export interface DropdownMultiSelectProps {
  options: Option[];
  className?: string;
  label?: string;
  defaultValue?: string[];
  onChange: (value: string[]) => void;
}

function getInitialValues(values?: string[]): Option[] {
  if (!values) return [];

  return values.map(item => ({
    label: item,
    component: <Badge size="small">{item}</Badge>
  }));
}

export const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  options,
  className,
  label,
  defaultValue,
  onChange
}) => {
  const [selectedItems, setSelectedItems] = useState<Option[]>(() =>
    getInitialValues(defaultValue)
  );
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const stateReducer = (
    state: DownshiftState<unknown>,
    changes: StateChangeOptions<unknown>
  ) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: true
        };
      default:
        return changes;
    }
  };

  const handleSelect = useCallback(
    r => {
      if (selectedItems.map(k => k.label).includes(r.label)) {
        const newSelectedItems = selectedItems.filter(k => k.label !== r.label);

        setSelectedItems(newSelectedItems);

        onChange(newSelectedItems.map(item => item.label));
      } else {
        const newSelectedItems = [...selectedItems, r];

        setSelectedItems(newSelectedItems);

        onChange(newSelectedItems.map(item => item.label));
      }
    },
    [onChange, selectedItems]
  );

  const [wrapperRef, { width }] = useMeasure();
  const [contentRef, { width: contentWidth }] = useMeasure();

  useLayoutEffect(() => {
    if (contentWidth > width && !showPlaceholder) {
      setShowPlaceholder(true);
    } else if (contentWidth <= width && showPlaceholder) {
      setShowPlaceholder(false);
    }
  }, [contentWidth, showPlaceholder, width]);

  return (
    <Downshift
      onSelect={handleSelect}
      itemToString={item => (item as { label: string })?.label}
      stateReducer={stateReducer}
    >
      {({
        getLabelProps,
        getMenuProps,
        getItemProps,
        getToggleButtonProps,
        isOpen
      }) => {
        return (
          <div className={cn(styles.root, className)}>
            {label && (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label className={styles.label} {...getLabelProps()}>
                {label}
              </label>
            )}
            <div
              className={styles.dropdown}
              ref={wrapperRef as React.LegacyRef<HTMLDivElement>}
            >
              <button
                type="button"
                className={styles.select}
                {...getToggleButtonProps()}
              >
                <div className={styles.container}>
                  <div
                    className={styles.selectedMeasure}
                    ref={contentRef as React.LegacyRef<HTMLDivElement>}
                  >
                    {selectedItems.map(sel => {
                      return (
                        <div key={sel.label} className={styles.selectedWrapper}>
                          {sel.component}
                        </div>
                      );
                    })}
                    <div
                      className={cn(
                        styles.collapsedLabel,
                        styles.selectedWrapper,
                        {
                          [styles.visible]: showPlaceholder
                        }
                      )}
                    >
                      <Badge size="small" variant="turqoise">
                        +{selectedItems.length - 1}
                      </Badge>
                    </div>
                  </div>
                  <div className={styles.selected}>
                    {selectedItems
                      .filter((k, i) => {
                        if (i === 0) return true;

                        return !showPlaceholder;
                      })
                      .map(sel => {
                        return (
                          <div
                            key={sel.label}
                            className={styles.selectedWrapper}
                          >
                            {sel.component}
                          </div>
                        );
                      })}
                    <div
                      className={cn(
                        styles.collapsedLabel,
                        styles.selectedWrapper,
                        {
                          [styles.visible]: showPlaceholder
                        }
                      )}
                    >
                      <Badge size="small" variant="turqoise">
                        +{selectedItems.length - 1}
                      </Badge>
                    </div>
                  </div>
                  <Icon
                    name="buttonArrowDown"
                    className={cn(styles.icon, { [styles.rotate]: isOpen })}
                  />
                </div>
              </button>
              <ul className={styles.menu} {...getMenuProps()}>
                {isOpen && (
                  <div className={styles.selectedFullList}>
                    {selectedItems.map(sel => {
                      return (
                        <div key={sel.label} className={styles.selectedWrapper}>
                          {sel.component}
                        </div>
                      );
                    })}
                  </div>
                )}
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
                        <Checkbox
                          label=""
                          className={styles.checkbox}
                          checked={selectedItems
                            .map(k => k.label)
                            .includes(item.label)}
                        />
                        {item.component}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};

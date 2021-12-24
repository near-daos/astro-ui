import React, { useCallback, useLayoutEffect, useState } from 'react';
import Downshift, {
  DownshiftState,
  GetItemPropsOptions,
  StateChangeOptions,
} from 'downshift';
import cn from 'classnames';
import { useMeasure } from 'react-use';

import { Checkbox } from 'components/inputs/Checkbox';
import { Icon } from 'components/Icon';
import { Badge } from 'components/badge/Badge';
import { BadgeList } from 'components/BadgeList';

import styles from './DropdownSelect.module.scss';

export interface Option {
  label: string;
  component: JSX.Element;
  disabled?: boolean;
}

export interface DropdownMultiSelectProps {
  options: Option[];
  className?: string;
  label?: string;
  defaultValue?: string[];
  simple?: boolean;
  onChange: (value: string[]) => void;
}

function getInitialValues(values?: string[]): Option[] {
  if (!values) {
    return [];
  }

  return values.map(item => ({
    label: item,
    component: <Badge size="small">{item}</Badge>,
  }));
}

export const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  options,
  className,
  label,
  defaultValue,
  simple,
  onChange,
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
          isOpen: true,
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

  const rootClassName = cn(styles.root, className, {
    [styles.simple]: simple,
  });

  function renderSelectContainer() {
    if (simple) {
      return <div className={styles.label}>{label}</div>;
    }

    return (
      <>
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
            className={cn(styles.collapsedLabel, styles.selectedWrapper, {
              [styles.visible]: showPlaceholder,
            })}
          >
            <Badge size="small" variant="turqoise">
              +{selectedItems.length - 1}
            </Badge>
          </div>
        </div>
        <BadgeList
          selectedItems={selectedItems}
          showPlaceholder={showPlaceholder}
        />
      </>
    );
  }

  function renderDropdownSelectedList() {
    return (
      <div className={styles.selectedFullList}>
        {selectedItems.map(sel => {
          return (
            <div key={sel.label} className={styles.selectedWrapper}>
              {sel.component}
            </div>
          );
        })}
      </div>
    );
  }

  function renderDropdownOptionsList(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getItemProps: (options: GetItemPropsOptions<unknown>) => any
  ) {
    return options.map((item, index) => {
      const props = !item.disabled ? { ...getItemProps({ item, index }) } : {};
      const checked = selectedItems.map(k => k.label).includes(item.label);

      return (
        <li
          className={cn(styles.item, {
            [styles.disabled]: item.disabled,
            [styles.checked]: checked,
          })}
          {...props}
          key={item.label}
        >
          <Checkbox label="" className={styles.checkbox} checked={checked} />
          {item.component}
        </li>
      );
    });
  }

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
        isOpen,
      }) => {
        return (
          <div className={rootClassName}>
            {label && !simple && (
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
                  {renderSelectContainer()}
                  <Icon
                    name="buttonArrowDown"
                    className={cn(styles.icon, { [styles.rotate]: isOpen })}
                  />
                </div>
              </button>
              <ul className={styles.menu} {...getMenuProps()}>
                {isOpen && (
                  <>
                    {!simple && renderDropdownSelectedList()}
                    {renderDropdownOptionsList(getItemProps)}
                  </>
                )}
              </ul>
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};

import React, { FC, ReactNode, useMemo } from 'react';
import clsx from 'classnames';
import { useRouter } from 'next/router';
import { get } from 'lodash';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { getSelectedItems } from './helpers';
import { ListItem } from './types';

import styles from './CategoriesFeedFilter.module.scss';

interface Props {
  disabled?: boolean;
  className?: string;
  list?: ListItem[];
  itemClassName?: string;
  onFilterChange?: () => void;
}

export const CategoriesFeedFilter: FC<Props> = ({
  list,
  disabled,
  className,
  itemClassName,
  onFilterChange,
}) => {
  const router = useRouter();
  const query = useMemo(() => {
    return router.query ? (router.query as Record<string, string>) : {};
  }, [router]);

  const queriesNames = useMemo<string[]>(() => {
    if (!list) {
      return [];
    }

    const values = list.reduce<Set<string>>((res, item) => {
      if (item.queryName) {
        res.add(item.queryName);
      }

      return res;
    }, new Set());

    return Array.from(values);
  }, [list]);

  const selectedItems = useMemo(() => {
    if (!list) {
      return [];
    }

    const values = list.reduce<Set<ListItem>>((res, item) => {
      const selected =
        Array.from(Object.entries(query)).filter(
          p => p[0] === item.queryName && p[1] === item.value
        ).length > 0;

      if (selected && item.queryName) {
        res.add(item);
      }

      return res;
    }, new Set());

    return Array.from(values);
  }, [list, query]);

  function renderFilterItem(item: ListItem) {
    const {
      value: itemVal,
      label,
      disabled: disabledItem,
      icon,
      queryName = '',
    } = item;

    const value = get(query, queryName);

    const hrefClassName = clsx(
      styles.itemLink,
      {
        [styles.active]: value === itemVal || (!itemVal && !value),
        [styles.disabled]: disabled || disabledItem,
        [styles.hidden]: value && value !== itemVal,
        [styles.status]: item.queryName === 'status',
      },
      itemClassName
    );

    return (
      <Button
        key={item.label}
        className={hrefClassName}
        variant="transparent"
        size="small"
        onClick={async () => {
          const newQuery = {
            ...query,
            [queryName]: value === itemVal ? '' : itemVal,
          };

          if (item.children) {
            item.children.forEach(child => {
              if (child.queryName) {
                newQuery[child.queryName] = '';
              }
            });
          }

          if (onFilterChange) {
            onFilterChange();
          }

          router.push({
            query: newQuery,
          });
        }}
      >
        {icon && <Icon name={icon} className={styles.icon} />}
        {label}
      </Button>
    );
  }

  function renderSelectedItem(item: ListItem, index: number): ReactNode {
    const { value: itemVal, label, icon, queryName = '' } = item;

    const value = get(query, queryName);

    const selectedChildrenItems = getSelectedItems(item.children, query);

    const hrefClassName = clsx(
      styles.itemLink,
      styles.selected,
      {
        [styles.status]: item.queryName === 'status',
      },
      itemClassName
    );

    return (
      <React.Fragment key={item.label}>
        <Button
          className={hrefClassName}
          style={{ zIndex: -index, paddingLeft: index !== 0 ? 28 : 12 }}
          variant="transparent"
          size="small"
          onClick={async () => {
            const newQuery = {
              ...query,
              [queryName]: value === itemVal ? '' : itemVal,
            };

            if (onFilterChange) {
              onFilterChange();
            }

            router.push({
              query: newQuery,
            });
          }}
        >
          {icon && <Icon name={icon} className={styles.icon} />}
          {label}
        </Button>
        {!!selectedChildrenItems.length && (
          <div style={{ zIndex: -index - 1 }}>
            {selectedChildrenItems.map((el, i) =>
              renderSelectedItem(el, i + 1)
            )}
          </div>
        )}
        {item.children && (
          <div className={styles.childrenItems}>
            {item.children
              ?.filter(
                el => !selectedChildrenItems.find(sel => sel.value === el.value)
              )
              .map(renderFilterItem)}
          </div>
        )}
      </React.Fragment>
    );
  }

  function isSelected() {
    return (
      Array.from(Object.entries(query)).filter(
        item => !!item[1] && item[0] !== 'dao'
      ).length > 0
    );
  }

  return (
    <div
      className={clsx(styles.root, className, {
        [styles.selected]: isSelected(),
      })}
    >
      <div className={styles.close}>
        <Button
          variant="transparent"
          size="block"
          className={styles.closeBtn}
          onClick={async () => {
            if (onFilterChange) {
              onFilterChange();
            }

            const newQuery = queriesNames.reduce<Record<string, string>>(
              (res, item) => {
                res[item] = '';

                return res;
              },
              {}
            );

            router.push({
              query: {
                ...newQuery,
                dao: query.dao,
              },
            });
          }}
        >
          <Icon name="close" className={styles.closeIcon} />
        </Button>
      </div>
      <ul className={styles.items}>{selectedItems.map(renderSelectedItem)}</ul>
      <ul className={clsx(styles.items, styles.availableItems)}>
        {list
          ?.filter(item => !selectedItems.find(sel => sel.value === item.value))
          .map(renderFilterItem)}
      </ul>
    </div>
  );
};

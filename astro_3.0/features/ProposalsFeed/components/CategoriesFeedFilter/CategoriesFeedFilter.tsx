import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import intersection from 'lodash/intersection';

import { Button } from 'components/button/Button';
import { Icon, IconName } from 'components/Icon';

import styles from './CategoriesFeedFilter.module.scss';

export type ListItem = {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: IconName;
  queryName?: string;
};

interface Props {
  disabled?: boolean;
  // queryName: string;
  className?: string;
  list?: ListItem[];
  hideAllOption?: boolean;
  shallowUpdate?: boolean;
  itemClassName?: string;
}

export const CategoriesFeedFilter: FC<Props> = ({
  list,
  disabled,
  className,
  itemClassName,
  shallowUpdate = false,
}) => {
  const { query, replace } = useRouter();

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

  function renderFilterItem(item: ListItem) {
    const {
      value: itemVal,
      label,
      disabled: disabledItem,
      icon,
      queryName = '',
    } = item;

    const { [queryName]: value } = query;

    const href = {
      query: {
        ...query,
        [queryName]: value === itemVal ? '' : itemVal,
      },
    };

    const hrefClassName = cn(
      styles.itemLink,
      {
        [styles.active]: value === itemVal || (!itemVal && !value),
        [styles.disabled]: disabled || disabledItem,
        [styles.hidden]: value && value !== itemVal,
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
          await replace(href, undefined, {
            shallow: shallowUpdate,
            scroll: false,
          });
        }}
      >
        {icon && <Icon name={icon} className={styles.icon} />}
        {label}
      </Button>
    );
  }

  function isSelected() {
    const q = Object.keys(query);
    const activeQ = q.reduce<string[]>((res, item) => {
      if (query[item]) {
        res.push(item);
      }

      return res;
    }, []);

    return intersection(activeQ, queriesNames).length > 0;
  }

  return (
    <div
      className={cn(styles.root, className, {
        [styles.selected]: isSelected(),
      })}
    >
      <div className={styles.close}>
        <Button
          variant="transparent"
          size="block"
          className={styles.closeBtn}
          onClick={async () => {
            const href = {
              query: {
                ...query,
                ...queriesNames.reduce<Record<string, string>>((res, item) => {
                  res[item] = '';

                  return res;
                }, {}),
              },
            };

            await replace(href, undefined, {
              shallow: shallowUpdate,
              scroll: false,
            });
          }}
        >
          <Icon name="close" className={styles.closeIcon} />
        </Button>
      </div>
      <ul className={styles.items}>{list?.map(renderFilterItem)}</ul>
    </div>
  );
};
